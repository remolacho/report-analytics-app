import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import './Breadcrumbs.scss';

const routeLabels: Record<string, string> = {
  '': 'Inicio',
  'chat-list': 'Lista de Chats',
  'chat': 'Chat',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Si estamos en la raíz, no mostramos breadcrumbs
  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      <ol className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          <Link to="/" className="breadcrumbs__link">
            <FaHome className="breadcrumbs__home-icon" />
          </Link>
          {pathnames.length > 0 && (
            <FaChevronRight className="breadcrumbs__separator" />
          )}
        </li>
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          return (
            <li 
              key={name} 
              className={`breadcrumbs__item ${isLast ? 'breadcrumbs__item--active' : ''}`}
            >
              {isLast ? (
                <span className="breadcrumbs__text">
                  {routeLabels[name] || name}
                </span>
              ) : (
                <>
                  <Link to={routeTo} className="breadcrumbs__link">
                    {routeLabels[name] || name}
                  </Link>
                  <FaChevronRight className="breadcrumbs__separator" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}; 