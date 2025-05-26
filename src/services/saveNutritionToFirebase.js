// saveNutritionToFirebase.js
import { getDatabase, ref, set, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// 기존 함수 - Progress 페이지용 (그대로 유지)
export const saveTodayNutrition = (calories, carbs, protein) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const today = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const key = `${months[today.getMonth()]} ${today.getDate()}`;

  const db = getDatabase();
  const nutritionRef = ref(db, `users/${user.uid}/nutrition/${key}`);

  const fat = Math.round((calories * 0.2) / 9); // optional 추정

  return set(nutritionRef, {
    calories,
    carbs,
    fat,
    protein
  })
  .then(() => console.log(`✅ 저장됨: ${key}`))
  .catch((err) => console.error('❌ 저장 실패:', err));
};

// 새로 추가: 음식 리스트와 영양정보 함께 저장 - Nutrition Analysis 페이지용
export const saveTodayFoodsAndNutrition = (consumedFoods, dailyNutrition) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return Promise.reject('User not authenticated');

  const today = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const key = `${months[today.getMonth()]} ${today.getDate()}`;
  
  const db = getDatabase();
  const nutritionRef = ref(db, `users/${user.uid}/nutrition/${key}`);
  
  return set(nutritionRef, {
    calories: dailyNutrition.calories,
    carbs: dailyNutrition.carbs,
    fat: dailyNutrition.fat,
    protein: dailyNutrition.protein,
    foods: consumedFoods, // 음식 리스트 추가
    updatedAt: new Date().toISOString()
  })
  .then(() => console.log(`✅ 음식 & 영양정보 저장됨: ${key}`))
  .catch((err) => console.error('❌ 저장 실패:', err));
};

// 새로 추가: 오늘 데이터 불러오기
export const loadTodayFoodsAndNutrition = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;

  const today = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const key = `${months[today.getMonth()]} ${today.getDate()}`;
  
  const db = getDatabase();
  const nutritionRef = ref(db, `users/${user.uid}/nutrition/${key}`);
  
  try {
    const snapshot = await get(nutritionRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('❌ 로드 실패:', error);
    return null;
  }
};