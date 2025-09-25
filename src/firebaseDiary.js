import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";

// Save a diary entry and keep only the latest 5
export const saveDiaryEntry = async (uid, title, entry, date) => {
  if (!uid) {
    console.error("Cannot save entry: UID is missing");
    return;
  }

  try {
    // Save the new entry
    const docRef = await addDoc(collection(db, "diaryEntries"), {
      uid,
      title,
      entry,
      date,
      timestamp: serverTimestamp() // critical for ordering
    });

    console.log("Diary entry saved successfully:", title, docRef.id);

    // Fetch all entries for this user ordered by timestamp
    const q = query(
      collection(db, "diaryEntries"),
      where("uid", "==", uid),
      orderBy("timestamp", "desc")
    );
    
    const snapshot = await getDocs(q);
    const entries = snapshot.docs;

    // Delete entries beyond the 5 most recent
    const excessEntries = entries.slice(5);
    for (const docSnap of excessEntries) {
      await deleteDoc(doc(db, "diaryEntries", docSnap.id));
      console.log("Deleted old diary entry:", docSnap.id);
    }

  } catch (error) {
    console.error("Error saving diary entry:", error);
  }
};

// Get last 5 diary entries
export const getLastFiveEntries = async (uid) => {
  if (!uid) {
    console.warn("Cannot fetch entries: UID is missing");
    return [];
  }

  try {
    const q = query(
      collection(db, "diaryEntries"),
      where("uid", "==", uid),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Fetched last 5 diary entries:", entries);
    return entries;
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    return [];
  }
};
