// src/components/DietHeader.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DietHeader.css';
import logo from '../assets/images/logo.png';
import userIcon from '../assets/images/userpage.png';
import MyPageModal from './MyPageModal';

const DietHeader = () => {
  const [showMyPageModal, setShowMyPageModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <header className="diet-header">
        <img src={logo} alt="DietChef Logo" className="logo" />

        <div className="nav-tabs">
          <button
            className={`nav-tab ${isActive('/dietpage') ? 'active' : ''}`}
            onClick={() => handleTabClick('/dietpage')}
          >
            Diet
          </button>
          <button
            className={`nav-tab ${isActive('/nutrition') ? 'active' : ''}`}
            onClick={() => handleTabClick('/nutrition')}
          >
            Nutrition
          </button>
          <button
            className={`nav-tab ${isActive('/foodinfo') ? 'active' : ''}`}
            onClick={() => handleTabClick('/foodinfo')}
          >
            Food Info
          </button>
          <button
            className={`nav-tab ${isActive('/meal-plan') ? 'active' : ''}`}
            onClick={() => handleTabClick('/meal-plan')}
          >
            Progress
          </button>
          <button className="user-icon-button" onClick={() => setShowMyPageModal(true)}>
            <img src={userIcon} alt="MyPage" className="user-icon-img" />
          </button>
        </div>
      </header>

      {showMyPageModal && <MyPageModal onClose={() => setShowMyPageModal(false)} />}
    </>
  );
};

export default DietHeader;
