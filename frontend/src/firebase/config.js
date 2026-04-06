// TEMPORARY FIX FOR NODE 25 SSR: Node v22+ has a buggy global localStorage.
// We must delete it before Firebase imports so Firebase doesn't crash during SSR.
if (typeof window === 'undefined' && typeof global !== 'undefined' && global.localStorage) {
  try { delete global.localStorage; } catch (e) {}
}

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCENTGYBfPCx4yM07sgdtG3ZJTO2P_xhmA",
  authDomain: "rentlee-auth.firebaseapp.com",
  projectId: "rentlee-auth",
  storageBucket: "rentlee-auth.firebasestorage.app",
  messagingSenderId: "854347492867",
  appId: "1:854347492867:web:3cd4a2d92dfe6da8dc2836",
  measurementId: "G-7SJG2ZJ5H1"
};

// Initialize Firebase only if there are no existing apps to avoid HMR errors
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Guard client-specific Firebase initializations behind window check to prevent SSR bugs
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.getItem === 'function';
export const auth = isBrowser ? getAuth(app) : null;
export const db = isBrowser ? getFirestore(app) : null;