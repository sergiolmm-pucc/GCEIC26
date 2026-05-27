import React, { useState } from 'react';
import { User, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');

    if (usuario.trim() === 'admin' && senha === '123456') {
      onLoginSuccess();
    } else {
      setIsShaking(true);
      setErro('Usuário ou senha incorretos! Dica: use admin / 123456');
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className={`glass ${isShaking ? 'animate-shake' : ''}`}
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 16, 32, 0.65)'
        }}
      >
        {/* Cabeçalho do Login */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '6px' }}>Portal Acadêmico</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Faça login para gerenciar notas e frequências ETEC
          </p>
        </div>

        {/* Mensagem de Erro com Ícone */}
        {erro && (
          <div 
            className="badge badge-danger animate-fade-in"
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '10px', 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              textTransform: 'none',
              letterSpacing: 'normal'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{erro}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="input-group">
            <label className="input-label" htmlFor="usuario">
              Usuário
            </label>
            <div style={{ position: 'relative' }}>
              <User 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input
                id="usuario"
                type="text"
                className="input-field"
                placeholder="Insira seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="senha">
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '14px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input
                id="senha"
                type="password"
                className="input-field"
                placeholder="••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            <LogIn size={18} />
            Entrar no Painel
          </button>
        </form>

        {/* Credenciais de Demonstração */}
        <div 
          style={{ 
            fontSize: '0.8rem', 
            color: 'rgba(255,255,255,0.15)', 
            textAlign: 'center',
            marginTop: '8px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '16px'
          }}
        >
          Acesso Acadêmico: <b>admin</b> / <b>123456</b>
        </div>
      </div>
    </div>
  );
}
