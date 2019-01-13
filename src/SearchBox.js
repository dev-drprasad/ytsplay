import React, { useRef, useEffect } from 'react';
import SearchIcon from 'react-feather/dist/icons/search';

const SearchBox = ({onSearchInput}) => {
  const inputEl = useRef(null);

  const handleFormSubmit = event => {
    event.preventDefault();
    const val = event.target.elements.query.value;
    if (val) {
      onSearchInput(val);
    }
  };

  useEffect(() => {
    if (inputEl.current) inputEl.current.focus();
  }, []);

  return (
    <form className="SearchBox" action="#" method="get" autoComplete="off" onSubmit={handleFormSubmit}>
      <div className="InputGroup">
        <input type="text" name="query" id="query" ref={inputEl} />
        <button type="submit"><SearchIcon size={20} /></button>
      </div>
    </form>
  );
};

export default SearchBox;
