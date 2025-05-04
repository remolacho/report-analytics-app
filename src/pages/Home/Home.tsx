import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket } from 'react-icons/fa';
import './Home.scss';

export const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="home__content">
        <h1 className="home__title">Potencia tus Análisis de Datos</h1>
        <p className="home__description">
          Transforma tus datos en decisiones estratégicas. Nuestra plataforma de análisis
          avanzado te permite visualizar tendencias, identificar patrones y generar
          informes detallados en tiempo real. Optimiza tu proceso de toma de decisiones
          con tecnología de vanguardia.
        </p>
        <Link to="/branch" className="home__cta">
          <FaRocket style={{ marginRight: '10px' }} />
          Iniciar Análisis
        </Link>
      </div>
    </div>
  );
}; 