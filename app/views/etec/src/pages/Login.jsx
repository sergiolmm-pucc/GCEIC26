import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!login(username, password)) {
      setError('Usuario ou senha invalidos');
      return;
    }

    navigate('/', { replace: true });
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="brand login-brand">
          <span className="brand-mark">E</span>
          <div>
            <strong>ETEC Domestica</strong>
            <small>GCEIC26</small>
          </div>
        </div>
        <h1>Entrar</h1>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Usuario</span>
            <input
              autoComplete="username"
              name="username"
              onChange={(event) => setUsername(event.target.value)}
              required
              value={username}
            />
          </label>
          <label className="field">
            <span>Senha</span>
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error ? <div className="alert">{error}</div> : null}
          <button className="primary-button" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
