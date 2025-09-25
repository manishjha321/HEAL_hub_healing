import React, { useState, useMemo } from "react";
import Matchmaker from "../components/Matchmaker";
import ChatRoom from "../components/ChatRoom";

const Chattr = () => {
  const [nickname, setNickname] = useState("");
  const [interest, setInterest] = useState("Anxiety");
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [roomId, setRoomId] = useState(null);

  const handleStartMatchmaking = () => {
    if (!nickname.trim()) {
      alert("Please enter a nickname");
      return;
    }
    setShowMatchmaker(true);
  };

  const handleMatch = (roomId) => {
    setRoomId(roomId);
    setShowMatchmaker(false);
  };

  const handleCancel = () => {
    setShowMatchmaker(false);
  };

  const handleLeaveRoom = () => {
    setRoomId(null);
    setNickname("");
    setInterest("Anxiety");
  };

  const matchmakerComponent = useMemo(() => (
    <Matchmaker
      nickname={nickname}
      interest={interest}
      onMatch={handleMatch}
      onCancel={handleCancel}
    />
  ), [nickname, interest]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Chattr</h1>

      {!showMatchmaker && !roomId && (
        <div>
          <input
            placeholder="Enter your nickname"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            style={{ padding: 8, marginBottom: 10, width: "100%" }}
          />
          <select
            value={interest}
            onChange={e => setInterest(e.target.value)}
            style={{ padding: 8, marginBottom: 10, width: "100%" }}
          >
            <option value="Anxiety">Anxiety</option>
            <option value="Depression">Depression</option>
            <option value="Stress">Stress</option>
            <option value="Relationships">Relationships</option>
            <option value="Self-Esteem">Self-Esteem</option>
            <option value="Loneliness">Loneliness</option>
            <option value="politics">politics</option>
            <option value="Burnout">Burnout</option>
            <option value="Mindfulness">Mindfulness</option>
            <option value="Motivation">Motivation</option>
            <option value="Bullying">Bullying</option>
            <option value="Bollywood">Bollywood</option>
            <option value="Cricket">Cricket</option>
            <option value="Music">Music</option>
            <option value="Career Pressure">Career Pressure</option>
            <option value="Breakup">Breakup</option>
            <option value="Football">Football</option>
            <option value="Parenting">Parenting</option>
            <option value="Gaming">Gaming</option>
            <option value="Career Change">Career Change</option>
          </select>

          <button onClick={handleStartMatchmaking} style={{ marginBottom: 20 }}>
            Start Matchmaking
          </button>

          {/* Divider for visual separation */}
          <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #ccc" }} />

          {/* Share Section */}
          <div style={{
            backgroundColor: "#f5f5f5",
            padding: "16px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
          }}>
            <p style={{ marginBottom: "12px", fontSize: "16px", color: "#333" }}>
              💬 Want to invite someone to Chattr?
            </p>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `I'm exploring Chattr on HealHub — a safe space to talk anonymously about ${interest}. Join me: https://heal-hub-healing-tfa4.vercel.app/chattr`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                style={{
                  backgroundColor: "#25D366",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                📤 Share Chattr on WhatsApp
              </button>
            </a>
          </div>
        </div>
      )}

      {showMatchmaker && matchmakerComponent}

      {roomId && (
        <ChatRoom roomId={roomId} nickname={nickname} onLeave={handleLeaveRoom} />
      )}
    </div>
  );
};

export default Chattr;
