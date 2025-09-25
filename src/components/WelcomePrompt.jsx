import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePrompt = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/setup-profile");
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card" style={{ animation: "fadeIn 0.6s ease-out" }}>
        <h1 className="welcome-title">Welcome to HealHub 💖</h1>
        <p className="welcome-subtitle">
          Your wellbeing journey starts here. Let’s personalize your experience.
        </p>

        <div className="info-section">
          <h3>Why do we ask for your information?</h3>
          <p>
            To recommend the right resources, support, and tools tailored to your lifestyle and emotional needs.
            Completing your profile helps us understand you better — so HealHub feels like it was built just for you.
          </p>
        </div>

        <div className="privacy-section">
          <h3>Your data is safe with us 🔒</h3>
          <p>
            We follow strict privacy standards. Your information is encrypted and never shared without your consent.
            You’re always in control.
          </p>
        </div>

        <p style={{ marginTop: "1rem", fontStyle: "italic", color: "#555" }}>
          This will only take a few moments — and it helps us support you better.
        </p>

        <button
          className="get-started-btn"
          onClick={handleGetStarted}
          aria-label="Begin profile setup"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePrompt;