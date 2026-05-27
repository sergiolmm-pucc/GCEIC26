import React, { useEffect, useState } from 'react';

export default function Splash({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 1.8 segundos de apresentação + 0.4s de fadeOut
    const timerFade = setTimeout(() => setFadeOut(true), 1800);
    const timerFinish = setTimeout(onFinish, 2200);

    return () => {
      clearTimeout(timerFade);
      clearTimeout(timerFinish);
    };
  }, [onFinish]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s ease',
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'scale(1.05)' : 'scale(1)',
        pointerEvents: 'none'
      }}
    >
      <div 
        className="glass animate-fade-in" 
        style={{
          padding: '40px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          background: 'radial-gradient(circle at center, rgba(30, 41, 73, 0.6) 0%, rgba(13, 20, 38, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 0 50px rgba(99, 102, 241, 0.15)'
        }}
      >
        {/* Ícone de Logotipo Acadêmico Estilizado */}
        <div 
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: '800',
            fontFamily: "'Outfit', sans-serif",
            color: '#fff',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
            animation: 'pulseGlow 2s infinite ease-in-out'
          }}
        >
          E
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 
            style={{ 
              fontSize: '2.2rem', 
              background: 'linear-gradient(135deg, #fff 30%, var(--text-muted) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}
          >
            Cálculo ETEC
          </h1>
          <p 
            style={{ 
              fontSize: '0.95rem', 
              color: 'var(--primary)', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.15em'
            }}
          >
            Portal de Gestão Acadêmica
          </p>
        </div>

        {/* Loader Animado */}
        <div 
          style={{
            width: '120px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '99px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
              borderRadius: '99px',
              animation: 'loadingProgress 1.5s infinite ease-in-out'
            }}
          />
        </div>
      </div>

      {/* Injeção de Animação CSS específica no escopo da Splash */}
      <style>{`
        @keyframes loadingProgress {
          0% { left: -40%; }
          50% { left: 100%; width: 30%; }
          100% { left: 100%; width: 40%; }
        }
      `}</style>
    </div>
  );
}
