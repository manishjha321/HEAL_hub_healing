// Community page

import React from 'react';
import { useNavigate } from 'react-router-dom';
import MentorsPage from '../components/MentorsPage';

const Community = () => {
  const navigate = useNavigate();
  return (
    <div className="community-container" style={{padding: '2rem 0'}}>
      <button
        onClick={() => navigate('/dashboard')}
        style={{background:'none',border:'none',fontSize:'1.5rem',cursor:'pointer',color:'#5c6bc0',marginBottom:'10px'}}
        title="Back to Home"
      >← Back to Home</button>
      <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Community</h2>
      <MentorsPage />
    </div>
  );
};

export default Community;
