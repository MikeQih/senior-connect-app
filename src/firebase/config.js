import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApVAopqyu49UGtcAkAzuLyovybTKOz8LU",
  authDomain: "senior-connect-app-5382e.firebaseapp.com",
  projectId: "senior-connect-app-5382e",
  storageBucket: "senior-connect-app-5382e.firebasestorage.app",
  messagingSenderId: "414196606832",
  appId: "1:414196606832:web:9b429f98930e09b63d11b5",
  measurementId: "G-LRKG2PJ2FX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { db, analytics };
