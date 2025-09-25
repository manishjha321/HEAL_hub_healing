// src/components/MyProfile.jsx

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FaEdit, FaSave, FaTimesCircle } from 'react-icons/fa';

const MyProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [formState, setFormState] = useState({});

  useEffect(() => {
    const fetchProfile = async (user) => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
          setFormState(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfile(user);
      } else {
        setLoading(false);
        setProfileData(null); // Clear data if user logs out
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSave = async (section) => {
    try {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, { [section]: formState[section] });
        setProfileData((prev) => ({
          ...prev,
          [section]: formState[section],
        }));
        setEditingSection(null);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormState(profileData);
    setEditingSection(null);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <h2>Complete Your Profile</h2>
        <p>It looks like this is your first time here. Please set up your profile to get the full HealHub experience!</p>
        {/* We will add a Link to the profile setup page here later */}
      </div>
    );
  }

  const renderForm = (section, fields) => (
    <div className="edit-form">
      {fields.map((field) => (
        <div key={field.name} className="form-group">
          <label>{field.label}</label>
          <input
            type={field.type || 'text'}
            name={field.name}
            value={formState[section][field.name] || ''}
            onChange={(e) => handleChange(e, section)}
          />
        </div>
      ))}
      <div className="form-actions">
        <button onClick={() => handleSave(section)} className="save-btn"><FaSave /> Save</button>
        <button onClick={handleCancel} className="cancel-btn"><FaTimesCircle /> Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {/* Profile Picture (Edit not implemented, requires storage) */}
      <div className="profile-picture-container">
  <img
    src={
      profileData.profilePictureUrl ||
      '/628286_anonym_avatar_default_head_person_icon.png'
    }
    alt="Profile"
    className="profile-picture"
  />
</div>

      {/* Basic Information Section */}
      <div className="profile-section">
        <h3 className="basic-info">Basic Information <button onClick={() => handleEdit('basicInfo')} className="edit-btn"><FaEdit /></button></h3>
        {editingSection === 'basicInfo' ? (
          renderForm('basicInfo', [
            { label: 'First Name', name: 'firstName' },
            { label: 'Last Name', name: 'lastName' },
            { label: 'Age', name: 'age', type: 'number' },
            { label: 'Gender', name: 'gender' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone', name: 'phone' },
            { label: 'City', name: 'city' },
            { label: 'Country', name: 'country' },
            { label: 'College', name: 'college' },
          ])
        ) : (
          <div>
            <p><strong>Name:</strong> {profileData.basicInfo.firstName} {profileData.basicInfo.lastName}</p>
            <p><strong>Age:</strong> {profileData.basicInfo.age}</p>
            <p><strong>Gender:</strong> {profileData.basicInfo.gender}</p>
            <p><strong>Email:</strong> {profileData.basicInfo.email}</p>
            <p><strong>Phone:</strong> {profileData.basicInfo.phone}</p>
            <p><strong>City/Country:</strong> {profileData.basicInfo.city}, {profileData.basicInfo.country}</p>
            <p><strong>College:</strong> {profileData.basicInfo.college}</p>
          </div>
        )}
      </div>

      {/* Health Information Section */}
      <div className="profile-section">
        <h3 className="basic-info">Health Information <button onClick={() => handleEdit('healthInfo')} className="edit-btn"><FaEdit /></button></h3>
        {editingSection === 'healthInfo' ? (
          renderForm('healthInfo', [
            { label: 'Blood Group', name: 'bloodGroup' },
            { label: 'Allergies (comma-separated)', name: 'allergies' },
            { label: 'Medical Conditions (comma-separated)', name: 'medicalConditions' },
            { label: 'Ongoing Medications (comma-separated)', name: 'ongoingMedications' },
          ])
        ) : (
          <div>
            <p><strong>Blood Group:</strong> {profileData.healthInfo.bloodGroup}</p>
            <p><strong>Allergies:</strong> {Array.isArray(profileData.healthInfo.allergies) ? profileData.healthInfo.allergies.join(', ') : profileData.healthInfo.allergies}</p>
            <p><strong>Medical Conditions:</strong> {Array.isArray(profileData.healthInfo.medicalConditions) ? profileData.healthInfo.medicalConditions.join(', ') : profileData.healthInfo.medicalConditions}</p>
            <p><strong>Ongoing Medications:</strong> {Array.isArray(profileData.healthInfo.ongoingMedications) ? profileData.healthInfo.ongoingMedications.join(', ') : profileData.healthInfo.ongoingMedications}</p>
          </div>
        )}
      </div>

      {/* Lifestyle Information Section */}
      <div className="profile-section">
        <h3  className="basic-info">Lifestyle & Habits <button onClick={() => handleEdit('lifestyleInfo')} className="edit-btn"><FaEdit /></button></h3>
        {editingSection === 'lifestyleInfo' ? (
          renderForm('lifestyleInfo', [
            { label: 'Diet', name: 'dietPreference' },
            { label: 'Exercise', name: 'exerciseRoutine' },
            { label: 'Sleep Hours', name: 'sleepHours', type: 'number' },
            { label: 'Smoking Habits', name: 'smokingHabits' },
            { label: 'Alcohol Habits', name: 'alcoholHabits' },
          ])
        ) : (
          <div>
            <p><strong>Diet:</strong> {profileData.lifestyleInfo.dietPreference}</p>
            <p><strong>Exercise:</strong> {profileData.lifestyleInfo.exerciseRoutine}</p>
            <p><strong>Sleep:</strong> {profileData.lifestyleInfo.sleepHours} hours</p>
            <p><strong>Smoking:</strong> {profileData.lifestyleInfo.smokingHabits}</p>
            <p><strong>Alcohol:</strong> {profileData.lifestyleInfo.alcoholHabits}</p>
          </div>
        )}
      </div>
      
      {/* Mental Wellbeing Section */}
      <div className="profile-section">
        <h3 className="basic-info">Mental Wellbeing <button onClick={() => handleEdit('mentalWellbeing')} className="edit-btn"><FaEdit /></button></h3>
        {editingSection === 'mentalWellbeing' ? (
          renderForm('mentalWellbeing', [
            { label: 'Stress Level (1-10)', name: 'stressLevel', type: 'number' },
          ])
        ) : (
          <div>
            <p><strong>Stress Level:</strong> {profileData.mentalWellbeing.stressLevel}/10</p>
          </div>
        )}
      </div>
      
      {/* Emergency Contact Section */}
      <div className="profile-section">
        <h3 className="basic-info">Emergency Contact <button onClick={() => handleEdit('emergencyContact')} className="edit-btn"><FaEdit /></button></h3>
        {editingSection === 'emergencyContact' ? (
          renderForm('emergencyContact', [
            { label: 'Name', name: 'name' },
            { label: 'Relation', name: 'relation' },
            { label: 'Phone Number', name: 'phoneNumber' },
          ])
        ) : (
          <div>
            <p><strong>Name:</strong> {profileData.emergencyContact.name}</p>
            <p><strong>Relation:</strong> {profileData.emergencyContact.relation}</p>
            <p><strong>Phone:</strong> {profileData.emergencyContact.phoneNumber}</p>
          </div>
        )}
      </div>
      
      {/* Location Section */}
      <div className="profile-section">
        <h3 className="basic-info">Location <button onClick={() => handleEdit('location')} className="edit-btn"><FaEdit /></button></h3>
        {editingSection === 'location' ? (
          renderForm('location', [
            { label: 'Formatted Address', name: 'formattedAddress' },
          ])
        ) : (
          <div>
            <p><strong>Address:</strong> {profileData.location.formattedAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;