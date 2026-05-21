import React, { useState } from 'react';
import axios from 'axios';
import { Campo, BtnCalc, Resultado } from '../components/FormParts';
import API_BASE from '../api';

export default function CustoViagem() {
  const [distancia, setDistancia] = useState('');
  const [autonomia, setAutonomia] = useState('');
  const [preco, setPreco] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const calcular = async () => {
    setErro(''); setResultado(null);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/autonomia/custo-viagem`, {
        distanciaKm: Number(distancia),
        autonomiaKmL: Number(autonomia),
        precoCombustivel: Number(preco),
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
        🗺️ Custo de <span style={{ color: 'var(--accent)' }}>Viagem</span>
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Calcule quanto vai gastar de combustível na sua próxima viagem.
      </p>
      <Campo label="Distância da Viagem" value={distancia} onChange={setDistancia} placeholder="Ex: 300" unit="km" />
      <Campo label="Autonomia do Carro" value={autonomia} onChange={setAutonomia} placeholder="Ex: 12" unit="km/l" />
      <Campo label="Preço do Combustível" value={preco} onChange={setPreco} placeholder="Ex: 6.50" unit="R$/L" />
      <BtnCalc onClick={calcular} loading={loading} />
      <Resultado dados={resultado} erro={erro} />
    </div>
  );
}
