import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (user === 'admin' && pass === '1234') {
      navigate('/calculadora');
    } else {
      alert('Usuário ou senha incorretos!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Ícone decorativo simples simulando água/piscina */}
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>🏊‍♂️</span>
        </div>

        <h2 style={styles.title}>Calculadora de Custo de uma Piscina</h2>
        <p style={styles.subtitle}>Faça login para acessar a calculadora</p>
        
        <div style={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="Usuário" 
            value={user}
            onChange={(e) => setUser(e.target.value)} 
            style={styles.input}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <input 
            type="password" 
            placeholder="Senha" 
            value={pass}
            onChange={(e) => setPass(e.target.value)} 
            style={styles.input}
          />
        </div>
        
        <button onClick={handleLogin} style={styles.button}>
          Entrar
        </button>
      </div>
    </div>
  );
}

// Objeto de estilos para manter o código limpo e organizado
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', // Degradê azul suave (água)
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    background: '#ffffff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 104, 185, 0.1)', // Sombra leve azulada
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  logoContainer: {
    width: '60px',
    height: '60px',
    background: '#0284c7',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
  },
  logoIcon: {
    fontSize: '28px',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#0f172a',
    fontSize: '24px',
    fontWeight: '700',
  },
  subtitle: {
    margin: '0 0 28px 0',
    color: '#64748b',
    fontSize: '14px',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f8fafc',
    color: '#334155',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#0284c7', // Azul piscina escuro
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
    marginTop: '8px',
  },
};

export default Login;