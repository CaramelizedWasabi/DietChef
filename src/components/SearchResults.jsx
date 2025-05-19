// src/components/SearchResults.jsx
import React from 'react';

/**
 * 검색 결과를 표시하는 컴포넌트
 */
const SearchResults = ({ searchResults, showSearchResults, addFood, setShowAddModal }) => {
  // 스타일 정의
  const styles = {
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
      color: '#666',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    },
    addManualButton: {
      padding: '8px 15px',
      backgroundColor: '#f2b84b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    }
  };

  if (!showSearchResults) {
    return null;
  }

  return (
    <div style={styles.searchResults}>
      {searchResults.length === 0 ? (
        <div style={styles.noResults}>
          <div>None</div>
          <button 
            style={styles.addManualButton}
            onClick={() => setShowAddModal(true)}
          >
            Add by yourself
          </button>
        </div>
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
  );
};

export default SearchResults;