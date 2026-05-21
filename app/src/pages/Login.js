import React, { useState } from 'react';

// Credenciais fixas conforme requisito do trabalho
const USER_FIXO = 'aluno';
const SENHA_FIXA = '123456';

export default function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setErro('');
    if (!user || !senha) { setErro('Preencha todos os campos'); return; }
    setLoading(true);
    setTimeout(() => {
      if (user === USER_FIXO && senha === SENHA_FIXA) {
        onLogin();
      } else {
        setErro('Usuário ou senha incorretos');
        setLoading(false);
      }
    }, 600);
  };

  const inp = {
    width: '100%', padding: '0.85rem 1rem',
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: '1rem',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: '1rem',
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '2.5rem 2rem', width: '100%', maxWidth: 400,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem' }}>🔐</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#fff' }}>
            Auto<span style={{ color: 'var(--accent)' }}>Calc</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>Faça login para continuar</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: 8, background: 'var(--card)', borderRadius: 6, padding: '4px 8px' }}>
            Demo: <b style={{color:'var(--accent)'}}>aluno</b> / <b style={{color:'var(--accent)'}}>123456</b>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ color: 'var(--muted)', fontSize: '0.8rem', display: 'block', marginBottom: 6 }}>USUÁRIO</label>
            <input style={inp} value={user} onChange={e => setUser(e.target.value)}
              placeholder="usuário" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <div>
            <label style={{ color: 'var(--muted)', fontSize: '0.8rem', display: 'block', marginBottom: 6 }}>SENHA</label>
            <input style={inp} type="password" value={senha} onChange={e => setSenha(e.target.value)}
              placeholder="••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          {erro && <p style={{ color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center' }}>{erro}</p>}

          <button onClick={handleLogin} disabled={loading} style={{
            background: loading ? 'var(--border)' : 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '0.9rem', fontSize: '1rem', fontWeight: 600,
            transition: 'all 0.2s', marginTop: '0.5rem',
          }}>
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </div>
      </div>
    </div>
  );
}
