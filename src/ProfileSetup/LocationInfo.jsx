import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const LocationInfo = ({ onNext, onPrevious, initialData }) => {
  const [formData, setFormData] = useState(initialData.location || {});
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleUseLocation = () => {
    setLoadingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=19b30ecb47f3459995cb9b829b42c0f0`
          );
          const data = await res.json();
          const formatted = data.results[0]?.formatted;
          if (formatted) {
            setFormData({ ...formData, formattedAddress: formatted });
          } else {
            setError('Unable to retrieve address from coordinates.');
          }
        } catch (err) {
          console.error('OpenCage API error:', err);
          setError('Failed to fetch address. Please try again.');
        } finally {
          setLoadingLocation(false);
        }
      },
      (geoError) => {
        console.error('Geolocation error:', geoError);
        setError('Location access denied or unavailable.');
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated.");
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);

      const locationData = {
        location: formData,
        profileCompleted: true,
      };

      await setDoc(userRef, locationData, { merge: true });

      onNext('location', formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving location info:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Step 6: Location & Final Details</h2>
      <p>To help us suggest local resources, could you share your address?</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="formattedAddress">Formatted Address</label>
          <input
            type="text"
            name="formattedAddress"
            id="formattedAddress"
            placeholder="Enter your address or use location"
            value={formData.formattedAddress || ''}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={handleUseLocation}
            style={{ marginTop: '8px' }}
            disabled={loadingLocation}
          >
            {loadingLocation ? 'Locating...' : 'Use My Location'}
          </button>
          {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onPrevious}>Previous</button>
        <button type="submit">Finish</button>
      </div>
    </form>
  );
};

export default LocationInfo;