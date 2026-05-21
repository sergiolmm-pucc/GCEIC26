import { Link } from 'react-router-dom';
import fotoPelaes from '../assets/pelaes.jpeg';
import fotoNakao from '../assets/nakao.jpeg';
import fotoNery from '../assets/nery.jpeg';

export default function Sobre() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link to="/calculadora" style={{ textDecoration: 'none', color: '#007bff' }}>&larr; Voltar para Calculadora</Link>
      </nav>
      
      <h2>Sobre a Equipe</h2>
      <p style={{ color: '#555', marginBottom: '3rem' }}>
        Projeto de Cálculo de Custos para Construção de Sauna <br/> 
        Engenharia de Software - PUC-Campinas
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ width: '150px', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={fotoPelaes} alt="Pedro" style={{width: '100%'}} /> 
          </div>
          <h3 style={{ marginTop: '1rem' }}>Pedro Pelaes Malinconico</h3>
          <p style={{ margin: '0', color: '#666' }}>API Materiais / Front-end / CI CD / Testes</p>
        </div>

        <div>
          <div style={{ width: '150px', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={fotoNakao} alt="Pedro" style={{width: '100%'}} /> 
          </div>
          <h3 style={{ marginTop: '1rem' }}>William Kenzo Nakao</h3>
          <p style={{ margin: '0', color: '#666' }}>API Equipamentos / Testes</p>
        </div>

        <div>
          <div style={{ width: '150px', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '50%', margin: '0 auto', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={fotoNery} alt="Pedro" style={{width: '100%'}} /> 
          </div>
          <h3 style={{ marginTop: '1rem' }}>Pedro Facine Nery</h3>
          <p style={{ margin: '0', color: '#666' }}>API Manutenção / Front-End</p>
        </div>
      </div>
    </div>
  );
}