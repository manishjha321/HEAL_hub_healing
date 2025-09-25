import React, { useState } from 'react';

const EmergencyContact = ({ onNext, onPrevious, initialData }) => {
  const [formData, setFormData] = useState(initialData.emergencyContact || {});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name && formData.relation && formData.phoneNumber) {
      onNext('emergencyContact', formData);
    } else {
      setError('Please fill in all fields for your emergency contact.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Step 5: Emergency Contact</h2>
      <p>In case of an emergency, who should we contact? This is a required field.</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="relation">Relation</label>
          <input
            type="text"
            name="relation"
            id="relation"
            placeholder="Relation"
            value={formData.relation || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div className="form-actions">
        <button type="button" onClick={onPrevious}>Previous</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default EmergencyContact;