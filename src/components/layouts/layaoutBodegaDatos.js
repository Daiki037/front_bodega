import React, { useState } from 'react';
import Menu from '../menuLateral/menu.js';
import BodegaDatos from '../bodegaDatos/bodegaDatos.js';

const BodegaDatosLayout = ({ setIsAuthenticated }) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  const handleToggleMenu = (collapsed) => {
    setIsMenuCollapsed(collapsed);
  };

  return (
    <div className="wrapper">
      <Menu setIsAuthenticated={setIsAuthenticated} onToggleMenu={handleToggleMenu} />
      <div className={`content-wrapper ${isMenuCollapsed ? 'collapsed' : ''}`}>
        <BodegaDatos />
      </div>
    </div>
  );
}; 

export default BodegaDatosLayout;

