import React from 'react';

const FAQ = [
  {
    q: 'O que é a Tabela Price?',
    a: 'É o sistema de amortização mais usado em financiamentos no Brasil. As parcelas são fixas, mas nos primeiros meses você paga mais juros e menos amortização.',
  },
  {
    q: 'O que é taxa mensal?',
    a: 'É o percentual de juros cobrado por mês sobre o saldo devedor. Ex: 1,29% ao mês.',
  },
  {
    q: 'Como é calculada a capacidade de financiamento?',
    a: 'Usamos a regra dos 30%: sua parcela mensal não deve ultrapassar 30% da sua renda bruta mensal.',
  },
  {
    q: 'A entrada é obrigatória?',
    a: 'Não. Se não informar, o sistema considera financiamento de 100% do valor do veículo.',
  },
];

function Help({ onNavegar }) {
  return (
    <div style={styles.container}>
      <div style={styles.topbar}>
        <button style={styles.voltar} onClick={() => onNavegar('home')}>← Voltar</button>
        <span style={styles.logo}>Ajuda</span>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Como usar o FINV</h3>
          {[
            ['🧮 Simulador', 'Informe o valor do veículo, entrada, taxa e prazo. O app calcula a parcela mensal e o total pago.'],
            ['💰 Capacidade', 'Informe sua renda mensal. O app mostra o valor máximo de veículo que você pode financiar sem comprometer mais de 30% da renda.'],
          ].map(([titulo, desc]) => (
            <div key={titulo} style={styles.item}>
              <p style={styles.itemTitulo}>{titulo}</p>
              <p style={styles.itemDesc}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Perguntas Frequentes</h3>
          {FAQ.map((item, i) => (
            <div key={i} style={styles.item}>
              <p style={styles.itemTitulo}>❓ {item.q}</p>
              <p style={styles.itemDesc}>{item.a}</p>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Endpoints da API</h3>
          {[
            ['POST /api/parcela', 'Calcula parcela mensal e total pago'],
            ['POST /api/capacidade', 'Calcula capacidade de financiamento pela renda'],
          ].map(([rota, desc]) => (
            <div key={rota} style={styles.endpointItem}>
              <code style={styles.rota}>{rota}</code>
              <span style={styles.itemDesc}>{desc}</span>
            </div>
          ))}
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
  item: { marginBottom: '16px' },
  itemTitulo: { fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px 0', color: '#f0a500' },
  itemDesc: { color: '#a0a8b8', fontSize: '13px', lineHeight: '1.6', margin: '0' },
  endpointItem: { marginBottom: '14px' },
  rota: { display: 'block', color: '#f0a500', fontSize: '13px', fontFamily: 'monospace', marginBottom: '4px' },
};

export default Help;