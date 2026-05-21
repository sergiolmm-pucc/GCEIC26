import React, { useState, useEffect } from 'react';
import './index.css';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Home from './pages/Home';
import Calcular from './pages/Calcular';
import CustoViagem from './pages/CustoViagem';
import CompararCombustivel from './pages/CompararCombustivel';
import Sobre from './pages/Sobre';
import Help from './pages/Help';
import Navbar from './components/Navbar';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('login'), 2500);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const navigate = (s) => setScreen(s);

  const handleLogin = () => {
    setLogado(true);
    setScreen('home');
  };

  const handleLogout = () => {
    setLogado(false);
    setScreen('login');
  };

  if (screen === 'splash') return <Splash />;
  if (screen === 'login') return <Login onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar navigate={navigate} onLogout={handleLogout} current={screen} />
      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: 700, margin: '0 auto', width: '100%' }}>
        {screen === 'home' && <Home navigate={navigate} />}
        {screen === 'calcular' && <Calcular />}
        {screen === 'custo-viagem' && <CustoViagem />}
        {screen === 'comparar' && <CompararCombustivel />}
        {screen === 'sobre' && <Sobre />}
        {screen === 'help' && <Help />}
      </main>
    </div>
  );
}
