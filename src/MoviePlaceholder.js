import React from 'react';

import './MoviePlaceholder.css';

const MoviePlaceholder = () => (
  <li className="MoviePlaceholder">
    <div className="ShimmerInner">
      <div className="ShimmerLine" />
      <div className="TitlePlaceholder CurveShape" />
      <div className="Cover1 Shimmer"/>
      <div className="Cover2 Shimmer" />
      <div className="YearPlaceholder CurveShape" />
      <div className="Cover3 Shimmer" />
    </div>
  </li>
);

export default MoviePlaceholder;
