import React from 'react';
import ListItem from './ListItem';

import './DownloadList.css';

const DownloadList = ({ torrents }) => {
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
  const handleStream = (hash) => () => {
    fetch('/api/stream', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: 'start',
        hash,
      }),
    })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json()
      })
      .then((data) => {
        // localStorage.setItem(hash, data.result);
      })
      .catch(console.error);

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
        onStream={handleStream(torrent.hash)}
        streamUrl={torrent.streamNo || null}
      />
      ))
    }
  </ul>
)};

export default DownloadList;
