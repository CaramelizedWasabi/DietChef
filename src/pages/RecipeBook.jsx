/* src/pages/RecipeBook.jsx */
/* 레시피북 페이지 - 저장된 레시피들을 관리하는 페이지 */

// React 라이브러리에서 필요한 함수들을 가져옴
// useState: 컴포넌트의 상태를 관리하는 Hook
// useEffect: 컴포넌트가 렌더링된 후 실행할 코드를 정의하는 Hook
import React, { useState, useEffect } from 'react';

// 페이지 이동을 위한 React Router의 Hook
import { useNavigate } from 'react-router-dom';

// Firebase 인증 관련 함수들
// getAuth: Firebase 인증 객체를 가져오는 함수
// onAuthStateChanged: 사용자 로그인/로그아웃 상태 변화를 감지하는 함수
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Firebase 실시간 데이터베이스 관련 함수들
// ref: 데이터베이스의 특정 경로를 참조하는 함수
// get: 데이터를 읽어오는 함수
// set: 데이터를 저장하는 함수  
// remove: 데이터를 삭제하는 함수
import { ref, get, set, remove } from 'firebase/database';

// Firebase 설정 파일에서 데이터베이스 객체를 가져옴
import { db } from '../firebase';

// 다른 컴포넌트들을 가져옴
import DietHeader from '../components/DietHeader'; // 상단 헤더 컴포넌트
import Footer from '../components/Footer'; // 하단 푸터 컴포넌트

// CSS 스타일 파일을 가져옴
import './RecipeBook.css';

