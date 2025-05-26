// src/components/SearchResults.jsx
import React from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const saveFoodToToday = (food) => {
  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const foodRef = ref(db, `users/${user.uid}/consumed/${today}`);
  const newFoodRef = push(foodRef);

  set(newFoodRef, food);
};

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
    showSearchResults && (
      <div style={styles.searchResults}>
        {searchResults.length === 0 ? (
          <div style={styles.noResults}>No results found.</div>
        ) : (
          searchResults.map((food, index) => (
            <div
              key={index}
              style={styles.searchResultItem}
              onClick={() => {
                saveFoodToToday(food);
                addFood(food);
                //setShowAddModal(true);
              }}
            >
              <div style={styles.foodNameResult}>{food.name}</div>
              <div style={styles.foodNutrition}>
                {food.calories} kcal | C:{food.carbs}g F:{food.fat}g P:{food.protein}g
              </div>
            </div>
          ))
        )}
      </div>
    )
  );
};

export default SearchResults;