import React from 'react';
import { useState } from 'react';
import { UserRound } from 'lucide-react';

const credenciais = {
  usuario: 'admin',
  senha: '123456'
};

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function submit(event) {
    event.preventDefault();

    if (usuario.trim() === credenciais.usuario && senha === credenciais.senha) {
      setErro('');
      onLogin();
      return;
    }

    setErro('Usuario ou senha invalido.');
  }

  return (
    <section className="login-page">
      <form className="login-panel" onSubmit={submit}>
        <UserRound size={34} />
        <h1>Entrar</h1>
        <label>
          Usuario
          <input value={usuario} onChange={(event) => setUsuario(event.target.value)} autoComplete="username" />
        </label>
        <label>
          Senha
          <input
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            type="password"
            autoComplete="current-password"
          />
        </label>
        {erro ? <p className="error">{erro}</p> : null}
        <button type="submit">Acessar</button>
        <p className="test-credentials">
          Acesso para teste: usuario <strong>{credenciais.usuario}</strong> / senha{' '}
          <strong>{credenciais.senha}</strong>
        </p>
      </form>
    </section>
  );
}
