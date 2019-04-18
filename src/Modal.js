import React, { useRef, useState, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';

import './Modal.css';

const Modal = ({ isOpen, onClose, height, children }) => {

  if (!isOpen) return null;

  const [_isOpen, setIsOpen] = useState(true);
  const modalEl = useRef(null);

  const handleCoverClick = (e) => {
    if (e.target.hasAttribute('modal')) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    const handleAnimationEnd = (event) => {
      if (!_isOpen) {
        onClose();
      }
    };
    modalEl.current.addEventListener('animationend', handleAnimationEnd);

    return () => modalEl.current.removeEventListener('animationend', handleAnimationEnd);
  }, [_isOpen]);

  return createPortal(
    <>
      {console.log('modalEl.current ', modalEl.current)}
      <div className={`ModalCover ${isOpen ? 'show' : 'hide'}`} onClick={handleCoverClick} modal="true" />
      <div
        className={`ModalContainer ${_isOpen ? 'slide-up' : 'slide-down'}`}
        ref={modalEl}
      >
        {children}
      </div>
    </>,
  document.body);
};

const shouldMemo = (prevProps, nextProps) => (
  prevProps.isOpen === nextProps.isOpen &&
  prevProps.height === nextProps.height
);

export default memo(Modal, shouldMemo);
