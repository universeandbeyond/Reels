import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyDSD1cfsf564-fODgEpXhifNyLS82Lrhfk",
  authDomain: "universe-e1634.firebaseapp.com",
  databaseURL: "https://universe-e1634-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "universe-e1634",
  storageBucket: "universe-e1634.firebasestorage.app",
  messagingSenderId: "714096730441",
  appId: "1:714096730441:web:d6b018a4f04970c4593a98",
  measurementId: "G-8P8FBW6KDB"
};

let app;
let db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  // Initialize Firestore
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Firebase will be null if initialization fails
  db = null;
}

export { db };

export default app;