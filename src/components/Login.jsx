import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "../styles/global.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-page-center">
      <div className="login-header">
        <span className="healhub-brand" style={{marginBottom: '12px'}}>
          <span className="hug-icon">💖🌿</span> HealHub
        </span>
        <h2 style={{margin: '8px 0 18px 0', fontWeight: 600}}>Welcome to the HealHub</h2>
      </div>
      <div className="login-box">
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
        <p onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Login" : "No account? Register"}
        </p>
      </div>
      <footer className="login-footer">
        <span>You are not alone, help is available.</span>
      </footer>
    </div>
  );
}
