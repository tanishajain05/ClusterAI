// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "clusterai-a01ca.firebaseapp.com",
  projectId: "clusterai-a01ca",
  storageBucket: "clusterai-a01ca.firebasestorage.app",
  messagingSenderId: "863832004782",
  appId: "1:863832004782:web:f1d032d7b0bd8143d0353f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
