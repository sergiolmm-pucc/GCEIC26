const EQUIPE = [
  { nome: 'Bruno Reitano',ra: 'RA - 24011707', funcao: 'API /frete/peso',      emoji: '📦', api: 'POST /frete/peso'      },
  { nome: 'Henry Piozzi',ra:'RA - 24007252', funcao: 'API /frete/distancia', emoji: '📍', api: 'POST /frete/distancia' },
  { nome: 'Rogério Medina', ra: 'RA - 24008491', funcao: 'API /frete/tipo',      emoji: '🚚', api: 'POST /frete/tipo'      },
];

export function SobrePage() {
  return (
    <div className="fc-page">
      <div className="container">
        <div className="mb-4">
          <h1 className="fc-page-title">
            <i className="bi bi-people text-orange me-2" />Sobre o Projeto
          </h1>
          <p className="fc-page-subtitle">Trabalho universitário — Cálculo de Frete (Mini Logística)</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="fc-card mb-4">
              <div className="fc-result-label mb-2">Descrição</div>
              <p style={{ color: 'var(--fc-muted)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 0 }}>
                Sistema de simulação de frete desenvolvido como projeto universitário.
                Permite calcular o custo de entrega entre cidades brasileiras levando em conta
                peso da encomenda, distância entre origem e destino e modalidade de entrega (econômica, normal ou expressa).
              </p>
              <img
                src="/foto-equipe.jpg"
                alt="Foto da equipe"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginTop: '12px',
                  display: 'block',
                }}
              />
            </div>

            <div className="fc-card">
              <div className="fc-result-label mb-3">Stack Tecnológica</div>
              <div className="row g-2">
                {[
                  { icon: 'bi-braces', label: 'TypeScript', desc: 'Linguagem' },
                  { icon: 'bi-lightning', label: 'React + Vite', desc: 'Frontend' },
                  { icon: 'bi-server', label: 'Node + Express', desc: 'Backend' },
                  { icon: 'bi-bootstrap', label: 'Bootstrap 5', desc: 'UI' },
                  { icon: 'bi-check2-square', label: 'Jest', desc: 'Testes' },
                  { icon: 'bi-github', label: 'GitHub Actions', desc: 'CI/CD' },
                ].map(t => (
                  <div className="col-6 col-md-4" key={t.label}>
                    <div className="fc-card-sm d-flex align-items-center gap-2">
                      <i className={`bi ${t.icon} text-orange`} style={{ fontSize: '1.1rem' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.label}</div>
                        <div style={{ color: 'var(--fc-muted)', fontSize: '0.73rem' }}>{t.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="fc-result-label mb-3">Equipe</div>
            <div className="d-flex flex-column gap-3">
              {EQUIPE.map(m => (
                <div className="fc-team-card" key={m.nome}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{m.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{m.nome}</div>
                  <div style={{ color: 'var(--fc-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>{m.ra}</div>
                  <div style={{ color: 'var(--fc-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>{m.funcao}</div>
                  <code style={{ fontSize: '0.72rem', color: 'var(--fc-primary)', marginTop: '0.4rem', display: 'block' }}>
                    {m.api}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}