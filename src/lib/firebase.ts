// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtem8Ip_bqrkTvdbq4xPPPBcxqoBRZg10",
  authDomain: "buildrentajax.firebaseapp.com",
  projectId: "buildrentajax",
  storageBucket: "buildrentajax.firebasestorage.app",
  messagingSenderId: "951120518787",
  appId: "1:951120518787:web:62a2b21a877166d0c9c5b6",
  measurementId: "G-023C9WEDBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;