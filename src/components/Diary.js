import { useState } from "react";
import "../styles/global.css";

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
  "You are not alone in this storm. There are people who care deeply about you—even if it doesn’t feel that way right now. Please call 1800-121-3667, the Hello Lifeline for free, 24/7 support.",
  "Your pain is real, but so is the possibility of healing. You don’t have to carry this weight alone. Reach out to AASRA’s helpline directory—they’re here to listen without judgment.",
  "I know it feels unbearable right now, but this moment doesn’t define your entire life. You are worthy of love, help, and a second chance. Talk to the mentors in our community space",
  "Please don’t make a permanent decision based on temporary pain. There are people trained to help—call Vandrevala Foundation’s 24/7 helpline at 1860-266-2345 or 9999-666-555.",
  "You matter. Your story matters. Even if you feel broken, you are not beyond repair. Let someone walk with you through this darkness. Join our community support group",
  "You are not weak for feeling this way. You are human. And humans need connection, compassion, and care. Let someone be there for you.",
  "You’ve survived every hard day so far. That’s strength. Let today be the day you ask for help—not because you’re giving up, but because you’re choosing to fight differently.",
  "There’s a future waiting for you that you can’t see right now. But I promise—it’s there. Please call 1800-121-3667 or visit our community Lifeline to talk to someone who understands.",
  "Feeling like this is serious. Call a helpline immediately or reach out to us remember help is available",







  
  "Feeling like this is serious. Call a helpline immediately or reach out to us remember help is available",
];

const negativeKeywords = [
  "sad", "depressed", "anxious", "stress", "bad", "down", "frustrated", "worried",
  "blank", "cloudy", "disoriented", "distracted", "unfocused", "disconnected", "dazed",
  "lost", "confused", "detached", "spaced out", "foggy", "absent-minded", "bewildered",
  "perplexed", "uncertain", "hesitant", "vacant"
];

function getDiaryFeedback(entry) {
  const text = entry.toLowerCase();
  const urgentKeywords = ["suicide", "kill myself", "end my life", "kill", "death","die","helpless"];
  const positiveKeywords = ["happy","joy","excited","good","great","love","amazing","positive","peace"];
  // Use the extended negativeKeywords above
  if (urgentKeywords.some(k => text.includes(k))) {
    return urgentResponses[Math.floor(Math.random()*urgentResponses.length)];
  } else if (positiveKeywords.some(k => text.includes(k))) {
    return positiveResponses[Math.floor(Math.random()*positiveResponses.length)];
  } else if (negativeKeywords.some(k => text.includes(k))) {
    return negativeResponses[Math.floor(Math.random()*negativeResponses.length)];
  } else {
    return "Thanks for sharing! Sometimes just writing down your thoughts helps.";
  }
}




export default function Diary() {
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [response, setResponse] = useState("");

  const analyzeEntry = () => {
    setResponse(getDiaryFeedback(entry));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeEntry();
    setEntry("");
    setTitle("");
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
      {response && <div className="diary-response">{response}</div>}
    </div>
  );
}
