import React, { useState, useRef } from 'react';
import PauseIcon from 'react-feather/dist/icons/pause-circle';
import CheckIcon from 'react-feather/dist/icons/check-circle';
import PlayIcon from 'react-feather/dist/icons/play-circle';

import './ListItem.css';
import ProgressBar from './ProgressBar';

const eventUnify = (e) => e.changedTouches ? e.changedTouches[0] : e;

const ListItem = ({ name, status, progress, onDelete }) => {
  const [lockX, setLockX] = useState(null);
  const ref = useRef(null);

  const handleItemLock = (e) => {
    const ev = eventUnify(e);
    setLockX(ev.clientX);
  }
  const handleItemMove = (e) => {
    const ev = eventUnify(e);
    const dx = ev.clientX - lockX;
    const windowWidth = window.innerWidth;
    const dxPercentage = dx/windowWidth;
    if (dxPercentage > 0.5) {
      ref.current.classList.toggle('smooth');
      onDelete();
    }
    setLockX(null);
  }
  
  return (
  <li className="ListItem" ref={ref} onMouseDown={handleItemLock} onTouchStart={handleItemLock} onMouseUp={handleItemMove} onTouchEnd={handleItemMove} >
    <h3>{name}</h3>
    <ProgressBar percentage={progress} />
    <div className="Status">
      {(status === 'Downloading') &&<PauseIcon title="pause" size={34} />}
      {(status === 'Seeding'|| status === 'Queued') &&<CheckIcon title="check" size={30} />}
      {status === 'Paused' &&<PlayIcon size={30} />}
    </div>
  </li>
)};

export default ListItem;
