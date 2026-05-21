import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate(sessionStorage.getItem('mkp_auth') === 'true' ? '/home' : '/login');
    }, 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh', width: '100%', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{
        animation: 'mk-fade .9s ease-out both',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
      }}>
        <div style={{
          width: 88, height: 88, border: '1.5px solid var(--ink)', borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <span style={{
            fontFamily: 'var(--font)', fontSize: 42, fontWeight: 500,
            letterSpacing: -1.5, color: 'var(--ink)',
          }}>M</span>
          <span style={{
            position: 'absolute', top: 13, right: 14,
            width: 9, height: 9, borderRadius: 5, background: 'var(--accent)',
          }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font)', fontSize: 30, fontWeight: 500,
            letterSpacing: -0.5, color: 'var(--ink)',
          }}>MarkUp</div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 2.6,
            color: 'var(--muted)', marginTop: 6, textTransform: 'uppercase',
          }}>Calculadora de Precos</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 80, width: 200, height: 1,
        background: 'var(--hair)', overflow: 'hidden',
      }}>
        <div style={{ height: '100%', background: 'var(--ink)', animation: 'mk-tick 2s ease-out forwards' }} />
      </div>

      <div style={{
        position: 'absolute', bottom: 48,
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.6,
        color: 'var(--muted)', textTransform: 'uppercase',
      }}>v 1.0 . 2026</div>
    </div>
  );
}
