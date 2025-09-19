import { useState } from "react";
import AppointmentModal from "../components/AppointmentModal";
import ChatModal from "../components/ChatModal";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

export default function MentorsPage() {
  const navigate = useNavigate();
  const mentors = [
    {
      id: "mentor1",
      name: "Monika Chauhan",
      role: "Mentor",
      email: "monika.chauhan@gmail.com",
  img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    },
    {
      id: "mentor2",
      name: "Rahul Verma",
      role: "Mentor",
      email: "rahul.verma@gmail.com",
  img: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    },
    {
      id: "mentor3",
      name: "Ananya Gupta",
      role: "Psychologist",
      email: "ananya.gupta@gmail.com",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: "mentor4",
  name: "Santanu Mishra",
      role: "Mentor",
      email: "santanumishra9878@gmail.com",
  img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
    },
    {
      id: "mentor5",
      name: "Priya Sharma",
      role: "Mentor",
      email: "priya.sharma@gmail.com",
      img: "https://randomuser.me/api/portraits/women/22.jpg",
    },
  ];

  const [activeAppointment, setActiveAppointment] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      alert("Failed to log out");
    }
  };

  return (
    <div className="mentors-container">
      <button onClick={handleLogout} className="logout-btn">Log Out</button>
      <h2>Your Wellness Mentors</h2>
      <div className="mentors-grid">
        {mentors.map((m) => (
          <div key={m.id} className="mentor-card">
            <img src={m.img} alt={m.name} className="mentor-img" />
            <h3>{m.name}</h3>
            <p className="role">{m.role}</p>
            <p><strong>Email:</strong> {m.email}</p>
            <div className="button-group">
              <button onClick={() => window.open(`/appointment?mentorId=${m.id}`, '_blank')}>Book Your Appointment</button>
              <button onClick={() => window.open(`/chatspace?mentorId=${m.id}`, '_blank')}>Chat Now</button>
            </div>
          </div>
        ))}
      </div>

      {activeAppointment && (
        <AppointmentModal
          mentor={activeAppointment}
          onClose={() => setActiveAppointment(null)}
        />
      )}
      
      {activeChat && (
        <ChatModal
          mentor={activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}
