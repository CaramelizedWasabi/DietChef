import React from 'react';
import './MealDeletePopup.css';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';
import { calculateNutritionFromFoods } from '../utils/updateNutritionAfterDelete';

const MealDeletePopup = ({ date, meals = [], onClose, onUpdate }) => {
  const handleDelete = async (mealIndex) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getDatabase();
    const mealRef = ref(db, `users/${user.uid}/nutrition/${date}`);
    const snap = await get(mealRef);

    if (!snap.exists()) return;

    const data = snap.val();
    if (!data.foods || !Array.isArray(data.foods)) return;

    const mealNameToDelete = meals[mealIndex];
    const updatedFoods = data.foods.filter((food, idx) => food.name !== mealNameToDelete || idx !== data.foods.findIndex(f => f.name === mealNameToDelete));

    const nutrition = calculateNutritionFromFoods(updatedFoods);
    

    await update(mealRef, { foods: updatedFoods, ...nutrition });
    onUpdate();
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>{date} - Delete Meal</h3>
        <ul className="meal-delete-list">
          {meals.length === 0 && <li>No Meals</li>}
          {meals.map((meal, idx) => (
            <li key={idx} className="meal-row">
              <span>{meal}</span>
              <button className="delete-btn" onClick={() => handleDelete(idx)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button className="goal-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MealDeletePopup;
