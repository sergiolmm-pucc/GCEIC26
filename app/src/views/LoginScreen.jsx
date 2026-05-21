import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoMark({ size = 36 }) {
  const dotSize = size * 0.11;
  return (
    <div style={{
      width: size, height: size, border: '1.2px solid var(--ink)', borderRadius: size * 0.25,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'var(--font)', fontSize: size * 0.5, fontWeight: 500, color: 'var(--ink)' }}>M</span>
      <span style={{
        position: 'absolute', top: size * 0.14, right: size * 0.17,
        width: dotSize, height: dotSize, borderRadius: dotSize, background: 'var(--accent)',
      }} />
    </div>
  );
}

const fieldStyle = {
  display: 'block', width: '100%', border: 'none',
  borderBottom: '1px solid var(--ink)', outline: 'none',
  background: 'transparent', fontFamily: 'var(--font)',
  fontSize: 20, fontWeight: 400, color: 'var(--ink)',
  padding: '0 0 8px 0', marginTop: 6,
};

const labelStyle = {
  fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1.2,
  textTransform: 'uppercase', color: 'var(--muted)', display: 'block',
};

export default function LoginScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [showHint, setShowHint] = useState(false);
  const [loading,  setLoading]  = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (username.trim() === 'admin' && password === 'admin') {
        sessionStorage.setItem('mkp_auth', 'true');
        navigate('/home');
      } else {
        setError('Usuario ou senha inválidos');
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%', background: 'var(--bg)',
      display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
    }} className="login-grid">
      <style>{`
        @media (max-width: 880px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-aside { display: none !important; }
        }
      `}</style>

      {/* LEFT — form */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 56px', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LogoMark size={36} />
          <span style={{ fontFamily: 'var(--font)', fontSize: 16, color: 'var(--ink)', letterSpacing: -0.1 }}>MarkUp</span>
        </div>

        <div style={{ maxWidth: 360, width: '100%', margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.6, color: 'var(--muted)', marginBottom: 10 }}>
            ACESSO
          </div>
          <h1 style={{
            margin: 0, fontFamily: 'var(--font)', fontSize: 38, fontWeight: 500,
            letterSpacing: -0.9, color: 'var(--ink)', lineHeight: 1.05,
          }}>Bem-vindo.</h1>
          <p style={{ fontFamily: 'var(--font)', fontSize: 15, color: 'var(--muted)', marginTop: 10, lineHeight: 1.55 }}>
            Entre para calcular seus precos de venda.
          </p>

          <form onSubmit={handleSubmit} id="loginForm" style={{ display: 'flex', flexDirection: 'column', gap: 26, marginTop: 32 }}>
            <label>
              <span style={labelStyle}>Usuario</span>
              <input id="username" type="text" value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin" required autoFocus autoComplete="username"
                style={fieldStyle} />
            </label>

            <label>
              <span style={labelStyle}>Senha</span>
              <input id="password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••" required autoComplete="current-password"
                style={fieldStyle} />
            </label>

            {error && (
              <div className="erro" style={{
                fontFamily: 'var(--font)', fontSize: 13, color: '#A8302C',
                background: '#FBEAE8', padding: '10px 14px', borderRadius: 8, marginTop: -10,
              }}>{error}</div>
            )}

            <button type="submit" id="btnLogin" disabled={loading} style={{
              width: '100%', padding: '16px 20px', borderRadius: 12, border: 'none',
              background: loading ? '#7A8C85' : 'var(--accent)', color: '#fff',
              fontFamily: 'var(--font)', fontSize: 15, fontWeight: 500, letterSpacing: 0.2,
              cursor: loading ? 'wait' : 'pointer', marginTop: 4,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              {loading && (
                <span style={{
                  width: 14, height: 14, borderRadius: 7,
                  border: '1.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff',
                  animation: 'mk-spin 0.7s linear infinite', display: 'inline-block',
                }} />
              )}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <button onClick={() => setShowHint(!showHint)} style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: 13, color: 'var(--muted)',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}>
              {showHint ? 'ocultar credenciais' : 'esqueceu seus dados?'}
            </button>
            {showHint && (
              <div style={{
                marginTop: 14, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)',
                border: '1px dashed var(--hair)', padding: '10px 14px', borderRadius: 8, display: 'inline-block',
              }}>
                usuario: <b style={{ color: 'var(--ink)' }}>admin</b> &nbsp;·&nbsp; senha: <b style={{ color: 'var(--ink)' }}>admin</b>
              </div>
            )}
          </div>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.4, color: 'var(--muted)', textTransform: 'uppercase' }}>
          © 2026 MARKUP
        </div>
      </div>

      {/* RIGHT — dark panel */}
      <div className="login-aside" style={{
        background: 'var(--ink)', color: '#fff', padding: '48px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.6,
          color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase',
        }}>Por que MarkUp</div>

        <div style={{ maxWidth: 460 }}>
          <div style={{
            fontFamily: 'var(--font)', fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 500,
            letterSpacing: -1, lineHeight: 1.15, color: '#fff',
          }}>
            Precificar bem e proteger o lucro do seu negocio.
          </div>
          <div style={{ marginTop: 20, fontFamily: 'var(--font)', fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            Cinco calculos essenciais em uma interface limpa, sem ruido.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 32 }}>
          {[['5','calculos'],['0','planilhas'],['∞','simulacoes']].map(([n, l], i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 32, fontWeight: 500, color: 'var(--accent)', letterSpacing: -0.6 }}>{n}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.4, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>
    </div>
  );
}
