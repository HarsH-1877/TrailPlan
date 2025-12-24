import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from './config.js';

// Sign in with Google
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('User signed in:', result.user.displayName);
        // Cache auth state
        localStorage.setItem('authState', JSON.stringify({
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            email: result.user.email
        }));
        return result.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

// Sign out
export async function signOutUser() {
    try {
        await signOut(auth);
        // Clear cached auth state
        localStorage.removeItem('authState');
        console.log('User signed out');
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

// Listen to auth state changes
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            // Update cached auth state
            localStorage.setItem('authState', JSON.stringify({
                displayName: user.displayName,
                photoURL: user.photoURL,
                email: user.email
            }));
        } else {
            localStorage.removeItem('authState');
        }
        callback(user);
    });
}

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}

// Get cached auth state (for immediate UI rendering)
export function getCachedAuthState() {
    try {
        const cached = localStorage.getItem('authState');
        return cached ? JSON.parse(cached) : null;
    } catch (e) {
        return null;
    }
}
