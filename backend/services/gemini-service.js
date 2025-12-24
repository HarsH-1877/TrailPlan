const { GoogleGenerativeAI } = require('@google/generative-ai');
const promptTemplates = require('../utils/prompt-templates');

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from environment variables");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Log to verify key is loaded (first 15 chars only for security)
console.log('🔑 Gemini API Key loaded:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 15)}...` : 'NOT FOUND');

/**
 * Test Gemini API connection
 */
async function testConnection() {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent('Hello! Please respond with "Connected"');
        const response = await result.response;
        return {
            connected: true,
            message: 'Gemini API connected successfully',
            testResponse: response.text()
        };
    } catch (error) {
        throw new Error(`Gemini API connection failed: ${error.message}`);
    }
}

/**
 * Generate optimized itinerary using Gemini AI
 */
async function generateOptimizedItinerary(tripData, bookingData) {
    try {
        // Define strict schema for valid JSON generation
        const responseSchema = {
            type: "object",
            properties: {
                tripSummary: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        optimizedRoute: { type: "array", items: { type: "string" } },
                        totalCost: { type: "number" },
                        costBreakdown: {
                            type: "object",
                            properties: {
                                flights: { type: "number" },
                                hotels: { type: "number" },
                                activities: { type: "number" },
                                meals: { type: "number" }
                            }
                        }
                    },
                    required: ["title", "totalCost"]
                },
                dailyItinerary: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            day: { type: "number" },
                            date: { type: "string" },
                            city: { type: "string" },
                            theme: { type: "string" },
                            activities: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        time: { type: "string" },
                                        type: { type: "string" },
                                        title: { type: "string" },
                                        description: { type: "string" },
                                        cost: { type: "number" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
                responseMimeType: "application/json",
                responseSchema: responseSchema
            }
        });

        // Build the master prompt
        const prompt = promptTemplates.buildMasterPrompt(tripData, bookingData);

        console.log('📤 Sending prompt to Gemini...');
        console.log('Prompt length:', prompt.length, 'characters');

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('📥 Received response from Gemini');
        console.log('Response length:', text.length, 'characters');

        // Parse JSON response
        const itinerary = parseItineraryResponse(text);

        // Enhance with image URLs
        const enhancedItinerary = enhanceWithImages(itinerary, bookingData);

        return enhancedItinerary;

    } catch (error) {
        console.error('Error generating itinerary with Gemini:', error);
        throw new Error(`Gemini generation failed: ${error.message}`);
    }
}

/**
 * Parse Gemini's JSON response
 */
function parseItineraryResponse(text) {
    try {
        console.log('📥 Parsing Gemini response...');

        // Robust JSON extraction: Find first '{' and last '}'
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
            throw new Error('No valid JSON object found (missing braces)');
        }

        let jsonText = text.substring(firstBrace, lastBrace + 1);

        console.log('📝 Extracted JSON length:', jsonText.length);

        // Parse JSON
        const itinerary = JSON.parse(jsonText);

        console.log('✅ Successfully parsed itinerary');
        return itinerary;

    } catch (error) {
        console.error('❌ Failed to parse Gemini response:', error);

        // Log the end of the text to see if it was truncated
        const debugText = text.length > 500 ? '...' + text.substring(text.length - 500) : text;
        console.error('❌ Response tail:', debugText);

        throw new Error(`Invalid JSON response from Gemini: ${error.message}`);
    }
}

/**
 * Enhance itinerary with image URLs
 */
function enhanceWithImages(itinerary, bookingData) {
    try {
        // Add flight images (airline logos)
        if (itinerary.selectedFlights) {
            if (itinerary.selectedFlights.outbound) {
                itinerary.selectedFlights.outbound.airlineLogoUrl = getAirlineLogo(
                    itinerary.selectedFlights.outbound.airline
                );
            }
            if (itinerary.selectedFlights.return) {
                itinerary.selectedFlights.return.airlineLogoUrl = getAirlineLogo(
                    itinerary.selectedFlights.return.airline
                );
            }
        }

        // Add hotel images
        if (itinerary.selectedHotels) {
            itinerary.selectedHotels = itinerary.selectedHotels.map(hotel => ({
                ...hotel,
                imageUrl: getHotelImage(hotel.name, hotel.city),
                thumbnailUrl: getHotelImage(hotel.name, hotel.city, true)
            }));
        }

        // Add activity images
        if (itinerary.dailyItinerary) {
            itinerary.dailyItinerary = itinerary.dailyItinerary.map(day => ({
                ...day,
                activities: day.activities.map(activity => ({
                    ...activity,
                    imageUrl: getActivityImage(activity.title, activity.type, day.city)
                }))
            }));
        }

        return itinerary;

    } catch (error) {
        console.error('Error enhancing with images:', error);
        return itinerary; // Return without images if enhancement fails
    }
}

/**
 * Get airline logo URL
 */
function getAirlineLogo(airlineName) {
    // Using placeholder service - in production, use real airline logo API
    const cleanName = encodeURIComponent(airlineName || 'airline');
    return `https://ui-avatars.com/api/?name=${cleanName}&size=128&background=0D47A1&color=fff&bold=true`;
}

/**
 * Get hotel image URL
 */
function getHotelImage(hotelName, city, thumbnail = false) {
    // Using Unsplash for hotel images
    const query = encodeURIComponent(`hotel ${city}`);
    const size = thumbnail ? '400x300' : '800x600';
    return `https://source.unsplash.com/${size}/?${query}`;
}

/**
 * Get activity image URL
 */
function getActivityImage(activityName, activityType, city) {
    // Map activity types to search queries
    const typeMap = {
        'sightseeing': 'landmark',
        'adventure': 'outdoor adventure',
        'culture': 'museum culture',
        'nature': 'nature landscape',
        'food': 'restaurant food',
        'shopping': 'shopping street',
        'activity': 'tourist attraction'
    };

    const searchType = typeMap[activityType?.toLowerCase()] || 'tourist attraction';
    const query = encodeURIComponent(`${searchType} ${city}`);

    return `https://source.unsplash.com/800x600/?${query}`;
}

module.exports = {
    testConnection,
    generateOptimizedItinerary
};
