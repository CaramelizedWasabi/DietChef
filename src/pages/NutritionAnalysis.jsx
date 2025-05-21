// src/pages/NutritionAnalysis.jsx 
import React from 'react';
import useNutritionHook from '../hooks/useNutrition.js';

// 분리된 컴포넌트들 임포트
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import NutritionSummary from '../components/NutritionSummary';
import FoodList from '../components/FoodList';
import AddFoodModal from '../components/AddFoodModal';
import ErrorMessage from '../components/ErrorMessage.jsx';

/**
 * 영양 분석 페이지 컴포넌트
 */
const NutritionAnalysis = () => {
  const {
    searchText,
    searchResults,
    showSearchResults,
    consumedFoods,
    dailyNutrition,
    isLoading,
    error,
    showAddModal,
    lastSearchQuery,
    setSearchText,
    handleSearch,
    addFood,
    removeFood,
    calculateSegments,
    clearError,
    setShowAddModal,
    addCustomFood
  } = useNutritionHook();

  // 스타일 정의
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '100%',
      margin: '0',
      padding: '0',
      backgroundColor: '#fff'
    },
    main: {
      padding: '0 20px',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    heading: {
      fontSize: '32px',
      textAlign: 'center',
      margin: '30px 0'
    },
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100
    },
    loadingText: {
      fontSize: '20px',
      color: '#333'
    },
    manualAddButton: {
      padding: '8px 15px',
      backgroundColor: '#f2b84b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      margin: '10px auto',
      display: 'block',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingText}>Loading...</div>
        </div>
      )}
      
      {/* 수동 추가 모달 */}
      <AddFoodModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addCustomFood}
      />
      
      {/* 메인 컨텐츠 */}
      <main style={styles.main}>
        <h1 style={styles.heading}>Nutrition Analysis</h1>
        
        {/* 에러 메시지 */}
        <ErrorMessage error={error} clearError={clearError} />
        
        {/* 검색창 */}
        <SearchBar 
          searchText={searchText} 
          setSearchText={setSearchText} 
          handleSearch={handleSearch} 
        />
        
        {/* 수동 추가 버튼 */}
        <button 
          style={styles.manualAddButton}
          onClick={() => setShowAddModal(true)}
        >
          Adding food yourself
        </button>
        
        {/* 검색 결과 */}
        <SearchResults 
          searchResults={searchResults}
          showSearchResults={showSearchResults}
          addFood={addFood}
          setShowAddModal={setShowAddModal}
        />
        
        {/* 원형 차트와 매크로 정보 */}
        <NutritionSummary 
          dailyNutrition={dailyNutrition}
          calculateSegments={calculateSegments}
        />
        
        {/* 음식 목록 */}
        <FoodList 
          consumedFoods={consumedFoods}
          removeFood={removeFood}
        />
      </main>
    </div>
  );
};

export default NutritionAnalysis;