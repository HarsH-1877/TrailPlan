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
// Static coordinates fallback for common cities AND countries
const STATIC_COORDINATES = {
    // Countries (using geographic center or capital)
    'USA': { lat: 37.0902, lon: -95.7129, displayName: 'United States' },
    'Japan': { lat: 36.2048, lon: 138.2529, displayName: 'Japan' },
    'Finland': { lat: 61.9241, lon: 25.7482, displayName: 'Finland' },
    'Norway': { lat: 60.4720, lon: 8.4689, displayName: 'Norway' },
    'Switzerland': { lat: 46.8182, lon: 8.2275, displayName: 'Switzerland' },
    'France': { lat: 46.2276, lon: 2.2137, displayName: 'France' },
    'Italy': { lat: 41.8719, lon: 12.5674, displayName: 'Italy' },
    'Spain': { lat: 40.4637, lon: -3.7492, displayName: 'Spain' },
    'Germany': { lat: 51.1657, lon: 10.4515, displayName: 'Germany' },
    'UK': { lat: 55.3781, lon: -3.4360, displayName: 'United Kingdom' },
    'United Kingdom': { lat: 55.3781, lon: -3.4360, displayName: 'United Kingdom' },
    'Australia': { lat: -25.2744, lon: 133.7751, displayName: 'Australia' },
    'India': { lat: 20.5937, lon: 78.9629, displayName: 'India' },
    'Thailand': { lat: 15.8700, lon: 100.9925, displayName: 'Thailand' },
    'UAE': { lat: 23.4241, lon: 53.8478, displayName: 'United Arab Emirates' },
    'Indonesia': { lat: -0.7893, lon: 113.9213, displayName: 'Indonesia' },
    'Singapore': { lat: 1.3521, lon: 103.8198, displayName: 'Singapore' },
    'New Zealand': { lat: -40.9006, lon: 174.8860, displayName: 'New Zealand' },
    'Canada': { lat: 56.1304, lon: -106.3468, displayName: 'Canada' },
    'Mexico': { lat: 23.6345, lon: -102.5528, displayName: 'Mexico' },
    'Brazil': { lat: -14.2350, lon: -51.9253, displayName: 'Brazil' },
    'Argentina': { lat: -38.4161, lon: -63.6167, displayName: 'Argentina' },
    'South Korea': { lat: 35.9078, lon: 127.7669, displayName: 'South Korea' },
    'China': { lat: 35.8617, lon: 104.1954, displayName: 'China' },
    'Netherlands': { lat: 52.1326, lon: 5.2913, displayName: 'Netherlands' },
    'Austria': { lat: 47.5162, lon: 14.5501, displayName: 'Austria' },
    'Czech Republic': { lat: 49.8175, lon: 15.4730, displayName: 'Czech Republic' },
    'Greece': { lat: 39.0742, lon: 21.8243, displayName: 'Greece' },
    'Portugal': { lat: 39.3999, lon: -8.2245, displayName: 'Portugal' },
    'Iceland': { lat: 64.9631, lon: -19.0208, displayName: 'Iceland' },

    // Popular Cities (North America)
    'New York, USA': { lat: 40.7128, lon: -74.0060, displayName: 'New York, NY, United States' },
    'Los Angeles, USA': { lat: 34.0522, lon: -118.2437, displayName: 'Los Angeles, CA, United States' },
    'Boston, USA': { lat: 42.3601, lon: -71.0589, displayName: 'Boston, MA, United States' },
    'San Francisco, USA': { lat: 37.7749, lon: -122.4194, displayName: 'San Francisco, CA, United States' },
    'Chicago, USA': { lat: 41.8781, lon: -87.6298, displayName: 'Chicago, IL, United States' },
    'Miami, USA': { lat: 25.7617, lon: -80.1918, displayName: 'Miami, FL, United States' },
    'Las Vegas, USA': { lat: 36.1699, lon: -115.1398, displayName: 'Las Vegas, NV, United States' },

    // Popular Cities (Europe)
    'Paris, France': { lat: 48.8566, lon: 2.3522, displayName: 'Paris, France' },
    'London, UK': { lat: 51.5074, lon: -0.1278, displayName: 'London, United Kingdom' },
    'Rome, Italy': { lat: 41.9028, lon: 12.4964, displayName: 'Rome, Italy' },
    'Madrid, Spain': { lat: 40.4168, lon: -3.7038, displayName: 'Madrid, Spain' },
    'Berlin, Germany': { lat: 52.5200, lon: 13.4050, displayName: 'Berlin, Germany' },
    'Barcelona, Spain': { lat: 41.3851, lon: 2.1734, displayName: 'Barcelona, Spain' },
    'Amsterdam, Netherlands': { lat: 52.3676, lon: 4.9041, displayName: 'Amsterdam, Netherlands' },
    'Vienna, Austria': { lat: 48.2082, lon: 16.3738, displayName: 'Vienna, Austria' },
    'Prague, Czech Republic': { lat: 50.0755, lon: 14.4378, displayName: 'Prague, Czech Republic' },

    // Popular Cities (Asia)
    'Tokyo, Japan': { lat: 35.6762, lon: 139.6503, displayName: 'Tokyo, Japan' },
    'Dubai, UAE': { lat: 25.2048, lon: 55.2708, displayName: 'Dubai, United Arab Emirates' },
    'Bangkok, Thailand': { lat: 13.7563, lon: 100.5018, displayName: 'Bangkok, Thailand' },
    'Mumbai, India': { lat: 19.0760, lon: 72.8777, displayName: 'Mumbai, India' },
    'Delhi, India': { lat: 28.7041, lon: 77.1025, displayName: 'Delhi, India' },
    'Hong Kong': { lat: 22.3193, lon: 114.1694, displayName: 'Hong Kong' },
    'Seoul, South Korea': { lat: 37.5665, lon: 126.9780, displayName: 'Seoul, South Korea' },
    'Bali, Indonesia': { lat: -8.3405, lon: 115.0920, displayName: 'Bali, Indonesia' },

    // Popular Cities (Oceania)
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
