import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQihUXxVwOe_gmJjbIz-KQPJoF5uaja6c",
    authDomain: "trailplan-23642.firebaseapp.com",
    projectId: "trailplan-23642",
    storageBucket: "trailplan-23642.firebasestorage.app",
    messagingSenderId: "131784198660",
    appId: "1:131784198660:web:ec81192ec46e34b084c351",
    measurementId: "G-9LYV3D30EM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
