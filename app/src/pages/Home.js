import React from 'react';

const MENUS = [
  { id: 'simulador', emoji: '🧮', titulo: 'Simulador', desc: 'Calcule parcelas e juros' },
  { id: 'capacidade', emoji: '💰', titulo: 'Capacidade', desc: 'Quanto posso financiar?' },
  { id: 'sobre', emoji: '👥', titulo: 'Sobre', desc: 'Equipe do projeto' },
  { id: 'help', emoji: '❓', titulo: 'Ajuda', desc: 'Como usar o app' },
];

function Home({ onNavegar, onLogout }) {
  return (
    <div style={styles.container}>
      <div style={styles.topbar}>
        <span style={styles.logo}>FINV</span>
        <button style={styles.botaoSair} onClick={onLogout}>Sair</button>
      </div>

      <div style={styles.content}>
        <h2 style={styles.bemVindo}>Bem-vindo! 👋</h2>
        <p style={styles.sub}>Simulador de Financiamento de Veículos</p>

        <div style={styles.grid}>
          {MENUS.map(m => (
            <div key={m.id} style={styles.card} onClick={() => onNavegar(m.id)}>
              <span style={styles.emoji}>{m.emoji}</span>
              <span style={styles.cardTitulo}>{m.titulo}</span>
              <span style={styles.cardDesc}>{m.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0c0f',
    color: '#ffffff',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: '#13161c',
    borderBottom: '1px solid #2a2f3d',
  },
  logo: {
    color: '#f0a500',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  botaoSair: {
    backgroundColor: 'transparent',
    border: '1px solid #2a2f3d',
    color: '#7a8099',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  content: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  bemVindo: {
    fontSize: '26px',
    margin: '0 0 4px 0',
  },
  sub: {
    color: '#7a8099',
    fontSize: '14px',
    margin: '0 0 32px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  card: {
    backgroundColor: '#13161c',
    border: '1px solid #2a2f3d',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  emoji: {
    fontSize: '28px',
  },
  cardTitulo: {
    fontWeight: 'bold',
    fontSize: '15px',
  },
  cardDesc: {
    color: '#7a8099',
    fontSize: '12px',
  },
};

export default Home;