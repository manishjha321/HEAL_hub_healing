import React, { useState } from 'react';

const MentalWellbeing = ({ onNext, onPrevious, initialData }) => {
  const [formData, setFormData] = useState(initialData.mentalWellbeing || {});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext('mentalWellbeing', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Step 4: Mental Wellbeing</h2>
      <p>Let’s gently check in on how you’ve been feeling lately.</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="stressLevel">On a scale of 1–10, how stressed have you felt this week?</label>
          <input
            type="number"
            name="stressLevel"
            id="stressLevel"
            min="1"
            max="10"
            placeholder="1 = very calm, 10 = very stressed"
            value={formData.stressLevel || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="emotionalState">How would you describe your emotional state this week?</label>
          <select name="emotionalState" id="emotionalState" value={formData.emotionalState || ''} onChange={handleChange}>
            <option value="">Select</option>
            <option value="great">Feeling great</option>
            <option value="okay">Doing okay</option>
            <option value="neutral">Neutral</option>
            <option value="low">Feeling low</option>
            <option value="veryLow">Struggling a lot</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="supportAvailable">Do you feel you have someone to talk to when things get tough?</label>
          <select name="supportAvailable" id="supportAvailable" value={formData.supportAvailable || ''} onChange={handleChange}>
            <option value="">Select</option>
            <option value="yes">Yes, I do</option>
            <option value="no">Not really</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="copingMechanism">What helps you cope when you're feeling overwhelmed?</label>
          <input
            type="text"
            name="copingMechanism"
            id="copingMechanism"
            placeholder="e.g., music, journaling, talking to someone"
            value={formData.copingMechanism || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group" style={{ width: '100%' }}>
          <label htmlFor="currentConcern">Is there anything weighing on your mind you'd like to share?</label>
          <textarea
            name="currentConcern"
            id="currentConcern"
            placeholder="Optional"
            value={formData.currentConcern || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onPrevious}>Previous</button>
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default MentalWellbeing;