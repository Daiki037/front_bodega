import React from 'react';
import './ModalContacto.css';

const ModalContacto = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Contacto</h2>
        <div className="contact-info">
          <p><strong>Teléfono fijo:</strong> (2) 731 1449</p>
          <p><strong>Celular:</strong> 320 123 4567</p>
          <p><strong>Correo electrónico:</strong> contacto@udenar.edu.co</p>
        </div>
      </div>
    </div>
  );
};

export default ModalContacto;
