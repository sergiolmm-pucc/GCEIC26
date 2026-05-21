import { Link } from 'react-router-dom';

function Help() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', lineHeight: '1.6' }}>
      <Link to="/calculadora" style={{ textDecoration: 'none', color: '#007bff' }}>
        ← Voltar para Calculadora
      </Link>

      <h1>Ajuda e Instruções</h1>
      <p>Bem-vindo ao sistema de cálculo de construção de piscina. Abaixo, explicamos como utilizar as funcionalidades do aplicativo:</p>

      <div style={styles.section}>
        <h3>1. Como calcular o custo?</h3>
        <p>Na tela de <strong>Calculadora</strong>, insira as dimensões da piscina (largura, comprimento e profundidade) em metros. Introduza também os valores unitários de mercado para água, materiais e manutenção.</p>
      </div>

      <div style={styles.section}>
        <h3>2. O que os resultados significam?</h3>
        <ul>
          <li><strong>Volume Total:</strong> A capacidade total da piscina em metros cúbicos (m³).</li>
          <li><strong>Custo da Água:</strong> O valor estimado para encher a piscina pela primeira vez.</li>
          <li><strong>Materiais:</strong> Soma dos gastos com infraestrutura elétrica e hidráulica.</li>
          <li><strong>Manutenção Mensal:</strong> Uma estimativa de gasto recorrente baseada no volume da piscina.</li>
        </ul>
      </div>

      <div style={styles.section}>
        <h3>3. Problemas com o cálculo?</h3>
        <p>Certifique-se de que todos os campos numéricos foram preenchidos corretamente e que o servidor da <strong>API (Node.js)</strong> está ligado e acessível na porta 3000.</p>
      </div>

      <div style={{ marginTop: '30px', fontSize: '0.9rem', color: '#666' }}>
        <p>Projeto GCEIC - Grupo 7</p>
      </div>
    </div>
  );
}

const styles = {
  section: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    borderLeft: '4px solid #007bff'
  }
};

export default Help;