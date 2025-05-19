// src/components/AddFoodModal.jsx
import React, { useState } from 'react';

/**
 * 사용자가 직접 음식 정보를 입력할 수 있는 모달 컴포넌트
 */
const AddFoodModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    carbs: '',
    fat: '',
    protein: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 입력값 유효성 검사
    if (!formData.name.trim()) {
      alert('음식 이름을 입력해주세요.');
      return;
    }
    
    // 숫자 필드 변환
    const newFood = {
      name: formData.name,
      calories: parseFloat(formData.calories) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
      protein: parseFloat(formData.protein) || 0,
      id: Date.now() // 임시 ID 생성
    };
    
    onAdd(newFood);
    
    // 폼 초기화
    setFormData({
      name: '',
      calories: '',
      carbs: '',
      fat: '',
      protein: ''
    });
  };

  if (!isOpen) return null;

  // 모달 외부 클릭 시 닫기 방지를 위한 이벤트 핸들러
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // 스타일 정의
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      width: '90%',
      maxWidth: '450px', // 모달 너비 줄임
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      overflow: 'hidden' // 내용이 넘치지 않도록 설정
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#888'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      textAlign: 'center'
    },
    inputGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '8px 10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      fontSize: '16px',
      boxSizing: 'border-box' // 패딩과 테두리를 포함한 크기 설정
    },
    submitButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#f2b84b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '15px'
    },
    rowContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: '15px', // 입력칸 사이의 간격 조정
      marginBottom: '15px'
    },
    column: {
      flex: 1,
      minWidth: 0 // flex 아이템이 컨테이너보다 작아질 수 있게 함
    },
    singleInput: {
      marginBottom: '15px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={handleModalClick}>
        <button style={styles.closeButton} onClick={onClose}>×</button>
        <h2 style={styles.title}>Do you want a manual addition?</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* 이름 입력란 */}
          <div style={styles.singleInput}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter food name"
            />
          </div>
          
          {/* 칼로리와 탄수화물 입력란을 한 줄에 배치 */}
          <div style={styles.rowContainer}>
            <div style={styles.column}>
              <label style={styles.label}>Calories (kcal)</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                style={styles.input}
                placeholder="0"
                min="0"
              />
            </div>
            
            <div style={styles.column}>
              <label style={styles.label}>Carbs (g)</label>
              <input
                type="number"
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                style={styles.input}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
          
          {/* 단백질과 지방 입력란을 한 줄에 배치 */}
          <div style={styles.rowContainer}>
            <div style={styles.column}>
              <label style={styles.label}>Protein (g)</label>
              <input
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                style={styles.input}
                placeholder="0"
                min="0"
              />
            </div>
            
            <div style={styles.column}>
              <label style={styles.label}>Fat (g)</label>
              <input
                type="number"
                name="fat"
                value={formData.fat}
                onChange={handleChange}
                style={styles.input}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
          
          {/* 추가 버튼 */}
          <button type="submit" style={styles.submitButton}>Add</button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodModal;