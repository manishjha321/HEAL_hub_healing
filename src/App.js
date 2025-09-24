import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Chatbot from "./pages/Chatbot";
import Community from "./pages/Community";
import AboutUs from "./components/AboutUs";
import ChatSpace from "./components/ChatSpace";
import AppointmentForm from "./components/AppointmentForm";
import Insight from "./components/Insight"; // ✅ NEW IMPORT
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/resources" element={user ? <Resources /> : <Navigate to="/" />} />
        <Route path="/chatbot" element={user ? <Chatbot /> : <Navigate to="/" />} />
        <Route path="/community" element={user ? <Community /> : <Navigate to="/" />} />
        <Route path="/insight" element={user ? <Insight /> : <Navigate to="/" />} /> {/* ✅ NEW ROUTE */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/chatspace" element={<ChatSpace />} />
        <Route path="/appointment" element={<AppointmentForm />} />
      </Routes>
    </Router>
  );
}

export default App;
