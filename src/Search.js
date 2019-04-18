import React, { useState} from 'react';
import { useYTSSearch } from './hooks';

import MovieItem from './MovieItem';
import MoviePlaceholder from './MoviePlaceholder';
import SearchBox from './SearchBox';

import './SearchBox.css';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState({ query: null, type: 'movies' });
  const {data: movies, status} = useYTSSearch(query);

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

  const fetchSuggestions = (query) => void setQuery(query);

  return (
    <div className="Search">
      <SearchBox onSearchInput={fetchSuggestions} blurTextInput={status === 'SUCCESS'} />
      <ul className="Movies">
        {status === 'LOADING' && <><MoviePlaceholder /><MoviePlaceholder /><MoviePlaceholder /></>}
        {status === 'SUCCESS' && movies.map((movie) => (
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
