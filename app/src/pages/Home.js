import React from 'react';

const cards = [
  { key: 'calcular', icon: '⛽', title: 'Calcular Autonomia', desc: 'Descubra quantos km seu carro faz por litro' },
  { key: 'custo-viagem', icon: '🗺️', title: 'Custo de Viagem', desc: 'Calcule o gasto de combustível para uma viagem' },
  { key: 'comparar', icon: '🔄', title: 'Etanol vs Gasolina', desc: 'Descubra qual combustível compensa mais' },
];

export default function Home({ navigate }) {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#fff' }}>
          Bem-vindo ao <span style={{ color: 'var(--accent)' }}>AutoCalc</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>
          Calcule autonomia, planeje viagens e economize combustível.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {cards.map(card => (
          <button key={card.key} onClick={() => navigate(card.key)} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '1.5rem', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: '1.25rem',
            transition: 'all 0.2s', cursor: 'pointer', width: '100%',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
          >
            <span style={{ fontSize: '2.5rem' }}>{card.icon}</span>
            <div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '1.1rem' }}>{card.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>{card.desc}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '1.5rem' }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
