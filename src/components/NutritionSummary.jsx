// src/components/NutritionSummary.jsx
import React from 'react';
import DonutChart from './DonutChart';

/**
 * 영양 정보 요약 컴포넌트
 */
const NutritionSummary = ({ dailyNutrition, calculateSegments }) => {
  // 스타일 정의
  const styles = {
    nutritionDisplay: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '20px 0 30px'
    },
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
    }
  };

  return (
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
  );
};

export default NutritionSummary;