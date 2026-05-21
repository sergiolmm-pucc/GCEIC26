import React from 'react';
import henrique from '../assets/henrique.jpg';
import rafael from '../assets/rafael.png';
import caio from '../assets/caio.jpg';

const equipe = [
  {
    nome: 'Henrique Zacarrias',
    api: 'API: POST /autonomia/calcular',
    foto: henrique,
  },
  {
    nome: 'Rafael Tamura',
    api: 'API: POST /autonomia/custo-viagem',
    foto: rafael,
  },
  {
    nome: 'Caio Adamo',
    api: 'API: POST /autonomia/comparar-combustivel',
    foto: caio,
  },
];

export default function Sobre() {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
        👥 Sobre a <span style={{ color: 'var(--accent)' }}>Equipe</span>
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        PUC Campinas - Escola Politécnica - GCEIC26 -  6º Semestre 
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {equipe.map((m, i) => (
          <div key={i} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center',
          }}>
            <img
              src={m.foto}
              alt={m.nome}
              style={{
                width: 70, height: 70, borderRadius: '50%',
                objectFit: 'cover', objectPosition: 'top',
                border: '2px solid var(--accent)', flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '1.1rem' }}>{m.nome}</div>
              <div style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: 4 }}>{m.api}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '1.25rem',
      }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
          <strong style={{ color: '#fff' }}>Tema:</strong> Cálculo de Autonomia de Carros<br />
          <strong style={{ color: '#fff' }}>Professor:</strong> Sérgio Marques<br />
          <strong style={{ color: '#fff' }}>Repositório:</strong>{' '}
          <a href="https://github.com/sergiolmm-pucc/GCEIC26" target="_blank" rel="noreferrer"
            style={{ color: 'var(--accent2)' }}>
            github.com/sergiolmm-pucc/GCEIC26
          </a>
        </p>
      </div>
    </div>
  );
}
