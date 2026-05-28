import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/salario', label: 'Salario' },
  { to: '/ferias', label: 'Ferias' },
  { to: '/rescisao', label: 'Rescisao' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/help', label: 'Help' },
];

export function Layout() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">E</span>
          <div>
            <strong>ETEC Domestica</strong>
            <small>Calculos academicos</small>
          </div>
        </div>
        <nav className="nav-list" aria-label="Principal">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="secondary-button" type="button" onClick={handleLogout}>
          Sair
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
