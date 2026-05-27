import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="fc-navbar navbar navbar-expand-lg">
      <div className="container">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand">
          <i className="bi bi-truck text-orange" />
          Frete<span className="text-orange">Calc</span>
          <span className="brand-dot ms-1" />
        </NavLink>

        {/* Toggler mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#fcNavbar"
          style={{ color: 'var(--fc-muted)' }}
        >
          <i className="bi bi-list fs-5" />
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="fcNavbar">
          <ul className="navbar-nav mx-auto gap-1">
            <li className="nav-item">
              <NavLink to="/simulacao" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <i className="bi bi-calculator" /> Simulação
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/historico" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <i className="bi bi-clock-history" /> Histórico
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/sobre" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <i className="bi bi-people" /> Sobre
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/help" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <i className="bi bi-question-circle" /> Help
              </NavLink>
            </li>
          </ul>

          {/* User info */}
          {user && (
            <div className="d-flex align-items-center gap-3 mt-2 mt-lg-0">
              <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--fc-muted)' }}>
                <i className="bi bi-person-circle me-1" />{user.username}
              </span>
              <button className="fc-btn-ghost" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right" /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
