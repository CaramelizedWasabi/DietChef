// src/pages/FoodInfoPage.jsx
// 음식 검색 및 목록을 보여주는 메인 페이지
import React, { useState } from 'react';
import { searchFoods } from '../services/foodService';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // 검색 아이콘

const FoodInfoPage = () => {
  // 상태 관리
  const [query, setQuery] = useState(''); // 검색어
  const [foods, setFoods] = useState([]); // 검색된 음식 목록
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [imageUrls, setImageUrls] = useState({}); // 음식별 이미지 URL 저장

  // Unsplash API에서 음식 이미지를 가져오는 함수
  const fetchUnsplashImage = async (foodName) => {
    try {
      // 환경변수에서 Unsplash API 키 가져오기
      const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
      console.log('🔑 API Key 확인:', accessKey ? '있음' : '없음');
      
      if (!accessKey) {
        console.warn('Unsplash API key not found');
        return null;
      }

      // 검색 쿼리 생성 (음식이름 + 'food' 키워드)
      const query = encodeURIComponent(foodName + ' food');
      const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${accessKey}`;
      console.log('요청 URL:', url);

      // Unsplash API 호출
      const response = await fetch(url);
      console.log('응답 상태:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('응답 데이터:', data);
        // 첫 번째 이미지의 small 크기 URL 반환
        const imageUrl = data.results[0]?.urls?.small || null;
        console.log('이미지 URL:', imageUrl);
        return imageUrl;
      } else {
        console.error('API 응답 실패:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching Unsplash image:', error);
    }
    return null;
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

  // 검색 버튼 클릭 처리 함수
  const handleSearch = async () => {
    if (!query.trim()) return; // 검색어가 비어있으면 리턴
    setLoading(true); // 로딩 시작
    
    try {
      console.log('검색 시작:', query);
      // CalorieNinjas API로 음식 영양 정보 검색
      const results = await searchFoods(query);
      console.log('음식 검색 결과:', results);
      setFoods(results);
      
      // 각 음식에 대해 Unsplash에서 이미지 가져오기
      console.log('이미지 검색 시작...');
      const newImageUrls = {};
      for (const food of results) {
        console.log(`${food.name} 이미지 검색 중...`);
        const imageUrl = await fetchUnsplashImage(food.name);
        newImageUrls[food.name] = imageUrl;
        console.log(`${food.name} 이미지:`, imageUrl || '없음');
      }
      console.log('모든 이미지 URL:', newImageUrls);
      setImageUrls(newImageUrls);
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // Enter 키 입력 처리 함수
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Enter 키 누르면 검색 실행
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: 'auto' }}>
      {/* 페이지 제목 */}
      <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
        Search foods or ingredients
      </h1>

      {/* 검색 바 영역 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '600px',
          borderRadius: '999px',
          backgroundColor: '#fca311', // 주황색 배경
          padding: '5px 10px',
          alignItems: 'center'
        }}>
          {/* 검색 입력 필드 */}
          <input
            type="text"
            placeholder="egg, chicken, beef, banana..." // 플레이스홀더 텍스트
            value={query}
            onChange={(e) => setQuery(e.target.value)} // 입력값 상태 업데이트
            onKeyDown={handleKeyDown} // Enter 키 처리
            style={{
              flex: 1,
              border: 'none',
              padding: '10px 16px',
              borderRadius: '999px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: 'transparent', // 투명 배경
              color: '#fff', // 흰색 글자
              fontWeight: 'bold'
            }}
          />
          {/* 검색 버튼 */}
          <button onClick={handleSearch} style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            padding: '6px',
            cursor: 'pointer'
          }}>
            <FaSearch /> {/* 검색 아이콘 */}
          </button>
        </div>
      </div>

      {/* 로딩 및 검색 결과 없음 메시지 */}
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      {!loading && foods.length === 0 && query && <p style={{ textAlign: 'center' }}>No results</p>}

      {/* 검색 결과 목록 */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap', // 여러 줄로 배치
        gap: '20px',
        justifyContent: 'center'
      }}>
        {foods.map((food) => (
          // 각 음식 카드
          <div key={food.food_id || food.id} style={{
            width: '160px',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            padding: '16px',
            backgroundColor: '#fff',
            textAlign: 'center'
          }}>
            {/* 음식 이미지 영역 */}
            <div style={{
              width: '100%',
              height: '100px',
              backgroundColor: '#f8f8f8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              marginBottom: '12px',
              overflow: 'hidden'
            }}>
              {/* Unsplash에서 가져온 실제 이미지 */}
              {imageUrls[food.name] ? (
                <img 
                  src={imageUrls[food.name]} 
                  alt={food.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover' // 이미지 비율 유지하며 꽉 채우기
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
                display: imageUrls[food.name] ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}>
                {getFoodEmoji(food.name)}
              </div>
            </div>
            
            {/* 음식 이름 */}
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{food.name}</div>
            {/* 칼로리 정보 */}
            <div style={{ fontSize: '14px', color: '#555' }}>{food.calories} kcal</div>
            
            {/* 상세 정보 보기 링크 */}
            <Link
              to="/food-detail" // FoodDetailPage로 이동
              state={{ 
                food: {
                  ...food,
                  imageUrl: imageUrls[food.name] // 이미지 URL도 함께 전달
                }
              }}
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
              more {/* "더보기" 버튼 */}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodInfoPage;