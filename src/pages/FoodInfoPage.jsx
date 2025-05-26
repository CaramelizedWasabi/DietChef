// src/pages/FoodInfoPage.jsx
import React, { useState } from 'react';
import { searchFoods } from '../services/foodService';
import DietHeader from '../components/DietHeader';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // 👈 thêm icon từ react-icons

const FoodInfoPage = () => {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const results = await searchFoods(query);
    setFoods(results);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <DietHeader />
      <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
          Search foods or ingredients
        </h1>

        {/* Search bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            width: '100%',
            maxWidth: '600px',
            borderRadius: '999px',
            backgroundColor: '#fca311',
            padding: '5px 10px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="egg, chicken, beef, banana..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown} // 👈 thêm Enter
              style={{
                flex: 1,
                border: 'none',
                padding: '10px 16px',
                borderRadius: '999px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'transparent',
                color: '#fff',
                fontWeight: 'bold'
              }}
            />
            <button onClick={handleSearch} style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '18px',
              padding: '6px',
              cursor: 'pointer'
            }}>
              <FaSearch /> {/* 👈 icon thay thế emoji */}
            </button>
          </div>
        </div>

        {/* Loading / No results */}
        {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
        {!loading && foods.length === 0 && <p style={{ textAlign: 'center' }}>No results</p>}

        {/* Search results */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {foods.map((food) => (
            <div key={food.food_id || food.id} style={{
              width: '160px',
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
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{food.name}</div>
              <div style={{ fontSize: '14px', color: '#555' }}>{food.calories} kcal</div>
              <Link
                to="/food-detail"
                state={{ food }}
                style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#f9a825',
                  color: '#fff',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                info...
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FoodInfoPage;
