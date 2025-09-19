import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm Saksham, your mental wellness companion. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Loaded API Key:", process.env.REACT_APP_API_KEY);
  }, []);

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const newUserMessage = { text: inputText, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    const userMessage = inputText;
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are Saksham, a kind and supportive mental wellness companion. You speak gently and encourage the user to share their feelings, suggest mindfulness tips, breathing exercises, and positive thoughts.",
            },
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: userMessage },
          ],
        }),
      });

      const data = await response.json();
      console.log("OpenAI response:", data);

      if (data.choices && data.choices.length > 0) {
        const reply = data.choices[0].message.content;
        const newBotMessage = { text: reply, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "⚠️ No response received. Please try again later.", sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "⚠️ Oops! Something went wrong. Try again.", sender: "bot" },
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
        <h2>Chat with Saksham AI</h2>
        <div className="chat-window">
          {messages.map((m, index) => (
            <div key={index} className={`message ${m.sender === "user" ? "sent" : "received"}`}>
              {m.text}
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
      </div>
    </div>
  );
}
