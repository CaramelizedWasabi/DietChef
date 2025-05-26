// src/pages/FoodDetailPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DietHeader from '../components/DietHeader';

const FoodDetailPage = () => {
  const location = useLocation();
  const food = location.state?.food;
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmYes = () => {
    // 👉 Lưu vào localStorage
    const stored = localStorage.getItem('mealPlan');
    const mealPlan = stored ? JSON.parse(stored) : [];
    mealPlan.push(food);
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));

    setShowConfirm(false);
    setShowSuccess(true);
  };

  const handleGoToMealPlan = () => {
    navigate('/meal-plan'); // 👉 chỉnh nếu route bạn đặt khác
  };

  const handleBack = () => {
    navigate(-1); // 👉 quay lại trang trước đó
  };

  if (!food) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>No food data provided.</div>;
  }

  return (
    <>
      <DietHeader />
      <div style={{
        maxWidth: '900px',
        margin: '40px auto',
        padding: '30px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        {/* 🔙 Nút Back */}
        <button
          onClick={handleBack}
          style={{
            marginBottom: '20px',
            backgroundColor: '#fca311',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
        Back
        </button>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{
            width: '300px',
            height: '300px',
            backgroundColor: '#eee',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: '#aaa',
            fontWeight: 'bold'
          }}>
            image
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>{food.name}</h2>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>
              <strong>Calories:</strong> {food.calories} kcal
            </p>
            <p><strong>Protein:</strong> {food.protein}g</p>
            <p><strong>Fat:</strong> {food.fat}g</p>
            <p><strong>Carbs:</strong> {food.carbs}g</p>

            <button
              onClick={handleAddClick}
              style={{
                marginTop: '20px',
                backgroundColor: '#f9a825',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '24px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Add to Meal Plan
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Popup */}
      {showConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '16px',
            width: '90%', maxWidth: '400px', textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>Confirm Add Popup</h2>
            <p>Are you sure you’d like to add this dish to your meal plan?</p>
            <p>By including it you’ll get the exact calories and nutrients tracked for your daily goals.</p>
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={handleConfirmYes}
                style={{
                  backgroundColor: '#f9a825', color: '#fff',
                  border: 'none', padding: '10px 24px',
                  borderRadius: '20px', marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                YES
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  backgroundColor: '#fca311', color: '#fff',
                  border: 'none', padding: '10px 24px',
                  borderRadius: '20px', marginLeft: '10px',
                  cursor: 'pointer'
                }}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '16px',
            width: '90%', maxWidth: '400px', textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>Success</h2>
            <p>Your selected dish has been added to your meal plan.</p>
            <p>You can now track its calories, protein, carbs, and fats as part of your daily nutrition goals.</p>
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={handleGoToMealPlan}
                style={{
                  backgroundColor: '#f9a825', color: '#fff',
                  border: 'none', padding: '10px 24px',
                  borderRadius: '20px', marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                VIEW MEAL PLAN
              </button>
              <button
                onClick={() => setShowSuccess(false)}
                style={{
                  backgroundColor: '#fca311', color: '#fff',
                  border: 'none', padding: '10px 24px',
                  borderRadius: '20px', marginLeft: '10px',
                  cursor: 'pointer'
                }}
              >
                BACK TO SEARCH
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodDetailPage;


