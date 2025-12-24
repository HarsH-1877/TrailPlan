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
// Static coordinates fallback for all countries in seasonality.json (50+ countries)
const STATIC_COORDINATES = {
    // From seasonality.json - all supported countries
    'France': { lat: 46.2276, lon: 2.2137, displayName: 'France' },
    'Italy': { lat: 41.8719, lon: 12.5674, displayName: 'Italy' },
    'Spain': { lat: 40.4637, lon: -3.7492, displayName: 'Spain' },
    'United Kingdom': { lat: 55.3781, lon: -3.4360, displayName: 'United Kingdom' },
    'UK': { lat: 55.3781, lon: -3.4360, displayName: 'United Kingdom' },
    'Germany': { lat: 51.1657, lon: 10.4515, displayName: 'Germany' },
    'Greece': { lat: 39.0742, lon: 21.8243, displayName: 'Greece' },
    'Japan': { lat: 36.2048, lon: 138.2529, displayName: 'Japan' },
    'Thailand': { lat: 15.8700, lon: 100.9925, displayName: 'Thailand' },
    'United States': { lat: 37.0902, lon: -95.7129, displayName: 'United States' },
    'USA': { lat: 37.0902, lon: -95.7129, displayName: 'United States' },
    'Australia': { lat: -25.2744, lon: 133.7751, displayName: 'Australia' },
    'Mexico': { lat: 23.6345, lon: -102.5528, displayName: 'Mexico' },
    'Turkey': { lat: 38.9637, lon: 35.2433, displayName: 'Turkey' },
    'Portugal': { lat: 39.3999, lon: -8.2245, displayName: 'Portugal' },
    'Netherlands': { lat: 52.1326, lon: 5.2913, displayName: 'Netherlands' },
    'Switzerland': { lat: 46.8182, lon: 8.2275, displayName: 'Switzerland' },
    'Austria': { lat: 47.5162, lon: 14.5501, displayName: 'Austria' },
    'Canada': { lat: 56.1304, lon: -106.3468, displayName: 'Canada' },
    'Singapore': { lat: 1.3521, lon: 103.8198, displayName: 'Singapore' },
    'South Korea': { lat: 35.9078, lon: 127.7669, displayName: 'South Korea' },
    'Indonesia': { lat: -0.7893, lon: 113.9213, displayName: 'Indonesia' },
    'Malaysia': { lat: 4.2105, lon: 101.9758, displayName: 'Malaysia' },
    'India': { lat: 20.5937, lon: 78.9629, displayName: 'India' },
    'United Arab Emirates': { lat: 23.4241, lon: 53.8478, displayName: 'United Arab Emirates' },
    'UAE': { lat: 23.4241, lon: 53.8478, displayName: 'United Arab Emirates' },
    'Egypt': { lat: 26.8206, lon: 30.8025, displayName: 'Egypt' },
    'Morocco': { lat: 31.7917, lon: -7.0926, displayName: 'Morocco' },
    'Brazil': { lat: -14.2350, lon: -51.9253, displayName: 'Brazil' },
    'Argentina': { lat: -38.4161, lon: -63.6167, displayName: 'Argentina' },
    'Peru': { lat: -9.1900, lon: -75.0152, displayName: 'Peru' },
    'Chile': { lat: -35.6751, lon: -71.5430, displayName: 'Chile' },
    'New Zealand': { lat: -40.9006, lon: 174.8860, displayName: 'New Zealand' },
    'South Africa': { lat: -30.5595, lon: 22.9375, displayName: 'South Africa' },
    'China': { lat: 35.8617, lon: 104.1954, displayName: 'China' },
    'Vietnam': { lat: 14.0583, lon: 108.2772, displayName: 'Vietnam' },
    'Philippines': { lat: 12.8797, lon: 121.7740, displayName: 'Philippines' },
    'Cambodia': { lat: 12.5657, lon: 104.9910, displayName: 'Cambodia' },
    'Iceland': { lat: 64.9631, lon: -19.0208, displayName: 'Iceland' },
    'Norway': { lat: 60.4720, lon: 8.4689, displayName: 'Norway' },
    'Sweden': { lat: 60.1282, lon: 18.6435, displayName: 'Sweden' },
    'Denmark': { lat: 56.2639, lon: 9.5018, displayName: 'Denmark' },
    'Finland': { lat: 61.9241, lon: 25.7482, displayName: 'Finland' },
    'Poland': { lat: 51.9194, lon: 19.1451, displayName: 'Poland' },
    'Czech Republic': { lat: 49.8175, lon: 15.4730, displayName: 'Czech Republic' },
    'Croatia': { lat: 45.1000, lon: 15.2000, displayName: 'Croatia' },
    'Ireland': { lat: 53.4129, lon: -8.2439, displayName: 'Ireland' },
    'Israel': { lat: 31.0461, lon: 34.8516, displayName: 'Israel' },
    'Hong Kong': { lat: 22.3193, lon: 114.1694, displayName: 'Hong Kong' },
    'Taiwan': { lat: 23.6978, lon: 120.9605, displayName: 'Taiwan' },
    'Russia': { lat: 61.5240, lon: 105.3188, displayName: 'Russia' },
    'Maldives': { lat: 3.2028, lon: 73.2207, displayName: 'Maldives' },

    // Popular Cities (for backward compatibility)
    'New York, USA': { lat: 40.7128, lon: -74.0060, displayName: 'New York, NY, United States' },
    'Los Angeles, USA': { lat: 34.0522, lon: -118.2437, displayName: 'Los Angeles, CA, United States' },
    'San Francisco, USA': { lat: 37.7749, lon: -122.4194, displayName: 'San Francisco, CA, United States' },
    'Paris, France': { lat: 48.8566, lon: 2.3522, displayName: 'Paris, France' },
    'London, UK': { lat: 51.5074, lon: -0.1278, displayName: 'London, United Kingdom' },
    'Rome, Italy': { lat: 41.9028, lon: 12.4964, displayName: 'Rome, Italy' },
    'Tokyo, Japan': { lat: 35.6762, lon: 139.6503, displayName: 'Tokyo, Japan' },
    'Dubai, UAE': { lat: 25.2048, lon: 55.2708, displayName: 'Dubai, United Arab Emirates' },
    'Mumbai, India': { lat: 19.0760, lon: 72.8777, displayName: 'Mumbai, India' },
    'Delhi, India': { lat: 28.7041, lon: 77.1025, displayName: 'Delhi, India' },
    'Sydney, Australia': { lat: -33.8688, lon: 151.2093, displayName: 'Sydney, Australia' },
    'Bangkok, Thailand': { lat: 13.7563, lon: 100.5018, displayName: 'Bangkok, Thailand' }
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
