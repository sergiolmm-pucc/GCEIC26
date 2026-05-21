import Navbar from '../components/Navbar';
import fotoCaua from '../assets/CauaMartinho.png';
import fotoMatheus from '../assets/matheus.jpeg';

const membros = [
  { initials: 'CS', name: 'Caua Martinho da Silva', role: 'BACK-END / CI-CD', hue: 'rgba(10,110,79,0.18)', photo: fotoCaua },
  { initials: 'MA', name: 'Matheus Alves',           role: 'FRONT-END',        hue: 'rgba(10,10,10,0.07)',  photo: fotoMatheus },
];

function TeamPhoto({ initials, name, role, hue, photo }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        aspectRatio: '1 / 1', borderRadius: 12, overflow: 'hidden', position: 'relative',
        background: `repeating-linear-gradient(135deg, ${hue} 0 8px, transparent 8px 16px), #F1F1ED`,
        border: '1px solid var(--hair)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {photo
          ? <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <>
              <div style={{
                width: 52, height: 52, borderRadius: 26, background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font)', fontSize: 18, fontWeight: 500, color: 'var(--ink)',
                border: '1px solid var(--hair)',
              }}>{initials}</div>
              <div style={{
                position: 'absolute', bottom: 6, left: 8,
                fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase',
              }}>foto</div>
            </>
        }
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{name}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 0.6, marginTop: 2 }}>{role}</div>
      </div>
    </div>
  );
}

export default function SobreScreen() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px 80px' }}>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.6, color: 'var(--muted)', marginBottom: 10 }}>
          EQUIPE & PROJETO
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'var(--font)', fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 500,
          letterSpacing: -1.2, color: 'var(--ink)', lineHeight: 1.05, maxWidth: 720,
        }}>Uma calculadora minimalista de formacao de precos.</h1>
        <p style={{ fontFamily: 'var(--font)', fontSize: 17, color: 'var(--muted)', marginTop: 18, lineHeight: 1.55, maxWidth: 640 }}>
          O <strong style={{ color: 'var(--ink)' }}>MarkUp</strong> foi pensado para pequenos comerciantes,
          prestadores de servico e estudantes de gestao que precisam de respostas claras,
          sem planilhas, sem cadastros.
        </p>

        <div style={{ marginTop: 56 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.6, color: 'var(--muted)', marginBottom: 18, textTransform: 'uppercase' }}>
            Equipe
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 24 }}>
            {membros.map((m, i) => <TeamPhoto key={i} {...m} />)}
          </div>
        </div>

        <div style={{
          marginTop: 56, background: 'var(--ink)', color: '#fff', borderRadius: 18,
          padding: '36px 40px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 32,
        }} className="proj-grid">
          <style>{`@media (max-width: 720px) { .proj-grid { grid-template-columns: 1fr !important; } }`}</style>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.4, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>
              Trabalho Academico
            </div>
            <div style={{ marginTop: 10, fontFamily: 'var(--font)', fontSize: 24, fontWeight: 500, letterSpacing: -0.4, lineHeight: 1.25 }}>
              Disciplina de Programacao Web — React
            </div>
            <p style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginTop: 12 }}>
              Aplicativo desenvolvido como projeto final, contemplando splash screen,
              autenticacao, cinco modos de calculo, telas de sobre e ajuda.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['Orientador','Prof. Sergio'],['Semestre','2026 / 1'],['Versao','1.0.0'],['Stack','React · Node.js · Vite']].map(([k,v],i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font)', fontSize: 14,
                paddingTop: i ? 12 : 0, borderTop: i ? '1px solid rgba(255,255,255,0.1)' : 'none',
                color: 'rgba(255,255,255,0.7)',
              }}>
                <span>{k}</span><span style={{ color: '#fff' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 40, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 1.2 }}>
          © 2026 · TODOS OS DIREITOS RESERVADOS
        </div>
      </div>
    </div>
  );
}
