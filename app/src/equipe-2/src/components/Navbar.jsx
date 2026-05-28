import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: '/principal', label: '🏠 Início' },
    { path: '/sobre', label: 'ℹ️ Sobre' },
    { path: '/help', label: '❓ Ajuda' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">📊 Simulador IRP</div>
      <div className="navbar-links">
        {links.map((link) => (
          <button
            key={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </button>
        ))}
        <button className="nav-logout" onClick={handleLogout}>🚪 Sair</button>
      </div>
    </nav>
  );
}

export default Navbar;