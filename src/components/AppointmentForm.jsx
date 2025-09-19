import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

const AppointmentForm = ({ mentor }) => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [showEmailMsg, setShowEmailMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setShowEmailMsg(true), 1200);
  };

  return (
    <div className="appointment-form-container" style={{maxWidth:500,margin:"40px auto",padding:"2rem",background:"#fff",borderRadius:16,boxShadow:"0 8px 30px rgba(0,0,0,0.12)"}}>
      <button
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            window.close();
            setTimeout(() => navigate('/dashboard'), 300);
          }
        }}
        style={{background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',color:'#5c6bc0',marginBottom:'10px'}}
        title="Back"
      >←</button>
      <h2 style={{textAlign:"center",marginBottom:"1.5rem"}}>Book Appointment with {mentor?.name || "Mentor"}</h2>
      {!submitted ? (
        <form style={{display:"flex",flexDirection:"column",gap:"16px"}} onSubmit={handleSubmit}>
          <input type="text" placeholder="Your Name" required style={{padding:"10px",borderRadius:8,border:"1px solid #ddd"}} />
          <input type="email" placeholder="Your Email" required style={{padding:"10px",borderRadius:8,border:"1px solid #ddd"}} />
          <input type="date" required style={{padding:"10px",borderRadius:8,border:"1px solid #ddd"}} />
          <textarea placeholder="Reason for appointment" rows={3} required style={{padding:"10px",borderRadius:8,border:"1px solid #ddd"}} />
          <button type="submit" style={{padding:"10px 18px",borderRadius:8,background:'#5c6bc0',color:'#fff',border:'none',fontWeight:600}}>Book Now</button>
        </form>
      ) : (
        <div style={{textAlign:'center',marginTop:'2rem'}}>
          <h3 style={{color:'#4caf50',marginBottom:'1rem'}}>Booking Successful!</h3>
          {showEmailMsg && <p style={{fontSize:'1.08rem',color:'#333'}}>You will get details of your appointment through your email.</p>}
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
