import React from 'react';
import './ModalDocumentos.css';

const ModalDocumentos = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-doc-overlay">
      <div className="modal-doc-content">
        <button className="modal-doc-close" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

export default ModalDocumentos;
