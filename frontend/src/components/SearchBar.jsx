import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Navigates to: /products?search=Cycle
      navigate(`/products?search=${keyword.trim()}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <form onSubmit={submitHandler} style={styles.searchForm}>
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        style={styles.searchInput}
      />
      <button type="submit" style={styles.searchBtn}>
        🔍
      </button>
    </form>
  );
};

const styles = {
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    background: '#f1f5f9',
    borderRadius: '30px',
    padding: '4px 15px',
    marginLeft: '20px',
    width: '100%',
    maxWidth: '300px',
    border: '1px solid #e2e8f0'
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    padding: '8px',
    width: '100%',
    fontSize: '14px'
  },
  searchBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default SearchBar;
