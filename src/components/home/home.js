
import React, { useState, useEffect } from 'react';
import ModalDocumentos from './ModalDocumentos';
import { saveAs } from 'file-saver';
import ModalReportes from './ModalReportes';
import ModalNoticias from './ModalNoticias';

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
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReportesOpen, setModalReportesOpen] = useState(false);
  const [modalNoticiasOpen, setModalNoticiasOpen] = useState(false);
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
          <div className="dashboard-card">
            <h3>Reportes</h3>
            <p>Accede a reportes y estadísticas relevantes.</p>
            <button className="dashboard-btn" onClick={() => setModalReportesOpen(true)}>Ver Reportes</button>
          </div>
          <div className="dashboard-card">
            <h3>Contacto</h3>
            <p>¿Tienes dudas o sugerencias? Contáctanos aquí.</p>
            <button className="dashboard-btn" onClick={() => setModalContactoOpen(true)}>Contacto</button>
          </div>
            <ModalContacto isOpen={modalContactoOpen} onClose={() => setModalContactoOpen(false)} />
          <div className="dashboard-card">
            <h3>Noticias</h3>
            <p>Últimas novedades y actualizaciones institucionales.</p>
            <button className="dashboard-btn" onClick={() => setModalNoticiasOpen(true)}>Ver Noticias</button>
          </div>
        </div>
      </div>
      <ModalDocumentos isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Documentos Institucionales</h2>
        <div className="modal-doc-list">
          {[
            { nombre: 'Documento Ejemplo 1.pdf', tipo: 'PDF' },
            { nombre: 'Documento Ejemplo 2.docx', tipo: 'Word' },
            { nombre: 'Documento Ejemplo 3.xlsx', tipo: 'Excel' },
            { nombre: 'Documento Ejemplo 4.pptx', tipo: 'PowerPoint' },
          ].map((doc, idx) => (
            <div
              className="modal-doc-card"
              key={idx}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                const blob = new Blob([""], { type: "application/octet-stream" });
                saveAs(blob, doc.nombre);
              }}
              title={`Descargar ${doc.nombre}`}
            >
              <div className="modal-doc-title">{doc.nombre}</div>
              <div className="modal-doc-type">{doc.tipo}</div>
            </div>
          ))}
        </div>
      </ModalDocumentos>
      <ModalReportes isOpen={modalReportesOpen} onClose={() => setModalReportesOpen(false)}>
        <h2>Reportes y Estadísticas</h2>
        <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
          <h4 style={{marginTop: 0}}>Ejemplo: Gráfico de Barras</h4>
          <img src="https://edit.org/img/blog/n/dhr-1024-plantilla-grafico-barra-simple-editar-online.webp" alt="Gráfico de Barras" style={{width: '100%', maxWidth: 500, display: 'block', margin: '0 auto', borderRadius: 8}} />
        </div>
      </ModalReportes>
      <ModalNoticias isOpen={modalNoticiasOpen} onClose={() => setModalNoticiasOpen(false)}>
        <h2>Noticias Institucionales</h2>
        <div style={{marginTop: '1.5rem', minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <img
            src={noticias[noticiaActual].imagen}
            alt={noticias[noticiaActual].texto}
            style={{width: 220, height: 140, objectFit: 'cover', borderRadius: 10, marginBottom: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.10)'}}
          />
          <div style={{fontSize: '1.15rem', fontWeight: 500, textAlign: 'center', marginBottom: 18, minHeight: 40}}>
            {noticias[noticiaActual].texto}
          </div>
          <div style={{display: 'flex', gap: 16}}>
            <button onClick={anteriorNoticia} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontSize: '1rem', cursor: 'pointer'}}>&#8592; Anterior</button>
            <button onClick={siguienteNoticia} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontSize: '1rem', cursor: 'pointer'}}>Siguiente &#8594;</button>
          </div>
          <div style={{marginTop: 10, fontSize: '0.95rem', color: '#888'}}>
            {noticiaActual + 1} de {noticias.length}
          </div>
        </div>
      </ModalNoticias>
    </>
  );
};

export default Home;