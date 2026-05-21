import { useNavigate, useLocation } from 'react-router-dom';

function LogoMark() {
  return (
    <div style={{
      width: 30, height: 30, border: '1.2px solid var(--ink)', borderRadius: 7,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'var(--font)', fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>M</span>
      <span style={{
        position: 'absolute', top: 4, right: 5,
        width: 3.5, height: 3.5, borderRadius: 2, background: 'var(--accent)',
      }} />
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path     = location.pathname;

  function logout() {
    sessionStorage.removeItem('mkp_auth');
    navigate('/login');
  }

  const tabs = [
    { label: 'Calcular', href: '/calculo' },
    { label: 'Sobre',    href: '/sobre'   },
    { label: 'Ajuda',    href: '/help'    },
  ];

  function isActive(href) {
    if (href === '/calculo') return path === '/calculo' || path === '/home';
    return path === href;
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(250,250,247,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--hair)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '18px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <button onClick={() => navigate('/calculo')} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <LogoMark />
          <span style={{ fontFamily: 'var(--font)', fontSize: 15, color: 'var(--ink)', letterSpacing: -0.1 }}>
            MarkUp
          </span>
        </button>

        <nav style={{ display: 'flex', gap: 4 }}>
          {tabs.map(t => {
            const active = isActive(t.href);
            return (
              <button key={t.href} onClick={() => navigate(t.href)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 14px', borderRadius: 8,
                fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500,
                color: active ? 'var(--ink)' : 'var(--muted)',
                position: 'relative',
              }}>
                {t.label}
                {active && (
                  <span style={{
                    position: 'absolute', bottom: -19, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4, height: 4, borderRadius: 2, background: 'var(--accent)',
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 0.4 }}>
            admin
          </span>
          <button onClick={logout} style={{
            background: 'none', border: '1px solid var(--hair)', borderRadius: 8,
            padding: '8px 14px', cursor: 'pointer',
            fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink)',
          }}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
