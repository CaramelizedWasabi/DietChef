// src/components/ErrorMessage.jsx
import React from 'react';

/**
 * 에러 메시지 컴포넌트
 */
const ErrorMessage = ({ error, clearError }) => {
  if (!error) return null;

  // 스타일 정의
  const styles = {
    errorMessage: {
      color: '#d9534f',
      textAlign: 'center',
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '#f8d7da',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#d9534f',
      fontSize: '20px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.errorMessage}>
      {error}
      <button 
        style={styles.closeButton} 
        onClick={clearError} 
        aria-label="Close error message"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorMessage;