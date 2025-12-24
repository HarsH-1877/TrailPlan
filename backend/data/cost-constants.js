/**
 * Flight Cost Estimation Constants
 * Calibrated against real Google Flights pricing (2025)
 * Target: HIGH estimate within ₹20k (~$240) of actual prices
 */

module.exports = {
    // Cost per kilometer by route distance (in USD)
    // Fine-tuned to match Google Flights within ₹20k
    COST_PER_KM: {
        SHORT_HAUL: 0.20,      // < 1,500 km (e.g., NYC-Chicago)
        MEDIUM_HAUL: 0.14,     // 1,500 - 4,000 km (e.g., NYC-LA)
        LONG_HAUL: 0.11,       // 4,000 - 8,000 km (e.g., NYC-Paris)
        ULTRA_LONG: 0.09       // > 8,000 km (e.g., NYC-Tokyo)
    },

    // Distance thresholds in kilometers
    DISTANCE_THRESHOLDS: {
        SHORT_HAUL: 1500,
        MEDIUM_HAUL: 4000,
        LONG_HAUL: 8000
    },

    // Trip type multipliers
    TRIP_TYPE_MULTIPLIERS: {
        'one-way': 1.2,        // One-way flights typically more expensive
        'round-trip': 1.0,     // Base rate
        'multi-city': 1.15     // Multi-city adds complexity
    },

    // Price bounds
    MIN_PRICE: 50,           // Minimum flight price (USD)
    MAX_PRICE: 15000,        // Maximum reasonable price (USD)

    // Variance for low/high estimates
    // HIGH set to be within ₹20k (~$240) of actual Google Flights prices
    VARIANCE: {
        LOW: 0.75,           // -25% for low estimate (budget deals)
        HIGH: 1.50           // +50% for high estimate (closer to actual)
    },

    // Default multiplier for unknown countries
    DEFAULT_SEASON_MULTIPLIER: 1.0
};
