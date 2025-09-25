import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

import BasicInfo from './BasicInfo';
import HealthInfo from './HealthInfo';
import LifestyleInfo from './LifestyleInfo';
import MentalWellbeing from './MentalWellbeing';
import EmergencyContact from './EmergencyContact';
import LocationInfo from './LocationInfo';

const ProfileSetupPage = () => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleNext = (section, data) => {
    const updatedData = { ...profileData, [section]: data };
    setProfileData(updatedData);
    if (step === 6) {
      saveProfile(updatedData);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const saveProfile = async (data) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to save your profile.");
      return;
    }

    setSaving(true);
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          ...data,
          profileCompleted: true,
          completedAt: Date.now()
        },
        { merge: true }
      );
      alert("Your profile is ready 🎉 Thanks for joining HealHub!");
      navigate('/dashboard');
    } catch (e) {
      console.error("Error saving profile: ", e);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicInfo onNext={handleNext} initialData={profileData} />;
      case 2:
        return <HealthInfo onNext={handleNext} onPrevious={handlePrevious} initialData={profileData} />;
      case 3:
        return <LifestyleInfo onNext={handleNext} onPrevious={handlePrevious} initialData={profileData} />;
      case 4:
        return <MentalWellbeing onNext={handleNext} onPrevious={handlePrevious} initialData={profileData} />;
      case 5:
        return <EmergencyContact onNext={handleNext} onPrevious={handlePrevious} initialData={profileData} />;
      case 6:
        return <LocationInfo onNext={handleNext} onPrevious={handlePrevious} initialData={profileData} />;
      default:
        return <div><p>Profile setup complete!</p></div>;
    }
  };

  return (
    <div className="profile-setup-container">
      {saving ? <div>Saving your profile...</div> : renderStep()}
    </div>
  );
};

export default ProfileSetupPage;