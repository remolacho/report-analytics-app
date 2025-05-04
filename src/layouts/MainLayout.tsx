import React from 'react';
import { Outlet } from 'react-router-dom';
import './MainLayout.scss';

export const MainLayout: React.FC = () => {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1>Reportería Conversacional</h1>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Reportería Conversacional. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}; 