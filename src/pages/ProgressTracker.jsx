import React, { useState, useEffect } from 'react';
import DonutChart from '../components/DonutChart';
import './ProgressTracker.css';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import GoalPopup from '../pages/GoalPopup';
import MealDeletePopup from '../pages/MealDeletePopup';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
const monthDayMap = {
  Jan: 31, Feb: 28, Mar: 31, Apr: 30, May: 31, Jun: 30,
  Jul: 31, Aug: 31, Sep: 30, Oct: 31, Nov: 30, Dec: 31
};

const ProgressTracker = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showMealView, setShowMealView] = useState(false);
  const [selectedDateForPopup, setSelectedDateForPopup] = useState(null);
  const [showGoalPopup, setShowGoalPopup] = useState(false);
  const [dailyNutrients, setDailyNutrients] = useState({});
  const [weeklyMeals, setWeeklyMeals] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [mealsForPopup, setMealsForPopup] = useState([]);

  const generateDatesForWeek = () => {
    if (!selectedMonth || !selectedWeek) return [];
    const maxDate = monthDayMap[selectedMonth];
    const weekIndex = parseInt(selectedWeek.split(' ')[1]) - 1;
    let startDay, endDay;
    
    if (selectedWeek === 'Week 4') {
      startDay = 22;
      endDay = maxDate;
    } else {
      startDay = weekIndex * 7 + 1;
      endDay = startDay + 6;
    }

    const dates = [];
    for (let d = startDay; d <= endDay; d++) {
      dates.push(`${selectedMonth} ${d}`);
    }
    return dates;
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getDatabase();
    // nutrition 경로에서 데이터 가져오기 (Nutrition Analysis와 동일)
    const nutritionRef = ref(db, `users/${user.uid}/nutrition`);
    
    const unsubscribe = onValue(nutritionRef, (snapshot) => {
      if (snapshot.exists()) {
        const nutritionData = snapshot.val();
        const nutrients = {};
        const meals = {};

        Object.entries(nutritionData).forEach(([date, data]) => {
          // nutrition 데이터 구조에 맞게 수정
          if (data.foods && Array.isArray(data.foods)) {
            // 영양정보는 이미 계산되어 저장됨
            nutrients[date] = {
              carbs: Math.round(data.carbs || 0),
              fat: Math.round(data.fat || 0),
              protein: Math.round(data.protein || 0),
            };
            
            // 음식 이름들만 추출
            meals[date] = data.foods.map(food => food.name || 'Unknown Food');
          } else {
            // 음식 리스트가 없는 경우 (기존 데이터)
            nutrients[date] = {
              carbs: Math.round(data.carbs || 0),
              fat: Math.round(data.fat || 0),
              protein: Math.round(data.protein || 0),
            };
            meals[date] = ['No Meals'];
          }
        });

        setDailyNutrients(nutrients);
        setWeeklyMeals(meals);
      } else {
        // 데이터가 없는 경우 초기화
        setDailyNutrients({});
        setWeeklyMeals({});
      }
    });

    return () => unsubscribe();
  }, []);
  const refreshMeals = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getDatabase();
    const nutritionRef = ref(db, `users/${user.uid}/nutrition`);
    const snapshot = await get(nutritionRef);

    if (!snapshot.exists()) return;

    const nutritionData = snapshot.val();
    const nutrients = {};
    const meals = {};

  Object.entries(nutritionData).forEach(([date, data]) => {
    if (data.foods && Array.isArray(data.foods)) {
      nutrients[date] = {
        carbs: Math.round(data.carbs || 0),
        fat: Math.round(data.fat || 0),
        protein: Math.round(data.protein || 0),
      };
      meals[date] = data.foods.map(food => food.name || 'Unknown Food');
    } else {
      nutrients[date] = {
        carbs: Math.round(data.carbs || 0),
        fat: Math.round(data.fat || 0),
        protein: Math.round(data.protein || 0),
      };
      meals[date] = ['No Meals'];
    }
  });

  setDailyNutrients(nutrients);
  setWeeklyMeals(meals);
};


  const backToNutrient = () => setShowMealView(false);
  
  const resetAll = () => {
    setSelectedMonth(null);
    setSelectedWeek(null);
    setShowMealView(false);
    setSelectedDateForPopup(null);
  };

  const handleDateClick = (date) =>{ 
    setSelectedDateForPopup(date);
    setMealsForPopup(weeklyMeals[date] || []);
    if (showMealView) {
    setShowDeletePopup(true);
  } else {
    setShowDeletePopup(false);
  }
  }
  const closePopup = () => setSelectedDateForPopup(null);

  const dates = generateDatesForWeek();
  const totalWeek = dates.reduce(
    (acc, date) => {
      const d = dailyNutrients[date];
      if (d) {
        acc.carbs += d.carbs || 0;
        acc.fat += d.fat || 0;
        acc.protein += d.protein || 0;
      }
      return acc;
    },
    { carbs: 0, fat: 0, protein: 0 }
  );

  const weekCal = totalWeek.carbs * 4 + totalWeek.fat * 9 + totalWeek.protein * 4;
  const hasWeekData = weekCal > 0;

  const renderPopup = () => {
    if (!selectedDateForPopup || showDeletePopup) return null; 
    const data = dailyNutrients[selectedDateForPopup];
    const hasNutrition = data && (data.carbs > 0 || data.fat > 0 || data.protein > 0);
    const display = hasNutrition ? data : { carbs: 0, fat: 0, protein: 0 };
    const totalCal = hasNutrition
      ? display.carbs * 4 + display.fat * 9 + display.protein * 4
      : 0;

    return (
      <div className="popup-overlay" onClick={closePopup}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <h3>{selectedDateForPopup} Nutrient</h3>
          <div className="popup-flex">
            <div className="donut-popup-wrapper">
              <DonutChart
                segments={
                  hasNutrition
                    ? [
                        { percent: (display.carbs * 4) / totalCal * 100, color: '#f9a826' },
                        { percent: (display.fat * 9) / totalCal * 100, color: '#6cc3aa' },
                        { percent: (display.protein * 4) / totalCal * 100, color: '#99dd55' }
                      ]
                    : [
                        { percent: 33, color: '#f9a826' },
                        { percent: 33, color: '#6cc3aa' },
                        { percent: 34, color: '#99dd55' }
                      ]
                }
                calories={totalCal}
              />
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ color: '#f9a826' }}>Carbs {display.carbs}g</li>
              <li style={{ color: '#6cc3aa' }}>Fat {display.fat}g</li>
              <li style={{ color: '#99dd55' }}>Protein {display.protein}g</li>
            </ul>
          </div>
          <button className="goal-button" onClick={closePopup}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className="tracker-container">
      {!selectedWeek && !showMealView && (
        <>
          <div className="month-container">
            {[0, 1].map(row => (
              <div key={row} className="month-row">
                {months.slice(row * 6, row * 6 + 6).map(month => (
                  <button
                    key={month}
                    className={`month-button ${selectedMonth === month ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedMonth(month);
                      setSelectedWeek(null);
                      setShowMealView(false);
                    }}
                  >
                    {month}
                  </button>
                ))}
              </div>
            ))}
          </div>
          {selectedMonth && (
            <div className="week-container">
              {[0, 1].map(row => (
                <div key={row} className="week-row">
                  {weeks.slice(row * 2, row * 2 + 2).map(week => (
                    <button
                      key={week}
                      className="week-button"
                      onClick={() => {
                        setSelectedWeek(week);
                        setShowMealView(false);
                      }}
                    >
                      {week}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
          <div className="goal-button-container">
            <button className="goal-button" onClick={() => setShowGoalPopup(true)}>Goal Result</button>
          </div>
        </>
      )}

      {selectedWeek && !showMealView && (
        <div className="week-detail">
          <div className="date-grid">
            {dates.map((date, i) => (
              <div
                key={i}
                className={`date-box ${selectedDateForPopup === date ? 'active' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                {date}
              </div>
            ))}
          </div>
          <div className="nutrient-section">
            <h3 className="nutrient-title">Weekly Nutrient</h3>
            <div className="nutrient-box fixed-width">
              <div className="donut-wrapper">
                <DonutChart
                  segments={
                    hasWeekData
                      ? [
                          { percent: (totalWeek.carbs * 4) / weekCal * 100, color: '#f9a826' },
                          { percent: (totalWeek.fat * 9) / weekCal * 100, color: '#6cc3aa' },
                          { percent: (totalWeek.protein * 4) / weekCal * 100, color: '#99dd55' }
                        ]
                      : [
                          { percent: 33, color: '#f9a826' },
                          { percent: 33, color: '#6cc3aa' },
                          { percent: 34, color: '#99dd55' }
                        ]
                  }
                  calories={weekCal}
                />
              </div>
              <div className="nutrient-info vertical-center">
                <div className="nutrient-row"><div className="legend-color carbs" /> Carbs {totalWeek.carbs}g</div>
                <div className="nutrient-row"><div className="legend-color fat" /> Fat {totalWeek.fat}g</div>
                <div className="nutrient-row"><div className="legend-color protein" /> Protein {totalWeek.protein}g</div>
              </div>
              <div className="weekly-meal-wrapper">
                <button className="meal-button" onClick={() => setShowMealView(true)}>
                  Weekly Meal
                </button>
              </div>
              <div className="total-cal-wrapper">
                <div>Total Cal</div>
                <div className="big-kcal">{weekCal.toLocaleString()}kcal</div>
              </div>
            </div>
          </div>
          <div className="goal-button-container">
            <button className="goal-button" onClick={resetAll}>Back</button>
          </div>
        </div>
      )}

      {showMealView && (
        <div className="week-detail">
          <h3 className="nutrient-title">Weekly Meal Plan</h3>
          <div className="date-grid">
            {dates.map((date, i) => (
              <div key={i} className="meal-box" onClick={() => handleDateClick(date)}>
                <div className="meal-date">{date}</div>
                <div className="meal-list">
                  {(weeklyMeals[date] || ['No Meals']).map((meal, j) => (
                    <div key={j} className="meal-item">{meal}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="goal-button-container">
            <button className="goal-button" onClick={backToNutrient}>Back</button>
          </div>
        </div>
      )}

      {renderPopup()}
      {showGoalPopup && <GoalPopup onClose={() => setShowGoalPopup(false)} />}
        {showDeletePopup && (
          <MealDeletePopup
            date={selectedDateForPopup}
            meals={mealsForPopup}
            onClose={() => {
            setShowDeletePopup(false);
            setSelectedDateForPopup(null);
            }}
            onUpdate={refreshMeals}
          />
        )}
    </div>
  );
};

export default ProgressTracker;