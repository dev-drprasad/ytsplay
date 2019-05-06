import React, { useRef, useEffect } from "react";
import SearchIcon from "react-feather/dist/icons/search";

const SearchBox = ({ onSearchInput, blurTextInput }) => {
  const inputEl = useRef(null);

  const handleFormSubmit = event => {
    event.preventDefault();
    const searchTerm = event.target.elements.query.value;
    const type = event.target.elements.type.value;
    if (searchTerm && type) {
      onSearchInput({ query: searchTerm, type });
    }
  };

  useEffect(() => {
    if (inputEl.current) inputEl.current.focus();
  }, []);

  useEffect(() => {
    if (blurTextInput && inputEl.current) inputEl.current.blur();
  }, [blurTextInput]);

  return (
    <form
      className="SearchBox"
      action="#"
      method="get"
      autoComplete="off"
      onSubmit={handleFormSubmit}
    >
      <div className="TextInputGroup">
        <input type="text" name="query" id="query" ref={inputEl} />
        <button type="submit">
          <SearchIcon size={20} />
        </button>
      </div>
      <div className="RadioGroup">
        <label>
          <input type="radio" name="type" value="movies" defaultChecked />
          Movies
        </label>
        <label>
          <input type="radio" name="type" value="shows" />
          TV Shows
        </label>
      </div>
    </form>
  );
};

export default SearchBox;
