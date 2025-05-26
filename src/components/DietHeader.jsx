/* src/components/DietHeader.jsx */
/*
 상단 헤더를 구성.
 - 로고 이미지
 - Diet / Nutrition / Food Info / Progress 내비게이션 탭
 - 사용자 프로필 버튼 (MyPageModal 연결)
*/
import React, { useState, useEffect } from 'react'; // React와 useState, useEffect 훅 임포트
import { useNavigate, useLocation } from 'react-router-dom'; //react-router-dom에서 useNavigate, useLocation 불러오기
import './DietHeader.css'; // 스타일시트 연결
import logo from '../assets/images/logo.png'; // 로고 이미지 파일 불러오기
import userIcon from '../assets/images/userpage.png'; // 사용자 아이콘 이미지
import MyPageModal from './MyPageModal'; // 마이페이지 모달 컴포넌트 불러오기

// DietHeader 함수형 컴포넌트 정의
const DietHeader = () => {
  // 현재 선택된 탭을 저장하는 state ('diet', 'nutrition' 등 중 하나)
  const [activeTab, setActiveTab] = useState('diet');
  // 마이페이지 모달을 열지 닫을지 결정하는 state
  const [showMyPageModal, setShowMyPageModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 경로 정보 가져오기

  // URL 경로에 따라 activeTab 자동 설정
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/dietpage') {
      setActiveTab('diet');
    } else if (path === '/nutrition' || path === '/nutrition-analysis') {
      setActiveTab('nutrition');
    } else if (path === '/foodinfo') {
      setActiveTab('foodInfo');
    } else if (path === '/progress') {
      setActiveTab('progress');
    }
    // 모달이 열려있을 때는 activeTab을 'myPage'로 유지
  }, [location.pathname]);

  // 탭 버튼 클릭 시 해당 탭을 활성화 상태로 설정하고 페이지 이동
  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  // 마이페이지 아이콘 클릭 시 모달 열고 탭을 'myPage'로 설정
  const handleMyPageClick = () => {
    setActiveTab('myPage');
    setShowMyPageModal(true);
  };

  // 모달 닫는 함수 (자식 컴포넌트에서 호출됨)
  const handleCloseModal = () => {
    setShowMyPageModal(false);
    // 모달 닫을 때 현재 URL에 맞는 탭으로 다시 설정
    const path = location.pathname;
    if (path === '/dietpage') {
      setActiveTab('diet');
    } else if (path === '/nutrition' || path === '/nutrition-analysis') {
      setActiveTab('nutrition');
    } else if (path === '/foodinfo') {
      setActiveTab('foodInfo');
    } else if (path === '/progress') {
      setActiveTab('progress');
    }
  };

  return (
    <>
      <header className="diet-header">
        <img src={logo} alt="DietChef Logo" className="logo" />
        
        {/* 오른쪽 탭 메뉴 영역 */}
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

          {/* 사용자 아이콘 버튼 (My Page) */}
          <button 
            className={`user-icon-button ${activeTab === 'myPage' ? 'active' : ''}`}
            onClick={handleMyPageClick}
          >
            <img src={userIcon} alt="MyPage" className="user-icon-img" />
          </button>
        </div>
      </header>

      {showMyPageModal && <MyPageModal onClose={handleCloseModal} />}
    </>
  );
};

// 컴포넌트 외부에서 사용 가능하도록 export
export default DietHeader;
