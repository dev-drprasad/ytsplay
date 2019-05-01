import React from 'react';
import ListItem from './ListItem';

import './DownloadList.css';

const DownloadList = ({ torrents, onDelete }) => {
  const handleDelete = (hash) => () => {
    fetch('/api/remove', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hash: hash,
      }),
    })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json()
      })
      .then((data) => {
        console.log('data :', data);
      })
      .catch((err) => {
        console.log('err :', err);
      });
  }
  return (
  <ul className="DownloadList">
    {torrents.map((torrent) => (
      <ListItem
        key={torrent.hash}
        name={torrent.name}
        status={torrent.state}
        progress={torrent.progress}
        onDelete={handleDelete(torrent.hash)}
      />
      ))
    }
  </ul>
)};

export default DownloadList;
