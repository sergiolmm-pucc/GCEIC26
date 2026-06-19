import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE = '/PISCINA2';

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
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const calcularCusto = async () => {
    setErro('');
    setResultado(null);

    try {
      const resVolume = await axios.post(`${API_BASE}/volume/calcular`, {
        largura: dados.largura,
        comprimento: dados.comprimento,
        profundidade: dados.profundidade
      });
      const volumeCalculado = resVolume.data.volume;

      const resMateriais = await axios.post(`${API_BASE}/materiais/calcular`, {
        precoEletrico: dados.precoEletrico,
        precoHidraulico: dados.precoHidraulico
      });

      const resCustos = await axios.post(`${API_BASE}/custos/calcular`, {
        volume: volumeCalculado,
        precoAgua: dados.precoAgua,
        precoManutencao: dados.precoManutencao
      });

      setResultado({
        volume: volumeCalculado,
        custoMateriais: resMateriais.data.custoMateriais,
        custoAgua: resCustos.data.custoAgua,
        custoManutencao: resCustos.data.custoManutencao,
        totalObra: (
          parseFloat(resCustos.data.custoAgua) +
          parseFloat(resCustos.data.custoManutencao) +
          parseFloat(resMateriais.data.custoMateriais)
        ).toFixed(2)
      });

    } catch (error) {
      console.error("Erro ao calcular em múltiplas APIs:", error);
      setErro(error.response?.data?.error || 'Erro ao conectar com as APIs. Verifique se os servidores Node estao rodando.');
    }
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>💧 AquaCalc</div>
        <div style={styles.navLinks}>
          <Link to="/sobre" style={styles.navLink}>Sobre a Equipe</Link>
          <Link to="/help" style={styles.navLink}>Ajuda</Link>
          <Link to="/login" style={styles.logoutLink}>Sair</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dimensionamento & Custos</h1>
          <p style={styles.subtitle}>Insira as especificações técnicas da piscina para gerar a simulação</p>
        </div>

        <div style={styles.layoutGrid}>
          {/* Formulário */}
          <div style={styles.formCard}>
            <h2 style={styles.sectionTitle}>1. Especificações Volumétricas</h2>
            <div style={styles.inputGroupRow}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Largura (m)</label>
                <input type="number" name="largura" placeholder="0.00" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Comprimento (m)</label>
                <input type="number" name="comprimento" placeholder="0.00" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Profundidade (m)</label>
                <input type="number" name="profundidade" placeholder="0.00" onChange={handleChange} style={styles.input} />
              </div>
            </div>

            <h2 style={styles.sectionTitle}>2. Precificação Comercial e Insumos</h2>
            <div style={styles.inputGrid}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Preço da Água (R$/m³)</label>
                <input type="number" name="precoAgua" placeholder="R$ 0,00" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Manutenção Mensal (R$/m³)</label>
                <input type="number" name="precoManutencao" placeholder="R$ 0,00" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Infraestrutura Elétrica</label>
                <input type="number" name="precoEletrico" placeholder="R$ 0,00" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Infraestrutura Hidráulica</label>
                <input type="number" name="precoHidraulico" placeholder="R$ 0,00" onChange={handleChange} style={styles.input} />
              </div>
            </div>

            <button onClick={calcularCusto} style={styles.button}>
              Calcular Projeto
            </button>

            {erro && (
              <p style={styles.errorMessage}>{erro}</p>
            )}
          </div>

          {/* Seção de Resultados Dinâmica */}
          <div style={styles.resultContainer}>
            {resultado ? (
              <div style={styles.resultCard}>
                <h3 style={styles.resultTitle}>📋 Relatório Orçamentário</h3>
                
                <div style={styles.resultItem}>
                  <span style={styles.resultLabel}>Capacidade Total Volumétrica:</span>
                  <span style={styles.resultValue}>{resultado.volume} m³</span>
                </div>
                
                <div style={styles.resultItem}>
                  <span style={styles.resultLabel}>Abastecimento Inicial (Água):</span>
                  <span style={styles.resultValue}>R$ {parseFloat(resultado.custoAgua).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div style={styles.resultItem}>
                  <span style={styles.resultLabel}>Custos Totais de Materiais:</span>
                  <span style={styles.resultValue}>R$ {parseFloat(resultado.custoMateriais).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div style={styles.resultItem}>
                  <span style={styles.resultLabel}>Previsão de Manutenção Mensal:</span>
                  <span style={{ ...styles.resultValue, color: '#0284c7' }}>
                    R$ {parseFloat(resultado.custoManutencao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês
                  </span>
                </div>

                <div style={styles.divider}></div>
                
                <div style={styles.totalBlock}>
                  <div>
                    <span style={styles.totalLabel}>Investimento de Implantação</span>
                    <p style={styles.totalSubtext}>Soma de infraestrutura, primeiro abastecimento e manutenção estimada</p>
                  </div>
                  <h4 style={styles.totalValue}>R$ {parseFloat(resultado.totalObra).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                </div>
              </div>
            ) : (
              <div style={styles.emptyResultCard}>
                <span style={styles.emptyIcon}>📊</span>
                <p style={styles.emptyText}>Aguardando parâmetros informados para consolidar o relatório.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    color: '#0f172a',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 40px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
  },
  navBrand: {
    fontWeight: '700',
    fontSize: '20px',
    color: '#0284c7',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: '#475569',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  logoutLink: {
    textDecoration: 'none',
    color: '#ef4444',
    fontWeight: '600',
    fontSize: '13px',
    padding: '6px 14px',
    borderRadius: '8px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '48px 20px',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: 0,
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '32px',
    alignItems: 'start',
  },
  formCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '36px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.02)',
    border: '1px solid #e1e8ed',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0284c7',
    margin: '0 0 20px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  inputGroupRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '36px',
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '28px',
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
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    marginTop: '12px',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)',
  },
  errorMessage: {
    margin: '16px 0 0 0',
    padding: '12px 14px',
    borderRadius: '10px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    fontSize: '14px',
    fontWeight: '600',
  },
  resultContainer: {
    width: '100%',
  },
  resultCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '36px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.02)',
    border: '1px solid #e1e8ed',
    borderTop: '4px solid #0284c7',
  },
  emptyResultCard: {
    background: '#f8fafc',
    borderRadius: '16px',
    padding: '60px 40px',
    border: '2px dashed #e2e8f0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '16px',
    opacity: 0.6,
  },
  emptyText: {
    fontSize: '14px',
    color: '#64748b',
    maxWidth: '280px',
    lineHeight: '1.5',
    margin: 0,
  },
  resultTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 24px 0',
    letterSpacing: '-0.3px',
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '14.5px',
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
    margin: '28px 0',
  },
  totalBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    display: 'block',
  },
  totalSubtext: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    color: '#64748b',
  },
  totalValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0284c7',
    margin: 0,
    letterSpacing: '-0.5px',
  }
};

export default Calculadora;
