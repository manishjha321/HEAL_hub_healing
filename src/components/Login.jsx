import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../styles/global.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ✅ Ensure Firestore document is created with fallback
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          profileCompleted: false,
        });

        navigate("/welcome");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : null;

        const isComplete = data?.profileCompleted === true;
        navigate(isComplete ? "/dashboard" : "/welcome");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="login-page-center">
      <div className="login-header">
        <span className="healhub-brand" style={{ marginBottom: "12px" }}>
          <span className="hug-icon">💖🌿</span> HealHub
        </span>
        <h2 style={{ margin: "8px 0 18px 0", fontWeight: 600 }}>
          Welcome to the HealHub
        </h2>
      </div>

      <div className="login-box">
        {isForgotPassword ? (
          <>
            <h2>Forgot Password?</h2>
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Send Reset Email</button>
            </form>
            <p onClick={() => setIsForgotPassword(false)} style={{ marginTop: "1rem", cursor: "pointer" }}>
              Back to Login
            </p>
            {message && <p className="info-message">{message}</p>}
          </>
        ) : (
          <>
            <h2>{isRegister ? "Register" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">{isRegister ? "Register" : "Login"}</button>
            </form>
            <p onClick={() => setIsForgotPassword(true)} style={{ marginTop: "1rem", cursor: "pointer" }}>
              Forgot Password?
            </p>
            <p onClick={() => setIsRegister(!isRegister)} style={{ cursor: "pointer" }}>
              {isRegister ? "Already have an account? Login" : "No account? Register"}
            </p>
          </>
        )}
      </div>

      <footer className="login-footer">
        <span>You are not alone, help is available.</span>
      </footer>
    </div>
  );
}