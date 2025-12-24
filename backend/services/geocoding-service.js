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
    // North America
    'New York, USA': { lat: 40.7128, lon: -74.0060, displayName: 'New York, NY, United States' },
    'Los Angeles, USA': { lat: 34.0522, lon: -118.2437, displayName: 'Los Angeles, CA, United States' },
    'Boston, USA': { lat: 42.3601, lon: -71.0589, displayName: 'Boston, MA, United States' },
    'San Francisco, USA': { lat: 37.7749, lon: -122.4194, displayName: 'San Francisco, CA, United States' },
    'Chicago, USA': { lat: 41.8781, lon: -87.6298, displayName: 'Chicago, IL, United States' },
    'Miami, USA': { lat: 25.7617, lon: -80.1918, displayName: 'Miami, FL, United States' },
    'Las Vegas, USA': { lat: 36.1699, lon: -115.1398, displayName: 'Las Vegas, NV, United States' },

    // Europe
    'Paris, France': { lat: 48.8566, lon: 2.3522, displayName: 'Paris, France' },
    'London, UK': { lat: 51.5074, lon: -0.1278, displayName: 'London, United Kingdom' },
    'Rome, Italy': { lat: 41.9028, lon: 12.4964, displayName: 'Rome, Italy' },
    'Madrid, Spain': { lat: 40.4168, lon: -3.7038, displayName: 'Madrid, Spain' },
    'Berlin, Germany': { lat: 52.5200, lon: 13.4050, displayName: 'Berlin, Germany' },
    'Barcelona, Spain': { lat: 41.3851, lon: 2.1734, displayName: 'Barcelona, Spain' },
    'Amsterdam, Netherlands': { lat: 52.3676, lon: 4.9041, displayName: 'Amsterdam, Netherlands' },
    'Vienna, Austria': { lat: 48.2082, lon: 16.3738, displayName: 'Vienna, Austria' },
    'Prague, Czech Republic': { lat: 50.0755, lon: 14.4378, displayName: 'Prague, Czech Republic' },

    // Asia
    'Tokyo, Japan': { lat: 35.6762, lon: 139.6503, displayName: 'Tokyo, Japan' },
    'Dubai, UAE': { lat: 25.2048, lon: 55.2708, displayName: 'Dubai, United Arab Emirates' },
    'Singapore': { lat: 1.3521, lon: 103.8198, displayName: 'Singapore' },
    'Bangkok, Thailand': { lat: 13.7563, lon: 100.5018, displayName: 'Bangkok, Thailand' },
    'Mumbai, India': { lat: 19.0760, lon: 72.8777, displayName: 'Mumbai, India' },
    'Delhi, India': { lat: 28.7041, lon: 77.1025, displayName: 'Delhi, India' },
    'Hong Kong': { lat: 22.3193, lon: 114.1694, displayName: 'Hong Kong' },
    'Seoul, South Korea': { lat: 37.5665, lon: 126.9780, displayName: 'Seoul, South Korea' },
    'Bali, Indonesia': { lat: -8.3405, lon: 115.0920, displayName: 'Bali, Indonesia' },

    // Oceania
    'Sydney, Australia': { lat: -33.8688, lon: 151.2093, displayName: 'Sydney, Australia' },
    'Melbourne, Australia': { lat: -37.8136, lon: 144.9631, displayName: 'Melbourne, Australia' },
    'Auckland, New Zealand': { lat: -36.8485, lon: 174.7633, displayName: 'Auckland, New Zealand' }
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
                'User-Agent': 'TripPlanner/1.0 (https://trail-plan.vercel.app)'
            },
            timeout: 10000 // Increased to 10 seconds
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
        console.error('❌ Geocoding error details:', {
            message: error.message,
            code: error.code,
            response: error.response?.status,
            location: locationName
        });

        if (error.response) {
            throw new Error(`Geocoding API error: ${error.response.status} - ${error.response.statusText}`);
        }
        if (error.code === 'ECONNABORTED') {
            throw new Error(`Geocoding timeout for: ${locationName}`);
        }
        if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
            throw new Error(`Network error: Cannot reach geocoding service`);
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
