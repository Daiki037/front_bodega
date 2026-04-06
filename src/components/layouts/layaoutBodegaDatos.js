import React, { useState } from 'react';
import BodegaDatos from '../bodegaDatos/bodegaDatos.js';

const BodegaDatosLayout = ({ setIsAuthenticated }) => {


  return (
    <div className="wrapper">
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <BodegaDatos />
      </div>
    </div>
  );
}; 

export default BodegaDatosLayout;

 