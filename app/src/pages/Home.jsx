import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <div className="home-hero">
        <span className="tag">Calculadora Financeira</span>
        <h1>Calcule seu markup<br />com precisão</h1>
        <p>
          Informe custo, despesas e lucro desejado para obter
          o preço ideal de venda em segundos.
        </p>
        <button className="cta" onClick={() => navigate('/markup')}>
          Ir para Cálculo →
        </button>
      </div>
    </>
  )
}

export default Home