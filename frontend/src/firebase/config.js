// TEMPORARY FIX FOR NODE 25 SSR: Node v22+ has a buggy global localStorage.
// We must delete it before Firebase imports so Firebase doesn't crash during SSR.
if (typeof window === 'undefined' && typeof global !== 'undefined' && global.localStorage) {
  try { delete global.localStorage; } catch (e) {}
}

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration — values come from environment variables.
// Copy frontend/.env.local.example → frontend/.env.local and fill in your values.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if there are no existing apps to avoid HMR errors
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Guard client-specific Firebase initializations behind window check to prevent SSR bugs
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.getItem === 'function';
export const auth = isBrowser ? getAuth(app) : null;
export const db = isBrowser ? getFirestore(app) : null;