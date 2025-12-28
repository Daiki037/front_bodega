import React from 'react';
import './ModalNoticias.css';

const ModalNoticias = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-noti-overlay">
      <div className="modal-noti-content">
        <button className="modal-noti-close" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

export default ModalNoticias;
