import React, { useState } from 'react';

const USUARIO = 'admin';
const SENHA = '1234';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function handleLogin() {
    if (usuario === USUARIO && senha === SENHA) {
      onLogin();
    } else {
      setErro('Usuário ou senha inválidos.');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.titulo}>FINV</h1>
        <p style={styles.subtitulo}>Financiamento de Veículos</p>

        {erro && <p style={styles.erro}>{erro}</p>}

        <div style={styles.grupo}>
          <label style={styles.label}>Usuário</label>
          <input
            style={styles.input}
            value={usuario}
            onChange={e => { setUsuario(e.target.value); setErro(''); }}
            placeholder="Digite seu usuário"
          />
        </div>

        <div style={styles.grupo}>
          <label style={styles.label}>Senha</label>
          <input
            style={styles.input}
            type="password"
            value={senha}
            onChange={e => { setSenha(e.target.value); setErro(''); }}
            placeholder="Digite sua senha"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button style={styles.botao} onClick={handleLogin}>
          ENTRAR
        </button>

        <p style={styles.dica}>usuário: admin · senha: 1234</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0c0f',
  },
  box: {
    backgroundColor: '#13161c',
    border: '1px solid #2a2f3d',
    borderRadius: '12px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '380px',
  },
  titulo: {
    color: '#f0a500',
    fontSize: '40px',
    margin: '0 0 4px 0',
  },
  subtitulo: {
    color: '#7a8099',
    fontSize: '13px',
    margin: '0 0 28px 0',
  },
  erro: {
    color: '#ef4444',
    fontSize: '13px',
    marginBottom: '12px',
  },
  grupo: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    color: '#7a8099',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '6px',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1c2029',
    border: '1px solid #2a2f3d',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '15px',
    boxSizing: 'border-box',
  },
  botao: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f0a500',
    border: 'none',
    borderRadius: '8px',
    color: '#000000',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  dica: {
    color: '#7a8099',
    fontSize: '11px',
    textAlign: 'center',
    marginTop: '16px',
  },
};

export default Login;