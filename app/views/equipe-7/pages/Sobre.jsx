import { Link } from 'react-router-dom';
import fotoGrupo from '../assets/fotoGrupo.jpeg';

function Sobre() {
  const integrantes = [
    { nome: "Bruno Lenitta Machado", papel: "", inicial: "B" },
    { nome: "Nicolas Mitjans Nunes", papel: "", inicial: "N" },
    { nome: "Gabriel Scolfaro de Azeredo", papel: "", inicial: "G" }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.backWrapper}>
        <Link to="/calculadora" style={styles.backButton}>
          ← Voltar ao Dashboard
        </Link>
      </div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Grupo 7</h1>
        </div>

        <div style={styles.photoContainer}>
          <img 
            src={fotoGrupo} 
            alt="Fotografia corporativa do Grupo 7" 
            style={styles.photo} 
          />
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Equipe</h3>
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  backWrapper: {
    width: '100%',
    maxWidth: '680px',
    marginBottom: '20px',
  },
  backButton: {
    textDecoration: 'none',
    color: '#0284c7',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '48px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.02)',
    width: '100%',
    maxWidth: '680px',
    boxSizing: 'border-box',
    border: '1px solid #e2e8f0',
  },
  header: {
    textAlign: 'center',
    marginBottom: '36px',
  },
  badge: {
    background: '#f0f9ff',
    color: '#0284c7',
    padding: '6px 14px',
    borderRadius: '30px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: '1px solid #e0f2fe',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '16px 0 6px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  photoContainer: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    marginBottom: '40px',
  },
  photo: {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'contain',
  },
  section: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 20px 0',
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
    padding: '14px 20px',
    borderRadius: '12px',
    border: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '15px',
  },
  memberName: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#0f172a',
  },
  memberRole: {
    fontSize: '13px',
    color: '#64748b',
    display: 'block',
    marginTop: '2px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '36px 0',
  },
  themeTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 10px 0',
  },
  themeDescription: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#475569',
    margin: 0,
  }
};

export default Sobre;