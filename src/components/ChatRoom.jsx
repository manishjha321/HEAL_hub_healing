import React, { useState, useEffect, useRef } from "react";
import { ref, push, onChildAdded, off, remove, onValue } from "firebase/database";
import { realtimeDB } from "../firebase";
import "../styles/global.css";

const ChatRoom = ({ roomId, nickname, interest, onLeave }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const messagesRef = ref(realtimeDB, `chats/${roomId}/messages`);
    const handleNewMessage = (snapshot) => {
      const msg = snapshot.val();
      setMessages((prev) => [...prev, msg]);
    };

    onChildAdded(messagesRef, handleNewMessage);

    return () => {
      off(messagesRef, "child_added", handleNewMessage);
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const usersRef = ref(realtimeDB, `chats/${roomId}/users`);
    onValue(usersRef, (snapshot) => {
      const users = snapshot.val();
      if (users) {
        const names = Object.values(users);
        const other = names.find((name) => name !== nickname);
        setPartnerName(other || "Anonymous");
      }
    });
  }, [roomId, nickname]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const messagesRef = ref(realtimeDB, `chats/${roomId}/messages`);
    push(messagesRef, {
      sender: nickname,
      text: input.trim(),
      timestamp: Date.now(),
    });

    setInput("");
  };

  const handleLeave = async () => {
    try {
      await remove(ref(realtimeDB, `chats/${roomId}`));
      console.log("✅ Chat room and messages deleted on leave");
    } catch (err) {
      console.error("Failed to delete chat room:", err);
    }
    onLeave();
  };

  return (
    <div className="chatroom-container">
      <header className="chatroom-header">
        <h2 >HealHub ChatSpace</h2>
        <button className="leave-button" onClick={handleLeave}>
          Leave
        </button>
      </header>

      <div className="chatroom-warning">
        HealHub is a mental wellness platform. Please be respectful and kind. This space is anonymous, but not unaccountable.
      </div>

      <main className="chatroom-main">
        <div className="chatroom-info">
          You are connected to <strong>{partnerName}</strong><strong>{interest}</strong>.
        </div>

        {messages.length === 0 && (
          <p className="chatroom-empty">No messages yet. Say hello 👋</p>
        )}

        {messages.map((msg, idx) => {
          const isSelf = msg.sender === nickname;
          return (
            <div key={idx} className={`chat-bubble ${isSelf ? "self" : "other"}`}>
              <div className="chat-sender">{msg.sender}</div>
              <div>{msg.text}</div>
              <div className="chat-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <form className="chatroom-form" onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          autoComplete="off"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;

