// src/pages/NutritionAnalysis.jsx
import React, { useState, useEffect } from 'react';

// 샘플 음식 데이터베이스 (실제 앱에서는 API로 가져올 수 있음)
const foodDatabase = [
  { id: 1, name: 'Salmon Salad', calories: 300, carbs: 15, fat: 18, protein: 22 },
  { id: 2, name: 'Chicken Breast', calories: 165, carbs: 0, fat: 3.6, protein: 31 },
  { id: 3, name: 'Brown Rice', calories: 216, carbs: 45, fat: 1.8, protein: 5 },
  { id: 4, name: 'Avocado', calories: 234, carbs: 12, fat: 21, protein: 2.9 },
  { id: 5, name: 'Greek Yogurt', calories: 100, carbs: 3.6, fat: 0.4, protein: 17 },
  { id: 6, name: 'Banana', calories: 105, carbs: 27, fat: 0.4, protein: 1.3 },
  { id: 7, name: 'Egg', calories: 72, carbs: 0.4, fat: 4.8, protein: 6.3 },
  { id: 8, name: 'Broccoli', calories: 55, carbs: 11, fat: 0.6, protein: 3.7 },
  { id: 9, name: 'Sweet Potato', calories: 112, carbs: 26, fat: 0.1, protein: 2 },
  { id: 10, name: 'Oatmeal', calories: 166, carbs: 28, fat: 3.6, protein: 5.9 },
];

