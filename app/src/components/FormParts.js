import React from 'react';

export function Campo({ label, value, onChange, placeholder, unit }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ color: 'var(--muted)', fontSize: '0.8rem', display: 'block', marginBottom: 6, letterSpacing: '0.05em' }}>
        {label} {unit && <span style={{ color: 'var(--accent)' }}>({unit})</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '0.85rem 1rem',
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 10, color: 'var(--text)', fontSize: '1rem',
        }}
      />
    </div>
  );
}

export function BtnCalc({ onClick, loading }) {
  return (
    <button onClick={onClick} style={{
      background: loading ? 'var(--border)' : 'var(--accent)',
      color: '#fff', border: 'none', borderRadius: 10,
      padding: '0.9rem', fontSize: '1rem', fontWeight: 600,
      width: '100%', marginTop: '0.5rem', transition: 'all 0.2s',
    }}>
      {loading ? 'Calculando...' : 'Calcular →'}
    </button>
  );
}

export function Resultado({ dados, erro }) {
  if (erro) return (
    <div style={{ background: '#2d0a0a', border: '1px solid var(--error)', borderRadius: 10, padding: '1rem', marginTop: '1.5rem', color: 'var(--error)' }}>
      ⚠️ {erro}
    </div>
  );
  if (!dados) return null;
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--success)', borderRadius: 12, padding: '1.25rem', marginTop: '1.5rem' }}>
      <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '0.75rem' }}>✅ Resultado</p>
      {Object.entries(dados).map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
          <span style={{ color: '#fff', fontWeight: 500 }}>{String(v)}</span>
        </div>
      ))}
    </div>
  );
}
