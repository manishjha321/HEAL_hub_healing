import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/global.css";

export default function Resources() {
  const [activeSection, setActiveSection] = useState(null);
  const [showTestResult, setShowTestResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState(Array(10).fill(''));
  const [score, setScore] = useState(0);
  const [activeGame, setActiveGame] = useState(null);

  const stories = [
    { title: "Real-life Recovery Journey", description: "Anonymous diary excerpts motivating users.", link: "#" },
    { title: "Overcoming Doubt", description: "Short story to inspire confidence.", link: "#" },
  ];

  const music = [
    { title: "Calming Playlist", link: "#" },
    { title: "Guided Meditation", link: "#" },
    { title: "Ambient Sounds", link: "#" },
  ];

  const jokes = [
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "I told my computer I needed a break, and it said: 'No problem, I'll go to sleep!'",
  ];

  const exercises = [
    "Take 5 deep breaths",
    "Stretch your arms and legs for 2 minutes",
    "Close your eyes and meditate for 3 minutes"
  ];

  const quickTest = [
    { question: "Do you spend more than 2 hours daily on video games?", options: ["Yes", "No"] },
    { question: "Do you smoke or use tobacco products?", options: ["Yes", "No"] },
    { question: "Do you feel anxious when you cannot check social media?", options: ["Yes", "No"] },
    { question: "Do you often skip meals due to habits?", options: ["Yes", "No"] },
    { question: "Do you consume caffeine excessively?", options: ["Yes", "No"] },
    { question: "Do you feel sleepy during work or school due to late-night habits?", options: ["Yes", "No"] },
    { question: "Do you use energy drinks to stay awake?", options: ["Yes", "No"] },
    { question: "Do you feel restless without a device?", options: ["Yes", "No"] },
    { question: "Do you check your phone before sleeping?", options: ["Yes", "No"] },
    { question: "Do you skip physical activity due to screen time?", options: ["Yes", "No"] },
  ];

  const handleAnswerChange = (index, answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = answer;
    setUserAnswers(updatedAnswers);
  };

  const submitTest = () => {
    let totalScore = 0;
    userAnswers.forEach(answer => {
      if (answer === "Yes") totalScore += 1;
    });
    setScore(totalScore);
    setShowTestResult(true);
  };

  // --- Tic Tac Toe Component ---
  const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);

    const winner = calculateWinner(board);

    function calculateWinner(board) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      return null;
    }

    const handleClick = (index) => {
      if (board[index] || winner) return;
      const newBoard = [...board];
      newBoard[index] = isXNext ? "X" : "O";
      setBoard(newBoard);
      setIsXNext(!isXNext);
    };

    return (
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <h4 style={{ marginBottom: "10px" }}>{winner ? `Winner: ${winner}` : `Turn: ${isXNext ? "X" : "O"}`}</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 70px)", gap: "8px", justifyContent: "center" }}>
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              style={{
                width: "70px",
                height: "70px",
                fontSize: "24px",
                background: "#ffffff",
                border: "2px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {cell}
            </button>
          ))}
        </div>
        <button
          onClick={() => setBoard(Array(9).fill(null))}
          className="btn primary-btn"
          style={{ marginTop: "15px" }}
        >
          Reset
        </button>
      </div>
    );
  };

  // --- Reaction Game Component ---
  const ReactionGame = () => {
    const [gameState, setGameState] = useState("waiting");
    const [startTime, setStartTime] = useState(null);
    const [reactionTime, setReactionTime] = useState(null);

    const startGame = () => {
      setGameState("waiting");
      setReactionTime(null);
      const delay = Math.floor(Math.random() * 3000) + 2000;
      setTimeout(() => {
        setGameState("ready");
        setStartTime(Date.now());
      }, delay);
    };

    const handleClick = () => {
      if (gameState === "ready") {
        setReactionTime(Date.now() - startTime);
        setGameState("done");
      }
    };

    return (
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <h4>⚡ Test Your Reaction Speed</h4>
        {gameState === "waiting" && (
          <button className="btn primary-btn" onClick={startGame}>Start</button>
        )}
        {gameState === "ready" && (
          <div
            onClick={handleClick}
            style={{
              background: "#ffebee",
              padding: "30px",
              borderRadius: "12px",
              marginTop: "10px",
              cursor: "pointer",
              textAlign: "center",
              fontWeight: "bold",
              border: "2px solid #e57373"
            }}
          >
            CLICK NOW!
          </div>
        )}
        {gameState === "done" && (
          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            Your Reaction Time: <strong>{reactionTime} ms</strong>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/dashboard" className="nav-item">Home</Link>
          <Link to="/resources" className="nav-item active">Resources</Link>
          <Link to="/community" className="nav-item">Community</Link>
          <Link to="/chatbot" className="nav-item">Chat with Saksham</Link>
        </div>
        <div className="navbar-center">
          <span className="healhub-brand">
            <span className="hug-icon">💖🌿</span> HealHub
          </span>
          <Link to="/about" className="nav-item">About Us</Link>
        </div>
      </nav>

      <div className="content-box resources-container" style={{ textAlign: "center" }}>

        {/* Stories & Reflections */}
        <button className="btn primary-btn" onClick={() => setActiveSection(activeSection === "stories" ? null : "stories")}>
          📚 Stories & Reflections
        </button>
        {activeSection === "stories" && (
          <div className="challenge-grid">
            {stories.map((story, idx) => (
              <div key={idx} className="challenge-card">
                <h3>{story.title}</h3>
                <p>{story.description}</p>
                <a href={story.link} target="_blank" rel="noreferrer" className="btn primary-btn">Read More</a>
              </div>
            ))}
          </div>
        )}

        {/* Audio & Music Therapy */}
        <button className="btn primary-btn" onClick={() => setActiveSection(activeSection === "music" ? null : "music")}>
          🎧 Audio & Music Therapy
        </button>
        {activeSection === "music" && (
          <div className="challenge-grid">
            {music.map((track, idx) => (
              <div key={idx} className="challenge-card">
                <h3>{track.title}</h3>
                <a href={track.link} target="_blank" rel="noreferrer" className="btn primary-btn">Listen</a>
              </div>
            ))}
          </div>
        )}

        {/* Jokes */}
        <button className="btn primary-btn" onClick={() => setActiveSection(activeSection === "jokes" ? null : "jokes")}>
          😂 Jokes
        </button>
        {activeSection === "jokes" && (
          <div className="challenge-grid">
            {jokes.map((joke, idx) => (
              <div key={idx} className="challenge-card">
                <p>{joke}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Exercises */}
        <button className="btn primary-btn" onClick={() => setActiveSection(activeSection === "exercises" ? null : "exercises")}>
          💪 Quick Exercises
        </button>
        {activeSection === "exercises" && (
          <div className="challenge-grid">
            {exercises.map((exercise, idx) => (
              <div key={idx} className="challenge-card">
                <p>{exercise}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Addiction Test */}
        <button className="btn primary-btn" onClick={() => setActiveSection(activeSection === "test" ? null : "test")}>
          📝 Quick Addiction Test
        </button>
        {activeSection === "test" && (
          <div style={{ marginTop: '15px' }}>
            {!showTestResult ? (
              <div>
                {quickTest.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: '15px' }}>
                    <p>{idx + 1}. {q.question}</p>
                    {q.options.map((option, oIdx) => (
                      <label key={oIdx} style={{ marginRight: '10px' }}>
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={option}
                          checked={userAnswers[idx] === option}
                          onChange={() => handleAnswerChange(idx, option)}
                        /> {option}
                      </label>
                    ))}
                  </div>
                ))}
                <button className="btn primary-btn" onClick={submitTest}>Submit Test</button>
              </div>
            ) : (
              <div style={{ marginTop: '15px', fontWeight: 'bold' }}>
                <p>Your addiction score is: {score} / {quickTest.length}</p>
                {score > 5
                  ? <p>⚠️ Warning: You might be at risk of addictive behaviors. Consider reducing screen or tobacco usage.</p>
                  : <p>✅ Good job! Your habits seem balanced.</p>
                }
              </div>
            )}
          </div>
        )}

        {/* Play Games */}
        <button className="btn primary-btn" onClick={() => setActiveSection(activeSection === "games" ? null : "games")}>
          🎮 Play Games
        </button>
        {activeSection === "games" && (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "15px" }}>Choose a Game</h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              maxWidth: "400px",
              margin: "0 auto"
            }}>
              <button className="btn primary-btn" style={{ width: "100%" }} onClick={() => setActiveGame("ticTacToe")}>
                ❌⭕ Tic Tac Toe
              </button>
              <button className="btn primary-btn" style={{ width: "100%" }} onClick={() => setActiveGame("reaction")}>
                ⚡ Reaction Speed
              </button>
            </div>

            {activeGame === "ticTacToe" && <TicTacToe />}
            {activeGame === "reaction" && <ReactionGame />}
          </div>
        )}

      </div>
    </div>
  );
}

