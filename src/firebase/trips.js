import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config.js';
import { getCurrentUser } from './auth.js';

// Save a trip to Firestore
export async function saveTrip(tripData) {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('User must be signed in to save trips');
    }

    try {
        const tripId = `trip_${Date.now()}`;
        const tripRef = doc(db, 'users', user.uid, 'trips', tripId);

        await setDoc(tripRef, {
            ...tripData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: user.uid
        });

        console.log('Trip saved successfully:', tripId);
        return tripId;
    } catch (error) {
        console.error('Error saving trip:', error);
        throw error;
    }
}

// Get all trips for the current user
export async function getUserTrips() {
    const user = getCurrentUser();
    if (!user) {
        return [];
    }

    try {
        const tripsRef = collection(db, 'users', user.uid, 'trips');
        const snapshot = await getDocs(tripsRef);

        const trips = [];
        snapshot.forEach((doc) => {
            trips.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by creation date (newest first)
        trips.sort((a, b) => {
            const aTime = a.createdAt?.toMillis() || 0;
            const bTime = b.createdAt?.toMillis() || 0;
            return bTime - aTime;
        });

        return trips;
    } catch (error) {
        console.error('Error getting trips:', error);
        throw error;
    }
}

// Get a specific trip
export async function getTrip(tripId) {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('User must be signed in');
    }

    try {
        const tripRef = doc(db, 'users', user.uid, 'trips', tripId);
        const tripDoc = await getDoc(tripRef);

        if (tripDoc.exists()) {
            return {
                id: tripDoc.id,
                ...tripDoc.data()
            };
        } else {
            throw new Error('Trip not found');
        }
    } catch (error) {
        console.error('Error getting trip:', error);
        throw error;
    }
}

// Delete a trip
export async function deleteTrip(tripId) {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('User must be signed in');
    }

    try {
        const tripRef = doc(db, 'users', user.uid, 'trips', tripId);
        await deleteDoc(tripRef);
        console.log('Trip deleted:', tripId);
    } catch (error) {
        console.error('Error deleting trip:', error);
        throw error;
    }
}