// 레시피북 메인 컴포넌트 정의
const RecipeBook = () => {
  // 페이지 이동을 위한 navigate 함수 생성
  const navigate = useNavigate();
  
  // === 컴포넌트의 상태(state) 변수들 정의 ===
  
  // 저장된 레시피 목록을 저장하는 상태 (빈 배열로 초기화)
  const [recipes, setRecipes] = useState([]);
  
  // 데이터 로딩 중인지 확인하는 상태 (true로 초기화)
  const [loading, setLoading] = useState(true);
  
  // 현재 선택된 레시피 정보를 저장하는 상태 (null로 초기화)
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  // 레시피 상세보기 모달창 표시 여부 (false로 초기화)
  const [showModal, setShowModal] = useState(false);
  
  // 새 레시피 추가 모달창 표시 여부 (false로 초기화)
  const [showAddModal, setShowAddModal] = useState(false);
  
  // 편집 모드 활성화 여부 (false로 초기화)
  const [editMode, setEditMode] = useState(false);
  
  // 새 레시피 추가용 상태 - 빈 객체로 초기화
  const [newRecipe, setNewRecipe] = useState({
    food: '',                      // 음식 이름
    reason_why_we_recommend: '',   // 추천 이유
    ingredients: '',               // 재료 목록
    how_to_make: '',              // 조리 방법
    kcal: 0                       // 칼로리
  });

  // 편집용 상태 - 기존 레시피를 수정할 때 사용 (빈 객체로 초기화)
  const [editRecipe, setEditRecipe] = useState({});

  // === 함수들 정의 ===
  
  // Firebase에서 저장된 레시피들을 불러오는 비동기 함수
  const loadSavedRecipes = async () => {
    try {
      // Firebase 인증 객체 가져오기
      const auth = getAuth();
      // 현재 로그인한 사용자 정보 가져오기
      const user = auth.currentUser;
      
      // 사용자가 로그인하지 않은 경우 함수 종료
      if (!user) return;

      // Firebase 데이터베이스의 해당 사용자 레시피 경로 참조
      // 경로: users/사용자ID/savedRecipes
      const recipesRef = ref(db, `users/${user.uid}/savedRecipes`);
      
      // 해당 경로의 데이터를 읽어옴
      const snapshot = await get(recipesRef);
      
      // 데이터가 존재하는 경우
      if (snapshot.exists()) {
        // 데이터를 JavaScript 객체로 변환
        const recipesData = snapshot.val();
        
        // 객체를 배열로 변환 (각 레시피에 ID 추가)
        // Object.entries()는 [키, 값] 쌍의 배열을 반환
        const recipesArray = Object.entries(recipesData).map(([id, recipe]) => ({
          id,      // 레시피 ID
          ...recipe // 레시피의 모든 속성을 펼쳐서 포함
        }));
        
        // 저장 시간 기준으로 정렬 (최신순)
        // new Date()로 문자열을 날짜 객체로 변환 후 비교
        recipesArray.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        
        // 정렬된 레시피 배열을 상태에 저장
        setRecipes(recipesArray);
      }
    } catch (error) {
      // 오류 발생 시 콘솔에 에러 메시지 출력
      console.error("Error loading recipes:", error);
    } finally {
      // 성공/실패 관계없이 로딩 상태를 false로 변경
      setLoading(false);
    }
  };

  // 레시피를 삭제하는 비동기 함수
  const deleteRecipe = async (recipeId) => {
    try {
      // Firebase 인증 객체와 현재 사용자 정보 가져오기
      const auth = getAuth();
      const user = auth.currentUser;
      
      // 로그인하지 않은 경우 함수 종료
      if (!user) return;

      // 삭제할 레시피의 Firebase 경로 참조
      const recipeRef = ref(db, `users/${user.uid}/savedRecipes/${recipeId}`);
      
      // Firebase에서 해당 레시피 삭제
      await remove(recipeRef);
      
      // 로컬 상태에서도 해당 레시피 제거
      // filter()를 사용해 삭제할 레시피를 제외한 새 배열 생성
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      
      // 모달창들 닫기
      setShowModal(false);
      setSelectedRecipe(null);
      
      // 사용자에게 삭제 완료 알림
      alert('The recipe has been deleted.');
    } catch (error) {
      // 오류 발생 시 콘솔에 에러 메시지 출력
      console.error("Error deleting recipe:", error);
      // 사용자에게 오류 알림
      alert('Failed to delete the recipe.');
    }
  };

  // 편집된 레시피를 저장하는 비동기 함수
  const saveEditedRecipe = async () => {
    try {
      // Firebase 인증 객체와 현재 사용자 정보 가져오기
      const auth = getAuth();
      const user = auth.currentUser;
      
      // 로그인하지 않은 경우 함수 종료
      if (!user) return;

      // 수정할 레시피의 Firebase 경로 참조
      const recipeRef = ref(db, `users/${user.uid}/savedRecipes/${selectedRecipe.id}`);
      
      // 업데이트할 레시피 객체 생성
      const updatedRecipe = {
        ...selectedRecipe,  // 기존 레시피 정보 복사
        ...editRecipe,      // 편집된 정보로 덮어쓰기
        
        // 재료 처리: 배열이면 그대로, 문자열이면 쉼표로 분리하여 배열로 변환
        ingredients: Array.isArray(editRecipe.ingredients) 
          ? editRecipe.ingredients 
          : editRecipe.ingredients.split(',').map(item => item.trim()),
        
        // 조리법 처리: 배열이면 그대로, 문자열이면 줄바꿈으로 분리하여 배열로 변환
        how_to_make: Array.isArray(editRecipe.how_to_make)
          ? editRecipe.how_to_make
          : editRecipe.how_to_make.split('\n').filter(step => step.trim()),
        
        // 칼로리를 정수로 변환 (변환 실패 시 0)
        kcal: parseInt(editRecipe.kcal) || 0,
        
        // 수정 시간 기록
        updatedAt: new Date().toISOString()
      };
      
      // Firebase에 업데이트된 레시피 저장
      await set(recipeRef, updatedRecipe);
      
      // 로컬 상태 업데이트
      // map()을 사용해 해당 레시피만 업데이트된 버전으로 교체
      setRecipes(recipes.map(recipe => 
        recipe.id === selectedRecipe.id ? updatedRecipe : recipe
      ));
      
      // 선택된 레시피 정보도 업데이트
      setSelectedRecipe(updatedRecipe);
      
      // 편집 모드 종료
      setEditMode(false);
      
      // 사용자에게 수정 완료 알림
      alert('Recipe modified successfully.');
    } catch (error) {
      // 오류 발생 시 콘솔에 에러 메시지 출력
      console.error("Error updating recipe:", error);
      // 사용자에게 오류 알림
      alert('Recipe modification failed.');
    }
  };

  // 새 레시피를 추가하는 비동기 함수
  const addNewRecipe = async () => {
    try {
      // Firebase 인증 객체와 현재 사용자 정보 가져오기
      const auth = getAuth();
      const user = auth.currentUser;
      
      // 로그인하지 않은 경우 함수 종료
      if (!user) return;

      // 필수 필드가 모두 입력되었는지 확인
      if (!newRecipe.food || !newRecipe.reason_why_we_recommend || !newRecipe.ingredients || !newRecipe.how_to_make) {
        alert('Please fill in all fields.');
        return;
      }

      // 현재 시간을 ID로 사용 (고유값 보장)
      const recipeId = Date.now().toString();
      
      // 새 레시피의 Firebase 경로 참조
      const recipeRef = ref(db, `users/${user.uid}/savedRecipes/${recipeId}`);
      
      // 저장할 레시피 객체 생성
      const recipeToSave = {
        food: newRecipe.food,  // 음식 이름
        reason_why_we_recommend: newRecipe.reason_why_we_recommend,  // 추천 이유
        
        // 재료를 쉼표로 분리하여 배열로 변환 (앞뒤 공백 제거)
        ingredients: newRecipe.ingredients.split(',').map(item => item.trim()),
        
        // 조리법을 줄바꿈으로 분리하여 배열로 변환 (빈 줄 제거)
        how_to_make: newRecipe.how_to_make.split('\n').filter(step => step.trim()),
        
        // 칼로리를 정수로 변환 (변환 실패 시 0)
        kcal: parseInt(newRecipe.kcal) || 0,
        
        mealType: 'custom',  // 사용자 정의 레시피임을 표시
        savedAt: new Date().toISOString()  // 저장 시간 기록
      };
      
      // Firebase에 새 레시피 저장
      await set(recipeRef, recipeToSave);
      
      // 로컬 상태 업데이트 (새 레시피를 맨 앞에 추가)
      setRecipes([{ id: recipeId, ...recipeToSave }, ...recipes]);
      
      // 모달 닫기
      setShowAddModal(false);
      
      // 입력 폼 초기화
      setNewRecipe({
        food: '',
        reason_why_we_recommend: '',
        ingredients: '',
        how_to_make: '',
        kcal: 0
      });
      
      // 사용자에게 추가 완료 알림
      alert('Recipe successfully added!');
    } catch (error) {
      // 오류 발생 시 콘솔에 에러 메시지 출력
      console.error("Error adding recipe:", error);
      // 사용자에게 오류 알림
      alert('Failed to save recipe');
    }
  };

  // 레시피 카드를 클릭했을 때 실행되는 함수
  const handleRecipeClick = (recipe) => {
    // 클릭한 레시피를 선택된 레시피로 설정
    setSelectedRecipe(recipe);
    
    // 편집용 상태에 레시피 정보 복사
    setEditRecipe({
      food: recipe.food,
      reason_why_we_recommend: recipe.reason_why_we_recommend,
      
      // 재료가 배열이면 쉼표로 연결, 아니면 그대로 사용
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients,
      
      // 조리법이 배열이면 줄바꿈으로 연결, 아니면 그대로 사용
      how_to_make: Array.isArray(recipe.how_to_make) ? recipe.how_to_make.join('\n') : recipe.how_to_make,
      
      // 칼로리 (없으면 0)
      kcal: recipe.kcal || 0
    });
    
    // 상세보기 모달 열기
    setShowModal(true);
    
    // 편집 모드는 비활성화 상태로 시작
    setEditMode(false);
  };

  // 편집 모드를 시작하는 함수
  const startEdit = () => {
    setEditMode(true);
  };

  // 편집을 취소하는 함수
  const cancelEdit = () => {
    // 편집 모드 종료
    setEditMode(false);
    
    // 편집 상태를 원래 레시피 정보로 되돌리기
    setEditRecipe({
      food: selectedRecipe.food,
      reason_why_we_recommend: selectedRecipe.reason_why_we_recommend,
      ingredients: Array.isArray(selectedRecipe.ingredients) ? selectedRecipe.ingredients.join(', ') : selectedRecipe.ingredients,
      how_to_make: Array.isArray(selectedRecipe.how_to_make) ? selectedRecipe.how_to_make.join('\n') : selectedRecipe.how_to_make,
      kcal: selectedRecipe.kcal || 0
    });
  };

  // === useEffect Hook - 컴포넌트가 처음 렌더링될 때 실행 ===
  useEffect(() => {
    // Firebase 인증 객체 가져오기
    const auth = getAuth();
    
    // App.js의 ProtectedRoute에서 이미 인증을 확인했으므로
    // 여기서는 단순히 현재 사용자가 있는지만 확인
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      // 현재 사용자가 있으면 바로 레시피 로드
      loadSavedRecipes();
    } else {
      // 현재 사용자가 없으면 인증 상태 변화를 감지
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // 사용자가 로그인하면 레시피 로드
          await loadSavedRecipes();
        } else {
          // 정말로 로그아웃된 경우에만 리다이렉트
          // 500ms 후에 다시 확인하여 일시적인 상태 변화를 방지
          setTimeout(() => {
            if (!auth.currentUser) {
              // 홈페이지로 이동 (replace: true는 뒤로가기 방지)
              navigate("/", { replace: true });
            }
          }, 500);
        }
      });
      
      // 컴포넌트가 언마운트될 때 리스너 해제
      return () => unsubscribe();
    }
  }, [navigate]); // navigate가 변경될 때마다 useEffect 재실행

  // 로딩 중일 때 보여줄 화면
  if (loading) {
    return (
      <div className="recipe-book-container">
        <DietHeader />
        <div className="recipe-book-content">
          <div className="loading">loading Recipe...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // === 메인 렌더링 부분 ===
  return (
    <div className="recipe-book-container">
      {/* 상단 헤더 */}
      <DietHeader />
      
      <div className="recipe-book-content">
        {/* 레시피북 헤더 영역 */}
        <div className="recipe-book-header">
          <h1>MY RECIPE BOOK</h1>
          {/* 새 레시피 추가 버튼 */}
          <button 
            className="add-recipe-btn"
            onClick={() => setShowAddModal(true)}  // 클릭 시 추가 모달 열기
          >
            Add new recipe
          </button>
        </div>

        {/* 레시피 카드들을 표시하는 그리드 */}
        <div className="recipe-cards-grid">
          {/* 저장된 레시피들을 최대 8개까지 표시 */}
          {recipes.slice(0, 8).map((recipe, index) => (
            <div 
              key={recipe.id}  // React에서 리스트 아이템을 구분하기 위한 고유 키
              className="recipe-card"
              onClick={() => handleRecipeClick(recipe)}  // 클릭 시 상세보기 열기
            >
              <div className="recipe-card-content">
                <h3>{recipe.food}</h3>  {/* 음식 이름 */}
                <div className="recipe-card-calories">
                  {recipe.kcal}Kcal  {/* 칼로리 표시 */}
                </div>
              </div>
            </div>
          ))}
          
          {/* 빈 카드들 (8개까지 채우기) */}
          {/* Array.from()으로 필요한 개수만큼 빈 배열 생성 */}
          {Array.from({ length: Math.max(0, 8 - recipes.length) }).map((_, index) => (
            <div key={`empty-${index}`} className="recipe-card empty">
              <div className="empty-card-content">
                <span>+</span>  {/* 빈 카드 표시 */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 레시피 상세보기/편집 모달 */}
      {showModal && selectedRecipe && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>  {/* 배경 클릭 시 모달 닫기 */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>  {/* 내용 클릭 시 이벤트 전파 방지 */}
            {/* 모달 닫기 버튼 */}
            <button 
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            
            {/* 모달 헤더 - 제목 부분 */}
            <div className="modal-header">
              {editMode ? (
                // 편집 모드일 때: 입력 필드
                <input
                  type="text"
                  value={editRecipe.food}
                  onChange={(e) => setEditRecipe({...editRecipe, food: e.target.value})}  // 값 변경 시 상태 업데이트
                  className="edit-title-input"
                />
              ) : (
                // 보기 모드일 때: 제목 표시
                <h2>{selectedRecipe.food}</h2>
              )}
            </div>

            {/* 모달 본문 */}
            <div className="modal-body">
              {/* 추천 이유 */}
              <div className="recipe-detail-item">
                <div className="detail-dot">●</div>  {/* 점 표시 */}
                <div className="detail-content">
                  {editMode ? (
                    // 편집 모드: 텍스트 영역
                    <textarea
                      placeholder="Why this recipe?"
                      value={editRecipe.reason_why_we_recommend}
                      onChange={(e) => setEditRecipe({...editRecipe, reason_why_we_recommend: e.target.value})}
                      className="edit-textarea"
                    />
                  ) : (
                    // 보기 모드: 텍스트 표시
                    <span>{selectedRecipe.reason_why_we_recommend}</span>
                  )}
                </div>
              </div>

              {/* 재료 목록 */}
              <div className="recipe-detail-item">
                <div className="detail-dot">●</div>
                <div className="detail-content">
                  {editMode ? (
                    // 편집 모드: 텍스트 영역
                    <textarea
                      placeholder="Enter ingredients (comma separated)"
                      value={editRecipe.ingredients}
                      onChange={(e) => setEditRecipe({...editRecipe, ingredients: e.target.value})}
                      className="edit-textarea"
                    />
                  ) : (
                    // 보기 모드: 재료 목록 표시
                    <span>
                      {Array.isArray(selectedRecipe.ingredients) 
                        ? selectedRecipe.ingredients.join(', ')  // 배열이면 쉼표로 연결, 문자열이면 그대로 표시
                        : selectedRecipe.ingredients} 
                    </span>
                  )}
                </div>
              </div>

              {/* 조리 방법 */}
              <div className="recipe-detail-item">
                <div className="detail-dot">●</div>
                <div className="detail-content">
                  {editMode ? (
                    // 편집 모드: 큰 텍스트 영역
                    <textarea
                      placeholder="Enter how to make (one step per line)"
                      value={editRecipe.how_to_make}
                      onChange={(e) => setEditRecipe({...editRecipe, how_to_make: e.target.value})}
                      className="edit-textarea large"
                    />
                  ) : (
                    // 보기 모드: 조리법 단계별 표시
                    <div className="instructions-list">
                      {Array.isArray(selectedRecipe.how_to_make) 
                        ? selectedRecipe.how_to_make.map((step, index) => (
                            <div key={index}>{step}</div>  // 각 단계를 별도 div로 표시, 문자열이면 그대로 표시
                          ))
                        : selectedRecipe.how_to_make} 
                    </div>
                  )}
                </div>
              </div>

              {/* 편집 모드일 때만 칼로리 입력 필드 표시 */}
              {editMode && (
                <div className="recipe-detail-item">
                  <div className="detail-dot">●</div>
                  <div className="detail-content">
                    <div className="input-label">Enter kcal</div>
                    <input
                      type="number"  // 숫자만 입력 가능
                      placeholder="Calories"
                      value={editRecipe.kcal}
                      onChange={(e) => setEditRecipe({...editRecipe, kcal: e.target.value})}
                      className="add-input"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 모달 액션 버튼들 */}
            <div className="modal-actions">
              {editMode ? (
                // 편집 모드일 때: 저장/취소 버튼
                <>
                  <button className="save-btn" onClick={saveEditedRecipe}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={cancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                // 보기 모드일 때: 편집/삭제 버튼
                <>
                  <button className="edit-btn" onClick={startEdit}>
                    Edit
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => {
                      // 삭제 확인 창 표시
                      if (window.confirm('Are you sure you want to delete the recipe? (Cannot be canceled.)')) {
                        deleteRecipe(selectedRecipe.id);
                      }
                    }}
                  >
                    Delete this recipe
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 새 레시피 추가 모달 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>  {/* 배경 클릭 시 모달 닫기 */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>  {/* 내용 클릭 시 이벤트 전파 방지 */}
            {/* 모달 닫기 버튼 */}
            <button 
              className="modal-close"
              onClick={() => setShowAddModal(false)}
            >
              ×
            </button>
            
            {/* 모달 헤더 - 레시피 이름 입력 */}
            <div className="modal-header">
              <input
                type="text"
                placeholder="Enter Recipe Name"
                value={newRecipe.food}
                onChange={(e) => setNewRecipe({...newRecipe, food: e.target.value})}  // 객체 스프레드로 특정 속성만 업데이트
                className="add-title-input"
              />
            </div>

            {/* 모달 본문 */}
            <div className="modal-body">
              {/* 추천 이유 입력 */}
              <div className="recipe-detail-item centered">  {/* centered 클래스로 중앙 정렬 */}
                <div className="detail-content">
                  <textarea
                    placeholder="Why this recipe?"
                    value={newRecipe.reason_why_we_recommend}
                    onChange={(e) => setNewRecipe({...newRecipe, reason_why_we_recommend: e.target.value})}
                    className="add-textarea"
                  />
                </div>
              </div>

              {/* 재료 입력 */}
              <div className="recipe-detail-item centered">
                <div className="detail-content">
                  <textarea
                    placeholder="Enter ingredients"
                    value={newRecipe.ingredients}
                    onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})}
                    className="add-textarea"
                  />
                </div>
              </div>

              {/* 조리 방법 입력 */}
              <div className="recipe-detail-item centered">
                <div className="detail-content">
                  <textarea
                    placeholder="Enter how to make"
                    value={newRecipe.how_to_make}
                    onChange={(e) => setNewRecipe({...newRecipe, how_to_make: e.target.value})}
                    className="add-textarea large"  // large 클래스로 더 큰 텍스트 영역
                  />
                </div>
              </div>

              {/* 칼로리 입력 */}
              <div className="recipe-detail-item centered">
                <div className="detail-content">
                  <div className="input-label">Enter kcal</div>  {/* 입력 필드 라벨 */}
                  <input
                    type="number"  // 숫자만 입력 가능
                    placeholder="Calories"
                    value={newRecipe.kcal}
                    onChange={(e) => setNewRecipe({...newRecipe, kcal: e.target.value})}
                    className="add-input"
                  />
                </div>
              </div>
            </div>

            {/* 모달 액션 버튼 */}
            <div className="modal-actions">
              <button className="save-btn" onClick={addNewRecipe}>
                Save  {/* 저장 버튼 - 클릭 시 addNewRecipe 함수 실행 */}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
};

export default RecipeBook;