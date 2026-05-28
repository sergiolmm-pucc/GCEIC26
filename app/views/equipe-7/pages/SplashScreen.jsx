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
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animated-ripple { animation: ripple 3s ease-in-out infinite; }
        .animated-logo { animation: float 4s ease-in-out infinite; }
        .progress-fill { animation: progress 3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>

      <div style={styles.content}>
        <div className="animated-logo" style={styles.logoContainer}>
          <div className="animated-ripple" style={styles.rippleEffect}></div>
          <span style={styles.logoIcon}>💧</span>
        </div>

        <h1 style={styles.title}>AquaCalc</h1>

        <p style={styles.subtitle}>GCEIC2026 • Engenharia & Gestão de Custos</p>
        
        <div style={styles.progressBar}>
          <div className="progress-fill" style={styles.progressTrack}></div>
        </div>
      </div>
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
    background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
    color: '#ffffff',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
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
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(2, 132, 199, 0.2) 100%)',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '28px',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    position: 'relative',
  },
  rippleEffect: {
    position: 'absolute',
    width: '130%',
    height: '130%',
    borderRadius: '32px',
    border: '1px solid rgba(56, 189, 248, 0.1)',
  },
  logoIcon: {
    fontSize: '46px',
    filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.6))',
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: '800',
    margin: '0 0 8px 0',
    letterSpacing: '-1px',
    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    margin: '0 0 48px 0',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  progressBar: {
    width: '240px',
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  progressTrack: {
    height: '100%',
    background: 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)',
    boxShadow: '0 0 14px rgba(56, 189, 248, 0.5)',
  },
  footer: {
    position: 'absolute',
    bottom: '32px',
    fontSize: '11px',
    color: '#475569',
    letterSpacing: '2px',
    fontWeight: '600',
  }
};

export default SplashScreen;