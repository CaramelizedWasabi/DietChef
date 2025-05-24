import { getDatabase, ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

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
