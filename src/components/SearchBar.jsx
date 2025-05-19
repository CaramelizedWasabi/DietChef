// src/components/SearchBar.jsx
import React from 'react';

/**
 * 음식 검색 입력창 컴포넌트
 */
const SearchBar = ({ searchText, setSearchText, handleSearch }) => {
  const styles = {
    searchContainer: {
      display: 'flex',
      maxWidth: '600px',
      margin: '0 auto 10px',
      position: 'relative'
    },
    searchInput: {
      flex: '1',
      padding: '12px 15px',
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRight: 'none',
      borderRadius: '8px 0 0 8px',
      outline: 'none'
    },
    searchButton: {
      padding: '0 20px',
      backgroundColor: '#a9d6a9',
      border: 'none',
      borderRadius: '0 8px 8px 0',
      cursor: 'pointer',
      fontSize: '20px'
    }
  };

  return (
    <div style={styles.searchContainer}>
      <input
        type="text"
        placeholder="Searh"
        style={styles.searchInput}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
        aria-label="Food search"
      />
      <button 
        style={styles.searchButton} 
        onClick={handleSearch}
        aria-label="Search"
      >
        🔍
      </button>
    </div>
  );
};

export default SearchBar;