import { Link } from 'react-router-dom';

function Help() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Link to="/calculadora" style={styles.backButton}>
          ← Voltar para o Painel Principal
        </Link>

        <h1 style={styles.title}>Documentação de Apoio</h1>
        <p style={styles.subtitle}>Instruções operacionais sobre as variáveis e integrações do sistema de cálculo.</p>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>1. Como calcular o custo?</h3>
          <p style={styles.text}>Na tela de <strong>Calculadora</strong>, insira as dimensões físicas em metros. Introduza também os valores contratuais e tarifas de mercado vigentes em sua região para água, materiais e serviços periódicos.</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>2. Mapeamento de Outputs</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}><strong>Volume Total:</strong> Capacidade calculada em metros cúbicos ($m^3$).</li>
            <li style={styles.listItem}><strong>Custo da Água:</strong> Projeção financeira do primeiro ciclo de abastecimento.</li>
            <li style={styles.listItem}><strong>Materiais:</strong> Consolidado estrutural hidráulico e elétrico.</li>
            <li style={styles.listItem}><strong>Manutenção Mensal:</strong> Custos operacionais recorrentes estimados por volume.</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>3. Verificação de Conectividade API</h3>
          <p style={styles.text}>Caso ocorra falhas no processamento, assegure-se de que o backend da aplicação construído em <strong>Node.js</strong> encontra-se operacional no servidor na porta padrão <code>3000</code>.</p>
        </div>

        <div style={styles.footer}>
          <p>Projeto GCEIC — Grupo 7</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    padding: '48px 20px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '48px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.02)',
    width: '100%',
    maxWidth: '720px',
    border: '1px solid #e2e8f0',
  },
  backButton: {
    textDecoration: 'none',
    color: '#0284c7',
    fontWeight: '600',
    fontSize: '14px',
    display: 'inline-block',
    marginBottom: '28px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: '0 0 40px 0',
    lineHeight: '1.5',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #f1f5f9',
    borderLeft: '4px solid #0284c7',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 10px 0',
  },
  text: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
    margin: 0,
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  listItem: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.5',
  },
  footer: {
    marginTop: '40px',
    fontSize: '12px',
    color: '#94a3b8',
    textAlign: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '24px',
  }
};

export default Help;