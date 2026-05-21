import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Credenciais fixas conforme exigência da atividade
    if (usuario === 'admin' && senha === '1234') {
      navigate('/calculadora');
    } else {
      setErro('Usuário ou senha inválidos.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Acesso ao Sistema</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Usuário" 
          value={usuario} 
          onChange={(e) => setUsuario(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          required
        />
        <button type="submit">Entrar</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </form>
    </div>
  );
}