// Matchmaker.jsx
import React, { useEffect, useRef } from "react";
import {
  ref,
  push,
  set,
  remove,
  onChildAdded,
  off,
  get,
} from "firebase/database";
import { realtimeDB } from "../firebase";

const Matchmaker = ({ nickname, interest, onMatch, onCancel, timeoutDuration = 30000 }) => {
  const userRef = useRef(null);
  const waitingRef = useRef(null);
  const listenerRef = useRef(null);
  const roomListenerRef = useRef(null);
  const isCancelled = useRef(false);
  const hasJoined = useRef(false);

  useEffect(() => {
    console.log("🔁 Matchmaker MOUNTED");

    // Basic validation
    if (!nickname || typeof nickname !== "string" || !interest) {
      console.error("❌ Missing or invalid nickname/interest:", nickname, interest);
      return;
    }

    if (hasJoined.current) {
      console.warn("⚠️ Already joined matchmaking. Skipping duplicate join.");
      return;
    }

    hasJoined.current = true;

    const joinMatchmaking = async () => {
      try {
        // Add user to waiting queue
        waitingRef.current = ref(realtimeDB, `waiting/${interest}`);
        userRef.current = push(waitingRef.current);
        await set(userRef.current, { nickname });

        const myId = userRef.current.key;
        console.log("🧭 Joined matchmaking queue:", interest, "as", nickname, "with ID:", myId);

        // 🔍 Check immediately if roomId already exists (in case listener is late)
        const snapshot = await get(userRef.current);
        if (snapshot.exists() && snapshot.val().roomId && !isCancelled.current) {
          const roomId = snapshot.val().roomId;
          console.log("🎯 Found existing roomId immediately:", roomId);
          onMatch(roomId);
          return;
        }

        // Listen for roomId written to own entry
        roomListenerRef.current = onChildAdded(userRef.current, (snapshot) => {
          if (snapshot.key === "roomId") {
            const roomId = snapshot.val();
            console.log("✅ Matched! Received roomId:", roomId);
            if (!isCancelled.current) {
              onMatch(roomId);
            }
          }
        });

        // Listen for potential partners in the queue
        listenerRef.current = onChildAdded(waitingRef.current, async (snapshot) => {
          const partner = snapshot.val();
          const partnerId = snapshot.key;

          if (!partner || typeof partner.nickname !== "string") {
            console.warn("⚠️ Skipping invalid partner:", partner);
            return;
          }

          if (partnerId === myId || partner.nickname === nickname) {
            return;
          }

          console.log("🔍 Found potential partner:", partner.nickname, "ID:", partnerId);

          // Only one user creates the room (alphabetical Firebase keys)
          if (myId > partnerId && !isCancelled.current) {
            const roomId = `room_${myId}_${partnerId}`;
            const roomRef = ref(realtimeDB, `chats/${roomId}`);

            console.log("🏗️ Creating room:", roomId);

            await set(roomRef, {
              users: {
                [nickname]: nickname,
                [partner.nickname]: partner.nickname,
              },
              interest,
              createdAt: Date.now(),
            });

            // Write roomId to both users
            await Promise.all([
              set(ref(realtimeDB, `waiting/${interest}/${partnerId}/roomId`), roomId),
              set(ref(realtimeDB, `waiting/${interest}/${myId}/roomId`), roomId),
            ]);

            // Remove both from queue
            await Promise.all([
              remove(ref(realtimeDB, `waiting/${interest}/${partnerId}`)),
              remove(userRef.current),
            ]);

            console.log("🧹 Removed both users from queue after match");
          }
        });

        // Timeout fallback
        const timeout = setTimeout(() => {
          if (!isCancelled.current) {
            console.warn("⏳ No match found within timeout.");
            handleCancel();
          }
        }, timeoutDuration);

        // Cleanup function on unmount
        return () => {
          console.log("🔚 Matchmaker UNMOUNTED");
          isCancelled.current = true;
          clearTimeout(timeout);

          if (listenerRef.current) {
            off(waitingRef.current, "child_added", listenerRef.current);
            console.log("🧹 Removed matchmaking listener");
          }

          if (roomListenerRef.current) {
            off(userRef.current, "child_added", roomListenerRef.current);
            console.log("🧹 Removed room listener");
          }

          if (userRef.current) {
            remove(userRef.current).then(() => {
              console.log("🧹 Removed self from queue");
            });
          }
        };
      } catch (err) {
        console.error("🔥 Error during matchmaking:", err);
        handleCancel();
      }
    };

    joinMatchmaking();

    // Cleanup handled above
  }, [nickname, interest, onMatch]);

  const handleCancel = async () => {
    isCancelled.current = true;
    try {
      if (userRef.current) {
        await remove(userRef.current);
        console.log("🚫 Matchmaking cancelled by user");
      }
    } catch (err) {
      console.error("❌ Failed to remove self from queue:", err);
    }
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="matchmaker">
      <p>
        Looking for someone who shares your interest in <strong>{interest}</strong>...
      </p>
      <button onClick={handleCancel} style={{ marginTop: "12px" }}>
        Cancel Matchmaking
      </button>
    </div>
  );
};

export default Matchmaker;
