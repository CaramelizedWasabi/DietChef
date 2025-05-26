// File: src/pages/MyMealPlanPage.jsx
import React, { useEffect, useState } from 'react';
import DietHeader from '../components/DietHeader';

const MyMealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('myMealPlan');
    if (saved) {
      setMealPlan(JSON.parse(saved));
    }
  }, []);

  return (
    <>
      <DietHeader />
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>
          MY MEAL PLAN
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <button style={{
            padding: '10px 20px',
            borderRadius: '20px',
            backgroundColor: '#fca311',
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
            marginRight: '10px'
          }}>
            ADDED FOODS
          </button>
          <button style={{
            padding: '10px 20px',
            borderRadius: '20px',
            backgroundColor: '#eee',
            color: '#555',
            border: 'none',
            fontWeight: 'bold'
          }}>
            PROGRESS
          </button>
        </div>

        {mealPlan.length === 0 && (
          <p style={{ textAlign: 'center' }}>No foods added yet.</p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '20px'
        }}>
          {mealPlan.map((food, index) => (
            <div key={index} style={{
              borderRadius: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              padding: '16px',
              backgroundColor: '#fff',
              textAlign: 'center'
            }}>
              <div style={{
                width: '100%',
                height: '100px',
                backgroundColor: '#eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                marginBottom: '12px',
                fontWeight: 'bold',
                color: '#aaa'
              }}>
                image
              </div>
              <div style={{ fontWeight: 'bold' }}>{food.name}</div>
              <div style={{ fontSize: '14px', color: '#555' }}>{food.calories} kcal</div>
              <div style={{ fontSize: '12px', color: '#777', marginTop: '4px' }}>
                Protein: {food.protein}g <br />
                Cal: {food.calories} <br />
                Fat: {food.fat}g
              </div>
              <div style={{
                marginTop: '8px',
                backgroundColor: '#fca311',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                infor...
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyMealPlanPage;
