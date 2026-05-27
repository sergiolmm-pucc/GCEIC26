import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(isAuthenticated() ? '/' : '/login', { replace: true });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="splash-page">
      <div className="splash-mark">ETEC</div>
      <h1>Encargos de empregada domestica</h1>
    </main>
  );
}
