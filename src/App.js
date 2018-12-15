import React, { useEffect, useState } from 'react';
import './App.css';
import ListItem from './ListItem';
import SearchModal from './SearchModal';
import AddTorrentButton from './AddTorrentButton';
import Login from './Login';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(() => !!document.cookie.match(/_session_id=\w+/));
  const [torrents, setTorrents] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

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
          if (data.error) {
            // Not authenticated
            if (data.error.code === 1) setLoggedIn(false);
          }
          
          // result.torrents will null when daemon is not running 
          setTorrents(Object.values(data.result.torrents || []));
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
          <AddTorrentButton onClick={() => setShowSearchModal(true)} />
          <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
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
