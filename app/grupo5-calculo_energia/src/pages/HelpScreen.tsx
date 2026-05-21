interface Props {
  onBack: () => void
}

const steps = [
  {
    num: 1,
    title: 'Cálculo de Consumo (kWh)',
    text: 'Na primeira aba, adicione os aparelhos da sua residência. Insira a Potência em Watts (W) (ex: 1500W para um ar-condicionado) e quantas horas por dia ele fica ligado. O sistema calculará automaticamente o consumo mensal em kWh.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    num: 2,
    title: 'Valor da Conta (R$)',
    text: 'Na aba de conta, informe o valor da Tarifa da Distribuidora (disponível na sua conta de luz) e selecione a Bandeira Tarifária atual (Verde, Amarela ou Vermelha). O sistema aplicará as taxas extras da ANEEL automaticamente.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    num: 3,
    title: 'Simulador de Economia',
    text: 'Use o simulador para comparar dois cenários. Por exemplo: "Ar-condicionado ligado por 8h" vs "Ar-condicionado ligado por 4h". O sistema mostrará qual cenário é mais barato e qual a sua economia real em Reais.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
]

const faqs = [
  {
    q: 'Onde encontro a potência do aparelho?',
    a: 'Geralmente em uma etiqueta atrás do aparelho ou no manual técnico. Também pode estar impressa no cabo de força.',
  },
  {
    q: 'O que são as bandeiras tarifárias?',
    a: 'São acréscimos aplicados à conta quando o custo de geração de energia aumenta no Brasil, como em períodos de seca que reduzem a produção hidrelétrica.',
  },
]

export default function HelpScreen({ onBack }: Props) {
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
            <h1 className="page-title">Como usar o Sistema</h1>
            <p className="page-subtitle">Guia rápido para cálculos de energia elétrica</p>
          </div>
        </div>

        <div className="help-section">
          <h2 className="help-section-title">Passo a passo</h2>
          <div className="help-steps">
            {steps.map((s, i) => (
              <div className="help-step-card" key={s.num}>
                <div className="help-step-number">{String(s.num).padStart(2, '0')}</div>
                <div className="help-step-icon">{s.icon}</div>
                <h3 className="help-step-title">{s.title}</h3>
                <p className="help-step-text">{s.text}</p>
                {i < steps.length - 1 && <div className="help-step-connector" />}
              </div>
            ))}
          </div>
        </div>

        <div className="help-section">
          <h2 className="help-section-title">Dúvidas frequentes</h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <div className="faq-q">
                  <span className="faq-q-icon">?</span>
                  {f.q}
                </div>
                <p className="faq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}