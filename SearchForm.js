//SearchForm.js
import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [expressway, setExpressway] = useState('');

  const handleSearch = () => {
    onSearch(expressway);
  };

  return (
    <div className="search-form">
      <label>Search by Expressway:</label>
      <input
        type="text"
        value={expressway}
        onChange={(e) => setExpressway(e.target.value)}
      />
      <button type="button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchForm;
