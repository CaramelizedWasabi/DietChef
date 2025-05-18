// src/pages/NutritionAnalysis.jsx
import React, { useState } from 'react';

const NutritionAnalysis = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e) => {
    // 검색 기능 구현 (나중에 추가)
    e.preventDefault();
    console.log("검색어:", searchText);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Nutrition Analysis</h2>
      
      {/* 검색창 - form 태그 사용 시 submit 이벤트 핸들링 추가 */}
      <form 
        style={styles.searchBar} 
        onSubmit={handleSearch}
      >
        <input 
          type="text" 
          placeholder="Search food..." 
          style={styles.input} 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button 
          type="submit" 
          style={styles.searchButton}
        >
          🔍
        </button>
      </form>
      
      {/* 칼로리 그래프 대체 텍스트 */}
      <div style={styles.circle}>
        <p style={styles.circleNumber}>528</p>
        <p style={styles.circleLabel}>Calories</p>
      </div>
      
      {/* 탄/지/단 요약 */}
      <div style={styles.macro}>
        <p><strong>Carbs</strong> 58g</p>
        <p><strong>Fat</strong> 13g</p>
        <p><strong>Protein</strong> 44g</p>
      </div>
      
      {/* 음식 리스트 */}
      <div style={styles.foodList}>
        <p><strong>Salmon Salad</strong> Calories(kcal) 300 | Carbs(g) 15 | Protein(g) 22</p>
        <p><strong>Salmon Salad</strong> Calories(kcal) 300 | Carbs(g) 15 | Protein(g) 22</p>
        <p><strong>Salmon Salad</strong> Calories(kcal) 300 | Carbs(g) 15 | Protein(g) 22</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '40px'
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px'
  },
  searchBar: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px'
  },
  input: {
    padding: '10px',
    width: '300px',
    borderRadius: '8px 0 0 8px',
    border: '1px solid #ccc',
    outline: 'none'
  },
  searchButton: {
    padding: '10px 16px',
    border: 'none',
    backgroundColor: '#9ed39f',
    borderRadius: '0 8px 8px 0',
    cursor: 'pointer'
  },
  circle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#c0edc0',
    margin: '0 auto 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  circleNumber: {
    fontSize: '32px',
    margin: 0
  },
  circleLabel: {
    margin: 0,
    color: '#444'
  },
  macro: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    marginBottom: '20px'
  },
  foodList: {
    backgroundColor: '#eaf5ea',
    padding: '20px',
    textAlign: 'left',
    width: '500px',
    margin: '0 auto',
    borderRadius: '12px'
  }
};

export default NutritionAnalysis;