// useNutrition.js
import { useState, useEffect } from 'react';
import { saveTodayFoodsAndNutrition, loadTodayFoodsAndNutrition } from '../services/saveNutritionToFirebase';
import { searchFoods } from '../services/foodService'; 

const useNutritionHook = () => {
  // 상태 관리
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  // 컴포넌트 마운트 시 Firebase에서 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await loadTodayFoodsAndNutrition();
        if (data) {
          setConsumedFoods(data.foods || []);
          setDailyNutrition({
            calories: data.calories || 0,
            carbs: data.carbs || 0,
            fat: data.fat || 0,
            protein: data.protein || 0
          });
          console.log('✅ 데이터 로드 완료');
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setError('Failed to retrieve data.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // 영양정보 계산 함수
  const calculateNutrition = (foods) => {
    return foods.reduce((total, food) => ({
      calories: total.calories + (food.calories || 0),
      carbs: total.carbs + (food.carbs || 0),
      fat: total.fat + (food.fat || 0),
      protein: total.protein + (food.protein || 0)
    }), { calories: 0, carbs: 0, fat: 0, protein: 0 });
  };

  // 검색 함수
  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setLastSearchQuery(searchText);
    
    try {
      console.log('검색어:', searchText);
      const results = await searchFoods(searchText);
      console.log('검색 결과:', results);
      
      if (results && results.length > 0) {
        setSearchResults(results);
        setShowSearchResults(true);
        setError(null);
      } else {
        setError(`"${searchText}"There are no search results for .`);
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setError('An error occurred while searching. Please try again.');
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 음식 추가 함수 (Firebase 저장 포함)
  const addFood = async (food) => {
    try {
      const foodWithId = { 
        ...food, 
        id: Date.now() + Math.random(), // 고유 ID 생성
        addedAt: new Date().toISOString()
      };
      
      const newFoods = [...consumedFoods, foodWithId];
      const newNutrition = calculateNutrition(newFoods);
      
      // 상태 업데이트
      setConsumedFoods(newFoods);
      setDailyNutrition(newNutrition);
      
      // Firebase에 저장
      await saveTodayFoodsAndNutrition(newFoods, newNutrition);
      
      // 검색 결과 숨기기
      setShowSearchResults(false);
      setSearchText('');
      
      console.log('✅ 음식 추가 및 저장 완료');
    } catch (error) {
      console.error('Food Addition Failed:', error);
      setError('Food addition failed.');
    }
  };

  // 음식 제거 함수 (Firebase 저장 포함)
  const removeFood = async (foodId) => {
    try {
      const newFoods = consumedFoods.filter(food => food.id !== foodId);
      const newNutrition = calculateNutrition(newFoods);
      
      // 상태 업데이트
      setConsumedFoods(newFoods);
      setDailyNutrition(newNutrition);
      
      // Firebase에 저장
      await saveTodayFoodsAndNutrition(newFoods, newNutrition);
      
      console.log('✅ 음식 제거 및 저장 완료');
    } catch (error) {
      console.error('음식 제거 실패:', error);
      setError('Food removal failed.');
    }
  };

  // 커스텀 음식 추가 함수
  const addCustomFood = async (customFood) => {
    try {
      const foodWithId = {
        ...customFood,
        id: Date.now() + Math.random(),
        addedAt: new Date().toISOString(),
        isCustom: true // 커스텀 음식 표시
      };
      
      const newFoods = [...consumedFoods, foodWithId];
      const newNutrition = calculateNutrition(newFoods);
      
      // 상태 업데이트
      setConsumedFoods(newFoods);
      setDailyNutrition(newNutrition);
      
      // Firebase에 저장
      await saveTodayFoodsAndNutrition(newFoods, newNutrition);
      
      // 모달 닫기
      setShowAddModal(false);
      
      console.log('✅ 커스텀 음식 추가 및 저장 완료');
    } catch (error) {
      console.error('커스텀 음식 추가 실패:', error);
      setError('Failed to add custom food.');
    }
  };

  // 차트용 세그먼트 계산
  const calculateSegments = () => {
    const total = dailyNutrition.calories;
    if (total === 0) return [
      { name: 'Carbs', value: 0, color: '#8FBC8F' },
      { name: 'Fat', value: 0, color: '#4682B4' },
      { name: 'Protein', value: 0, color: '#2F4F4F' }
    ];
    
    return [
      { 
        name: 'Carbs', 
        value: (dailyNutrition.carbs * 4 / total) * 100,
        color: '#8FBC8F'
      },
      { 
        name: 'Fat', 
        value: (dailyNutrition.fat * 9 / total) * 100,
        color: '#4682B4'
      },
      { 
        name: 'Protein', 
        value: (dailyNutrition.protein * 4 / total) * 100,
        color: '#2F4F4F'
      }
    ];
  };

  // 에러 클리어 함수
  const clearError = () => {
    setError(null);
  };

  return {
    // 상태들
    searchText,
    searchResults,
    showSearchResults,
    consumedFoods,
    dailyNutrition,
    isLoading,
    error,
    showAddModal,
    lastSearchQuery,
    
    // 함수들
    setSearchText,
    handleSearch,
    addFood,
    removeFood,
    calculateSegments,
    clearError,
    setShowAddModal,
    addCustomFood
  };
};

export default useNutritionHook;