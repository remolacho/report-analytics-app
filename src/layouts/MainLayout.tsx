import React from 'react';
import { Outlet } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import logo from '../assets/images/logo-liam.png';
import './MainLayout.scss';

export const MainLayout: React.FC = () => {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <img src={logo} alt="Liam Analytics Logo" />
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          <Breadcrumbs />
          <Outlet />
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Liam Analytics. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}; 