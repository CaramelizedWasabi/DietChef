// src/components/FoodList.jsx
import React from 'react';
import FoodItem from './FoodItem';

/**
 * 음식 목록 컴포넌트
 */
const FoodList = ({ consumedFoods, removeFood }) => {
  // 스타일 정의
  const styles = {
    foodListTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      borderBottom: '1px solid #eee',
      paddingBottom: '10px'
    },
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
    }
  };

  return (
    <>
      {/* 음식 항목 제목 */}
      {consumedFoods.length > 0 && (
        <div style={styles.foodListTitle}>The food you ate today</div>
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
    </>
  );
};

export default FoodList;