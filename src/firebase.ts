import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6CjWCnJOMw3v7ICI9S0QJA5XIpsi5zxE",
  authDomain: "telecure-cf7e8.firebaseapp.com",
  projectId: "telecure-cf7e8",
  storageBucket: "telecure-cf7e8.firebasestorage.app",
  messagingSenderId: "628046517543",
  appId: "1:628046517543:web:19fa419cac5085266bc502",
  measurementId: "G-W2NWWZF0QB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth for use in your app
export const auth = getAuth(app);