// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCObgDenJjz5X_NTqCClL-IvrMTSc2QTXw",
  authDomain: "taskflow-e6808.firebaseapp.com",
  projectId: "taskflow-e6808",
  storageBucket: "taskflow-e6808.firebasestorage.app",
  messagingSenderId: "610898462306",
  appId: "1:610898462306:web:2c12395805f8f656b0333b",
  measurementId: "G-DFS1D0F4YX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

const auth = getAuth(app);

export { app, analytics, db, auth };