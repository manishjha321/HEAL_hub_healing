import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { MdOutlineLightMode, MdModeNight, MdFilterVintage } from 'react-icons/md';
import MentorsPage from '../components/MentorsPage';
import Diary from '../components/Diary';
import '../styles/global.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light-theme');
    const [streakCount, setStreakCount] = useState(0);
    const [streakMessage, setStreakMessage] = useState('Start your streak by completing a task!');
    const [currentSound, setCurrentSound] = useState(null);
    const [audioUrl, setAudioUrl] = useState("");

    const [moodScore, setMoodScore] = useState(50);
    const [shortThought, setShortThought] = useState('');
    const [moodFeedback, setMoodFeedback] = useState('');

    const soundSources = {
        rain: '/sounds/rain.mp3', // Rain sound (local)
        forest: '/sounds/forest.mp3', // Forest sound (local)
        ocean: '/sounds/ocean.mp3', // Ocean waves (local)
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light-theme';
        setTheme(savedTheme);
        document.body.className = savedTheme;

        const savedStreak = parseInt(localStorage.getItem('streakCount')) || 0;
        setStreakCount(savedStreak);
    }, []);

    const toggleTheme = () => {
        const themes = ['light-theme', 'dark-theme', 'zen-theme'];
        const currentThemeIndex = themes.indexOf(theme);
        const newTheme = themes[(currentThemeIndex + 1) % themes.length];
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.body.className = newTheme;
    };

    // ✅ Updated function to check & update streak with proper date logic
    const updateStreak = () => {
        const today = new Date().toDateString();
        const lastCheckIn = localStorage.getItem('lastCheckInDate');
        let streak = parseInt(localStorage.getItem('streakCount')) || 0;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        if (lastCheckIn === today) {
            setStreakMessage('You already checked in today!');
        } else if (lastCheckIn === yesterdayString) {
            streak++;
            setStreakMessage('You\'re on a roll! Keep going!');
        } else {
            streak = 1;
            setStreakMessage('Streak started! Great job!');
        }

        localStorage.setItem('streakCount', streak);
        localStorage.setItem('lastCheckInDate', today);
        setStreakCount(streak);
    };

    const toggleSound = (soundType) => {
        if (currentSound === soundType) {
            setCurrentSound(null);
            setAudioUrl("");
        } else {
            setCurrentSound(soundType);
            setAudioUrl(soundSources[soundType]);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (err) {
            alert('Failed to log out');
        }
    };

    const handleMoodSubmit = () => {
        let feedback = '';
        if (moodScore <= 33) {
            feedback = 'We notice you are feeling low 😞. Check out Resources for books, music, and stories to lift your mood!';
        } else if (moodScore <= 66) {
            feedback = 'Feeling okay 😐? Reflect on what went right and what could be improved. Resources can help!';
        } else {
            feedback = 'You are feeling great 😊! Keep up the good vibes!';
        }
        setMoodFeedback(feedback);
    };

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <div className="navbar-left">
                    <a href="/">Home</a>
                    <a href="/resources">Resources</a>
                    <a href="/community">Community</a>
                    <a href="/chatbot">Chat with Saksham</a>
                    
                </div>
                <div className="navbar-center">
                    <span className="healhub-brand">
                        <span className="hug-icon">💖🌿</span> HealHub
                    </span>
                    <Link to="/about" className="nav-item">About Us</Link>
                </div>
                <div className="navbar-right">
                    <button onClick={toggleTheme} className="theme-switcher-btn">
                        {theme === 'light-theme' ? <MdOutlineLightMode /> : theme === 'dark-theme' ? <MdModeNight /> : <MdFilterVintage />}
                    </button>
                    <button onClick={handleLogout} className="logout-btn">Log Out</button>
                </div>
            </nav>

            <div className="dashboard-grid">
                {/* Diary Section */}
                <div className="card diary-entry-card">
                    <Diary />
                </div>

                {/* Mood Slider Section */}
                <div className="card mood-analysis-card">
                    <h3>How was your day?</h3>
                    <p className="mood-question-label">Drag the slider to reflect your mood.</p>
                    <div className="mood-slider-container">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={moodScore}
                            onChange={(e) => setMoodScore(Number(e.target.value))}
                            style={{ width: '100%', marginTop: '10px' }}
                        />
                        <div className="mood-labels">
                            <span>😞</span><span>😐</span><span>😊</span>
                        </div>
                    </div>
                    <input
                        type="text"
                        className="short-thought-input"
                        placeholder="Share your thoughts in 10 words"
                        value={shortThought}
                        onChange={(e) => setShortThought(e.target.value)}
                        style={{ width: '100%', marginTop: '10px', padding: '5px' }}
                    />
                    <button
                        style={{ marginTop: '10px', padding: '8px 12px', cursor: 'pointer' }}
                        onClick={handleMoodSubmit}
                    >
                        Submit
                    </button>
                    {moodFeedback && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{moodFeedback}</p>}
                </div>

                {/* Self-care streak */}
                <div className="card streak-card">
                    <h3>Self-Care Streak 🔥</h3>
                    <div className="streak-display">
                        <span id="streak-count">{streakCount}</span>
                        <p>days in a row!</p>
                    </div>
                    <p className="streak-message">{streakMessage}</p>
                    <button
                        onClick={updateStreak}
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            cursor: 'pointer'
                        }}
                    >
                        ✅ Check-in Today
                    </button>
                </div>

                {/* Sound player */}
                <div className="card sound-player-card">
                    <h3>Ambient Sounds 🎧</h3>
                    <div className="sound-buttons">
                        <button className={`sound-btn ${currentSound === 'rain' ? 'active' : ''}`} onClick={() => toggleSound('rain')}>Rain</button>
                        <button className={`sound-btn ${currentSound === 'forest' ? 'active' : ''}`} onClick={() => toggleSound('forest')}>Forest</button>
                        <button className={`sound-btn ${currentSound === 'ocean' ? 'active' : ''}`} onClick={() => toggleSound('ocean')}>Ocean</button>
                    </div>
                    {audioUrl && (
                        <audio src={audioUrl} controls autoPlay style={{marginTop:'16px',width:'100%'}} />
                    )}
                </div>

                {/* Mentors section removed from home page */}
            </div>
        </div>
    );
};

export default Dashboard;
