import React from 'react';
import PauseIcon from 'react-feather/dist/icons/pause-circle';
import CheckIcon from 'react-feather/dist/icons/check-circle';
import PlayIcon from 'react-feather/dist/icons/play-circle';

import './ListItem.css';
import ProgressBar from './ProgressBar';

const ListItem = ({ name, status, progress }) => (
  <li className="ListItem">
    <h3>{name}</h3>
    <ProgressBar percentage={progress} />
    <div className="status">
      {(status === 'Downloading' || status === 'Queued') &&<PauseIcon size={30} />}
      {status === 'Completed' &&<CheckIcon size={30} />}
      {status === 'Paused' &&<PlayIcon size={30} />}
    </div>
  </li>
);

export default ListItem;
