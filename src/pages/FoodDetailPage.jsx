// src/pages/FoodDetailPage.jsx
// 음식 상세 정보를 보여주는 페이지
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FoodDetailPage = () => {
  // 이전 페이지에서 전달받은 음식 데이터 가져오기
  const location = useLocation();
  const food = location.state?.food;
  const navigate = useNavigate();

  // 뒤로가기 버튼 클릭 처리
  const handleBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  // 음식 이름에 따른 기본 이모지 반환 함수
  const getFoodEmoji = (foodName) => {
    const name = foodName.toLowerCase();
    // 각 음식 종류별로 해당하는 이모지 반환
    if (name.includes('chicken')) return '🍗';
    if (name.includes('beef') || name.includes('steak')) return '🥩';
    if (name.includes('fish') || name.includes('salmon')) return '🐟';
    if (name.includes('banana')) return '🍌';
    if (name.includes('apple')) return '🍎';
    if (name.includes('egg')) return '🥚';
    if (name.includes('bread')) return '🍞';
    if (name.includes('rice')) return '🍚';
    if (name.includes('pasta')) return '🍝';
    if (name.includes('pizza')) return '🍕';
    if (name.includes('burger')) return '🍔';
    if (name.includes('salad')) return '🥗';
    if (name.includes('milk')) return '🥛';
    if (name.includes('cheese')) return '🧀';
    return '🍽️'; // 기본 음식 이모지
  };

  // 음식 데이터가 없으면 에러 메시지 표시
  if (!food) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>No food data provided.</div>;
  }

  return (
    <div style={{
      maxWidth: '900px',
      margin: '40px auto',
      padding: '30px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* 뒤로가기 버튼 */}
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

      {/* 음식 이름 - 맨 위 중앙에 표시 */}
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333'
      }}>
        {food.name}
      </h1>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* 왼쪽 이미지 영역 */}
        <div style={{
          width: '300px',
          height: '300px',
          backgroundColor: '#f8f8f8',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0 // 이미지 크기 고정
        }}>
          {/* Unsplash API에서 가져온 이미지가 있으면 표시 */}
          {food.imageUrl ? (
            <img 
              src={food.imageUrl} 
              alt={food.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                // 이미지 로드 실패시 이모지로 대체
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          {/* 이미지가 없거나 로드 실패시 이모지 표시 */}
          <div style={{
            width: '100%',
            height: '100%',
            display: food.imageUrl ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px'
          }}>
            {getFoodEmoji(food.name)}
          </div>
        </div>

        {/* 오른쪽 영양 정보 영역 */}
        <div style={{ flex: 1 }}>
          {/* 모든 영양 정보를 3x4 그리드로 표시 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', // 3열 그리드
            gap: '8px'
          }}>
            {/* 기본 영양소 4개 */}
            {/* 칼로리 */}
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>Calories</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
                {food.calories}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>kcal</span>
              </div>
            </div>

            {/* 단백질 */}
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>Protein</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
                {food.protein}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>g</span>
              </div>
            </div>

            {/* 탄수화물 */}
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>Carbs</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
                {food.carbs}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>g</span>
              </div>
            </div>

            {/* 지방 */}
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>Fat</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
                {food.fat}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>g</span>
              </div>
            </div>

            {/* 추가 영양 정보들 - API에서 제공되지 않으면 0으로 표시 */}
            {/* 식이섬유 */}
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>Fiber</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
                {food.fiber_g || food.fiber || 0}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>g</span>
              </div>
            </div>

            {/* 당분 */}
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>Sugar</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
                {food.sugar_g || food.sugar || 0}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>g</span>
              </div>
            </div>

            {/* 나트륨 */}
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>Sodium</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
                {food.sodium_mg || food.sodium || 0}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>mg</span>
              </div>
            </div>

            {/* 칼륨 */}
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>Potassium</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
                {food.potassium_mg || food.potassium || 0}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>mg</span>
              </div>
            </div>

            {/* 콜레스테롤 */}
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>Cholesterol</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
                {food.cholesterol_mg || food.cholesterol || 0}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>mg</span>
              </div>
            </div>

            {/* 포화지방 */}
            <div style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#856404', marginBottom: '2px' }}>Saturated Fat</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#856404' }}>
                {food.saturated_fat_g || food.saturated_fat || 0}
                <span style={{ fontSize: '10px', marginLeft: '2px' }}>g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;