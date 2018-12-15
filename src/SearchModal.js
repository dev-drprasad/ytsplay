import React from 'react';
import Search from './Search';
import Modal from './Modal';

const SearchModal = ({ isOpen, onClose }) => {
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      {isOpen && <Search />}
    </Modal>
  );
};

export default SearchModal;
