// src/hooks/useNutrition.js
import { useState, useEffect, useCallback } from 'react';
import {
  searchFoods,
  saveConsumedFood,
  deleteConsumedFood,
  getTodayConsumedFoods
} from '../services/foodService';

/**
 * 영양 분석 관련 로직을 모아둔 커스텀 훅
 * @returns {Object} - 영양 분석 관련 상태 및 함수들
 */
function useNutritionHook() {
  // 상태 정의
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
  
  // 모달 관련 상태 추가
  const [showAddModal, setShowAddModal] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const todayFoods = await getTodayConsumedFoods();
        setConsumedFoods(todayFoods);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load your food data. Please try again later.');
        setIsLoading(false);
        console.error('Error loading initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  // 검색 기능
  const handleSearch = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (searchText.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsLoading(true);
      setLastSearchQuery(searchText); // 검색 쿼리 저장
      const results = await searchFoods(searchText);
      setSearchResults(results);
      setShowSearchResults(true);
      
      // 검색 결과가 없으면 수동 추가 모달 표시
      if (results.length === 0) {
        setShowAddModal(true);
      }
      
      setIsLoading(false);
    } catch (err) {
      setError('Search failed. Please try again later.');
      setIsLoading(false);
      console.error('Error during search:', err);
    }
  }, [searchText]);

  // 음식 등록 기능
  const addFood = useCallback(async (food) => {
    try {
      setIsLoading(true);
      const savedFood = await saveConsumedFood(food);
      setConsumedFoods(prev => [...prev, savedFood]);
      setSearchText('');
      setShowSearchResults(false);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to add food. Please try again.');
      setIsLoading(false);
      console.error('Error adding food:', err);
    }
  }, []);

  // 수동으로 음식 추가
  const addCustomFood = useCallback((food) => {
    // 사용자가 입력한 음식 정보를 저장
    const customFood = {
      ...food,
      entryId: Date.now() // 고유 ID 생성
    };
    
    setConsumedFoods(prev => [...prev, customFood]);
    setShowAddModal(false);
    setSearchText('');
    setShowSearchResults(false);
  }, []);

  // 음식 삭제 기능
  const removeFood = useCallback(async (entryId) => {
    try {
      setIsLoading(true);
      const success = await deleteConsumedFood(entryId);
      if (success) {
        setConsumedFoods(prev => prev.filter(food => food.entryId !== entryId));
      } else {
        setError('Failed to remove food. Please try again.');
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to remove food. Please try again.');
      setIsLoading(false);
      console.error('Error removing food:', err);
    }
  }, []);

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
  const calculateSegments = useCallback(() => {
    const total = dailyNutrition.carbs * 4 + dailyNutrition.fat * 9 + dailyNutrition.protein * 4;
    
    if (total === 0) {
      // 등록된 음식이 없는 경우 기본 세그먼트
      return [
        { color: '#a9e1a9', percent: 33 }, // 탄수화물
        { color: '#5a9e8f', percent: 33 }, // 지방
        { color: '#1a365e', percent: 34 }  // 단백질
      ];
    }
    
    return [
      { color: '#a9e1a9', percent: (dailyNutrition.carbs * 4 / total) * 100 }, // 탄수화물
      { color: '#5a9e8f', percent: (dailyNutrition.fat * 9 / total) * 100 },   // 지방
      { color: '#1a365e', percent: (dailyNutrition.protein * 4 / total) * 100 } // 단백질
    ];
  }, [dailyNutrition]);

  // 에러 상태 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 상태
    searchText,
    searchResults,
    showSearchResults,
    consumedFoods,
    dailyNutrition,
    isLoading,
    error,
    showAddModal,
    lastSearchQuery,
    
    // 상태 변경 함수
    setSearchText,
    handleSearch,
    addFood,
    removeFood,
    calculateSegments,
    clearError,
    setShowAddModal,
    addCustomFood
  };
}

// 명확하게 함수 이름을 다르게 지정하고 기본 내보내기로 useNutrition 이름 사용
export default useNutritionHook;