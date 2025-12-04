import React from 'react';
import NavBar from '../navBar/navbar';
import imagen1 from '../../imagenes/udenar.png';

const Home = () => {
  return (
    <div>
      <NavBar />
      <div>
        <img src={imagen1} alt="imagen 1" />
      </div>
    </div>
  );
};

export default Home;