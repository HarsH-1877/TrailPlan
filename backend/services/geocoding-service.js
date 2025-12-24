/**
 * Geocoding Service using OpenStreetMap Nominatim API
 * Free, no API key required
 */

const axios = require('axios');

// In-memory cache for coordinates
const coordinateCache = new Map();

// Rate limiting: 1 request per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second in milliseconds

/**
 * Get coordinates for a location using OpenStreetMap Nominatim
 * @param {string} locationName - City, country, or address
 * @returns {Promise<{lat: number, lon: number, displayName: string}>}
 */
// Static coordinates fallback for common cities
const STATIC_COORDINATES = {
    'New York, USA': { lat: 40.7128, lon: -74.0060, displayName: 'New York, NY, United States' },
    'Los Angeles, USA': { lat: 34.0522, lon: -118.2437, displayName: 'Los Angeles, CA, United States' },
    'Boston, USA': { lat: 42.3601, lon: -71.0589, displayName: 'Boston, MA, United States' },
    'Paris, France': { lat: 48.8566, lon: 2.3522, displayName: 'Paris, France' },
    'London, UK': { lat: 51.5074, lon: -0.1278, displayName: 'London, United Kingdom' },
    'Tokyo, Japan': { lat: 35.6762, lon: 139.6503, displayName: 'Tokyo, Japan' },
    'Sydney, Australia': { lat: -33.8688, lon: 151.2093, displayName: 'Sydney, Australia' },
    'Rome, Italy': { lat: 41.9028, lon: 12.4964, displayName: 'Rome, Italy' },
    'Madrid, Spain': { lat: 40.4168, lon: -3.7038, displayName: 'Madrid, Spain' },
    'Berlin, Germany': { lat: 52.5200, lon: 13.4050, displayName: 'Berlin, Germany' }
};

/**
 * Get coordinates for a location using OpenStreetMap Nominatim
 * @param {string} locationName - City, country, or address
 * @returns {Promise<{lat: number, lon: number, displayName: string}>}
 */
async function getCoordinates(locationName) {
    // Check cache first
    if (coordinateCache.has(locationName)) {
        console.log(`📍 Cache hit for: ${locationName}`);
        return coordinateCache.get(locationName);
    }

    // Check static coordinates fallback
    if (STATIC_COORDINATES[locationName]) {
        console.log(`📍 Using static coordinates for: ${locationName}`);
        const result = STATIC_COORDINATES[locationName];
        coordinateCache.set(locationName, result);
        return result;
    }

    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
        console.log(`⏳ Rate limiting: waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    try {
        console.log(`🌐 Fetching coordinates for: ${locationName}`);

        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: locationName,
                format: 'json',
                limit: 1,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'TripPlanner/1.0 (+https://github.com/yourusername/tripplanner; contact@tripplanner.com)'
            },
            timeout: 5000
        });

        lastRequestTime = Date.now();

        if (response.data.length === 0) {
            throw new Error(`Location not found: ${locationName}`);
        }

        const result = {
            lat: parseFloat(response.data[0].lat),
            lon: parseFloat(response.data[0].lon),
            displayName: response.data[0].display_name
        };

        // Cache the result
        coordinateCache.set(locationName, result);
        console.log(`✅ Coordinates found: ${result.lat}, ${result.lon}`);

        return result;

    } catch (error) {
        if (error.response) {
            throw new Error(`Geocoding API error: ${error.response.status} - ${error.response.statusText}`);
        }
        throw new Error(`Failed to geocode location: ${error.message}`);
    }
}

/**
 * Clear the coordinate cache (useful for testing)
 */
function clearCache() {
    coordinateCache.clear();
    console.log('🗑️ Geocoding cache cleared');
}

/**
 * Get cache statistics
 */
function getCacheStats() {
    return {
        size: coordinateCache.size,
        entries: Array.from(coordinateCache.keys())
    };
}

module.exports = {
    getCoordinates,
    clearCache,
    getCacheStats
};
