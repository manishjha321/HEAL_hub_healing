import { useState } from "react";
import "../styles/global.css";
import { saveDiaryEntry } from "../firebaseDiary";
import { auth } from "../firebase";

const positiveResponses = [
  "Great job! Keep shining and spreading positivity!",
  "You're doing amazing! Keep up the good vibes!",
  "Keep it up! Every positive thought counts!",
];

const negativeResponses = [
  "It's okay to feel down. Take a deep breath.",
  "Remember, tough times pass. You are strong!",
  "Don't be too hard on yourself. You're doing your best!",
];

const urgentResponses = [
  "You are not alone in this storm. Please call 1800-121-3667.",
  "Reach out to AASRA’s helpline—they are here to listen.",
  "Talk to mentors in our community space.",
];

const negativeKeywords = [
  "sad", "depressed", "anxious", "stress", "bad", "down", "frustrated", "worried"
];

function getDiaryFeedback(entry) {
  const text = entry?.toLowerCase() || "";
  const urgentKeywords = ["suicide", "kill myself", "end my life", "kill", "death", "die"];
  const positiveKeywords = ["happy", "joy", "excited", "good", "great", "love", "amazing", "positive", "peace"];

  if (urgentKeywords.some(k => text.includes(k))) {
    return urgentResponses[Math.floor(Math.random() * urgentResponses.length)];
  } else if (positiveKeywords.some(k => text.includes(k))) {
    return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
  } else if (negativeKeywords.some(k => text.includes(k))) {
    return negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
  } else {
    return "Thanks for sharing! Sometimes just writing down your thoughts helps.";
  }
}

export default function Diary({ onAIAnalyze, aiResponse, isAnalyzing }) {
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [response, setResponse] = useState("");
  const [usedAI, setUsedAI] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to save a diary entry.");
      return;
    }

    const entryDate = date || new Date().toISOString().slice(0, 10);

    try {
      // Save entry exactly as user wrote it
      console.log("Saving diary entry:", { title, entry, date: entryDate, uid: user.uid });
      await saveDiaryEntry(user.uid, title, entry, entryDate);
      console.log("Entry saved!");

      // Reset form
      setTitle("");
      setEntry("");
      setDate(new Date().toISOString().slice(0, 10));

      // Then optionally do AI feedback
      if (navigator.onLine && onAIAnalyze) {
        setUsedAI(true);
        await onAIAnalyze(entry);
      } else {
        setUsedAI(false);
        setResponse(getDiaryFeedback(entry));
      }
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("Failed to save diary entry.");
    }
  };

  const handleClear = () => {
    setEntry("");
    setTitle("");
    setResponse("");
    setUsedAI(false);
  };

  return (
    <div className="diary-container">
      <h3>My Diary</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Diary Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your thoughts here..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          rows={6}
          required
        />
        <button type="submit" className="btn primary-btn">Submit Entry</button>
      </form>

      {!usedAI && response && (
        <div className="diary-response">
          <h4>Keyword Feedback 💬</h4>
          <p>{response}</p>
        </div>
      )}

      {isAnalyzing && (
        <div className="diary-response ai-feedback">
          <h4>AI Insight 🧠</h4>
          <p>Analyzing your entry… please wait</p>
        </div>
      )}

      {usedAI && !isAnalyzing && aiResponse && (
        <div className="diary-response ai-feedback">
          <h4>AI Insight 🧠</h4>
          <p>{aiResponse}</p>
        </div>
      )}

      {(response || aiResponse) && (
        <button onClick={handleClear} className="btn secondary-btn" style={{ marginTop: "1rem" }}>
          Clear Entry
        </button>
      )}
    </div>
  );
}
