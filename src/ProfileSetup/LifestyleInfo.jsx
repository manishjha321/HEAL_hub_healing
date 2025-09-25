import React, { useState } from 'react';

const LifestyleInfo = ({ onNext, onPrevious, initialData }) => {
  const [formData, setFormData] = useState(initialData.lifestyleInfo || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext('lifestyleInfo', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Step 3: Lifestyle & Habits</h2>
      <p>Your daily habits are a big part of your overall well-being. What do they look like?</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dietPreference">Diet Preference</label>
          <input
            type="text"
            name="dietPreference"
            id="dietPreference"
            placeholder="e.g., Vegan, Vegetarian"
            value={formData.dietPreference || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="exerciseRoutine">Exercise Routine</label>
          <input
            type="text"
            name="exerciseRoutine"
            id="exerciseRoutine"
            placeholder="e.g., 3 times a week"
            value={formData.exerciseRoutine || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="sleepHours">Sleep Hours</label>
          <input
            type="number"
            name="sleepHours"
            id="sleepHours"
            placeholder="e.g., 7"
            value={formData.sleepHours || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="workSchedule">Work Schedule</label>
          <input
            type="text"
            name="workSchedule"
            id="workSchedule"
            placeholder="e.g., 9am–6pm, shift-based"
            value={formData.workSchedule || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="smokingHabits">Smoking Habits</label>
          <input
            type="text"
            name="smokingHabits"
            id="smokingHabits"
            placeholder="e.g., Never, Socially"
            value={formData.smokingHabits || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="alcoholHabits">Alcohol Habits</label>
          <input
            type="text"
            name="alcoholHabits"
            id="alcoholHabits"
            placeholder="e.g., Never, Occasionally"
            value={formData.alcoholHabits || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="caffeineIntake">Caffeine Intake</label>
          <input
            type="text"
            name="caffeineIntake"
            id="caffeineIntake"
            placeholder="e.g., 2 cups/day, none"
            value={formData.caffeineIntake || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="screenTime">Average Daily Screen Time</label>
          <input
            type="text"
            name="screenTime"
            id="screenTime"
            placeholder="e.g., 5 hours"
            value={formData.screenTime || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="socialInteraction">Social Interaction Level</label>
          <input
            type="text"
            name="socialInteraction"
            id="socialInteraction"
            placeholder="e.g., Very social, Prefer solitude"
            value={formData.socialInteraction || ''}
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

export default LifestyleInfo;