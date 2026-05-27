import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-icon">📊</div>
        <h1 className="splash-title">Simulador IRP</h1>
        <p className="splash-subtitle">Imposto de Renda Progressivo</p>
        <div className="splash-loader">
          <div className="splash-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default Splash;