import React, { useRef, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';

import './Modal.css';

const Modal = ({ isOpen, onClose, height, children }) => {
  const modalEl = useRef(null);
  const handleCoverClick = (e) => {
    if (e.target.hasAttribute('modal')) {
      onClose();
    }
  }

  useEffect(() => {
    const handleAnimationEnd = (event) => {
      if (!isOpen) {
        event.target.classList.remove('show');
        event.target.classList.add('hide');

      } else {
        event.target.classList.remove('hide');
        event.target.classList.add('show');
      }
    };
    modalEl.current.addEventListener('animationend', handleAnimationEnd);

    return () => modalEl.current.removeEventListener('animationend', handleAnimationEnd);
  }, [isOpen]);

  return createPortal(
    <>
      {console.log('modalEl.current ', modalEl.current)}
      <div className={`ModalCover ${isOpen ? 'show' : 'hide'}`} onClick={handleCoverClick} modal="true"></div>
      <div
        className={`ModalContainer ${!modalEl.current ? 'hide' : ''} ${isOpen ? 'slide-up' : 'slide-down'}`}
        style={{ height, marginTop: `calc(100vh - ${height}px)`}}
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
