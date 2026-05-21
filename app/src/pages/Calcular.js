import React, { useState } from 'react';
import axios from 'axios';
import { Campo, BtnCalc, Resultado } from '../components/FormParts';
import API_BASE from '../api';

export default function Calcular() {
  const [km, setKm] = useState('');
  const [litros, setLitros] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const calcular = async () => {
    setErro(''); setResultado(null);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/autonomia/calcular`, {
        kmPercorridos: Number(km),
        litrosAbastecidos: Number(litros),
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
        ⛽ Calcular <span style={{ color: 'var(--accent)' }}>Autonomia</span>
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Informe os km percorridos e os litros abastecidos para descobrir a autonomia do seu carro.
      </p>
      <Campo label="KM Percorridos" value={km} onChange={setKm} placeholder="Ex: 500" unit="km" />
      <Campo label="Litros Abastecidos" value={litros} onChange={setLitros} placeholder="Ex: 40" unit="L" />
      <BtnCalc onClick={calcular} loading={loading} />
      <Resultado dados={resultado} erro={erro} />
    </div>
  );
}
