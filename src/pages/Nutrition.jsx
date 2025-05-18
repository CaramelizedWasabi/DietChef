// src/pages/Nutrition.jsx 수정
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, child } from 'firebase/database'; // Realtime Database
import { useNavigate } from 'react-router-dom';

const Nutrition = () => {
  const [calories, setCalories] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserNutrition = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getDatabase(); // Realtime DB 사용
      const userRef = ref(db, `users/${user.uid}/survey`); // 경로: users/{uid}/survey
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { height, weight, gender } = data;
          const age = 22; // 나중에 생일에서 계산 가능
          const cal =
            gender === 'male'
              ? Math.round(66 + 13.7 * weight + 5 * height - 6.8 * age)
              : Math.round(655 + 9.6 * weight + 1.8 * height - 4.7 * age);
          setCalories(cal);
          setCarbs(Math.round((cal * 0.5) / 4));
          setProtein(Math.round(weight * 1.2));
        } else {
          console.warn('No nutrition data found');
        }
      } catch (error) {
        console.error('Failed to load data from Realtime DB:', error);
      }
    };
    fetchUserNutrition();
  }, []);

  const handleAnalysisClick = () => {
    console.log('✅ 버튼 클릭됨');
    // 직접 페이지 이동시켜 보기
    window.location.href = '/nutrition-analysis';
    // navigate('/nutrition-analysis'); // 이것도 문제가 생기면 위의 코드 사용
  };

  return (
    <div style={styles.page}>
      <h2>Check Your Daily Nutrient Needs!</h2>
      <div style={styles.card}>
        <h3>Your Recommended Daily Intake</h3>
        <p>Calories: {calories} kcal</p>
        <p>Carbohydrates: {carbs} g</p>
        <p>Protein: {protein} g</p>
      </div>
      <button
        onClick={handleAnalysisClick}
        style={styles.button}
      >
        Check Your Nutrition Analysis
      </button>
    </div>
  );
};

const styles = {
  page: {
    textAlign: 'center',
    paddingTop: '0px',
    paddingBottom: '40px',
    marginTop: '-150px',
  },
  card: {
    margin: '20px auto',
    padding: '20px',
    width: '300px',
    borderRadius: '12px',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#fdbb30',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Nutrition;