import React from "react";
import PlusIcon from "react-feather/dist/icons/plus";

import "./AddTorrentButton.css";

const AddTorrentButton = ({ onClick }) => {
  return (
    <button className="AddTorrentButton" onClick={onClick}>
      <PlusIcon size={28} />
    </button>
  );
};

export default AddTorrentButton;
