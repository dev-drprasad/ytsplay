import React, { useState, useEffect } from "react";
import { useYTSSearch, useShowDetail } from "./hooks";

import MovieItem from "./MovieItem";
import MoviePlaceholder from "./MoviePlaceholder";
import SearchBox from "./SearchBox";

import "./SearchBox.css";
import "./Search.css";

const ShowDetail = ({ url: v, onSuccessAdd }) => {
  const [url, setUrl] = useState(null);
  const { data: episodes, status } = useShowDetail(url);

  const handleEpisodeClick = url => {
    const searchParams = new URLSearchParams();
    searchParams.append("url", url);
    searchParams.append("type", "shows");
    const addUrl = `/api/add?${searchParams.toString()}`;
    fetch(addUrl)
      .then(response => response.json())
      .then(data => {
        console.log("data :", data);
        onSuccessAdd();
      })
      .catch(err => {
        console.log("err :", err);
      });
  };

  useEffect(() => {
    if (v) {
      setUrl(v);
    }
  }, [v]);
  return (
    <div className="ShowDetail">
      {status === "LOADING" && (
        <>
          <MoviePlaceholder />
          <MoviePlaceholder />
          <MoviePlaceholder />
        </>
      )}
      {status === "SUCCESS" && episodes.length && (
        <ul className="EpisodeList">
          {episodes.map(episode => (
            <li onClick={() => handleEpisodeClick(episode.url)}>
              {episode.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Search = ({ onSuccessAdd }) => {
  const [query, setQuery] = useState({ query: null, type: "movies" });
  const { data: movies, status } = useYTSSearch(query);
  const [showDetail, setShowDetail] = useState(null);

  const handleMovieClick = url => {
    if (query.type === "shows") {
      setShowDetail(url);
      return;
    }
    const searchParams = new URLSearchParams();
    searchParams.append("url", url);
    searchParams.append("type", query.type);
    const addUrl = `/api/add?${searchParams.toString()}`;
    fetch(addUrl)
      .then(response => response.json())
      .then(data => {
        console.log("data :", data);
        onSuccessAdd();
      })
      .catch(err => {
        console.log("err :", err);
      });
  };

  const fetchSuggestions = query => {
    setShowDetail(null);
    setQuery(query);
  };

  return (
    <div className="Search">
      <SearchBox
        onSearchInput={fetchSuggestions}
        blurTextInput={status === "SUCCESS"}
      />
      {!showDetail && (
        <ul className="Movies">
          {status === "LOADING" && (
            <>
              <MoviePlaceholder />
              <MoviePlaceholder />
              <MoviePlaceholder />
            </>
          )}
          {status === "SUCCESS" &&
            movies.map(movie => (
              <MovieItem
                name={movie.name}
                imageUrl={movie.imageUrl}
                year={movie.year}
                url={movie.url}
                onClick={handleMovieClick}
              />
            ))}
        </ul>
      )}
      {showDetail && query.type === "shows" && (
        <ShowDetail url={showDetail} onSuccessAdd={onSuccessAdd} />
      )}
    </div>
  );
};

export default Search;
