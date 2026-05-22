import React from 'react';

const EQUIPE = [
  { nome: 'Felipe Nonato', ra: 'RA: 24021973', papel: 'React App + Testes', foto: require('../view/Nonato.jpg')},
  { nome: 'Rafael Pires', ra: 'RA: 24007131', papel: 'API + Testes', foto: require('../view/Rafael.jpg')},
];

function Sobre({ onNavegar }) {
  return (
    <div style={styles.container}>
      <div style={styles.topbar}>
        <button style={styles.voltar} onClick={() => onNavegar('home')}>← Voltar</button>
        <span style={styles.logo}>Sobre</span>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Sobre o Projeto</h3>
          <p style={styles.texto}>
            O <strong>FINV</strong> é um simulador de financiamento de veículos desenvolvido
            para a disciplina de Gerência de Configuração, Entrega e Integração Contínua
            (GCEIC26) da Escola Politécnica da PUC-Campinas, 1º semestre de 2026.
          </p>
          <div style={styles.infoGrid}>
            {[
              ['Disciplina', 'GCEIC26'],
              ['Professor', 'Sérgio Marques'],
              ['Semestre', '1S/2026'],
              ['Stack', 'Node.js + React'],
            ].map(([k, v]) => (
              <div key={k} style={styles.infoItem}>
                <span style={styles.infoLabel}>{k}</span>
                <span style={styles.infoValor}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Nossa Equipe</h3>

          <div style={styles.membroGrid}>
            {EQUIPE.map(m => (
              <div key={m.nome} style={styles.membroCard}>
                <div style={styles.avatar}>{<img src={m.foto} alt={m.nome} style={styles.avatar} />}</div>
                <span style={styles.membroNome}>{m.nome}</span>
                <span style={styles.membroRa}>{m.ra}</span>
                <span style={styles.membroPapel}>{m.papel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0c0f', color: '#ffffff' },
  topbar: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', backgroundColor: '#13161c', borderBottom: '1px solid #2a2f3d' },
  voltar: { backgroundColor: 'transparent', border: '1px solid #2a2f3d', color: '#7a8099', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  logo: { color: '#f0a500', fontSize: '20px', fontWeight: 'bold' },
  content: { maxWidth: '600px', margin: '0 auto', padding: '24px' },
  card: { backgroundColor: '#13161c', border: '1px solid #2a2f3d', borderRadius: '12px', padding: '24px', marginBottom: '16px' },
  cardTitulo: { color: '#f0a500', fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', textTransform: 'uppercase' },
  texto: { color: '#a0a8b8', fontSize: '14px', lineHeight: '1.7', margin: '0 0 20px 0' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  infoItem: { backgroundColor: '#1c2029', border: '1px solid #2a2f3d', borderRadius: '8px', padding: '10px 14px' },
  infoLabel: { display: 'block', color: '#7a8099', fontSize: '11px', textTransform: 'uppercase' },
  infoValor: { display: 'block', fontWeight: 'bold', fontSize: '14px', marginTop: '2px' },
  fotoPlaceholder: { width: '100%', height: '160px', backgroundColor: '#1c2029', border: '2px dashed #2a2f3d', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8099', fontSize: '13px', marginBottom: '20px' },
  membroGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  membroCard: { backgroundColor: '#1c2029', border: '1px solid #2a2f3d', borderRadius: '10px', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  avatar: { width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px' },  membroNome: { fontWeight: 'bold', fontSize: '14px' },
  membroRa: { color: '#7a8099', fontSize: '12px' },
  membroPapel: { color: '#f0a500', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' },
  foto: { width: '100%', borderRadius: '10px', marginBottom: '20px' },
};

export default Sobre;