import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'Salario mensal',
    text: 'Liquido do trabalhador e custo total do empregador.',
    to: '/salario',
  },
  {
    title: 'Ferias',
    text: 'Ferias com adicional constitucional de um terco.',
    to: '/ferias',
  },
  {
    title: 'Rescisao',
    text: 'Verbas rescisorias em cenario simplificado.',
    to: '/rescisao',
  },
];

export function Dashboard() {
  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">GCEIC26</p>
        <h1>ETEC - Encargos de empregada domestica</h1>
        <p>
          Ferramenta academica para consultar estimativas de salario, ferias e
          rescisao.
        </p>
      </header>

      <div className="notice">
        Calculos estimativos. Use o eSocial e orientacao profissional para valores oficiais.
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <article className="feature-card" key={card.to}>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            <Link to={card.to}>Abrir calculo</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
