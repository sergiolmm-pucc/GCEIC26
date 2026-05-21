import React, { useState } from 'react';

const faqs = [
  {
    q: 'Como calcular a autonomia do meu carro?',
    a: 'Vá em "Calcular Autonomia", informe quantos km você rodou e quantos litros abasteceu. O sistema calculará os km/l e dará uma classificação.',
  },
  {
    q: 'Como saber o custo de uma viagem?',
    a: 'Acesse "Custo de Viagem", informe a distância total, a autonomia do seu carro (km/l) e o preço atual do combustível. O sistema calcula litros necessários e o custo total.',
  },
  {
    q: 'Como funciona a comparação etanol vs gasolina?',
    a: 'Pela Regra dos 70%: se o preço do etanol for menor que 70% do preço da gasolina, o etanol compensa. Nossa calculadora considera também as diferenças de autonomia entre os dois combustíveis.',
  },
  {
    q: 'Como faço login?',
    a: 'Use o usuário "aluno" e a senha "123456".',
  },
  {
    q: 'A API está offline. O que fazer?',
    a: 'Certifique-se de que o servidor Node.js está rodando na porta 3001 (npm start na pasta autonomia-api).',
  },
];

export default function Help() {
  const [aberto, setAberto] = useState(null);

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
        ❓ <span style={{ color: 'var(--accent)' }}>Ajuda</span>
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Perguntas frequentes sobre o AutoCalc.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{
            background: 'var(--card)', border: `1px solid ${aberto === i ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s',
          }}>
            <button onClick={() => setAberto(aberto === i ? null : i)} style={{
              width: '100%', padding: '1rem 1.25rem', textAlign: 'left',
              background: 'transparent', color: '#fff', fontSize: '0.95rem',
              fontWeight: 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              {faq.q}
              <span style={{ color: 'var(--accent)', fontSize: '1.2rem', transition: 'transform 0.2s',
                transform: aberto === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {aberto === i && (
              <div style={{ padding: '0 1.25rem 1rem', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '1rem 1.25rem', color: 'var(--muted)', fontSize: '0.85rem',
      }}>
        📧 Dúvidas? Contate o professor Sérgio Marques — PUC Campinas
      </div>
    </div>
  );
}
