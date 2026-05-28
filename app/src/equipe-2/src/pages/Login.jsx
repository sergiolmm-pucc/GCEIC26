import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && senha === '123') {
      navigate('/principal');
    } else {
      setErro('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">🔐</span>
          <h2>Simulador IRP</h2>
          <p>Faça login para continuar</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              required
            />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          {erro && <div className="login-erro">{erro}</div>}
          <button type="submit" className="login-btn">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;