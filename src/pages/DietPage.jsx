/* src/pages/DietPage.jsx */
/* 식단 추천 기능 페이지 구성, 로그인하면 가장 먼저 보이는 화면 */

// React 라이브러리에서 필요한 함수들을 가져옴
// useEffect: 컴포넌트가 렌더링된 후 실행할 코드를 정의하는 Hook
// useState: 컴포넌트의 상태를 관리하는 Hook
// useCallback: 함수를 메모이제이션하여 성능 최적화하는 Hook
import React, { useEffect, useState, useCallback } from 'react';

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
import { ref, get, set } from 'firebase/database';

// Firebase 설정 파일에서 데이터베이스 객체를 가져옴
import { db } from '../firebase';

// 다른 컴포넌트들을 가져옴
import DietHeader from '../components/DietHeader'; // 상단 헤더 컴포넌트
import Footer from '../components/Footer'; // 하단 푸터 컴포넌트

// CSS 스타일 파일을 가져옴
import './DietPage.css';

// 식단 페이지 메인 컴포넌트 정의
const DietPage = () => {
  // 페이지 이동을 위한 navigate 함수 생성
  const navigate = useNavigate();
  
  // === 컴포넌트의 상태(state) 변수들 정의 ===
  
  // 현재 선택된 식사 종류 (아침, 점심, 저녁 중 하나)
  const [currentMeal, setCurrentMeal] = useState('breakfast');
  
  // Firebase에서 가져온 식단 데이터를 저장하는 상태
  const [mealData, setMealData] = useState(null);
  
  // 데이터 로딩 중인지 확인하는 상태 (false로 초기화)
  const [loading, setLoading] = useState(false);
  
  // 사용자 정보를 저장하는 상태 (프로필, 설문 결과 등)
  const [userData, setUserData] = useState(null);
  
  // 식단 표시 여부를 결정하는 상태
  const [showMealPlan, setShowMealPlan] = useState(false);

  // === 유틸리티 함수들 정의 ===

  /* (recipe_data.json 참고) 사용자상태(마름/보통/보통이상- BMI로 계산) * 목표(감량/유지/증량) * 운동량(적음/많음 - 4시간 기준으로 정함) = 18가지 케이스
      해당 18가지 케이스 중에서 사용자가 해당하는 케이스를 사용자 정보를 불러와서 찾고, 해당 케이스의 추천 식단을 출력.
      이때 각 18가지 케이스 * 아침점심저녁 레시피 각각 3개씩 = 162가지의 레시피를 준비함. 이 중 랜덤으로 아침, 점심, 저녁별로 뽑음.
      하지만 하루종일 유지되게 구현. */

  // BMI(체질량지수) 계산 및 분류 함수
  const calculateBMICategory = useCallback((height, weight) =>{
    // 키를 미터 단위로 변환 (cm -> m)
    const heightInM = height / 100;
    
    // BMI 계산 공식: 체중(kg) / (키(m) * 키(m))
    const bmi = weight / (heightInM * heightInM);
    
    // BMI 수치에 따른 분류
    if (bmi < 18.5) return 'underweight';  // 저체중
    if (bmi < 25) return 'normal';         // 정상체중
    return 'overweight';                   // 과체중
  },[]);

  // 사용자의 식단 카테고리 결정 함수
  // 사용자의 BMI, 목표, 운동량을 종합하여 맞춤형 식단 카테고리를 결정
  const getUserMealCategory = useCallback((userData) => {
    // BMI 분류 결과 가져오기
    const bmiCategory = calculateBMICategory(userData.height, userData.weight);
    
    // 다양한 필드명 가능성 체크 (중첩 객체 포함)
    // Firebase 데이터 구조가 다를 수 있으므로 여러 가능성을 확인
    let goal = userData.dietGoal ||           // 기본 필드
               userData.goal ||               // 대체 필드1
               userData.survey?.dietGoal ||   // 중첩 객체 내 필드1
               userData.survey?.goal ||       // 중첩 객체 내 필드2
               userData.dietType ||           // 대체 필드2
               userData.objective;            // 대체 필드3
    
    // Firebase에서는 loss가 아니라 lose로 저장되어 있을 수 있음
    if (goal === 'loss') {
      goal = 'lose';
    }
    
    // 다양한 운동시간 필드명 가능성 체크 (중첩 객체 포함)
    const exerciseHours = userData.exerciseHours ||           // 기본 필드
                         userData.survey?.exerciseHours ||    // 중첩 객체 내 필드1
                         userData.exercise_hours ||           // 언더스코어 표기법
                         userData.survey?.exercise_hours ||   // 중첩 언더스코어 표기법
                         userData.workoutHours ||             // 대체 필드1
                         userData.activityHours ||            // 대체 필드2
                         0;                                   // 기본값
    
    // 운동량에 따른 분류 (4시간 이상이면 고강도, 미만이면 저강도)
    const exerciseLevel = exerciseHours >= 4 ? 'high_exercise' : 'low_exercise';
    
    // 디버깅을 위한 콘솔 출력들
    console.log("User data:", userData);
    console.log("All user data keys:", Object.keys(userData));
    console.log("Survey data:", userData.survey);
    console.log("BMI Category:", bmiCategory);
    console.log("Diet Goal:", goal);
    console.log("Exercise Hours:", exerciseHours);
    console.log("Exercise Level:", exerciseLevel);
    
    // 최종 카테고리 조합: BMI_목표_운동량 형태로 생성
    const category = `${bmiCategory}_${goal}_${exerciseLevel}`;
    console.log("Final category:", category);
    
    return category;
  }, [calculateBMICategory]); 

  // 오늘 날짜 기준으로 랜덤 레시피 선택 함수
  // 하루 종일 동일한 레시피가 나오도록 날짜 기반 해시 사용
  const getTodayRandomRecipe = (recipes) => {
    // 오늘 날짜를 문자열로 변환
    const today = new Date().toDateString();
    
    // 날짜 문자열로부터 해시값 생성 (동일한 날짜는 항상 같은 해시값)
    const hash = today.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);  // 문자열 해시 알고리즘
      return a & a;  // 32비트 정수로 변환
    }, 0);
    
    // 레시피 키 배열 생성
    const recipeKeys = Object.keys(recipes);
    
    // 해시값을 레시피 개수로 나눈 나머지로 인덱스 결정
    const index = Math.abs(hash) % recipeKeys.length;
    
    // 선택된 레시피 반환
    return recipes[recipeKeys[index]];
  };

  // 사용자 진행 상태 확인 함수
  // 프로필 작성 완료 여부와 설문 완료 여부를 확인
  const checkUserProgress = async (uid) => {
    try {
      // Firebase에서 사용자 데이터 참조
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);
     
      if (snapshot.exists()) {
        // 사용자 데이터가 존재하는 경우
        const userData = snapshot.val();
        return {
          hasProfile: Boolean(userData.profileCompleted),  // 프로필 완료 여부
          hasSurvey: Boolean(userData.surveyCompleted),    // 설문 완료 여부
          userData: userData                               // 사용자 데이터
        };
      }
      
      // 사용자 데이터가 없는 경우 기본값 반환
      return { hasProfile: false, hasSurvey: false, userData: null };
    } catch (error) {
      console.error("Error checking user progress:", error);
      return { hasProfile: false, hasSurvey: false, userData: null };
    }
  };

  // 식단 데이터 로드 함수
  // 사용자가 식단을 보려고 할 때만 실행되도록 useCallback으로 최적화
  const loadMealData = useCallback(async () => {
    // 사용자 데이터가 없으면 함수 종료
    if (!userData) return;
    
    // 로딩 상태 시작
    setLoading(true);
    
    try {
      // 사용자에게 맞는 식단 카테고리 결정
      const userCategory = getUserMealCategory(userData);
      console.log("Loading meal data for category:", userCategory);
      
      // Firebase에서 해당 카테고리의 식단 데이터 참조
      const mealRef = ref(db, `meal_plans/${userCategory}`);
      const snapshot = await get(mealRef);
      
      console.log("Firebase snapshot exists:", snapshot.exists());
      console.log("Firebase snapshot data:", snapshot.val());
      
      if (snapshot.exists()) {
        // 식단 데이터가 존재하는 경우
        const mealPlans = snapshot.val();
        console.log("Meal plans data:", mealPlans);
        
        const processedMealData = {};
        
        // 각 식사 시간별로 랜덤 레시피 선택
        ['breakfast', 'lunch', 'dinner'].forEach(mealTime => {
          if (mealPlans[mealTime]) {
            console.log(`Processing ${mealTime}:`, mealPlans[mealTime]);
            // 오늘 날짜 기준으로 해당 식사의 레시피 선택
            processedMealData[mealTime] = getTodayRandomRecipe(mealPlans[mealTime]);
          } else {
            console.log(`No data found for ${mealTime}`);
          }
        });
        
        console.log("Processed meal data:", processedMealData);
        setMealData(processedMealData);
      } else {
        // 해당 카테고리의 데이터가 없는 경우 대체 카테고리 시도
        console.log("No meal plans found for category:", userCategory);
        
        // 실제 존재하는 대체 카테고리들
        const alternativeCategories = [
          'normal_gain_high_exercise',
          'normal_maintain_low_exercise', 
          'underweight_gain_high_exercise',
          'overweight_loss_low_exercise',
          'overweight_maintain_high_exercise'
        ];
        
        let foundData = false;
        
        // 대체 카테고리들을 순차적으로 시도
        for (const altCategory of alternativeCategories) {
          console.log("Trying alternative category:", altCategory);
          const altRef = ref(db, `meal_plans/${altCategory}`);
          const altSnapshot = await get(altRef);
          
          if (altSnapshot.exists()) {
            console.log("Found data in alternative category:", altCategory);
            const altMealPlans = altSnapshot.val();
            const processedMealData = {};
            
            // 대체 카테고리 데이터로 식단 구성
            ['breakfast', 'lunch', 'dinner'].forEach(mealTime => {
              if (altMealPlans[mealTime]) {
                processedMealData[mealTime] = getTodayRandomRecipe(altMealPlans[mealTime]);
              }
            });
            
            setMealData(processedMealData);
            foundData = true;
            break;  // 데이터를 찾았으므로 루프 종료
          }
        }
        
        if (!foundData) {
          // 모든 카테고리에서 데이터를 찾지 못한 경우 기본 데이터 사용
          console.log("Using default data");
          setMealData({
            breakfast: {
              food: "Default Breakfast",
              kcal: 350,
              reason_why_we_recommend: "Balanced meal to start your day",
              ingredients: ["Oats", "Banana", "Milk"],
              how_to_make: ["Mix ingredients", "Heat if desired", "Enjoy"]
            },
            lunch: {
              food: "Default Lunch",
              kcal: 450,
              reason_why_we_recommend: "Nutritious midday meal",
              ingredients: ["Rice", "Vegetables", "Protein"],
              how_to_make: ["Cook rice", "Prepare vegetables", "Combine and serve"]
            },
            dinner: {
              food: "Default Dinner",
              kcal: 400,
              reason_why_we_recommend: "Light evening meal",
              ingredients: ["Salad", "Lean protein", "Dressing"],
              how_to_make: ["Prepare salad", "Cook protein", "Mix and serve"]
            }
          });
        }
      }
    } catch (error) {
      console.error("Error loading meal data:", error);
      console.error("Error details:", error.message);
    } finally {
      // 성공/실패 관계없이 로딩 상태 종료
      setLoading(false);
    }
  }, [userData, getUserMealCategory]);  // userData가 변경될 때마다 함수 재생성

  // 식단 표시 토글 함수
  const handleShowMealPlan = () => {
    // 식단 데이터가 없고 사용자 데이터가 있으면 식단 로드
    if (!mealData && userData) {
      loadMealData();
    }
    // 식단 표시 상태를 true로 변경
    setShowMealPlan(true);
  };

  // 레시피 저장 함수
  // 사용자가 마음에 드는 레시피를 개인 레시피북에 저장
  const saveRecipe = async (recipe, mealType) => {
    try {
      // Firebase 인증 객체와 현재 사용자 정보 가져오기
      const auth = getAuth();
      const user = auth.currentUser;
      
      // 로그인하지 않은 경우 함수 종료
      if (!user) return;

      // 현재 시간을 ID로 사용하여 고유한 레시피 ID 생성
      const savedRecipeRef = ref(db, `users/${user.uid}/savedRecipes/${Date.now()}`);
      
      // 레시피 데이터를 Firebase에 저장
      await set(savedRecipeRef, {
        ...recipe,                        // 기존 레시피 데이터 복사
        mealType: mealType,              // 식사 종류 추가 (breakfast, lunch, dinner)
        savedAt: new Date().toISOString() // 저장 시간 기록
      });
      
      // 사용자에게 저장 완료 알림
      alert('Recipe successfully saved!');
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert('Failed to save recipe');
    }
  };

  // === useEffect Hook들 ===

  // 인증 상태 변화 감지 및 사용자 진행 상태 확인
  useEffect(() => {
    const auth = getAuth();
    
    // 인증 상태 변화를 감지하는 리스너 등록
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // 로그인하지 않은 경우 홈페이지로 리다이렉트
        navigate("/", { replace: true });
        return;
      }

      try {
        // 사용자의 진행 상태 확인 (프로필, 설문 완료 여부)
        const progress = await checkUserProgress(user.uid);
        
        if (!progress.hasProfile) {
          // 프로필을 작성하지 않았다면 프로필 작성 페이지로 이동
          navigate("/complete-profile", { replace: true });
        } else if (!progress.hasSurvey) {
          // 설문을 완료하지 않았다면 설문 페이지로 이동
          navigate("/survey", { replace: true });
        } else {
          // 모든 조건이 충족된 경우
          setUserData(progress.userData);  // 사용자 데이터 설정
          setShowMealPlan(true);          // 식단 표시 활성화
        }
      } catch (error) {
        console.error("사용자 진행 상태 확인 오류:", error);
      }
    });

    // 컴포넌트 언마운트 시 인증 상태 변화 리스너 제거
    return () => unsubscribe();
  }, [navigate]);

  // 뒤로가기 방지 기능
  useEffect(() => {
    // 뒤로가기 버튼을 눌렀을 때 실행되는 함수
    const preventBackNavigation = (e) => {
      // 현재 페이지를 브라우저 히스토리에 다시 푸시 (뒤로가기 방지)
      window.history.pushState(null, null, window.location.pathname);
      e.preventDefault();  // 브라우저의 기본 뒤로가기 동작 방지
    };

    // 처음 페이지 로드 시 현재 상태를 히스토리에 푸시
    window.history.pushState(null, null, window.location.pathname);
    
    // popstate 이벤트 리스너 추가 (뒤로가기 버튼 감지)
    window.addEventListener('popstate', preventBackNavigation);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);

  // userData가 설정되면 자동으로 식단 로드
  useEffect(() => {
    if (userData && showMealPlan && !mealData) {
      loadMealData();  // 식단 데이터 로드 함수 실행
    }
  }, [userData, showMealPlan, mealData, loadMealData]);

  // === 렌더링 부분 ===

  // 로딩 중일 때 보여줄 화면
  if (loading) {
    return (
      <div className="diet-page-container">
        <DietHeader />
        <div className="diet-page-content">
          <div className="loading">Page loading ...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // 식단이 로드되지 않은 경우 기본 페이지 렌더링
  if (!showMealPlan || !userData) {
    return (
      <div className="diet-page-container">
        <DietHeader />
        <div className="diet-page-content">
          <h1>Page for your personalized diet</h1>
          <p>Page loading after logging in</p>
          <button 
            className="show-meal-plan-btn"
            onClick={handleShowMealPlan}  // 클릭 시 식단 로드 및 표시
          >
            오늘의 식단 보기
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // 메인 식단 추천 페이지 렌더링
  return (
    <div className="diet-page-container">
      <DietHeader />
      <div className="diet-page-content">
        <h1>We prepared today's meal plan just for you</h1>
        
        {/* 식사 카드 캐러셀 - 3개의 카드(점심, 아침, 저녁)가 회전하며 표시 */}
        <div className="meal-carousel">
          
          {/* 점심 카드 */}
          <div 
            className={`meal-card ${currentMeal === 'lunch' ? 'active' : 'side left'}`}
            onClick={() => setCurrentMeal('lunch')}  // 클릭 시 점심으로 전환
          >
            <h3>Lunch</h3>
            {/* 현재 선택된 식사가 점심이고 데이터가 있는 경우 상세 정보 표시 */}
            {currentMeal === 'lunch' && mealData?.lunch && (
              <div className="meal-details">
                {/* 음식 이름 */}
                <div className="meal-title">{mealData.lunch.food}</div>
                {/* 칼로리 정보 */}
                <div className="meal-calories">{mealData.lunch.kcal} kcal</div>
                
                {/* 추천 이유 */}
                <div className="meal-reason">
                  <span className="reason-dot">●</span>
                  <span>{mealData.lunch.reason_why_we_recommend}</span>
                </div>
                
                {/* 재료 목록 - 배열인지 문자열인지 확인 후 적절히 표시 */}
                <div className="meal-ingredients">
                  <span className="ingredients-dot">●</span>
                  <span>{Array.isArray(mealData.lunch.ingredients) 
                    ? mealData.lunch.ingredients.join(', ')  // 배열이면 쉼표로 연결, 문자열이면 그대로 표시
                    : mealData.lunch.ingredients}           
                  </span>
                </div>
                
                {/* 조리법 - 배열인지 문자열인지 확인 후 적절히 표시 */}
                <div className="meal-instructions">
                  <span className="instructions-dot">●</span>
                  <div className="instructions-list">
                    {Array.isArray(mealData.lunch.how_to_make) 
                      ? mealData.lunch.how_to_make.map((step, index) => (
                          <div key={index}>{step}</div>  // 배열이면 각 단계를 별도 div로 표시
                        ))
                      : <div>{mealData.lunch.how_to_make}</div>  // 문자열이면 하나의 div로 표시
                    }
                  </div>
                </div>
                
                {/* 액션 버튼들 */}
                <div className="meal-actions">
                  {/* 저장 버튼 */}
                  <button 
                    className="save-btn"
                    onClick={(e) => {
                      e.stopPropagation();  // 카드 클릭 이벤트 전파 방지
                      saveRecipe(mealData.lunch, 'lunch');  // 점심 레시피 저장
                    }}
                  >
                    Save
                  </button>
                  {/* 레시피북 버튼 */}
                  <button 
                    className="recipe-book-btn"
                    onClick={(e) => {
                      e.stopPropagation();  // 카드 클릭 이벤트 전파 방지
                      navigate('/recipe-book');  // 레시피북 페이지로 이동
                    }}
                  >
                    My recipe book
                  </button>
                </div>
              </div>
            )}
            {/* 점심이 선택되지 않은 경우 간단한 미리보기만 표시 */}
            {currentMeal !== 'lunch' && (
              <div className="meal-preview">
                {mealData?.lunch?.food || 'Loading...'}
              </div>
            )}
          </div>

          {/* 아침 카드 (기본적으로 메인으로 표시) */}
          <div 
            className={`meal-card ${currentMeal === 'breakfast' ? 'active' : currentMeal === 'lunch' ? 'side right' : 'side left'}`}
            onClick={() => setCurrentMeal('breakfast')}  // 클릭 시 아침으로 전환
          >
            <h3>Breakfast</h3>
            {/* 현재 선택된 식사가 아침이고 데이터가 있는 경우 상세 정보 표시 */}
            {currentMeal === 'breakfast' && mealData?.breakfast && (
              <div className="meal-details">
                <div className="meal-title">{mealData.breakfast.food}</div>
                <div className="meal-calories">{mealData.breakfast.kcal} kcal</div>
                
                <div className="meal-reason">
                  <span className="reason-dot">●</span>
                  <span>{mealData.breakfast.reason_why_we_recommend}</span>
                </div>
                
                <div className="meal-ingredients">
                  <span className="ingredients-dot">●</span>
                  <span>{Array.isArray(mealData.breakfast.ingredients)
                    ? mealData.breakfast.ingredients.join(', ')
                    : mealData.breakfast.ingredients}</span>
                </div>
                
                <div className="meal-instructions">
                  <span className="instructions-dot">●</span>
                  <div className="instructions-list">
                    {Array.isArray(mealData.breakfast.how_to_make)
                      ? mealData.breakfast.how_to_make.map((step, index) => (
                          <div key={index}>{step}</div>
                        ))
                      : <div>{mealData.breakfast.how_to_make}</div>
                    }
                  </div>
                </div>
                
                <div className="meal-actions">
                  <button 
                    className="save-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      saveRecipe(mealData.breakfast, 'breakfast');
                    }}
                  >
                    Save
                  </button>
                  <button 
                    className="recipe-book-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/recipe-book');
                    }}
                  >
                    My recipe book
                  </button>
                </div>
              </div>
            )}
            {/* 아침이 선택되지 않은 경우 간단한 미리보기만 표시 */}
            {currentMeal !== 'breakfast' && (
              <div className="meal-preview">
                {mealData?.breakfast?.food || 'Loading...'}
              </div>
            )}
          </div>

          {/* 저녁 카드 */}
          <div 
            className={`meal-card ${currentMeal === 'dinner' ? 'active' : 'side right'}`}
            onClick={() => setCurrentMeal('dinner')}  // 클릭 시 저녁으로 전환
          >
            <h3>Dinner</h3>
            {/* 현재 선택된 식사가 저녁이고 데이터가 있는 경우 상세 정보 표시 */}
            {currentMeal === 'dinner' && mealData?.dinner && (
              <div className="meal-details">
                <div className="meal-title">{mealData.dinner.food}</div>
                <div className="meal-calories">{mealData.dinner.kcal} kcal</div>
                
                <div className="meal-reason">
                  <span className="reason-dot">●</span>
                  <span>{mealData.dinner.reason_why_we_recommend}</span>
                </div>
                
                <div className="meal-ingredients">
                  <span className="ingredients-dot">●</span>
                  <span>{Array.isArray(mealData.dinner.ingredients)
                    ? mealData.dinner.ingredients.join(', ')
                    : mealData.dinner.ingredients}</span>
                </div>
                
                {/* 조리법 - 배열인지 문자열인지 확인 후 적절히 표시 */}
                <div className="meal-instructions">
                  <span className="instructions-dot">●</span>
                  <div className="instructions-list">
                    {Array.isArray(mealData.dinner.how_to_make)
                      ? mealData.dinner.how_to_make.map((step, index) => (
                          <div key={index}>{step}</div>  // 배열이면 각 단계를 별도 div로 표시
                        ))
                      : <div>{mealData.dinner.how_to_make}</div>  // 문자열이면 하나의 div로 표시
                    }
                  </div>
                </div>
                
                {/* 액션 버튼들 */}
                <div className="meal-actions">
                  {/* 저장 버튼 */}
                  <button 
                    className="save-btn"
                    onClick={(e) => {
                      e.stopPropagation();  // 카드 클릭 이벤트 전파 방지
                      saveRecipe(mealData.dinner, 'dinner');  // 저녁 레시피 저장
                    }}
                  >
                    Save
                  </button>
                  {/* 레시피북 버튼 */}
                  <button 
                    className="recipe-book-btn"
                    onClick={(e) => {
                      e.stopPropagation();  // 카드 클릭 이벤트 전파 방지
                      navigate('/recipe-book');  // 레시피북 페이지로 이동
                    }}
                  >
                    My recipe book
                  </button>
                </div>
              </div>
            )}
            {/* 저녁이 선택되지 않은 경우 간단한 미리보기만 표시 */}
            {currentMeal !== 'dinner' && (
              <div className="meal-preview">
                {mealData?.dinner?.food || 'Loading...'}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
};

export default DietPage;