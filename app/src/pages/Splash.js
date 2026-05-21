import React from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0e1a 0%, #111827 60%, #1a1000 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    animation: 'fadeIn 0.8s ease',
  },
  icon: { fontSize: '5rem' },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '3.5rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.05em',
  },
  accent: { color: 'var(--accent)' },
  subtitle: { color: 'var(--muted)', fontSize: '1rem', letterSpacing: '0.15em' },
  loader: {
    width: 200,
    height: 3,
    background: 'var(--border)',
    borderRadius: 99,
    overflow: 'hidden',
    marginTop: '1rem',
  },
  loaderBar: {
    height: '100%',
    background: 'var(--accent)',
    borderRadius: 99,
    animation: 'load 2.3s ease forwards',
  },
};

export default function Splash() {
  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes load { from { width: 0; } to { width: 100%; } }
      `}</style>
      <div style={styles.container}>
        <div style={styles.icon}>🚗</div>
        <h1 style={styles.title}>Auto<span style={styles.accent}>Calc</span></h1>
        <p style={styles.subtitle}>CALCULADORA DE AUTONOMIA</p>
        <div style={styles.loader}><div style={styles.loaderBar} /></div>
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '2rem' }}>
          PUC Campinas — GCEIC26
        </p>
      </div>
    </>
  );
}
