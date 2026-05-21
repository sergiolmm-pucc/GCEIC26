import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Calculadora() {
  const [dados, setDados] = useState({
    largura: '',
    comprimento: '',
    profundidade: '',
    precoAgua: '',
    precoEletrico: '',
    precoHidraulico: '',
    precoManutencao: ''
  });

  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const calcularCusto = async () => {
    try {
      const resVolume = await axios.post('http://localhost:3000/PISCINA/volume/calcular', {
        largura: dados.largura,
        comprimento: dados.comprimento,
        profundidade: dados.profundidade
      });
      const volumeCalculado = resVolume.data.volume;

      const resMateriais = await axios.post('http://localhost:3000/PISCINA/materiais/calcular', {
        precoEletrico: dados.precoEletrico,
        precoHidraulico: dados.precoHidraulico
      });

      const resCustos = await axios.post('http://localhost:3000/PISCINA/custos/calcular', {
        volume: volumeCalculado,
        precoAgua: dados.precoAgua,
        precoManutencao: dados.precoManutencao
      });

      setResultado({
        volume: volumeCalculado,
        custoMateriais: resMateriais.data.custoMateriais,
        custoAgua: resCustos.data.custoAgua,
        custoManutencao: resCustos.data.custoManutencao,
        totalObra: (parseFloat(resCustos.data.custoAgua) + parseFloat(resMateriais.data.custoMateriais)).toFixed(2)
      });

    } catch (error) {
      console.error("Erro ao calcular em múltiplas APIs:", error);
      alert("Erro ao conectar com as APIs. Verifique se o servidor Node está rodando!");
    }
  };

  return (
    <div style={styles.container}>
      {/* Menu de Navegação Superior */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>🏊‍♂️ GCEIC2026</div>
        <div style={styles.navLinks}>
          <Link to="/sobre" style={styles.navLink}>Sobre a Equipe</Link>
          <Link to="/help" style={styles.navLink}>Ajuda</Link>
          <Link to="/login" style={styles.logoutLink}>Sair</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Cálculo de Custo da Piscina</h1>
          <p style={styles.subtitle}>Insira as dimensões e parâmetros para simular o orçamento</p>
        </div>

        <div style={styles.gridContainer}>
          {/* Formulário */}
          <div style={styles.formCard}>
            <h2 style={styles.sectionTitle}>1. Dimensões da Piscina</h2>
            <div style={styles.inputGroupRow}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Largura (m)</label>
                <input type="number" name="largura" placeholder="Ex: 4" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Comprimento (m)</label>
                <input type="number" name="comprimento" placeholder="Ex: 8" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Profundidade (m)</label>
                <input type="number" name="profundidade" placeholder="Ex: 1.5" onChange={handleChange} style={styles.input} />
              </div>
            </div>

            <h2 style={styles.sectionTitle}>2. Custos Unitários e Materiais</h2>
            <div style={styles.inputGrid}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Preço da Água (por m³)</label>
                <input type="number" name="precoAgua" placeholder="R$" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Manutenção Mensal (por m³)</label>
                <input type="number" name="precoManutencao" placeholder="R$" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Custo Material Elétrico</label>
                <input type="number" name="precoEletrico" placeholder="R$" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Custo Material Hidráulico</label>
                <input type="number" name="precoHidraulico" placeholder="R$" onChange={handleChange} style={styles.input} />
              </div>
            </div>

            <button onClick={calcularCusto} style={styles.button}>
              Calcular Projeto 🚀
            </button>
          </div>

          {/* Resultado */}
{resultado && (
  <div style={styles.resultCard}>
    <h3 style={styles.resultTitle}>📋 Resumo do Orçamento</h3>
    
    <div style={styles.resultItem}>
      <span style={styles.resultLabel}>Volume Estimado:</span>
      <span style={styles.resultValue}>{resultado.volume} m³</span>
    </div>
    
    <div style={styles.resultItem}>
      <span style={styles.resultLabel}>Custo de Abastecimento (Água):</span>
      <span style={styles.resultValue}>R$ {parseFloat(resultado.custoAgua).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
    </div>
    
    <div style={styles.resultItem}>
      <span style={styles.resultLabel}>Custo Total de Materiais:</span>
      <span style={styles.resultValue}>R$ {parseFloat(resultado.custoMateriais).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
    </div>

    <div style={styles.resultItem}>
      <span style={styles.resultLabel}>Manutenção Estimada (Mensal):</span>
      {/* Aqui está a correção: juntamos os dois styles em um só */}
      <span style={{ ...styles.resultValue, color: '#0284c7' }}>
        R$ {parseFloat(resultado.custoManutencao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
      </span>
    </div>

    <div style={styles.divider}></div>
    
    <div style={styles.totalBlock}>
      <span style={styles.totalLabel}>Custo Total de Implantação:</span>
      <h4 style={styles.totalValue}>R$ {parseFloat(resultado.totalObra).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
    </div>
  </div>
)}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f9ff', // Azul água bem claro de fundo
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#1e293b',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  navBrand: {
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#0284c7',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: '#64748b',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  logoutLink: {
    textDecoration: 'none',
    color: '#ef4444',
    fontWeight: '600',
    fontSize: '14px',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #fee2e2',
    backgroundColor: '#fef2f2',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: 0,
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    alignItems: 'center',
  },
  formCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0, 104, 185, 0.08)',
    width: '100%',
    maxWidth: '650px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0369a1',
    margin: '0 0 20px 0',
    borderBottom: '2px solid #f0f9ff',
    paddingBottom: '8px',
  },
  inputGroupRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
    marginTop: '16px',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
  },
  resultCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 4px 25px rgba(0, 104, 185, 0.12)',
    width: '100%',
    maxWidth: '650px',
    borderLeft: '5px solid #0284c7',
  },
  resultTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 24px 0',
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  resultLabel: {
    color: '#64748b',
    fontWeight: '500',
  },
  resultValue: {
    color: '#0f172a',
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '24px 0',
  },
  totalBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0284c7',
    margin: 0,
  }
};

export default Calculadora;