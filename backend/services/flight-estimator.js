/**
 * Flight Cost Estimator Service
 * Deterministic formula-based flight price estimation
 */

const geocodingService = require('./geocoding-service');
const { haversine } = require('../utils/haversine');
const seasonalityHelper = require('../utils/seasonality-helper');
const {
    COST_PER_KM,
    DISTANCE_THRESHOLDS,
    TRIP_TYPE_MULTIPLIERS,
    MIN_PRICE,
    MAX_PRICE,
    VARIANCE
} = require('../data/cost-constants');

/**
 * Determine route type based on distance
 * @param {number} distance - Distance in kilometers
 * @returns {string} Route type: 'SHORT_HAUL', 'MEDIUM_HAUL', 'LONG_HAUL', or 'ULTRA_LONG'
 */
function getRouteType(distance) {
    if (distance < DISTANCE_THRESHOLDS.SHORT_HAUL) return 'SHORT_HAUL';
    if (distance < DISTANCE_THRESHOLDS.MEDIUM_HAUL) return 'MEDIUM_HAUL';
    if (distance < DISTANCE_THRESHOLDS.LONG_HAUL) return 'LONG_HAUL';
    return 'ULTRA_LONG';
}

/**
 * Estimate flight cost between two locations
 * @param {string} origin - Origin city/location
 * @param {string} destination - Destination city/location
 * @param {string|Date} travelDate - Travel date
 * @param {string} tripType - 'one-way', 'round-trip', or 'multi-city'
 * @returns {Promise<Object>} Flight cost estimate
 */
async function estimateFlightCost(origin, destination, travelDate, tripType = 'round-trip') {
    try {
        console.log('\n🛫 Estimating flight cost:');
        console.log(`   Origin: ${origin}`);
        console.log(`   Destination: ${destination}`);
        console.log(`   Date: ${travelDate}`);
        console.log(`   Type: ${tripType}`);

        // 1. Get coordinates
        const [originCoords, destCoords] = await Promise.all([
            geocodingService.getCoordinates(origin),
            geocodingService.getCoordinates(destination)
        ]);

        // 2. Calculate distance
        const distance = haversine(
            originCoords.lat,
            originCoords.lon,
            destCoords.lat,
            destCoords.lon
        );

        console.log(`   Distance: ${distance.toLocaleString()} km`);

        // 3. Determine route type and cost per km
        const routeType = getRouteType(distance);
        const costPerKm = COST_PER_KM[routeType];

        console.log(`   Route type: ${routeType} ($${costPerKm}/km)`);

        // 4. Get seasonality multiplier
        const destinationCountry = seasonalityHelper.extractCountry(destCoords.displayName);
        const seasonMultiplier = seasonalityHelper.getSeasonMultiplier(
            destinationCountry,
            travelDate
        );

        // 5. Get trip type multiplier
        const tripTypeMultiplier = TRIP_TYPE_MULTIPLIERS[tripType] || 1.0;

        // 6. Calculate base cost
        let baseCost = distance * costPerKm * seasonMultiplier * tripTypeMultiplier;

        // 7. Apply bounds
        baseCost = Math.max(MIN_PRICE, Math.min(MAX_PRICE, baseCost));

        // 8. Calculate range (low/likely/high)
        const likely = Math.round(baseCost);
        const low = Math.round(baseCost * VARIANCE.LOW);
        const high = Math.round(baseCost * VARIANCE.HIGH);

        // 9. Determine confidence
        const confidence = seasonalityHelper.extractCountry(destCoords.displayName) in require('../data/seasonality.json')
            ? 'high'
            : 'medium';

        const result = {
            origin: {
                name: originCoords.displayName,
                coordinates: { lat: originCoords.lat, lon: originCoords.lon }
            },
            destination: {
                name: destCoords.displayName,
                coordinates: { lat: destCoords.lat, lon: destCoords.lon }
            },
            distance,
            estimate: {
                low,
                likely,
                high,
                currency: 'USD'
            },
            confidence,
            factors: {
                routeType,
                costPerKm,
                seasonMultiplier,
                tripTypeMultiplier
            }
        };

        console.log(`\n💰 Estimate: $${low} - $${likely} - $${high}`);
        console.log(`   Confidence: ${confidence}\n`);

        return result;

    } catch (error) {
        console.error('❌ Flight estimation error:', error.message);
        throw new Error(`Failed to estimate flight cost: ${error.message}`);
    }
}

/**
 * Estimate round-trip flight cost (convenience function)
 */
async function estimateRoundTripCost(origin, destination, departDate) {
    const outbound = await estimateFlightCost(origin, destination, departDate, 'round-trip');

    // For round-trip, double the one-way estimate (already includes round-trip multiplier)
    return {
        ...outbound,
        estimate: {
            low: outbound.estimate.low * 2,
            likely: outbound.estimate.likely * 2,
            high: outbound.estimate.high * 2,
            currency: 'USD'
        },
        tripType: 'round-trip'
    };
}

module.exports = {
    estimateFlightCost,
    estimateRoundTripCost,
    getRouteType
};
