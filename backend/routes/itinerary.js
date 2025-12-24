const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const flightEstimator = require('../services/flight-estimator');
const { buildOptimizedItineraryPrompt } = require('../utils/gemini-prompts');
const { parseJsonRobust } = require('../utils/json-parser');

// Initialize Gemini AI
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/generate-itinerary
 * Generate real itinerary using flight estimator + Gemini AI
 */
router.post('/generate-itinerary', async (req, res) => {
    try {
        console.log('📥 Received itinerary request:', req.body);

        // Extract ALL fields from request
        const {
            tripName,
            tripType,
            startLocation,
            destinations,
            startDate,
            duration,
            adults,
            children,
            infants,
            budget,
            currency
        } = req.body;

        // Validate required fields
        if (!startLocation || !destinations || !startDate || !duration) {
            return res.status(400).json({
                error: 'Missing required fields: startLocation, destinations, startDate, duration'
            });
        }

        const tripData = req.body;

        // Helper function to clean location names (remove airport codes, etc.)
        const cleanLocation = (location) => {
            if (!location) return location;
            // Remove airport codes like (BOM), (JFK), etc.
            return location.replace(/\s*\([A-Z]{3}\)\s*$/g, '').trim();
        };

        // Step 1: Get real flight estimate
        console.log('✈️  Estimating flight cost...');
        const destination = Array.isArray(destinations) ? destinations[0] : destinations;

        // Clean locations before sending to geocoder
        const cleanedStartLocation = cleanLocation(startLocation);
        const cleanedDestination = cleanLocation(destination);

        console.log(`   Cleaned: "${startLocation}" → "${cleanedStartLocation}"`);
        console.log(`   Cleaned: "${destination}" → "${cleanedDestination}"`);

        const flightEstimate = await flightEstimator.estimateFlightCost(
            cleanedStartLocation,
            cleanedDestination,
            startDate,
            tripType
        );

        const flightCostUSD = flightEstimate.estimate.likely;
        const exchangeRate = currency === 'INR' ? 83 : 1; // Simple conversion, can be enhanced
        const flightCostInCurrency = Math.round(flightCostUSD * exchangeRate);

        console.log(`✅ Flight estimate: ${currency} ${flightCostInCurrency.toLocaleString()}`);
        console.log(`   Distance: ${flightEstimate.distance.toLocaleString()} km`);

        // Step 2: Build Gemini prompt
        console.log('🤖 Building Gemini prompt...');
        const prompt = buildOptimizedItineraryPrompt(tripData, flightEstimate);

        // Step 3: Call Gemini API in JSON mode (no strict schema, use robust parser instead)
        console.log('📤 Sending to Gemini AI (JSON mode)...');

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 16384
            }
        });

        let itinerary = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (!itinerary && attempts < maxAttempts) {
            attempts++;
            try {
                console.log(`   Attempt ${attempts}/${maxAttempts}...`);

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let jsonResponse = response.text();

                console.log('📥 Received response from Gemini');
                console.log(`   Response length: ${jsonResponse.length} characters`);
                console.log('\n' + '='.repeat(80));
                console.log('RAW GEMINI RESPONSE:');
                console.log('='.repeat(80));
                console.log(jsonResponse);
                console.log('='.repeat(80) + '\n');

                // Multi-strategy JSON parsing
                itinerary = parseJsonRobust(jsonResponse);

                if (itinerary) {
                    console.log('✅ Successfully parsed itinerary');
                }

            } catch (error) {
                console.warn(`⚠️  Attempt ${attempts} failed:`, error.message);
                if (attempts >= maxAttempts) {
                    throw new Error(`Failed to get valid JSON after ${maxAttempts} attempts: ${error.message}`);
                }
                // Wait 15 seconds before retry to avoid rate limiting (5 req/min limit)
                console.log(`⏳ Waiting 15 seconds before retry ${attempts + 1}...`);
                await new Promise(resolve => setTimeout(resolve, 15000));
            }
        }

        // Step 5: Transform response to match frontend expectations
        const hotelActivityMealCost = itinerary.budgetSummary?.estimatedSpend || 0;
        const totalCost = flightCostInCurrency + hotelActivityMealCost;

        // Post-process: Replace flight booking links with Google Flights
        if (itinerary.dailyItinerary && Array.isArray(itinerary.dailyItinerary)) {
            itinerary.dailyItinerary.forEach(day => {
                if (day.activities && Array.isArray(day.activities)) {
                    day.activities.forEach(activity => {
                        // Only replace links for flight/travel activities
                        if (activity.type === 'travel' || activity.title?.toLowerCase().includes('flight')) {
                            // Generate Google Flights link
                            const cleanStart = cleanLocation(startLocation);
                            const cleanDest = cleanLocation(destination);
                            activity.bookingUrl = `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(cleanStart)}+to+${encodeURIComponent(cleanDest)}`;
                        }
                    });
                }
            });
        }

        // Extract ALL hotel information from daily itinerary
        const hotelsWithDays = [];
        const hotelOccurrences = new Map(); // Track which days each hotel appears

        if (itinerary.dailyItinerary && Array.isArray(itinerary.dailyItinerary)) {
            itinerary.dailyItinerary.forEach((day, index) => {
                if (day.accommodation && day.accommodation.name && day.accommodation.name !== 'N/A') {
                    const hotelKey = `${day.accommodation.name}-${day.location}`;

                    if (!hotelOccurrences.has(hotelKey)) {
                        hotelOccurrences.set(hotelKey, {
                            hotel: day.accommodation,
                            location: day.location,
                            days: []
                        });
                    }

                    hotelOccurrences.get(hotelKey).days.push(index + 1); // 1-indexed day number
                }
            });
        }

        // Build selectedHotels array with check-in/check-out dates
        const selectedHotels = [];
        const startDateObj = new Date(startDate);

        hotelOccurrences.forEach((data, hotelKey) => {
            const firstDay = Math.min(...data.days);
            const lastDay = Math.max(...data.days);
            const totalNights = data.days.length;

            const checkInDate = new Date(startDateObj);
            checkInDate.setDate(checkInDate.getDate() + firstDay - 1);

            const checkOutDate = new Date(startDateObj);
            checkOutDate.setDate(checkOutDate.getDate() + lastDay);

            selectedHotels.push({
                name: data.hotel.name,
                city: data.location,
                stars: 4,
                rating: data.hotel.rating || 8.0,
                roomType: 'Standard Room',
                pricePerNight: data.hotel.pricePerNight || 0,
                totalNights: totalNights,
                totalPrice: (data.hotel.pricePerNight || 0) * totalNights,
                checkInDate: checkInDate.toISOString().split('T')[0],
                checkOutDate: checkOutDate.toISOString().split('T')[0],
                bookingUrl: data.hotel.bookingUrl || 'https://www.booking.com/hotels'
            });
        });

        console.log(`📍 Extracted ${selectedHotels.length} hotel(s) from itinerary:`,
            selectedHotels.map(h => `${h.name} (${h.city}, ${h.totalNights}n)`).join(', '));

        const enhancedItinerary = {
            ...itinerary,
            // CRITICAL: Include ALL original user input for frontend
            tripName,
            tripType,
            startLocation,
            destinations: Array.isArray(destinations) ? destinations : [destinations],
            startDate,
            duration,
            adults,
            children,
            infants,
            budget,  // User's ACTUAL budget
            currency,
            // Root-level costBreakdown (timeline page expects this)
            costBreakdown: {
                flights: flightCostInCurrency,
                hotel: itinerary.budgetSummary?.breakdown?.accommodation || 0,
                activities: itinerary.budgetSummary?.breakdown?.activities || 0,
                food: itinerary.budgetSummary?.breakdown?.meals || 0,
                total: totalCost
            },
            // Flight details from our estimator
            flightDetails: {
                estimate: flightEstimate.estimate,
                distance: flightEstimate.distance,
                factors: flightEstimate.factors,
                confidence: flightEstimate.confidence,
                costInCurrency: flightCostInCurrency,
                currency: currency
            },
            // Selected hotels array with ALL hotels
            selectedHotels: selectedHotels,
            // Update tripSummary with flight costs
            tripSummary: {
                ...itinerary.tripSummary,
                totalEstimatedCost: totalCost,
                costBreakdown: {
                    flights: flightCostInCurrency,
                    hotels: itinerary.budgetSummary?.breakdown?.accommodation || 0,
                    activities: itinerary.budgetSummary?.breakdown?.activities || 0,
                    meals: itinerary.budgetSummary?.breakdown?.meals || 0
                }
            }
        };

        console.log('✅ Itinerary generation complete!');
        console.log(`   Total cost: ${currency} ${totalCost.toLocaleString()}`);
        console.log(`   Route: ${enhancedItinerary.tripSummary.optimizedRoute.join(' → ')}`);
        console.log(`   Hotels: ${enhancedItinerary.selectedHotels?.length || 0} properties`);

        res.json({
            success: true,
            data: enhancedItinerary
        });

    } catch (error) {
        console.error('❌ ERROR generating itinerary:', error.message);
        console.error(error.stack);

        // Return error in a format frontend can handle
        res.status(200).json({
            success: false,
            error: error.message || 'Failed to generate itinerary',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * GET /api/test-gemini
 * Test Gemini API connection
 */
router.get('/test-gemini', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent('Hello! Please respond with "Connected"');
        const response = await result.response;

        res.json({
            success: true,
            message: 'Gemini API connected successfully',
            response: response.text()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
