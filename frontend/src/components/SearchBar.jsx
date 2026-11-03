import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MIN_SEARCH_LENGTH = 2;
const MAX_SEARCH_LENGTH = 60;

const SearchBar = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [validationMessage, setValidationMessage] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const cleanKeyword = keyword.trim().replace(/\s+/g, ' ');

    if (!cleanKeyword) {
      setValidationMessage('');
      navigate('/products');
      return;
    }

    if (cleanKeyword.length < MIN_SEARCH_LENGTH) {
      setValidationMessage(`Type at least ${MIN_SEARCH_LENGTH} characters.`);
      return;
    }

    if (cleanKeyword.length > MAX_SEARCH_LENGTH) {
      setValidationMessage(`Search can be ${MAX_SEARCH_LENGTH} characters max.`);
      return;
    }

    setValidationMessage('');
    const params = new URLSearchParams({ search: cleanKeyword });
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="search-bar-wrap">
      <form onSubmit={submitHandler} className="search-form" noValidate>
        <input
          type="search"
          name="q"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (validationMessage) setValidationMessage('');
          }}
          placeholder="Search products"
          className="search-input"
          maxLength={MAX_SEARCH_LENGTH + 10}
          aria-label="Search products"
          aria-invalid={Boolean(validationMessage)}
          aria-describedby={validationMessage ? 'search-validation' : undefined}
        />
        <button type="submit" className="search-btn" aria-label="Submit search">
          Search
        </button>
      </form>
      {validationMessage && (
        <div id="search-validation" className="search-validation" role="alert">
          {validationMessage}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
