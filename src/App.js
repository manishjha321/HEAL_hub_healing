import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Login from "./components/Login";
import WelcomePrompt from "./components/WelcomePrompt";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Chatbot from "./pages/Chatbot";
import Community from "./pages/Community";
import AboutUs from "./components/AboutUs";
import ChatSpace from "./components/ChatSpace";
import AppointmentForm from "./components/AppointmentForm";
import Insight from "./components/Insight";
import MyProfile from "./components/MyProfile";
import ProfileSetupPage from "./ProfileSetup/ProfileSetupPage.jsx";
import Chattr from "./pages/Chattr"; // ✅ NEW IMPORT

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setHasProfile(data?.profileCompleted === true);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="loading-screen">
        <span className="hug-icon">💖🌿</span>
        <p>Preparing your healing space...</p>
      </div>
    );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/welcome"
          element={
            user ? (hasProfile ? <Navigate to="/dashboard" /> : <WelcomePrompt />) : <Navigate to="/" />
          }
        />
        <Route
          path="/setup-profile"
          element={
            user ? (hasProfile ? <Navigate to="/dashboard" /> : <ProfileSetupPage />) : <Navigate to="/" />
          }
        />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/resources" element={user ? <Resources /> : <Navigate to="/" />} />
        <Route path="/chatbot" element={user ? <Chatbot /> : <Navigate to="/" />} />
        <Route path="/community" element={user ? <Community /> : <Navigate to="/" />} />
        <Route path="/insight" element={user ? <Insight /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <MyProfile /> : <Navigate to="/" />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/chatspace" element={<ChatSpace />} />
        <Route path="/appointment" element={<AppointmentForm />} />
        <Route path="/chattr" element={user ? <Chattr /> : <Navigate to="/" />} /> {/* ✅ NEW ROUTE */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;