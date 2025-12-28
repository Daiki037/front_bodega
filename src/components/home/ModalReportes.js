import React from 'react';
import './ModalReportes.css';

const ModalReportes = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-rep-overlay">
      <div className="modal-rep-content">
        <button className="modal-rep-close" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

export default ModalReportes;
