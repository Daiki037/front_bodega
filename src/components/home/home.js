import React, { useState, useEffect } from 'react';
import ModalDocumentos from './ModalDocumentos';
import { saveAs } from 'file-saver';
import NavBar from '../navBar/navbar';
import imagen1 from '../../imagenes/udenar.png';
import imagen2 from '../../imagenes/logo 1 CESUN corto.png';
import imagen3 from '../../imagenes/logo 2 CESUN .png';
import imagen4 from '../../imagenes/logo RPCMP.png';
import './home.css';
import ModalContacto from './ModalContacto';

// ...existing code...


// Lista de logotipos en public/logos 2
const logosCisigesco = [
  'logo ejecutora CISIGESCO png azul.png',
  'logos CISIGESCO png azul-01.png',
  'logos CISIGESCO png azul-03.png',
  'logos CISIGESCO png azul-04.png',
  'logos CISIGESCO png azul-05.png',
];


const images = [
  { src: imagen1, alt: 'Udenar' },
  { src: imagen2, alt: 'Logo 1 CESUN corto' },
  { src: imagen3, alt: 'Logo 2' },
  { src: imagen4, alt: 'Logo RPCMP' },
];

const Home = () => {
  const [documentos, setDocumentos] = useState([]);
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  // const [modalReportesOpen, setModalReportesOpen] = useState(false);
  // const [modalNoticiasOpen, setModalNoticiasOpen] = useState(false);
  const [modalContactoOpen, setModalContactoOpen] = useState(false);
  

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  // Cambiar imagen automáticamente cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Consultar documentos al abrir el modal
  useEffect(() => {
    if (modalOpen) {
      fetch('http://localhost:3002/documentos')
        .then(res => res.json())
        .then(data => setDocumentos(data))
        .catch(() => setDocumentos([]));
    }
  }, [modalOpen]);
  return (
    <>
      <NavBar />
      <div className="carousel-outer">
        <div className="carousel">
          {images.map((img, idx) => (
            <img
              key={img.alt}
              src={img.src}
              alt={img.alt}
              style={{ opacity: idx === current ? 1 : 0, position: 'absolute', left: 0, top: 0 }}
            />
          ))}
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={prevSlide} aria-label="Anterior">&#8592;</button>
            <button className="carousel-btn" onClick={nextSlide} aria-label="Siguiente">&#8594;</button>
          </div>
          {/* Indicadores de puntos sobre la imagen */}
          <div className="carousel-dots">
            {images.map((_, idx) => (
              <button
                key={idx}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  margin: '0 4px',
                  backgroundColor: idx === current ? '#1976d2' : '#bbb',
                  border: idx === current ? '2px solid #1976d2' : '2px solid #eee',
                  boxShadow: idx === current ? '0 0 6px #1976d2' : 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'background 0.2s, border 0.2s',
                }}
                onClick={() => setCurrent(idx)}
                aria-label={`Ir a la imagen ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>


      <div className="home-container">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Documentos</h3>
            <p>Descarga documentos de interes.</p>
            <button className="dashboard-btn" onClick={() => setModalOpen(true)}>Ir a Documentos</button>
          </div>
          
          <div className="dashboard-card">
            <h3>Contacto</h3>
            <p>¿Tienes dudas o sugerencias? Contáctanos aquí.</p>
            <button className="dashboard-btn" onClick={() => setModalContactoOpen(true)}>Contacto</button>
          </div>
            <ModalContacto isOpen={modalContactoOpen} onClose={() => setModalContactoOpen(false)} />
          
        </div>
      </div>
      <ModalDocumentos isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Documentos Institucionales</h2>
        <div className="modal-doc-list">
          {documentos.length === 0 ? (
            <div>No hay documentos disponibles.</div>
          ) : (
            documentos.map((nombre, idx) => (
              <div
                className="modal-doc-card"
                key={idx}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  window.open(`${process.env.REACT_APP_API_URL}/documentos/${encodeURIComponent(nombre)}/download`, '_blank');
                }}
                title={`Descargar ${nombre}`}
              >
                <div className="modal-doc-title">{nombre}</div>
                <div className="modal-doc-type">{nombre.split('.').pop().toUpperCase()}</div>
              </div>
            ))
          )}
        </div>
      </ModalDocumentos>

      {/* Panel tipo footer para logotipos CISIGESCO */}
      <footer className="logos-footer-panel">
        <div className="logos-footer-title">Aliados y Colaboradores</div>
        <div className="logos-footer-logos">
          {logosCisigesco.map((logo, idx) => (
            <img
              key={idx}
              src={process.env.PUBLIC_URL + '/logos 2/' + logo}
              alt={logo.replace(/\.[^/.]+$/, '')}
              className="logo-footer-img"
              loading="lazy"
            />
          ))}
        </div>
      </footer>
    </>
  );
};

export default Home;