
import React, { useState, useEffect } from 'react';
import ModalDocumentos from './ModalDocumentos';
import { saveAs } from 'file-saver';
// import ModalReportes from './ModalReportes';
// import ModalNoticias from './ModalNoticias';

import NavBar from '../navBar/navbar';
import imagen1 from '../../imagenes/udenar.png';
import imagen2 from '../../imagenes/logo 1 CESUN corto.png';
import imagen3 from '../../imagenes/logo 2 CESUN .png';

import imagen4 from '../../imagenes/logo RPCMP.png';
import './home.css';
import ModalContacto from './ModalContacto';


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
  const noticias = [
    {
      texto: 'Se inauguró el nuevo laboratorio de informática.',
      imagen: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80'
    },
    {
      texto: 'Convocatoria abierta para becas 2026.',
      imagen: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80'
    },
    {
      texto: 'Actualización de protocolos de bioseguridad.',
      imagen: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
    },
    {
      texto: 'Próximo evento: Semana de la Ciencia.',
      imagen: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
    }
  ];
  const [noticiaActual, setNoticiaActual] = useState(0);
  const siguienteNoticia = () => setNoticiaActual((prev) => (prev + 1) % noticias.length);
  const anteriorNoticia = () => setNoticiaActual((prev) => (prev - 1 + noticias.length) % noticias.length);

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
        </div>
      </div>

      {/* Indicadores de puntos */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        {images.map((_, idx) => (
          <span
            key={idx}
            style={{
              height: 12,
              width: 12,
              margin: '0 6px',
              backgroundColor: idx === current ? '#1976d2' : '#bbb',
              borderRadius: '50%',
              display: 'inline-block',
              transition: 'background 0.3s',
              border: idx === current ? '2px solid #1976d2' : '2px solid #eee',
              boxShadow: idx === current ? '0 0 6px #1976d2' : 'none',
              cursor: 'pointer',
            }}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir a la imagen ${idx + 1}`}
          />
        ))}
      </div>

      <div className="home-container">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Documentos</h3>
            <p>Sube, gestiona y consulta documentos institucionales.</p>
            <button className="dashboard-btn" onClick={() => setModalOpen(true)}>Ir a Documentos</button>
          </div>
          {/*
          <div className="dashboard-card">
            <h3>Reportes</h3>
            <p>Accede a reportes y estadísticas relevantes.</p>
            <button className="dashboard-btn" onClick={() => setModalReportesOpen(true)}>Ver Reportes</button>
          </div>
          */}
          <div className="dashboard-card">
            <h3>Contacto</h3>
            <p>¿Tienes dudas o sugerencias? Contáctanos aquí.</p>
            <button className="dashboard-btn" onClick={() => setModalContactoOpen(true)}>Contacto</button>
          </div>
            <ModalContacto isOpen={modalContactoOpen} onClose={() => setModalContactoOpen(false)} />
          {/*
          <div className="dashboard-card">
            <h3>Noticias</h3>
            <p>Últimas novedades y actualizaciones institucionales.</p>
            <button className="dashboard-btn" onClick={() => setModalNoticiasOpen(true)}>Ver Noticias</button>
          </div>
          */}
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
      {/*
      <ModalReportes isOpen={modalReportesOpen} onClose={() => setModalReportesOpen(false)}>
        <h2>Reportes y Estadísticas</h2>
        <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
          <h4 style={{marginTop: 0}}>Ejemplo: Gráfico de Barras</h4>
          <img src="https://edit.org/img/blog/n/dhr-1024-plantilla-grafico-barra-simple-editar-online.webp" alt="Gráfico de Barras" style={{width: '100%', maxWidth: 500, display: 'block', margin: '0 auto', borderRadius: 8}} />
        </div>
      </ModalReportes>
      */}
      {/* ModalNoticias eliminado */}
        {/* ModalNoticias eliminado */}
    </>
  );
};

export default Home;