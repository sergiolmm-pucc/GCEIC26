import { useEffect, useState } from 'react';
import { Calculator, HelpCircle, Info, LogOut } from 'lucide-react';
import Help from './components/Help.jsx';
import Login from './components/Login.jsx';
import Simulador from './components/Simulador/index.jsx';
import Sobre from './components/Sobre.jsx';

export default function App() {
  const [splash, setSplash] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [tela, setTela] = useState('simulador');

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (splash) {
    return <SplashScreen />;
  }

  if (!autenticado) {
    return <Login onLogin={() => setAutenticado(true)} />;
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">PBL</p>
          <h1>Preco Bruto e Liquido</h1>
        </div>
        <nav aria-label="Navegacao principal">
          <button className={tela === 'simulador' ? 'active' : ''} onClick={() => setTela('simulador')}>
            <Calculator size={18} />
            Simulador
          </button>
          <button className={tela === 'sobre' ? 'active' : ''} onClick={() => setTela('sobre')}>
            <Info size={18} />
            Sobre
          </button>
          <button className={tela === 'help' ? 'active' : ''} onClick={() => setTela('help')}>
            <HelpCircle size={18} />
            Help
          </button>
        </nav>
        <button className="logout" onClick={() => setAutenticado(false)}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <section className="content">
        {tela === 'simulador' && <Simulador />}
        {tela === 'sobre' && <Sobre />}
        {tela === 'help' && <Help />}
      </section>
    </main>
  );
}

function SplashScreen() {
  return (
    <section className="splash">
      <div className="splash-mark">PBL</div>
      <h1>Simulador de Preco</h1>
      <p>Calculando preco bruto, liquido, IPI, lucro e margem.</p>
    </section>
  );
}
