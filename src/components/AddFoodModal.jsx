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
      alert('Please enter the name of the food.');
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
      maxWidth: '500px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      position: 'relative'
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
      fontSize: '16px'
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
      marginTop: '10px'
    },
    row: {
      display: 'flex',
      gap: '10px'
    },
    column: {
      flex: 1
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={handleModalClick}>
        <button style={styles.closeButton} onClick={onClose}>×</button>
        <h2 style={styles.title}>Do you want a manual addition?</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Name"
            />
          </div>
          
          <div style={styles.row}>
            <div style={styles.column}>
              <div style={styles.inputGroup}>
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
            </div>
            
            <div style={styles.column}>
              <div style={styles.inputGroup}>
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
          </div>
          
          <div style={styles.inputGroup}>
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
          
          <div style={styles.inputGroup}>
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
          
          <button type="submit" style={styles.submitButton}>Add</button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodModal;