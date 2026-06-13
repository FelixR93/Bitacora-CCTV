import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFDr02Ddz2snhDE7IGPkGosbtrGFRBac8",
  authDomain: "bitacora-cctv-bonanza.firebaseapp.com",
  projectId: "bitacora-cctv-bonanza",
  storageBucket: "bitacora-cctv-bonanza.firebasestorage.app",
  messagingSenderId: "1088952429792",
  appId: "1:1088952429792:web:a9b45915a45eab9279f485",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;