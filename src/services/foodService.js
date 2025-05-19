// src/services/foodService.js
// CalorieNinjas API를 사용하는 서비스 함수들

// CalorieNinjas API 정보
const CALORIENINJAS_API_KEY = process.env.REACT_APP_CALORIENINJAS_API_KEY;
const API_BASE_URL = 'https://api.calorieninjas.com/v1';

/**
 * CalorieNinjas API에서 음식 검색
 * @param {string} query - 검색어
 * @returns {Promise<Array>} - 검색 결과 배열
 */
export const searchFoods = async (query) => {
    try {
      console.log('Searching for:', query);
      
      // API 연결 플래그 - 실제 API 연결시 true로 변경
      const useRealApi = true;
      
      if (useRealApi) {
        console.log('Using real API');
        
        // CalorieNinjas API 호출
        const url = `${API_BASE_URL}/nutrition?query=${encodeURIComponent(query)}`;
        console.log('API URL:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Api-Key': CALORIENINJAS_API_KEY,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response data:', data);
        
        // CalorieNinjas 응답 형식을 앱 형식으로 변환
        if (data.items && Array.isArray(data.items)) {
          return data.items.map((item, index) => {
            return {
              id: index + 1, // 고유 ID 생성
              name: item.name || query,
              calories: Math.round(item.calories || 0),
              carbs: Math.round(item.carbohydrates_total_g || 0),
              fat: Math.round(item.fat_total_g || 0),
              protein: Math.round(item.protein_g || 0)
            };
          });
        } else {
          console.log('No items in response, returning empty array');
          return [];
        }
      } else {
        console.log('Using mock data');
        return mockSearchFoods(query);
      }
    } catch (error) {
      console.error('Error searching foods:', error);
      // 에러가 발생해도 빈 배열 반환하여 앱이 크래시 되지 않도록 함
      return [];
    }
  };

/**
 * 음식 상세 정보 가져오기
 * @param {number} foodId - 음식 ID
 * @returns {Promise<Object>} - 음식 상세 정보
 */
export const getFoodDetails = async (foodId) => {
  try {
    // API 연결 플래그 - 실제 API 연결시 true로 변경
    const useRealApi = false;
    
    if (useRealApi) {
      // 우리 앱에서는 처음에 searchFoods로 모든 정보를 가져오므로
      // 개별 음식 조회는 필요 없지만, 실제 API 연동시 구현 가능
      
      // 이 예제에서는 이미 가져온 음식 정보를 사용한다고 가정
      // 실제로는 캐시된 데이터나 로컬 저장소에서 조회 가능
      return mockFoodDatabase.find(food => food.id === foodId) || null;
    } else {
      // 개발용 목업 데이터 사용
      return mockFoodDatabase.find(food => food.id === foodId) || null;
    }
  } catch (error) {
    console.error('Error fetching food details:', error);
    throw error;
  }
};

/**
 * 사용자의 음식 섭취 기록 저장
 * @param {Object} foodEntry - 섭취한 음식 정보
 * @returns {Promise<Object>} - 저장된 음식 정보 (ID 포함)
 */
export const saveConsumedFood = async (foodEntry) => {
  try {
    return { ...foodEntry, entryId: Date.now() };
  } catch (error) {
    console.error('Error saving consumed food:', error);
    throw error;
  }
};

/**
 * 사용자의 음식 섭취 기록 삭제
 * @param {number} entryId - 삭제할 섭취 기록 ID
 * @returns {Promise<boolean>} - 삭제 성공 여부
 */
export const deleteConsumedFood = async (entryId) => {
  try {
    return true;
  } catch (error) {
    console.error('Error deleting consumed food:', error);
    throw error;
  }
};

/**
 * 사용자의 오늘 섭취한 음식 목록 가져오기
 * @returns {Promise<Array>} - 오늘 섭취한 음식 목록
 */
export const getTodayConsumedFoods = async () => {
  try {
    return [];
  } catch (error) {
    console.error('Error fetching today consumed foods:', error);
    throw error;
  }
};

// 샘플 데이터 (API 연동 전까지 사용)
const mockFoodDatabase = [
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

/**
 * 샘플 음식 검색 함수 (API 연동 전까지 사용)
 * @param {string} query - 검색어
 * @returns {Array} - 검색 결과 배열
 */
const mockSearchFoods = (query) => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  return mockFoodDatabase.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );
};