const NutritionAnalysis = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [consumedFoods, setConsumedFoods] = useState([]);
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0
  });
  
  // 검색 기능
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    const results = foodDatabase.filter(food => 
      food.name.toLowerCase().includes(searchText.toLowerCase())
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
  };
  
  // 음식 등록 기능
  const addFood = (food) => {
    // 현재 시간을 ID로 사용하여 같은 음식도 여러 번 추가 가능하게 함
    const foodWithId = { ...food, entryId: Date.now() };
    const updatedFoods = [...consumedFoods, foodWithId];
    setConsumedFoods(updatedFoods);
    setSearchText('');
    setShowSearchResults(false);
  };
  
  // 음식 삭제 기능
  const removeFood = (entryId) => {
    const updatedFoods = consumedFoods.filter(food => food.entryId !== entryId);
    setConsumedFoods(updatedFoods);
  };
  
  // 영양소 합계 계산 (consumedFoods가 변경될 때마다 실행)
  useEffect(() => {
    const totals = consumedFoods.reduce((acc, food) => {
      return {
        calories: acc.calories + food.calories,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat,
        protein: acc.protein + food.protein
      };
    }, { calories: 0, carbs: 0, fat: 0, protein: 0 });
    
    setDailyNutrition(totals);
  }, [consumedFoods]);
  
  // 도넛 차트 세그먼트 계산
  const calculateSegments = () => {
    const total = dailyNutrition.carbs * 4 + dailyNutrition.fat * 9 + dailyNutrition.protein * 4;
    
    if (total === 0) {
      // 등록된 음식이 없는 경우 기본 세그먼트
      return [
        { color: '#a9e1a9', percent: 33 },
        { color: '#5a9e8f', percent: 33 },
        { color: '#1a365e', percent: 34 }
      ];
    }
    
    return [
      { color: '#a9e1a9', percent: (dailyNutrition.carbs * 4 / total) * 100 }, // 탄수화물
      { color: '#5a9e8f', percent: (dailyNutrition.fat * 9 / total) * 100 },   // 지방
      { color: '#1a365e', percent: (dailyNutrition.protein * 4 / total) * 100 } // 단백질
    ];
  };
  
  return (
    <div style={styles.container}>
      {/* 메인 컨텐츠 */}
      <main style={styles.main}>
        <h1 style={styles.heading}>Nutrition Analysis</h1>
        
        {/* 검색창 */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="음식 검색..."
            style={styles.searchInput}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          <button style={styles.searchButton} onClick={handleSearch}>
            🔍
          </button>
        </div>
        
        {/* 검색 결과 */}
        {showSearchResults && (
          <div style={styles.searchResults}>
            {searchResults.length === 0 ? (
              <div style={styles.noResults}>검색 결과가 없습니다.</div>
            ) : (
              searchResults.map(food => (
                <div key={food.id} style={styles.searchResultItem} onClick={() => addFood(food)}>
                  <div style={styles.foodNameResult}>{food.name}</div>
                  <div style={styles.foodNutrition}>
                    {food.calories} kcal | 탄수화물 {food.carbs}g | 지방 {food.fat}g | 단백질 {food.protein}g
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
          <div style={styles.foodListTitle}>오늘 섭취한 음식</div>
        )}
        
        {/* 등록된 음식 목록 */}
        <div style={styles.foodItemContainer}>
          {consumedFoods.length === 0 ? (
            <div style={styles.emptyList}>등록된 음식이 없습니다. 음식을 검색하여 추가해보세요!</div>
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

// 원형 차트 컴포넌트
const DonutChart = ({ calories, segments }) => {
  return (
    <div style={styles.donutChart}>
      <svg width="200" height="200" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="transparent" stroke="#eee" strokeWidth="10" />
        
        {/* 차트 세그먼트 계산 및 그리기 */}
        {segments.map((segment, index) => {
          // 원형 차트의 세그먼트를 계산
          const prevSegmentsTotal = segments
            .slice(0, index)
            .reduce((total, seg) => total + seg.percent, 0);
            
          const startAngle = (prevSegmentsTotal / 100) * 360;
          const endAngle = ((prevSegmentsTotal + segment.percent) / 100) * 360;
          
          // SVG 아크 계산
          const startX = 50 + 45 * Math.cos((startAngle - 90) * Math.PI / 180);
          const startY = 50 + 45 * Math.sin((startAngle - 90) * Math.PI / 180);
          const endX = 50 + 45 * Math.cos((endAngle - 90) * Math.PI / 180);
          const endY = 50 + 45 * Math.sin((endAngle - 90) * Math.PI / 180);
          
          // 큰 호인지 여부
          const largeArcFlag = segment.percent > 50 ? 1 : 0;
          
          const pathData = `
            M 50 50
            L ${startX} ${startY}
            A 45 45 0 ${largeArcFlag} 1 ${endX} ${endY}
            Z
          `;
          
          return <path key={index} d={pathData} fill={segment.color} />;
        })}
        
        {/* 중앙 흰색 원 */}
        <circle cx="50" cy="50" r="30" fill="white" />
      </svg>
      
      {/* 칼로리 정보 */}
      <div style={styles.caloriesInfo}>
        <div style={styles.caloriesNumber}>{Math.round(calories)}</div>
        <div style={styles.caloriesLabel}>Calories</div>
      </div>
    </div>
  );
};

// 음식 항목 컴포넌트
const FoodItem = ({ food, onRemove }) => {
  return (
    <div style={styles.foodItem}>
      <div style={styles.foodDetails}>
        <span style={styles.foodName}>{food.name}</span>
        <span style={styles.foodDetail}>Calories(kcal) {food.calories}</span>
        <span style={styles.foodDetail}>Carbs(g) {food.carbs}</span>
        <span style={styles.foodDetail}>Protein(g) {food.protein}</span>
      </div>
      <button style={styles.removeButton} onClick={onRemove}>×</button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '100%',
    margin: '0',
    padding: '0',
    backgroundColor: '#fff'
  },
  
  // 메인 컨텐츠 스타일
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
    top: '140px', // 검색창 아래에 위치하도록 조정
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
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
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
  
  // 도넛 차트 스타일
  donutChart: {
    position: 'relative',
    width: '200px',
    height: '200px'
  },
  caloriesInfo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
  },
  caloriesNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '0'
  },
  caloriesLabel: {
    fontSize: '14px',
    color: '#888',
    margin: '0'
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
  
  // 음식 항목 스타일
  foodItemContainer: {
    marginBottom: '20px',
    maxHeight: '400px',
    overflowY: 'auto',
    backgroundColor: '#f2f9f2',
    padding: '15px',
    borderRadius: '8px'
  },
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
  },
  emptyList: {
    textAlign: 'center',
    padding: '20px',
    color: '#888'
  }
};

export default NutritionAnalysis;