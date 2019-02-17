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
    <div className="Status">
      {(status === 'Downloading') &&<PauseIcon title="pause" size={34} />}
      {(status === 'Seeding'|| status === 'Queued') &&<CheckIcon title="check" size={30} />}
      {status === 'Paused' &&<PlayIcon size={30} />}
    </div>
  </li>
);

export default ListItem;
