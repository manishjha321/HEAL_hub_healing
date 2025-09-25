import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyASwj6QJC541qtbKrjPzYzX-OHkT_cPdUc",
  authDomain: "healhub-a0378.firebaseapp.com",
  databaseURL: "https://healhub-a0378-default-rtdb.asia-southeast1.firebasedatabase.app", // ✅ Required for Realtime DB
  projectId: "healhub-a0378",
  storageBucket: "healhub-a0378.appspot.com",
  messagingSenderId: "556977742383",
  appId: "1:556977742383:web:978184a2a027269982dcda"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);       // ✅ Restore original name
               // ✅ Optional alias if needed// ✅ Keep existing Firestore logic
export const realtimeDB = getDatabase(app); // ✅ New: Realtime DB for Chattr