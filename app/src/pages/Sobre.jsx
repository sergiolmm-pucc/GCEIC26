import { Link } from 'react-router-dom';

function Sobre() {
  const integrantes = [
    { nome: "Bruno Lenitta Machado", papel: "Desenvolvedor", inicial: "B" },
    { nome: "Nicolas Mitjans Nunes", papel: "Desenvolvedor", inicial: "N" },
    { nome: "Gabriel Scolfaro de Azeredo", papel: "Desenvolvedor", inicial: "G" }
  ];

  return (
    <div style={styles.container}>
      {/* Botão flutuante de Retorno */}
      <div style={styles.backWrapper}>
        <Link to="/calculadora" style={styles.backButton}>
          ← Voltar para a Calculadora
        </Link>
      </div>

      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.badge}>Grupo 7</span>
          <h1 style={styles.title}>Sobre a Equipe</h1>
          <p style={styles.subtitle}>Projeto GCEIC - GCEIC2026</p>
        </div>

        {/* Simulador de imagem real / Frame elegante */}
        <div style={styles.photoContainer}>
          <div style={styles.photoPlaceholder}>
            <span style={styles.photoIcon}>📸</span>
            <p style={styles.photoText}>Foto da Equipe GCEIC-07</p>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Integrantes</h3>
          <div style={styles.memberList}>
            {integrantes.map((member, idx) => (
              <div key={idx} style={styles.memberCard}>
                <div style={styles.avatar}>{member.inicial}</div>
                <div>
                  <h4 style={styles.memberName}>{member.nome}</h4>
                  <span style={styles.memberRole}>{member.papel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.section}>
          <h4 style={styles.themeTitle}>Tema Escolhido:</h4>
          <p style={styles.themeDescription}>
            Desenvolvimento de uma ferramenta voltada ao cálculo estrutural e de custos para a construção de piscinas. 
            A solução abrange o dimensionamento volumétrico automático, orçamento de materiais de infraestrutura 
            elétrica e hidráulica, simulação do custo de abastecimento inicial de água e previsões de gastos para manutenção recorrente.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f9ff',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '40px 20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backWrapper: {
    width: '100%',
    maxWidth: '650px',
    marginBottom: '20px',
  },
  backButton: {
    textDecoration: 'none',
    color: '#0284c7',
    fontWeight: '600',
    fontSize: '15px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'color 0.2s',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0, 104, 185, 0.08)',
    width: '100%',
    maxWidth: '650px',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  badge: {
    background: '#e0f2fe',
    color: '#0369a1',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '12px 0 6px 0',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: 0,
  },
  photoContainer: {
    width: '100%',
    height: '240px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px dashed #cbd5e1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '32px',
    overflow: 'hidden',
  },
  photoPlaceholder: {
    textAlign: 'center',
  },
  photoIcon: {
    fontSize: '36px',
    marginBottom: '8px',
    display: 'block',
  },
  photoText: {
    margin: 0,
    color: '#94a3b8',
    fontWeight: '500',
    fontSize: '14px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 16px 0',
  },
  memberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  memberCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
  },
  memberName: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
  },
  memberRole: {
    fontSize: '13px',
    color: '#64748b',
  },
  divider: {
    height: '1px',
    backgroundColor: '#f1f5f9',
    margin: '32px 0',
  },
  themeTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  themeDescription: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#475569',
    margin: 0,
  }
};

export default Sobre;