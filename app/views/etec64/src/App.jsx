import React, { useState } from 'react';
import Splash from './components/Splash';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [screen, setScreen] = useState('splash'); // 'splash', 'login', 'dashboard'

  return (
    <div style={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      {screen === 'splash' && (
        <Splash onFinish={() => setScreen('login')} />
      )}
      
      {screen === 'login' && (
        <Login onLoginSuccess={() => setScreen('dashboard')} />
      )}

      {screen === 'dashboard' && (
        <Dashboard onLogout={() => setScreen('login')} />
      )}
    </div>
  );
}
