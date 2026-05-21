import React from 'react';

const items = [
  { key: 'home', label: '🏠 Home' },
  { key: 'calcular', label: '⛽ Autonomia' },
  { key: 'custo-viagem', label: '🗺️ Viagem' },
  { key: 'comparar', label: '🔄 Comparar' },
  { key: 'sobre', label: '👥 Sobre' },
  { key: 'help', label: '❓ Help' },
];

export default function Navbar({ navigate, onLogout, current }) {
  return (
    <nav style={{
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      padding: '0 1rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: '1.5rem',
        fontWeight: 700, color: '#fff', padding: '0.75rem 0',
      }}>
        Auto<span style={{ color: 'var(--accent)' }}>Calc</span>
      </span>

      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
        {items.map(item => (
          <button key={item.key} onClick={() => navigate(item.key)} style={{
            background: current === item.key ? 'var(--accent)' : 'transparent',
            color: current === item.key ? '#fff' : 'var(--muted)',
            padding: '0.4rem 0.75rem', borderRadius: 8,
            fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s',
            border: '1px solid transparent',
          }}>
            {item.label}
          </button>
        ))}
        <button onClick={onLogout} style={{
          background: 'transparent', color: 'var(--error)',
          padding: '0.4rem 0.75rem', borderRadius: 8,
          fontSize: '0.8rem', border: '1px solid var(--error)',
        }}>
          Sair
        </button>
      </div>
    </nav>
  );
}
