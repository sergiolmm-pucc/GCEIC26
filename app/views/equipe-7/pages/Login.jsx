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

        <h2 style={styles.title}>Acesse a Plataforma</h2>
        <p style={styles.subtitle}>Insira suas credenciais abaixo(admin/1234)</p>
        
        <div style={styles.inputGroup}>
          <label style={styles.fieldLabel}>Usuário</label>
          <input 
            type="text" 
            placeholder="Ex: admin" 
            value={user}
            onChange={(e) => setUser(e.target.value)} 
            style={styles.input}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.fieldLabel}>Senha</label>
          <input 
            type="password" 
            placeholder="1234" 
            value={pass}
            onChange={(e) => setPass(e.target.value)} 
            style={styles.input}
          />
        </div>
        
        <button onClick={handleLogin} style={styles.button}>
          Autenticar sistema
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    background: '#ffffff',
    padding: '48px 40px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
    width: '100%',
    maxWidth: '440px',
    border: '1px solid #f1f5f9',
  },
  logoContainer: {
    width: '56px',
    height: '56px',
    background: '#f0f9ff',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px auto',
    border: '1px solid #e0f2fe',
  },
  logoIcon: {
    fontSize: '24px',
  },
  title: {
    margin: '0 0 6px 0',
    color: '#0f172a',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 32px 0',
    color: '#64748b',
    fontSize: '14px',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  button: {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: '#0284c7',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '12px',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)',
  },
};

export default Login;