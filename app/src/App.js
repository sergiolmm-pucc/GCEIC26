import React, { useState } from 'react';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Home from './pages/Home';
import Simulador from './pages/Simulador';
import Capacidade from './pages/Capacidade';
import Sobre from './pages/Sobre';
import Help from './pages/Help';

function App() {
  const [tela, setTela] = useState('splash');

  function handleSplashFim() {
    setTela('login');
  }

  function handleLogin() {
    setTela('home');
  }

  function handleLogout() {
    setTela('login');
  }

  function handleNavegar(destino) {
    setTela(destino);
  }

  return (
    <div>
      {tela === 'splash'     && <Splash onFinish={handleSplashFim} />}
      {tela === 'login'      && <Login onLogin={handleLogin} />}
      {tela === 'home'       && <Home onNavegar={handleNavegar} onLogout={handleLogout} />}
      {tela === 'simulador'  && <Simulador onNavegar={handleNavegar} />}
      {tela === 'capacidade' && <Capacidade onNavegar={handleNavegar} />}
      {tela === 'sobre'      && <Sobre onNavegar={handleNavegar} />}
      {tela === 'help'       && <Help onNavegar={handleNavegar} />}
    </div>
  );
}

export default App;