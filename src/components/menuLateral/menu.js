import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './menu.css'; // Asegúrate de importar el archivo CSS

function Menu({ user, setIsAuthenticated, onToggleMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar el colapso del menú

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleMenu = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState); // Alternar el estado de colapso
    if (onToggleMenu) {
      onToggleMenu(newState); // Notificar al componente padre
    }
  };

  const handleBodegaDatosClick = () => {
    navigate('/BodegaDatos');
  };
  
  const handleLogout = () => {
    navigate('/home');
  };

  return (
    <aside className={`main-sidebar sidebar-dark-primary elevation-4 ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="menu-header" onClick={toggleMenu} style={{ cursor: 'pointer', padding: '10px', background: '#343a40', color: '#fff' }}>
        <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-down'}`} style={{ marginRight: '10px' }}></i>
        {!isCollapsed && <span>Yachay</span>}
      </div>
      <div className="sidebar" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src="https://st2.depositphotos.com/2498595/6810/v/450/depositphotos_68107035-stock-illustration-doctor-icon-rounded-squares-button.jpg" className="img-circle elevation-2" alt="Doctor" />
          </div>
          {!isCollapsed && (
            <div className="info">
              <a href="/perfilUsuario" className="d-block"><span>{username}</span></a>
            </div>
          )}
        </div>
        <div className="sidebar-menu">
          <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
              <li className="nav-item" id="12">
                <button onClick={handleBodegaDatosClick} className="nav-link" style={{ background: 'none', padding: '5px 0', cursor: 'pointer' }}>
                  <i className="nav-icon fas fa-server"></i>
                  {!isCollapsed && <p>Bodega de Datos</p>}
                </button>
              </li>
          </ul>
        </div>
        <div className="logout" onClick={handleLogout}>
          <i className="nav-icon fas fa-sign-out-alt"></i>
          {!isCollapsed && <p>Atras</p>}
        </div>
      </div>
    </aside>
  );
}

export default Menu;