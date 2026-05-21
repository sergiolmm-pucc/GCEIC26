import React, { useState } from 'react';
import axios from 'axios';
import { Campo, BtnCalc, Resultado } from '../components/FormParts';
import API_BASE from '../api';

export default function CompararCombustivel() {
  const [precoGas, setPrecoGas] = useState('');
  const [precoEtanol, setPrecoEtanol] = useState('');
  const [autoGas, setAutoGas] = useState('');
  const [autoEtanol, setAutoEtanol] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const calcular = async () => {
    setErro(''); setResultado(null);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/autonomia/comparar-combustivel`, {
        precoGasolina: Number(precoGas),
        precoEtanol: Number(precoEtanol),
        autonomiaGasolina: Number(autoGas),
        autonomiaEtanol: Number(autoEtanol),
      });
      setResultado(data.dados);
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao conectar com a API');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
        🔄 Etanol vs <span style={{ color: 'var(--accent)' }}>Gasolina</span>
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Usando a regra dos 70%, descubra qual combustível é mais econômico para você.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
        <Campo label="Preço Gasolina" value={precoGas} onChange={setPrecoGas} placeholder="Ex: 5.80" unit="R$/L" />
        <Campo label="Preço Etanol" value={precoEtanol} onChange={setPrecoEtanol} placeholder="Ex: 3.90" unit="R$/L" />
        <Campo label="Autonomia Gasolina" value={autoGas} onChange={setAutoGas} placeholder="Ex: 12" unit="km/l" />
        <Campo label="Autonomia Etanol" value={autoEtanol} onChange={setAutoEtanol} placeholder="Ex: 8.5" unit="km/l" />
      </div>
      <BtnCalc onClick={calcular} loading={loading} />
      <Resultado dados={resultado} erro={erro} />
    </div>
  );
}
