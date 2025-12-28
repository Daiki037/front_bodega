import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function NavBar() {
  const navigate = useNavigate()

  const toggleSidebar = () => {
    document.body.classList.toggle('sidebar-collapse')
  }

  const divStyle = {
    backgroundColor: '#00923F',
    color: 'white', // Cambiar el color de la letra a blanco
    padding: 0
  }

  const linkStyle = {
    color: 'white' // Asegurarse de que los enlaces también tengan el color blanco
  }

  const handleLogout = () => {
    // Lógica para cerrar sesión (por ejemplo, limpiar el estado de autenticación)
    console.log('Cerrar sesión')
    // navigate('/login') // Eliminado: ya no existe la ruta de login
  }

  return (
    <nav
      className='navbar navbar-expand-lg navbar-light navbar-custom'
      style={divStyle}
    >
      <div className='container-fluid'>
        <a className='navbar-brand d-flex align-items-center' href='/' style={linkStyle}>
            <img
              src={require('../../imagenes/logo 1 CESUN corto.png')}
              alt='Logo'
              style={{ height: '48px', marginRight: '14px' }}
            />
          Inicio
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <Link className='nav-link' to='/about' style={linkStyle}>
                Acerca de
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/contact' style={linkStyle}>
                Contacto
              </Link>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link'
                href='https://www.udenar.edu.co/'
                target='_blank'
                rel='noopener noreferrer'
                style={linkStyle}
                title='Universidad de Nariño'
              >
                Udenar
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link'
                href='https://www.udenar.edu.co/cesun/'
                target='_blank'
                rel='noopener noreferrer'
                style={linkStyle}
                title='Centro de Estudios en Salud Universidad de Nariño'
              >
                CESUN
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link'
                href='http://rpcc.univalle.edu.co/'
                target='_blank'
                rel='noopener noreferrer'
                style={linkStyle}
                title='Registro Poblacional de Cancer de Cali'
              >
                RPCC
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link'
                href='https://www.cancer.gov.co/'
                target='_blank'
                rel='noopener noreferrer'
                style={linkStyle}
                title='Instituto Nacional de Cancer'
              >
                INC
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link'
                href='https://www.iarc.who.int/'
                target='_blank'
                rel='noopener noreferrer'
                style={linkStyle}
                title='Página de la IARC'
              >
                IARC
              </a>
            </li>
          </ul>
          <ul className='navbar-nav ml-auto'>
            <li className='nav-item'>
              <Link className='nav-link' to='/BodegaDatos' style={linkStyle}>
                Ingresar
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
