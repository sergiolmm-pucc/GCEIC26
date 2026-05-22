import React, { useEffect } from 'react';

function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>FINV</h1>
      <p style={styles.subtitulo}>Financiamento de Veículos</p>
      <p style={styles.info}>GCEIC26 · PUC-Campinas</p>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0c0f',
  },
  titulo: {
    fontSize: '72px',
    color: '#f0a500',
    margin: '0',
  },
  subtitulo: {
    fontSize: '18px',
    color: '#ffffff',
    marginTop: '12px',
  },
  info: {
    fontSize: '13px',
    color: '#7a8099',
    marginTop: '8px',
    letterSpacing: '2px',
  },
};

export default Splash;