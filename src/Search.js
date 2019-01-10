import React, { useState} from 'react';
import MovieItem from './MovieItem';
import MoviePlaceholder from './MoviePlaceholder';
import SearchBox from './SearchBox';

import './SearchBox.css';
import './Search.css';

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMovieClick = (url) => {
    const searchParams = new URLSearchParams();
    searchParams.append('url', url);
    const addUrl = `/api/add?${searchParams.toString()}`;
    fetch(addUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log('data :', data);
    })
    .catch((err) => {
      console.log('err :', err);
    });
  }

  const fetchSuggestions = (query) => {
    setLoading(true);
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
      setLoading(false);
    })
    .catch(error => {
      setMovies([]);
      setLoading(false);
    });
  }
  return (
    <div className="Search">
      <SearchBox onSearchInput={fetchSuggestions} />
      <ul className="Movies">
        {loading && <><MoviePlaceholder /><MoviePlaceholder /><MoviePlaceholder /></>}
        {!loading && movies.map((movie) => (
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
