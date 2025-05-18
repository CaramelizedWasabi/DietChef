// src/components/ProtectedRoute.jsx
/** 사용자 인증 및 프로필/설문 완료 여부에 따라 접근을 제어하는 보호 라우트 컴포넌트 **/

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { checkUserProgress } from '../auth'; // 사용자 프로필 및 설문 진행 상황 확인 함수

// ProtectedRoute 컴포넌트 정의
// - 특정 페이지에 접근할 수 있는 사용자인지 확인하고 조건이 맞지 않으면 다른 페이지로 리디렉션함
// - props:
//   - element: 렌더링할 실제 컴포넌트
//   - requireLogin: 로그인 여부 필요 (기본값 true)
//   - requireProfile: 프로필 입력 완료 여부 필요 (기본값 false)
//   - requireSurvey: 설문 완료 여부 필요 (기본값 false)
const ProtectedRoute = ({ 
  element, 
  requireLogin = true, 
  requireProfile = false, 
  requireSurvey = false, 
}) => {
  // 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(null); // 초기값 false → null 
  const [userProgress, setUserProgress] = useState({
    profileCompleted: false, // 프로필 작성 완료 여부
    surveyCompleted: false   // 설문 작성 완료 여부
  });
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        try {
          const progress = await checkUserProgress(user.uid);
          if (progress) setUserProgress(progress);
        } catch (error) {
          console.error("User status verification error:", error);
        }
      } else {
        setIsAuthenticated(false);
      }
      setAuthChecked(true); // 인증 확인 완료
    });
  
    return () => unsubscribe();
  }, []);

  // 로딩 중일 때 화면에 표시할 내용
  if (!authChecked) {
    return <div className="loading-container">Loading...</div>;
  }
  
  // 로그인 안 된 경우
  if (!isAuthenticated) {
    return requireLogin ? <Navigate to="/" /> : null;
  }
  

  // 프로필 작성 완료가 필요한데 완료하지 않은 경우, 프로필 작성 페이지로 이동
  if (requireProfile && !userProgress.profileCompleted) {
    return <Navigate to="/complete-profile" />;
  }

  // 설문 완료가 필요한데 설문을 완료하지 않은 경우
  if (requireSurvey && !userProgress.surveyCompleted) {
    // 프로필은 완료했으나 설문만 완료되지 않은 경우, 설문 페이지로 이동
    if (userProgress.profileCompleted) {
      return <Navigate to="/survey" />;
    }
    // 프로필도 완료되지 않은 경우, 먼저 프로필 작성 페이지로 이동
    return <Navigate to="/complete-profile" />;
  }

  // 모든 조건을 충족한 경우, 원래의 컴포넌트 렌더링
  return element;
};

export default ProtectedRoute;
