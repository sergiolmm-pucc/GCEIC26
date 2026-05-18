import Navbar from '../components/Navbar'

function Help() {
  return (
    <>
      <Navbar />
      
      <h1>Help</h1>

      <p>Este sistema calcula markup de produtos.</p>

      <p>Informe:</p>
      <ul>
        <li>Custo do produto</li>
        <li>Despesas (%)</li>
        <li>Lucro desejado (%)</li>
      </ul>

      <p>Clique em calcular para obter o preço de venda.</p>

    </>
  )
}

export default Help