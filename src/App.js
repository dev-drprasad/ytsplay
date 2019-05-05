import React, { useEffect, useState } from 'react';
import './App.css';
import SearchModal from './SearchModal';
import AddTorrentButton from './AddTorrentButton';
import Login from './Login';
import DownloadList from './DownloadList';

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
          if (response.status === 401) setLoggedIn(false);
          if (!response.ok) throw Error(response.statusText);
          return response.json()
        })
        .then((data) => {
          console.log('data :', data);
          setTorrents(data.result);
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
          <DownloadList torrents={torrents} />
          <AddTorrentButton onClick={() => setShowSearchModal(true)} />
          <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
        </>
      ) : (
        <Login onLogIn={() => setLoggedIn(true)} />
      )}
    </div>
  );
};

export default App;

// https://www.uplabs.com/posts/event-discovery-app-search-filter
// https://www.uplabs.com/posts/android-search-deliveroo
