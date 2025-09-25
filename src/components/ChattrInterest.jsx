import React, { useState, useEffect, useRef } from "react";

const interests = [
  "Anxiety", "Self-care", "Grief", "Loneliness", "Motivation", "Relationships", "Burnout", "Mindfulness"
];

const ChattrInterest = ({ onSubmit }) => {
  const [nickname, setNickname] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSubmit = () => {
    const trimmedName = nickname.trim();
    if (!trimmedName || !selectedInterest) {
      alert("Please enter a nickname and select an interest.");
      console.warn("❌ Submission blocked: nickname or interest missing");
      return;
    }

    console.log("🚀 Submitting:", { nickname: trimmedName, interest: selectedInterest });
    onSubmit(trimmedName, selectedInterest);
  };

  return (
    <div className="chattr-interest">
      <h2>Start a Chattr</h2>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter a nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <div className="interest-options">
        {interests.map((interest) => (
          <button
            key={interest}
            className={selectedInterest === interest ? "selected" : ""}
            onClick={() => setSelectedInterest(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit}>Find a Match</button>
    </div>
  );
};

export default ChattrInterest;