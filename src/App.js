import React, { useEffect, useState } from 'react';
import './App.css';
import ListItem from './ListItem';
import SearchModal from './SearchModal';
import AddTorrentButton from './AddTorrentButton';
import Login from './Login';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(() => {
    const cookieMatch = document.cookie.match(/_session_id=\w+/);
    return Boolean(cookieMatch);
  });
  const [torrents, setTorrents] = useState([]);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false); 

  useEffect(() => {
    if (!loggedIn) return;
    
    const getTorrents = () => {
      fetch('/api/list', {
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json()
        })
        .then((data) => {
          console.log('data :', data);
          // result.torrents will null when daemon is not running 
          if (!data.error) {
            setTorrents(Object.values(data.result.torrents || []));
          } else {
            // Not authenticated
            if (data.error.code === 1) setLoggedIn(false);
          }
        })
        .catch((error) => {
          setTorrents([]);
        });
    }
    getTorrents();
    const timer = setInterval(getTorrents, 5000);
    return () => clearInterval(timer);
  }, [loggedIn]);
  
  return (
    <div className="App">
      {loggedIn
      ? (
        <>
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
          <AddTorrentButton onClick={() => setSearchModalOpen(true)} />
          <SearchModal isOpen={isSearchModalOpen} onClose={() => setSearchModalOpen(false)} />
        </>
      ) : (
        <Login onLogIn={setLoggedIn} />
      )}
    </div>
  );
};

export default App;

// https://www.uplabs.com/posts/event-discovery-app-search-filter
// https://www.uplabs.com/posts/android-search-deliveroo
