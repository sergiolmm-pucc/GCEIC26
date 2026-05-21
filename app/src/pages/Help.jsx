import Navbar from '../components/Navbar'

function Help() {
  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Como usar</h1>

        <div className="help-card">
          <h2>O que é Markup?</h2>
          <p>
            Markup é o índice aplicado sobre o custo de um produto para
            determinar o preço de venda, cobrindo despesas e garantindo lucro.
          </p>
        </div>

        <div className="help-card">
          <h2>O que informar</h2>
          <p>Para calcular, você precisa de três valores:</p>
          <ul>
            <li>Custo do produto (R$)</li>
            <li>Despesas operacionais (%)</li>
            <li>Lucro desejado (%)</li>
          </ul>
        </div>

        <div className="help-card">
          <h2>Fórmula utilizada</h2>
          <p>
            Preço de Venda = Custo ÷ (1 − (Despesas% + Lucro%) ÷ 100)
          </p>
          <p>
            A soma de despesas e lucro não pode atingir 100% — o sistema
            irá avisar caso isso aconteça.
          </p>
        </div>
      </div>
    </>
  )
}

export default Help