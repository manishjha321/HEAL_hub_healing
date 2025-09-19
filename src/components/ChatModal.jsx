import { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import "../styles/global.css";

export default function ChatModal({ mentor, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  const chatId = [auth.currentUser.uid, mentor.id].sort().join("_");

  useEffect(() => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.email,
      text,
      timestamp: serverTimestamp(),
    });
    setText("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-modal">
      <div className="chat-box">
        <div className="chat-header">
          <b>Chat with {mentor.name}</b>
          <button onClick={onClose}>✖</button>
        </div>
        <div className="chat-messages" ref={scrollRef}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`message ${m.senderId === auth.currentUser.uid ? "sent" : "received"}`}
            >
              <div>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
