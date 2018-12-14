import React from 'react';

import './MovieItem.css';

const MovieItem = ({ imageUrl, name, year, url, onClick }) => {
  return (
    <li className="MovieItem" onClick={() => onClick(url)}>
      <img className="Image" src={imageUrl} alt={name} />
      <h3 className="Name">{name}</h3>
      <div className="Year">{year}</div>
    </li>
  );
};

export default MovieItem;
