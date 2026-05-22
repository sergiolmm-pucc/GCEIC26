import React, { useState } from 'react';

function Capacidade({ onNavegar }) {
  const [form, setForm] = useState({
    rendaMensal: '',
    taxaMensal: '1.29',
    numParcelas: '48',
    entradaPercent: '20',
  });
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
  }

  async function calcular() {
    setErro('');
    setResultado(null);
    if (!form.rendaMensal || Number(form.rendaMensal) <= 0) {
      return setErro('Informe sua renda mensal.');
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/capacidade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rendaMensal: Number(form.rendaMensal),
          taxaMensal: Number(form.taxaMensal),
          numParcelas: Number(form.numParcelas),
          entradaPercent: Number(form.entradaPercent),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setResultado(json.data);
    } catch (e) {
      setErro(e.message || 'Erro ao conectar com a API.');
    } finally {
      setLoading(false);
    }
  }

  function fmt(val) {
    return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div style={styles.container}>
      <div style={styles.topbar}>
        <button style={styles.voltar} onClick={() => onNavegar('home')}>← Voltar</button>
        <span style={styles.logo}>Capacidade</span>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h3 style={styles.cardTitulo}>Quanto posso financiar?</h3>
          <p style={styles.descricao}>Calcula o valor máximo com base em 30% da sua renda mensal.</p>

          <div style={styles.grupo}>
            <label style={styles.label}>Renda Mensal (R$)</label>
            <input style={styles.input} type="number" placeholder="Ex: 8000"
              value={form.rendaMensal} onChange={e => set('rendaMensal', e.target.value)} />
          </div>

          <div style={styles.linha}>
            <div style={{ ...styles.grupo, flex: 1 }}>
              <label style={styles.label}>Taxa Mensal (%)</label>
              <input style={styles.input} type="number" step="0.01"
                value={form.taxaMensal} onChange={e => set('taxaMensal', e.target.value)} />
            </div>
            <div style={{ ...styles.grupo, flex: 1 }}>
              <label style={styles.label}>Nº Parcelas</label>
              <input style={styles.input} type="number"
                value={form.numParcelas} onChange={e => set('numParcelas', e.target.value)} />
            </div>
          </div>

          <div style={styles.grupo}>
            <label style={styles.label}>Entrada (%)</label>
            <input style={styles.input} type="number" placeholder="Ex: 20"
              value={form.entradaPercent} onChange={e => set('entradaPercent', e.target.value)} />
          </div>

          {erro && <p style={styles.erro}>{erro}</p>}

          <button style={styles.botao} onClick={calcular} disabled={loading}>
            {loading ? 'Calculando...' : 'CALCULAR'}
          </button>
        </div>

        {resultado && (
          <div style={styles.card}>
            <h3 style={styles.cardTitulo}>Resultado</h3>
            {[
              ['Parcela Máxima (30% da renda)', fmt(resultado.parcelaMaxima)],
              ['Valor Máximo do Veículo', fmt(resultado.valorVeiculoMax)],
              ['Valor Máximo a Financiar', fmt(resultado.valorFinanciadoMax)],
            ].map(([label, valor]) => (
              <div key={label} style={styles.linha2}>
                <span style={styles.resultLabel}>{label}</span>
                <span style={styles.resultValor}>{valor}</span>
              </div>
            ))}
          </div>
        )}
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
  cardTitulo: { color: '#f0a500', fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' },
  descricao: { color: '#7a8099', fontSize: '13px', margin: '0 0 20px 0' },
  grupo: { marginBottom: '16px' },
  label: { display: 'block', color: '#7a8099', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px', backgroundColor: '#1c2029', border: '1px solid #2a2f3d', borderRadius: '8px', color: '#ffffff', fontSize: '15px', boxSizing: 'border-box' },
  linha: { display: 'flex', gap: '12px' },
  erro: { color: '#ef4444', fontSize: '13px', marginBottom: '12px' },
  botao: { width: '100%', padding: '12px', backgroundColor: '#f0a500', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' },
  linha2: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2f3d' },
  resultLabel: { color: '#7a8099', fontSize: '14px' },
  resultValor: { fontWeight: 'bold', fontSize: '15px' },
};

export default Capacidade;