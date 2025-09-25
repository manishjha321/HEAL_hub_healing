import React, { useState } from 'react';

const HealthInfo = ({ onNext, onPrevious, initialData }) => {
  const [formData, setFormData] = useState(initialData.healthInfo || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNoneClick = (field) => {
    setFormData({ ...formData, [field]: 'None' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext('healthInfo', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Step 2: Health Information</h2>
      <p>Now, let’s talk a little about your health. We'll keep this information safe and private.</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group</label>
          <input
            type="text"
            name="bloodGroup"
            id="bloodGroup"
            placeholder="Blood Group (e.g., A+)"
            value={formData.bloodGroup || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="allergies">Allergies</label>
          <textarea
            name="allergies"
            id="allergies"
            placeholder="Allergies (comma-separated)"
            value={formData.allergies || ''}
            onChange={handleChange}
          />
          <button type="button" onClick={() => handleNoneClick('allergies')} style={{ marginTop: '6px' }}>
            I have no allergies
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="medicalConditions">Medical Conditions</label>
          <textarea
            name="medicalConditions"
            id="medicalConditions"
            placeholder="Medical Conditions (comma-separated)"
            value={formData.medicalConditions || ''}
            onChange={handleChange}
          />
          <button type="button" onClick={() => handleNoneClick('medicalConditions')} style={{ marginTop: '6px' }}>
            I have no medical conditions
          </button>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ongoingMedications">Ongoing Medications</label>
          <textarea
            name="ongoingMedications"
            id="ongoingMedications"
            placeholder="Ongoing Medications (comma-separated)"
            value={formData.ongoingMedications || ''}
            onChange={handleChange}
          />
          <button type="button" onClick={() => handleNoneClick('ongoingMedications')} style={{ marginTop: '6px' }}>
            I’m not taking any medications
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onPrevious}>Previous</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default HealthInfo;