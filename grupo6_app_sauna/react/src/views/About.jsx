import { Link } from 'react-router-dom';

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
        {/* Membro 1 */}
        <div>
          <div style={{ width: '150px', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/*Trocar span de placeholder <img src="/caminho/foto.jpg" alt="Pedro" style={{width: '100%'}} /> */}
            <span style={{ color: '#666', fontSize: '0.9rem' }}>Foto Pedro</span>
          </div>
          <h3 style={{ marginTop: '1rem' }}>Pedro Pelaes Malinconico</h3>
          <p style={{ margin: '0', color: '#666' }}>API Materiais / Front-end</p>
        </div>

        {/* Membro 2 */}
        <div>
          <div style={{ width: '150px', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>Foto Aluno 2</span>
          </div>
          <h3 style={{ marginTop: '1rem' }}>Nome do Aluno 2</h3>
          <p style={{ margin: '0', color: '#666' }}>API Equipamentos / Testes</p>
        </div>

        {/* Membro 3 */}
        <div>
          <div style={{ width: '150px', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>Foto Aluno 3</span>
          </div>
          <h3 style={{ marginTop: '1rem' }}>Nome do Aluno 3</h3>
          <p style={{ margin: '0', color: '#666' }}>API Manutenção / CI-CD</p>
        </div>
      </div>
    </div>
  );
}