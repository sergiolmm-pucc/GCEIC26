import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const calculos = [
  { short: '01', label: 'Preco de Venda',     desc: 'PV = Custo / (1 - MarkUp%)',              tipo: 'sell'   },
  { short: '02', label: 'MarkUp %',            desc: 'MarkUp = ((PV - Custo) / PV) x 100',     tipo: 'mkup'   },
  { short: '03', label: 'MarkUp Divisor',      desc: 'Divisor = 1 - (DF + DV + L) / 100',      tipo: 'div'    },
  { short: '04', label: 'Lucro',               desc: 'Lucro unitario, total e margem',          tipo: 'profit' },
  { short: '05', label: 'Ponto de Equilibrio', desc: 'PE = Custos Fixos / (PV - Custo Var.)',   tipo: 'be'     },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 32px 80px' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.6, color: 'var(--muted)', marginBottom: 10 }}>
          CALCULADORAS
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'var(--font)', fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 500, letterSpacing: -1, color: 'var(--ink)', lineHeight: 1.1, maxWidth: 600,
        }}>Escolha o calculo desejado.</h1>
        <p style={{ fontFamily: 'var(--font)', fontSize: 16, color: 'var(--muted)', marginTop: 14, lineHeight: 1.55, maxWidth: 520 }}>
          Cinco modos de precificacao, do mais simples ao mais completo.
        </p>
        <div style={{
          marginTop: 48,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16,
        }}>
          {calculos.map((c, i) => (
            <button key={i} onClick={() => navigate(`/calculo?tipo=${c.tipo}`)} style={{
              background: '#fff', border: '1px solid var(--hair)', borderRadius: 14,
              padding: '24px 22px', textAlign: 'left', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 10, transition: 'border-color .15s, transform .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hair)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1.4, color: 'var(--accent)' }}>{c.short}</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 16, fontWeight: 500, color: 'var(--ink)', letterSpacing: -0.2 }}>{c.label}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{c.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
