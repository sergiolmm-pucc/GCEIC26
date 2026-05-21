import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CalculadoraSauna() {
  const [dimensoes, setDimensoes] = useState({ largura: '', comprimento: '', altura: '' });
  const [tipo, setTipo] = useState('umida');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // fetchs da api
    console.log("Dados prontos para envio à API:", { ...dimensoes, tipo });
    alert("A integração com a API Node ocorrerá aqui!");
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
        <label>
          Tipo de Sauna:
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ marginLeft: '1rem', padding: '0.3rem' }}>
            <option value="umida">Úmida (Vapor)</option>
            <option value="seca">Seca (Finlandesa)</option>
          </select>
        </label>

        <input type="number" placeholder="Largura (m)" step="0.1" required
          value={dimensoes.largura} onChange={(e) => setDimensoes({...dimensoes, largura: e.target.value})} />
        
        <input type="number" placeholder="Comprimento (m)" step="0.1" required
          value={dimensoes.comprimento} onChange={(e) => setDimensoes({...dimensoes, comprimento: e.target.value})} />
        
        <input type="number" placeholder="Altura (m)" step="0.1" required
          value={dimensoes.altura} onChange={(e) => setDimensoes({...dimensoes, altura: e.target.value})} />

        <button type="submit" style={{ padding: '0.8rem', cursor: 'pointer' }}>Calcular Custos</button>
      </form>
    </div>
  );
}