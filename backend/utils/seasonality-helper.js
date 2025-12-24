/**
 * Seasonality Helper
 * Determines season and pricing multipliers based on destination and travel date
 */

const seasonalityData = require('../data/seasonality.json');
const { DEFAULT_SEASON_MULTIPLIER } = require('../data/cost-constants');

/**
 * Get the season for a specific country and month
 * @param {string} country - Country name
 * @param {number} month - Month (1-12)
 * @returns {string} Season: 'peak', 'shoulder', or 'off'
 */
function getSeason(country, month) {
    const data = seasonalityData[country];

    if (!data) {
        return 'shoulder'; // Default if country not found
    }

    if (data.peak.includes(month)) return 'peak';
    if (data.shoulder.includes(month)) return 'shoulder';
    if (data.off.includes(month)) return 'off';

    return 'shoulder'; // Fallback
}

/**
 * Get the season multiplier for a specific country and date
 * @param {string} country - Country name
 * @param {string|Date} travelDate - Travel date (ISO string or Date object)
 * @returns {number} Multiplier (e.g., 1.35 for peak)
 */
function getSeasonMultiplier(country, travelDate) {
    const data = seasonalityData[country];

    if (!data) {
        console.log(`⚠️  Country "${country}" not in seasonality database, using default multiplier`);
        return DEFAULT_SEASON_MULTIPLIER;
    }

    // Extract month from date
    const date = typeof travelDate === 'string' ? new Date(travelDate) : travelDate;
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed

    const season = getSeason(country, month);
    const multiplier = data.multipliers[season];

    console.log(`📅 ${country} in ${getMonthName(month)}: ${season} season (${multiplier}×)`);

    return multiplier;
}

/**
 * Extract country from location string
 * @param {string} location - Location string (e.g., "Paris, France" or "France")
 * @returns {string} Country name
 */
function extractCountry(location) {
    // Simple heuristic: take the last part after comma, or the whole string
    const parts = location.split(',').map(p => p.trim());
    return parts[parts.length - 1];
}

/**
 * Get month name for logging
 */
function getMonthName(month) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
}

module.exports = {
    getSeason,
    getSeasonMultiplier,
    extractCountry
};
