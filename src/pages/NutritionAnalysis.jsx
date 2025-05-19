// src/pages/NutritionAnalysis.jsx
import React from 'react';
// 상대 경로 수정
import useNutritionHook from '../hooks/useNutrition.js';
import DonutChart from '../components/DonutChart';
import FoodItem from '../components/FoodItem';

const NutritionAnalysis = () => {
  const {
    searchText,
    searchResults,
    showSearchResults,
    consumedFoods,
    dailyNutrition,
    isLoading,
    error,
    setSearchText,
    handleSearch,
    addFood,
    removeFood,
    calculateSegments,
    clearError
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
    // 검색 스타일
    searchContainer: {
      display: 'flex',
      maxWidth: '600px',
      margin: '0 auto 10px',
      position: 'relative'
    },
    searchInput: {
      flex: '1',
      padding: '12px 15px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRight: 'none',
      borderRadius: '8px 0 0 8px',
      outline: 'none'
    },
    searchButton: {
      padding: '0 20px',
      backgroundColor: '#a9d6a9',
      border: 'none',
      borderRadius: '0 8px 8px 0',
      cursor: 'pointer',
      fontSize: '20px'
    },
    // 검색 결과 스타일
    searchResults: {
      position: 'absolute',
      top: '140px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '600px',
      maxHeight: '300px',
      overflowY: 'auto',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      zIndex: 10
    },
    searchResultItem: {
      padding: '10px 15px',
      borderBottom: '1px solid #eee',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    foodNameResult: {
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    foodNutrition: {
      fontSize: '14px',
      color: '#666'
    },
    noResults: {
      padding: '15px',
      textAlign: 'center',
      color: '#666'
    },
    // 영양소 정보 표시 스타일
    nutritionDisplay: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '20px 0 30px'
    },
    // 매크로 영양소 스타일
    macrosContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      maxWidth: '500px',
      margin: '20px 0'
    },
    macroSection: {
      flex: '1',
      textAlign: 'center'
    },
    macroHeader: {
      fontSize: '18px',
      margin: '0 0 8px 0'
    },
    macroValue: {
      fontSize: '22px',
      fontWeight: 'bold'
    },
    macroSeparator: {
      width: '1px',
      height: '40px',
      backgroundColor: '#ddd',
      margin: '0 15px'
    },
    // 음식 목록 제목 스타일
    foodListTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      borderBottom: '1px solid #eee',
      paddingBottom: '10px'
    },
    // 음식 항목 컨테이너 스타일
    foodItemContainer: {
      marginBottom: '20px',
      maxHeight: '400px',
      overflowY: 'auto',
      backgroundColor: '#f2f9f2',
      padding: '15px',
      borderRadius: '8px'
    },
    emptyList: {
      textAlign: 'center',
      padding: '20px',
      color: '#888'
    },
    // 로딩 및 에러 스타일
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
    errorMessage: {
      color: '#d9534f',
      textAlign: 'center',
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '#f8d7da',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#d9534f',
      fontSize: '20px',
      cursor: 'pointer'
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
      
      {/* 메인 컨텐츠 */}
      <main style={styles.main}>
        <h1 style={styles.heading}>Nutrition Analysis</h1>
        
        {/* 에러 메시지 */}
        {error && (
          <div style={styles.errorMessage}>
            {error}
            <button style={styles.closeButton} onClick={clearError} aria-label="Close error message">
              ×
            </button>
          </div>
        )}
        
        {/* 검색창 */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Serch Food"
            style={styles.searchInput}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            aria-label="Food search"
          />
          <button 
            style={styles.searchButton} 
            onClick={handleSearch}
            aria-label="Search"
          >
            🔍
          </button>
        </div>
        
        {/* 검색 결과 */}
        {showSearchResults && (
          <div style={styles.searchResults}>
            {searchResults.length === 0 ? (
              <div style={styles.noResults}>None</div>
            ) : (
              searchResults.map(food => (
                <div 
                  key={food.id} 
                  style={styles.searchResultItem} 
                  onClick={() => addFood(food)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Add ${food.name} to consumed foods`}
                >
                  <div style={styles.foodNameResult}>{food.name}</div>
                  <div style={styles.foodNutrition}>
                    {food.calories} kcal | Carbs {food.carbs}g | Fat {food.fat}g | Protein {food.protein}g
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* 원형 차트와 매크로 정보 */}
        <div style={styles.nutritionDisplay}>
          <DonutChart
            calories={dailyNutrition.calories}
            segments={calculateSegments()}
          />
          <div style={styles.macrosContainer}>
            <div style={styles.macroSection}>
              <div style={styles.macroHeader}>Carbs</div>
              <div style={styles.macroValue}>{Math.round(dailyNutrition.carbs)}g</div>
            </div>
            <div style={styles.macroSeparator}></div>
            <div style={styles.macroSection}>
              <div style={styles.macroHeader}>Fat</div>
              <div style={styles.macroValue}>{Math.round(dailyNutrition.fat)}g</div>
            </div>
            <div style={styles.macroSeparator}></div>
            <div style={styles.macroSection}>
              <div style={styles.macroHeader}>Protein</div>
              <div style={styles.macroValue}>{Math.round(dailyNutrition.protein)}g</div>
            </div>
          </div>
        </div>
        
        {/* 음식 항목 제목 */}
        {consumedFoods.length > 0 && (
          <div style={styles.foodListTitle}>The food you ate today </div>
        )}
        
        {/* 등록된 음식 목록 */}
        <div style={styles.foodItemContainer}>
          {consumedFoods.length === 0 ? (
            <div style={styles.emptyList}>No food registered. Search for food and add it!</div>
          ) : (
            consumedFoods.map(food => (
              <FoodItem
                key={food.entryId}
                food={food}
                onRemove={() => removeFood(food.entryId)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default NutritionAnalysis;