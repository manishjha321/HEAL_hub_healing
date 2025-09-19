import { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import "../styles/global.css";

export default function CommunityChat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    const q = query(collection(db, "community-chat"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "community-chat"), {
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
    <div className="community-chat-modal">
      <div className="chat-box">
        <div className="chat-header">
          <b>Community Chat</b>
          <button onClick={onClose}>✖</button>
        </div>
        <div className="chat-messages" ref={scrollRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`message ${m.senderId === auth.currentUser.uid ? "sent" : "received"}`}
            >
              <div className="message-header">
                <span className="sender-name">
                  {m.senderId === auth.currentUser.uid ? "You" : m.senderName.split('@')[0]}
                </span>
                <span className="timestamp">
                  {m.timestamp?.toDate()?.toLocaleTimeString()}
                </span>
              </div>
              <div className="message-text">{m.text}</div>
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
