import React, { useState, useEffect} from 'react';
import Search from './Search';
import Modal from './Modal';

import { debounce } from './utils';

const SearchModal = ({ isOpen, onClose }) => {
  const [viewportHeight, setViewportHeight] = useState(null);

  useEffect(() => {
    setViewportHeight(document.documentElement.clientHeight);
  })

  useEffect(() => {
    window.addEventListener('resize', debounce((event) => {
      setViewportHeight(document.documentElement.clientHeight);
    }));
  }, []);
  
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} height={viewportHeight < 400 ? viewportHeight : 400 }>
      <Search />
    </Modal>
  );
};

export default SearchModal;
