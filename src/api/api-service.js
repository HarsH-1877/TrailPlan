/**
 * API Service - Handles all backend communication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Test Gemini API connection
 */
export async function testGeminiConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/test-gemini`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error testing Gemini connection:', error);
        throw error;
    }
}

/**
 * Test Booking.com API connection
 */
export async function testBookingConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/test-booking`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error testing Booking connection:', error);
        throw error;
    }
}

/**
 * Generate optimized itinerary
 * @param {Object} tripData - Trip form data
 * @returns {Promise<Object>} Generated itinerary
 */
export async function generateItinerary(tripData) {
    try {
        // Show Lottie loading animation
        if (window.showLoading) window.showLoading();

        console.log('📤 Sending trip data to backend:', tripData);

        const response = await fetch(`${API_BASE_URL}/generate-itinerary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tripData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate itinerary');
        }

        const result = await response.json();
        console.log('✅ Received response from backend:', result);

        // Check if backend returned success: false
        if (result.success === false) {
            throw new Error(result.error || 'Backend returned error');
        }

        // Validate that we have data
        if (!result.data) {
            throw new Error('Backend response missing data field');
        }

        // Validate that data has required fields
        if (!result.data.dailyItinerary || !result.data.costBreakdown) {
            console.warn('⚠️ Backend data missing required fields:', result.data);
            throw new Error('Backend response missing required fields (dailyItinerary or costBreakdown)');
        }

        console.log('✅ Valid itinerary data received');
        return result.data;

    } catch (error) {
        console.error('❌ Error generating itinerary:', error);
        throw error;
    } finally {
        // Hide loading animation
        if (window.hideLoading) window.hideLoading();
    }
}

/**
 * Save itinerary to localStorage for timeline page
 */
export function saveItineraryToStorage(itinerary) {
    try {
        localStorage.setItem('currentItinerary', JSON.stringify(itinerary));
        console.log('💾 Itinerary saved to localStorage');
    } catch (error) {
        console.error('Error saving itinerary to storage:', error);
    }
}

/**
 * Load itinerary from localStorage
 */
export function loadItineraryFromStorage() {
    try {
        const data = localStorage.getItem('currentItinerary');
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('Error loading itinerary from storage:', error);
        return null;
    }
}
