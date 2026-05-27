import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro]         = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }    = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(username.trim(), password);
      if (ok) { navigate('/simulacao'); }
      else    { setErro('Usuário ou senha inválidos.'); }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fc-login-wrap">
      <div className="fc-login-bg" />
      <div className="fc-login-card">

        {/* Header */}
        <div className="text-center mb-4">
          <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px' }}>
            <i className="bi bi-truck text-orange me-2" />
            Frete<span className="text-orange">Calc</span>
          </div>
          <p style={{ color: 'var(--fc-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Acesse sua conta para simular fretes
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="fc-label">
              <i className="bi bi-person me-1" /> Usuário
            </label>
            <input
              type="text"
              className="fc-input"
              placeholder="admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="fc-label">
              <i className="bi bi-lock me-1" /> Senha
            </label>
            <input
              type="password"
              className="fc-input"
              placeholder="••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {erro && (
            <div className="fc-alert mb-3">
              <i className="bi bi-exclamation-triangle me-2" />{erro}
            </div>
          )}

          <button className="fc-btn mt-1" type="submit" disabled={loading || !username || !password}>
            {loading
              ? <><span className="spinner-border spinner-border-sm" role="status" /> Entrando...</>
              : <><i className="bi bi-arrow-right-circle" /> Entrar</>
            }
          </button>
        </form>

        {/* Dica */}
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--fc-border)' }}>
          <p style={{ color: 'var(--fc-muted)', fontSize: '0.75rem', marginBottom: '0.4rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Credenciais de teste
          </p>
          <code style={{ color: 'var(--fc-primary)', fontSize: '0.78rem' }}>
            admin / 1234 &nbsp;·&nbsp; aluno / frete
          </code>
        </div>

      </div>
    </div>
  );
}
