import React, { useState} from 'react';
import MovieItem from './MovieItem';
import SearchIcon from 'react-feather/dist/icons/search';
import './SearchBox.css';
import './Search.css';

const SearchBox = ({onSearchInput}) => {
  const handleFormSubmit = event => {
    event.preventDefault();
    const val = event.target.elements.query.value;
    if (val) {
      onSearchInput(val);
    }
  };

  return (
    <form className="SearchBox" action="#" method="get" autoComplete="off" onSubmit={handleFormSubmit}>
      <div className="InputGroup">
        <input type="text" name="query" id="query" />
        <button type="submit"><SearchIcon size={20} /></button>
      </div>
    </form>
  );
};

const Search = () => {
  const [movies, setMovies] = useState([]);

  const handleMovieClick = (url) => {
    const searchParams = new URLSearchParams();
    searchParams.append('url', url);
    const addUrl = `/api/add?${searchParams.toString()}`;
    fetch(addUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log('data :', data);
    });
  }

  const fetchSuggestions = (query) => {
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    const searchUrl = `/api/search?${searchParams.toString()}`;
    fetch(searchUrl)
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      console.log('data :', data);
      setMovies(data);
    })
    .catch(error => {
      console.log('error.message :', error.message);
      setMovies([]);
    });
  }
  return (
    <div className="Search">
      <SearchBox onSearchInput={fetchSuggestions} />
      <ul className="Movies">
        {movies.map((movie) => (
          <MovieItem
            name={movie.name}
            imageUrl={movie.imageUrl}
            year={movie.year}
            url={movie.url}
            onClick={handleMovieClick} />
        ))}
      </ul>
    </div>
  );
};

export default Search;
