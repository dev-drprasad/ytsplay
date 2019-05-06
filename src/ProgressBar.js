import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ percentage }) => (
  <div className="ProgressBar">
    <div className="Filler" style={{ width: `${percentage}%` }} />
  </div>
);

export default ProgressBar;
