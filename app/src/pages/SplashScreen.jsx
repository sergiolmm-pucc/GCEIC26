import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      {/* Injeção de CSS para animações de rotação e pulso */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .custom-spinner {
          animation: spin 1s linear infinite;
        }
        .animated-logo {
          animation: pulse 2s ease-in-out infinite;
        }
        .progress-fill {
          animation: progress 3s linear forwards;
        }
      `}</style>

      <div style={styles.content}>
        {/* Ícone principal com efeito de pulso */}
        <div className="animated-logo" style={styles.logoContainer}>
          <span style={styles.logoIcon}>💧</span>
        </div>

        <h1 style={styles.title}>Calculadora de Piscina</h1>
        <p style={styles.subtitle}>Carregando projeto GCEIC2026...</p>
        
        {/* Spinner Moderno */}
        <div className="custom-spinner" style={styles.spinner}></div>

        {/* Barra de progresso sutil combinando com os 3 segundos */}
        <div style={styles.progressBar}>
          <div className="progress-fill" style={styles.progressTrack}></div>
        </div>
      </div>
      
      {/* Detalhe estético no rodapé */}
      <div style={styles.footer}>v1.0.0</div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(180deg, #0284c7 0%, #0c4a6e 100%)', // Degradê profundo (fundo da piscina)
    color: '#ffffff',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    width: '90px',
    height: '90px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', // Formato orgânico que lembra água
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    backdropFilter: 'blur(5px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  logoIcon: {
    fontSize: '42px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#bae6fd', // Azul claro suave para o texto secundário
    margin: '0 0 40px 0',
    opacity: 0.8,
    fontWeight: '400',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTop: '4px solid #ffffff', // Parte branca que gira
    borderRadius: '50%',
    marginBottom: '30px',
  },
  progressBar: {
    width: '200px',
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressTrack: {
    height: '100%',
    backgroundColor: '#38bdf8', // Cor da barra enchendo
    boxShadow: '0 0 8px #38bdf8',
  },
  footer: {
    position: 'absolute',
    bottom: '24px',
    fontSize: '12px',
    color: '#0284c7',
    letterSpacing: '1px',
    fontWeight: '600',
  }
};

export default SplashScreen;