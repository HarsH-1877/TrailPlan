/**
 * API Service for communicating with backend
 */

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Generate itinerary by calling backend
 */
export async function generateItinerary(tripData) {
    try {
        // Show Lottie loading animation
        if (window.showLoading) window.showLoading();

        const response = await fetch(`${API_BASE_URL}/generate-itinerary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tripData)
        });

        if (!response.ok) {
            const error = await response.json();
            const errorMsg = error.error?.message || error.error || error.message || 'Failed to generate itinerary';
            throw new Error(errorMsg);
        }

        const result = await response.json();
        return result.data;

    } catch (error) {
        console.error('API Error:', error);
        throw error;
    } finally {
        // Hide loading animation
        if (window.hideLoading) window.hideLoading();
    }
}

/**
 * Test backend connection
 */
export async function testBackendConnection() {
    try {
        const response = await fetch('http://localhost:3001/health');
        const data = await response.json();
        return data.status === 'ok';
    } catch (error) {
        console.error('Backend connection test failed:', error);
        return false;
    }
}

/**
 * Test Booking.com API
 */
export async function testBookingAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/test-booking`);
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Booking API test failed:', error);
        return false;
    }
}

/**
 * Test Gemini API
 */
export async function testGeminiAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/test-gemini`);
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Gemini API test failed:', error);
        return false;
    }
}
