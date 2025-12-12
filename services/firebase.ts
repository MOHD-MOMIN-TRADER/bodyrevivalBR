import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAXMZrPZyM_omYA-BwTx94JhKadLG9nb88",
  authDomain: "bodyrevivalbr.firebaseapp.com",
  projectId: "bodyrevivalbr",
  storageBucket: "bodyrevivalbr.firebasestorage.app",
  messagingSenderId: "159669061850",
  appId: "1:159669061850:web:79989ed132e22351bbfde3",
  measurementId: "G-VDJCW19XTJ"
};

const app = initializeApp(firebaseConfig);

// Export Auth, Firestore, and Analytics
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export { serverTimestamp };
