import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm Saksham, your mental wellness companion. I'm here to listen, support, and guide you. How are you feeling today?",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const formatBotReply = (text) => {
    return text
      .replace(/### (.*?)\n?/g, '<h4>$1</h4>')
      .replace(/- \*\*(.*?)\*\* \((.*?)\) – (.*?)\n?/g, '<li><strong>$1</strong> <em>($2)</em>: $3</li>')
      .replace(/- (.*?)\n?/g, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const newUserMessage = { text: inputText, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const messageToSend = inputText;
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("https://heal-hub-healing-3.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await response.json();
      console.log("Saksham response:", data);

      if (data.message) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.message, sender: "bot" },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "⚠️ No response received. Please try again later.",
            sender: "bot",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching Saksham response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "⚠️ Oops! Something went wrong. You're not alone—let's try again in a moment.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="top-navbar">
        <div className="nav-left">
          <Link to="/dashboard" className="nav-item">Home</Link>
          <Link to="/resources" className="nav-item">Resources</Link>
          <Link to="/community" className="nav-item">Community</Link>
          <Link to="/chatbot" className="nav-item active">Chat with Saksham</Link>
        </div>
      </nav>

      <div className="content-box chatbot-container">
        <h2>💬 Chat with Saksham AI</h2>
        <p className="chat-intro">Saksham is here to support your emotional well-being. Whether you're feeling low, anxious, or just need someone to talk to—he's listening. 💙</p>

        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((m, index) => (
            <div key={index} className={`message ${m.sender === "user" ? "sent" : "received"}`}>
              {m.sender === "bot" ? (
                <div
                  className="bot-reply"
                  dangerouslySetInnerHTML={{ __html: formatBotReply(m.text) }}
                />
              ) : (
                m.text
              )}
            </div>
          ))}
          {loading && <div className="message received">⏳ Saksham is thinking...</div>}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>

        {/* Disclaimer */}
        <p className="chat-disclaimer">
          ⚠️ <strong>Disclaimer:</strong> Saksham is an AI-based mental wellness companion. While he strives to be helpful and empathetic, he may occasionally make mistakes or offer incomplete advice. For serious mental health concerns, please consult a qualified professional.
        </p>
      </div>
    </div>
  );
}