import fotoequipe from '../assets/fotoequipe.jpeg'

const members = [
  { name: 'Enzo Garofalo Pampana', ra: '24008914', initials: 'EG' },
  { name: 'Pedro Ximenes Costa', ra: '24000763', initials: 'PX' },
  { name: 'Yuri Cardoso Balieiro', ra: '24011525', initials: 'YC' },
]

export default function SobreScreen({ onBack }) {
  return (
    <div className="page-body">
      <div className="page-container">
        <div className="page-header">
          <button className="btn-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Voltar
          </button>
          <div>
            <h1 className="page-title">Sobre o Projeto</h1>
          </div>
        </div>

        <div className="sobre-grid">
          <div className="sobre-photo-card">
            <div className="sobre-photo-label">Nossa Equipe</div>
            <div className="sobre-photo-wrap">
              <img src={fotoequipe} alt="Foto da Equipe" className="sobre-photo" />
            </div>
          </div>

          <div className="sobre-right">
            <div className="sobre-members-card">
              <div className="sobre-section-label">Integrantes</div>
              <ul className="member-list">
                {members.map((m, i) => (
                  <li key={m.ra} className="member-item">
                    <div className="member-avatar" data-index={i}>{m.initials}</div>
                    <div className="member-info">
                      <span className="member-name">{m.name}</span>
                      <span className="member-ra">RA · {m.ra}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sobre-project-card">
              <div className="sobre-section-label">O Projeto</div>
              <p className="sobre-project-text">
                Ferramenta intuitiva para cálculo de consumo elétrico residencial
                e simulação de economia baseada em diferentes cenários de uso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
