// Save trip functionality for timeline page
import { getCurrentUser, signInWithGoogle } from '../firebase/auth.js';
import { saveTrip as saveTripToFirebase } from '../firebase/trips.js';

// Global Save Trip function
window.saveTrip = async function () {
    const user = getCurrentUser();

    if (!user) {
        if (confirm('You need to sign in to save trips. Sign in now?')) {
            try {
                await signInWithGoogle();
                // After sign-in, try saving again
                window.saveTrip();
            } catch (error) {
                console.error('Sign in failed:', error);
            }
        }
        return;
    }

    try {
        // Get trip data from sessionStorage
        const tripDataStr = sessionStorage.getItem('tripData');

        if (!tripDataStr) {
            alert('No trip data found. Please generate an itinerary first.');
            return;
        }

        const tripData = JSON.parse(tripDataStr);

        // Save to Firestore
        const tripId = await saveTripToFirebase(tripData);

        alert('✅ Trip saved successfully!');
        console.log('Trip saved with ID:', tripId);

    } catch (error) {
        console.error('Error saving trip:', error);
        alert('Failed to save trip. Please try again.');
    }
};

// Initialize the save trip function when this module is loaded
console.log('Save trip functionality loaded');
