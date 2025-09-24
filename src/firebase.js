import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASwj6QJC541qtbKrjPzYzX-OHkT_cPdUc",
  authDomain: "healhub-a0378.firebaseapp.com",
  projectId: "healhub-a0378",
  storageBucket: "healhub-a0378.firebasestorage.app",
  messagingSenderId: "556977742383",
  appId: "1:556977742383:web:978184a2a027269982dcda"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);