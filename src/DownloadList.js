import React from 'react';
import ListItem from './ListItem';

import './DownloadList.css';

const DownloadList = ({ torrents }) => (
  <ul className="DownloadList">
    {torrents.map((torrent) => (
      <ListItem
        name={torrent.name}
        status={torrent.state}
        progress={torrent.progress}
      />
      ))
    }
  </ul>
);

export default DownloadList;
