import React, { useState } from 'react';

const BasicInfo = ({ onNext, initialData }) => {
  const [formData, setFormData] = useState(initialData.basicInfo || {});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName && formData.email && formData.phone) {
      onNext('basicInfo', formData);
    } else {
      setError('Please fill in all required fields.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Step 1: Basic Information</h2>
      <p>Let's get to know each other. What's your name?</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="First Name"
            value={formData.firstName || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Last Name"
            value={formData.lastName || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="Phone Number"
            value={formData.phone || ''}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            name="age"
            id="age"
            placeholder="Age"
            value={formData.age || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <input
            type="text"
            name="gender"
            id="gender"
            placeholder="Gender"
            value={formData.gender || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="City"
            value={formData.city || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            name="country"
            id="country"
            placeholder="Country"
            value={formData.country || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="college">College</label>
          <input
            type="text"
            name="college"
            id="college"
            placeholder="College"
            value={formData.college || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div className="form-actions">
        <button type="submit">Next</button>
      </div>
    </form>
  );
};

export default BasicInfo;