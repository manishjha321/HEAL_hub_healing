import { useState } from "react";
import "../styles/global.css";

export default function AppointmentModal({ mentor, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setFormData({ name: "", email: "", message: "" });
  };

  const closeSuccess = () => {
    setSuccess(false);
    onClose();
  };

  return (
    <>
      {!success ? (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={onClose}>✖</button>
            <h3>Book Appointment with {mentor.name}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <div className="form-buttons">
                <button type="submit">Submit</button>
                <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="modal">
          <div className="modal-content success-modal">
            <span className="success-icon">✔</span>
            <h3>Appointment Booked!</h3>
            <p>Your appointment with <strong>{mentor.name}</strong> has been scheduled.</p>
            <button onClick={closeSuccess}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}
