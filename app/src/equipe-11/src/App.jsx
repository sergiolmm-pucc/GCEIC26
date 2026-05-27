import { useEffect, useState } from 'react';
import SplashScreen from './SplashScreen';

const defaultForm = {
  length: 105,
  width: 68,
  grassType: 'natural',
  drainage: 'standard',
  baseType: 'standard',
  maintenanceYears: 5,
  annualCareCost: 1200
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/equipe-11';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('campoAuthToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const payload = await response.json();
      if (!response.ok) {
        setLoginError(payload.error || 'Credenciais inválidas');
        return;
      }

      setToken(payload.token);
      localStorage.setItem('campoAuthToken', payload.token);
      setUsername('');
      setPassword('');
      setResult(null);
      setApiError('');
    } catch (error) {
      setLoginError('Não foi possível conectar ao servidor');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('campoAuthToken');
    setResult(null);
    setApiError('');
  };

  const handleFieldChange = (event) => {
    const { name, value, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleCalculate = async (event) => {
    event.preventDefault();
    setApiError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const payload = await response.json();
      if (!response.ok) {
        setApiError(payload.error || 'Erro ao calcular');
        return;
      }

      setResult(payload);
    } catch (error) {
      setApiError('Erro de conexão com o servidor');
    }
  };

  return (
    <>
      {showSplash && <SplashScreen />}
      <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Calculadora de Campo de Futebol</h1>
          <p>Somente o campo: construção e manutenção com login.</p>
        </div>
        {token && (
          <button className="secondary-button" onClick={handleLogout}>
            Sair
          </button>
        )}
      </header>

      {!token ? (
        <section className="card">
          <h2>Login</h2>
          <p className="hint">Use <strong>admin</strong> / <strong>admin</strong></p>
          <form onSubmit={handleLogin} className="form-grid">
            <label>
              Usuário
              <input
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </label>
            <label>
              Senha
              <input
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button type="submit">Entrar</button>
            {loginError && <p className="error-message">{loginError}</p>}
          </form>
        </section>
      ) : (
        <section className="card">
          <h2>Dados do campo</h2>
          <form onSubmit={handleCalculate} className="form-grid">
            <label>
              Comprimento (m)
              <input
                name="length"
                type="number"
                min="1"
                step="0.1"
                value={form.length}
                onChange={handleFieldChange}
                required
              />
            </label>
            <label>
              Largura (m)
              <input
                name="width"
                type="number"
                min="1"
                step="0.1"
                value={form.width}
                onChange={handleFieldChange}
                required
              />
            </label>
            <label>
              Tipo de grama
              <select name="grassType" value={form.grassType} onChange={handleFieldChange}>
                <option value="natural">Natural</option>
                <option value="artificial">Artificial</option>
              </select>
            </label>
            <label>
              Drenagem
              <select name="drainage" value={form.drainage} onChange={handleFieldChange}>
                <option value="standard">Padrão</option>
                <option value="advanced">Avançada</option>
              </select>
            </label>
            <label>
              Base do campo
              <select name="baseType" value={form.baseType} onChange={handleFieldChange}>
                <option value="standard">Padrão</option>
                <option value="reinforced">Reforçada</option>
              </select>
            </label>
            <label>
              Anos de manutenção
              <input
                name="maintenanceYears"
                type="number"
                min="0"
                step="1"
                value={form.maintenanceYears}
                onChange={handleFieldChange}
                required
              />
            </label>
            <label>
              Custo anual de manutenção (R$)
              <input
                name="annualCareCost"
                type="number"
                min="0"
                step="0.01"
                value={form.annualCareCost}
                onChange={handleFieldChange}
                required
              />
            </label>
            <button type="submit">Calcular</button>
          </form>

          {apiError && <p className="error-message">{apiError}</p>}

          {result && (
            <div className="result-grid">
              <div className="result-card">
                <strong>Área</strong>
                <span>{result.area} m²</span>
              </div>
              <div className="result-card">
                <strong>Perímetro</strong>
                <span>{result.perimeter} m</span>
              </div>
              <div className="result-card">
                <strong>Custo de construção</strong>
                <span>R$ {result.constructionCost.toFixed(2)}</span>
              </div>
              <div className="result-card">
                <strong>Custo de manutenção</strong>
                <span>R$ {result.maintenanceCost.toFixed(2)}</span>
              </div>
              <div className="result-card">
                <strong>Custo total</strong>
                <span>R$ {result.totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </section>
      )}
      </div>
    </>
  );
}

export default App;
