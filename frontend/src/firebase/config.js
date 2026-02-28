// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCENTGYBfPCx4yM07sgdtG3ZJTO2P_xhmA",
  authDomain: "rentlee-auth.firebaseapp.com",
  projectId: "rentlee-auth",
  storageBucket: "rentlee-auth.firebasestorage.app",
  messagingSenderId: "854347492867",
  appId: "1:854347492867:web:3cd4a2d92dfe6da8dc2836",
  measurementId: "G-7SJG2ZJ5H1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);