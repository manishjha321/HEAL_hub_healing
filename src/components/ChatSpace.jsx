import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/global.css";


const mentorList = [
  {
    id: "mentor1",
    name: "Monika Chauhan",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "mentor2",
    name: "Rahul Verma",
    img: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: "mentor3",
    name: "Ananya Gupta",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "mentor4",
    name: "Saurabh Mehta",
    img: "https://randomuser.me/api/portraits/men/68.jpg",
  },
  {
    id: "mentor5",
    name: "Priya Sharma",
    img: "https://randomuser.me/api/portraits/women/22.jpg",
  },
];

const ChatSpace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const mentorId = params.get("mentorId");
  const mentor = mentorList.find(m => m.id === mentorId) || mentorList[0];

  const [messages, setMessages] = useState([
    { sender: "mentor", text: `Hi! I'm ${mentor.name}. How can I help you today? 😊` }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(msgs => [...msgs, { sender: "mentor", text: "Thank you for sharing! I'm here to listen." }]);
    }, 900);
  };

  return (
    <div className="chatspace-container" style={{maxWidth:600,margin:"40px auto",padding:"2rem",background:"#fff",borderRadius:20,boxShadow:"0 8px 30px rgba(0,0,0,0.12)"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:"1.5rem",justifyContent:"space-between"}}>
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              window.close();
            }
          }}
          style={{background:"none",border:"none",fontSize:"1.5rem",cursor:"pointer",color:"#5c6bc0",marginRight:"10px"}}
          title="Back"
        >←</button>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <img src={mentor.img} alt={mentor.name} style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",boxShadow:"0 2px 8px rgba(0,0,0,0.10)"}} />
          <span style={{fontWeight:700,fontSize:"1.15rem",color:"#5c6bc0"}}>{mentor.name}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <span title="Call" style={{fontSize:"1.6rem",cursor:"pointer",color:"#4caf50",display:'inline-block',marginRight:'2px'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" fill="#4caf50"/></svg>
          </span>
          <span title="Video call" style={{fontSize:"1.6rem",cursor:"pointer",color:"#2196f3",display:'inline-block'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 10.5V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3.5l4 4v-11l-4 4z" fill="#2196f3"/></svg>
          </span>
        </div>
      </div>
      <div className="chatspace-window" style={{height:340,background:"linear-gradient(135deg,#e0c3fc 0%,#8ec5fc 100%)",borderRadius:16,padding:"1rem",marginBottom:"1rem",overflowY:"auto",boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === "user" ? "chat-msg user" : "chat-msg mentor"} style={{display:"flex",justifyContent:msg.sender==="user"?"flex-end":"flex-start",marginBottom:"10px"}}>
            <span style={{background:msg.sender==="user"?"#5c6bc0":"#fff",color:msg.sender==="user"?"#fff":"#333",padding:"10px 16px",borderRadius:14,maxWidth:"70%",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",fontSize:"1.08rem"}}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
        <label htmlFor="chatspace-attach" style={{cursor:"pointer",marginRight:"6px"}} title="Attach file">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.657 7.757l-8.486 8.486a3 3 0 104.243 4.243l7.071-7.071a5 5 0 10-7.071-7.071l-8.486 8.486" stroke="#5c6bc0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </label>
        <input
          id="chatspace-attach"
          type="file"
          style={{display:'none'}}
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              alert(`Attached: ${e.target.files[0].name}`);
            }
          }}
        />
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid #ddd",fontSize:"1.08rem"}}
        />
        <button
          style={{padding:"12px 22px",borderRadius:10,background:"#5c6bc0",color:"#fff",border:"none",fontWeight:600,fontSize:"1.08rem",boxShadow:"0 2px 8px rgba(92,107,192,0.12)"}}
          onClick={handleSend}
        >Send</button>
      </div>
    </div>
  );
};

export default ChatSpace;
