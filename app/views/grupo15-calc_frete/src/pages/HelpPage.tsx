const FAQ = [
  {
    q: 'Como é calculado o valor do frete?',
    a: 'O valor é calculado em três etapas: (1) custo por peso = peso × R$ 2,50/kg; (2) custo por distância = km × R$ 0,15/km; (3) multiplicador por tipo de entrega — econômico ×0,8, normal ×1,0, expresso ×1,8.',
    icon: 'bi-calculator',
  },
  {
    q: 'De onde vêm as distâncias entre cidades?',
    a: 'As distâncias são valores fixos predefinidos entre as principais capitais e cidades do Brasil, representando distâncias rodoviárias aproximadas.',
    icon: 'bi-map',
  },
  {
    q: 'Qual a diferença entre os tipos de entrega?',
    a: 'Econômico (×0,8): mais barato, 7–10 dias úteis. Normal (×1,0): tarifa padrão, 3–5 dias úteis. Expresso (×1,8): mais caro, 1–2 dias úteis.',
    icon: 'bi-truck',
  },
  {
    q: 'O histórico de simulações é salvo?',
    a: 'Sim, as últimas 20 simulações ficam salvas no seu navegador (localStorage). Elas são mantidas mesmo após fechar o navegador, mas são exclusivas deste dispositivo.',
    icon: 'bi-clock-history',
  },
  {
    q: 'Como usar o sistema?',
    a: '1. Faça login com as credenciais de acesso. 2. Vá à aba Simulação. 3. Selecione cidade de origem e destino. 4. Informe o peso da encomenda em kg. 5. Escolha o tipo de entrega. 6. Clique em Calcular Frete.',
    icon: 'bi-list-ol',
  },
];

export function HelpPage() {
  return (
    <div className="fc-page">
      <div className="container" style={{ maxWidth: '720px' }}>
        <div className="mb-4">
          <h1 className="fc-page-title">
            <i className="bi bi-question-circle text-orange me-2" />Ajuda
          </h1>
          <p className="fc-page-subtitle">Dúvidas frequentes sobre o FreteCalc</p>
        </div>

        <div className="accordion fc-accordion" id="helpAccordion">
          {FAQ.map((item, i) => (
            <div className="accordion-item" key={i}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button${i !== 0 ? ' collapsed' : ''}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq${i}`}
                >
                  <i className={`bi ${item.icon} text-orange me-2`} />
                  {item.q}
                </button>
              </h2>
              <div id={`faq${i}`} className={`accordion-collapse collapse${i === 0 ? ' show' : ''}`}>
                <div className="accordion-body">{item.a}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="fc-card mt-4 text-center">
          <i className="bi bi-envelope text-orange" style={{ fontSize: '1.5rem' }} />
          <div style={{ fontWeight: 700, marginTop: '0.5rem' }}>Precisa de mais ajuda?</div>
          <div style={{ color: 'var(--fc-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Fale com o professor ou com a equipe de desenvolvimento do projeto.
          </div>
        </div>
      </div>
    </div>
  );
}