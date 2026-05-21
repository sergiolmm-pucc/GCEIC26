import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CalculadoraSauna() {
  const [dimensoes, setDimensoes] = useState({ largura: '', comprimento: '', altura: '' });
  const [tipo, setTipo] = useState('umida');
  
  // Adicionando estados para a manutenção (com valores padrão para facilitar)
  const [horasUsoMes, setHorasUsoMes] = useState(20);
  const [precoKWh, setPrecoKWh] = useState(0.95);

  const [resultados, setResultados] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Fetch para a API de Materiais
      const respostaMateriais = await fetch('http://localhost:3001/api/SAUNA/materiais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          largura: parseFloat(dimensoes.largura),
          comprimento: parseFloat(dimensoes.comprimento),
          altura: parseFloat(dimensoes.altura),
          tipo: tipo
        })
      });
      const dadosMateriais = await respostaMateriais.json();

      // 2. Fetch para a API de Equipamentos 
      const respostaEquipamentos = await fetch('http://localhost:3001/api/SAUNA/equipamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          volumeM3: dadosMateriais.volumeM3,
          tipo: tipo
        })
      });
      const dadosEquipamentos = await respostaEquipamentos.json();

      // 3. Fetch para a API de Manutenção
      const respostaManutencao = await fetch('http://localhost:3001/api/SAUNA/manutencao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          potenciaGeradorKW: dadosEquipamentos.potenciaGeradorKW,
          horasUsoMes: parseInt(horasUsoMes),
          precoKWh: parseFloat(precoKWh)
        })
      });
      const dadosManutencao = await respostaManutencao.json();
      
      setResultados({
        area: dadosMateriais.areaTotalM2,
        volume: dadosMateriais.volumeM3,
        materiais: dadosMateriais.totalMateriais,
        potencia: dadosEquipamentos.potenciaGeradorKW,
        equipamentos: dadosEquipamentos.totalEquipamentos,
        consumo: dadosManutencao.consumoMensalKWh,
        manutencao: dadosManutencao.totalManutencaoMensal
      });

    } catch (erro) {
      console.error("Erro ao conectar com a API:", erro);
      alert("Falha na comunicação com o servidor. Verifique se a API na porta 3001 está rodando.");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <nav style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
        <Link to="/sobre">Sobre a Equipe</Link>
        <Link to="/help">Ajuda</Link>
        <Link to="/login" style={{ marginLeft: 'auto', color: 'red' }}>Sair</Link>
      </nav>

      <h2>Calculadora de Construção - Sauna</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        
        <fieldset style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <legend>Características da Sauna</legend>
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            Tipo de Sauna:
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ marginLeft: '1rem', padding: '0.3rem' }}>
              <option value="umida">Úmida (Vapor)</option>
              <option value="seca">Seca (Finlandesa)</option>
            </select>
          </label>

          <input type="number" placeholder="Largura (m)" step="0.1" required
            value={dimensoes.largura} onChange={(e) => setDimensoes({...dimensoes, largura: e.target.value})} style={{ display: 'block', marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }} />
          
          <input type="number" placeholder="Comprimento (m)" step="0.1" required
            value={dimensoes.comprimento} onChange={(e) => setDimensoes({...dimensoes, comprimento: e.target.value})} style={{ display: 'block', marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }} />
          
          <input type="number" placeholder="Altura (m)" step="0.1" required
            value={dimensoes.altura} onChange={(e) => setDimensoes({...dimensoes, altura: e.target.value})} style={{ display: 'block', width: '100%', padding: '0.5rem' }} />
        </fieldset>

        <fieldset style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <legend>Uso Estimado</legend>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Horas de uso por mês:
            <input type="number" step="1" required value={horasUsoMes} onChange={(e) => setHorasUsoMes(e.target.value)} style={{ marginLeft: '1rem', width: '80px', padding: '0.3rem' }} />
          </label>
          <label style={{ display: 'block' }}>
            Preço do kWh (R$):
            <input type="number" step="0.01" required value={precoKWh} onChange={(e) => setPrecoKWh(e.target.value)} style={{ marginLeft: '1rem', width: '80px', padding: '0.3rem' }} />
          </label>
        </fieldset>

        <button type="submit" style={{ padding: '0.8rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginTop: '1rem' }}>
          Calcular Custos
        </button>
        
        {resultados && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #28a745', borderRadius: '8px', backgroundColor: '#f8fff9' }}>
          <h3 style={{ marginTop: 0, color: '#28a745' }}>Resultados do Cálculo:</h3>
          <p><strong>Área Total:</strong> {resultados.area} m²</p>
          <p><strong>Volume Interno:</strong> {resultados.volume} m³</p>
          <hr style={{ borderColor: '#ccc', margin: '1rem 0' }} />
          <p><strong>Custo de Materiais:</strong> R$ {resultados.materiais.toFixed(2)}</p>
          <p><strong>Custo de Equipamentos ({resultados.potencia} kW):</strong> R$ {resultados.equipamentos.toFixed(2)}</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Custo Fixo Total: R$ {(resultados.materiais + resultados.equipamentos).toFixed(2)}</p>
          <hr style={{ borderColor: '#ccc', margin: '1rem 0' }} />
          <p><strong>Consumo de Energia Mensal:</strong> {resultados.consumo} kWh</p>
          <p><strong>Custo Total de Manutenção/Mês:</strong> R$ {resultados.manutencao.toFixed(2)}</p>
        </div>
      )}
      </form>
    </div>
  );
}