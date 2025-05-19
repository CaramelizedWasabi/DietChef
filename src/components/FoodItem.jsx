// src/components/FoodItem.jsx
import React from 'react';

const FoodItem = ({ food, onRemove }) => {
  // 스타일 정의
  const styles = {
    foodItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      marginBottom: '8px',
      backgroundColor: 'white',
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    foodDetails: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: '1'
    },
    foodName: {
      fontWeight: 'bold',
      marginRight: '15px'
    },
    foodDetail: {
      color: '#666',
      margin: '0 10px 0 0'
    },
    removeButton: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '16px'
    }
  };

  return (
    <div style={styles.foodItem}>
      <div style={styles.foodDetails}>
        <span style={styles.foodName}>{food.name}</span>
        <span style={styles.foodDetail}>Calories(kcal) {food.calories}</span>
        <span style={styles.foodDetail}>Carbs(g) {food.carbs}</span>
        <span style={styles.foodDetail}>Fat(g) {food.fat}</span>
        <span style={styles.foodDetail}>Protein(g) {food.protein}</span>
      </div>
      <button 
        style={styles.removeButton} 
        onClick={onRemove}
        aria-label="Remove food item"
      >
        ×
      </button>
    </div>
  );
};

export default FoodItem;