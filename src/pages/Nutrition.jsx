import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'; //firebase 인증
import { getFirestore, doc, getDoc } from 'firebase/firestore'; //Firebase Firestore

const Nutrition = () => {
  const [calories, setCalories] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);

  // Firebase에서 사용자 영양 정보 불러옴
  useEffect(() => {
    const fetchUserNutrition = async () => {
      const auth = getAuth(); // 현재 로그인된 사용자 정보
      const user = auth.currentUser;
      if (!user) return;
  
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
  
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const { height, weight, gender } = data;
          const age = 22; // 예시 나이

          const cal = gender === 'male'
            ? Math.round(66 + 13.7 * weight + 5 * height - 6.8 * age)
            : Math.round(655 + 9.6 * weight + 1.8 * height - 4.7 * age);

          setCalories(cal);
          setCarbs(Math.round((cal * 0.5) / 4));
          setProtein(Math.round(weight * 1.2));
        } else {
          console.warn('User document does not exist.');
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
  
    fetchUserNutrition();
  }, []);
  

  return (
    <div style={styles.page}>
      <h2>Check Your Daily Nutrient Needs!</h2>
      <div style={styles.card}>
        <h3>Your Recommended Daily Intake</h3>
        <p>Calories: {calories} kcal</p>
        <p>Carbohydrates: {carbs} g</p>
        <p>Protein: {protein} g</p>
      </div>
      <button onClick={() => {}} style={styles.button}>
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
    marginTop: '-150px'   
  },
  card: {
    margin: '20px auto',
    padding: '20px',
    width: '300px',
    borderRadius: '12px',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: 'white'
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#fdbb30',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default Nutrition;
