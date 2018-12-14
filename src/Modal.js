import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  const modalEl = useRef(null);
  const handleCoverClick = (e) => {
    if (e.target.hasAttribute('modal')) {
      onClose();
    }
  }

  useEffect(() => {
    console.log('modalEl.current :', modalEl.current);
    const handleAnimationEnd = () => {
      console.log('object');
      if (!isOpen) {
        document.querySelector('.ModalContainer').classList.remove('show');
        document.querySelector('.ModalContainer').classList.add('hide');
      } else {
        document.querySelector('.ModalContainer').classList.add('show');
        document.querySelector('.ModalContainer').classList.remove('hide');
      }
    };
    modalEl.current.addEventListener('animationend', handleAnimationEnd);

    return () => {
      modalEl.current.removeEventListener('animationend', handleAnimationEnd)
    }

    // modalEl.current.addEventListener('transitionstart', () => {
    //   console.log('object');
    //   document.querySelector('.ModalCover').classList.remove('hide');
    //   document.querySelector('ModalCover').classList.add('show');
    // });
    // setTimeout(() => {
    //   if (!isOpen) {
    //     document.querySelector('.ModalCover').classList.add('hide');
    //   }
    // }, 0)
  }, [isOpen]);
  return createPortal(
    <>
      <div className={`ModalCover ${isOpen ? 'show' : 'hide'}`} onClick={handleCoverClick} modal="true"></div>
      <div className={`ModalContainer ${isOpen ? 'slide-up' : 'slide-down'}`} ref={modalEl}>
        {children}
      </div>
    </>,
  document.body);
};

export default Modal;
