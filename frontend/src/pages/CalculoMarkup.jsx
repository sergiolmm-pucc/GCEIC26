import { useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

function CalculoMarkup() {
  const [custo, setCusto] = useState('')
  const [despesas, setDespesas] = useState('')
  const [lucro, setLucro] = useState('')
  const [resultado, setResultado] = useState(null)

  async function calcular() {
    try {
      const response = await api.post('/MKP/markup', {
        custo: Number(custo),
        despesas: Number(despesas),
        lucro: Number(lucro),
      })
      setResultado(response.data)
    } catch (error) {
      alert('Erro ao calcular. Verifique os valores informados.')
    }
  }

  function fmt(value) {
    return Number(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Cálculo de Markup</h1>

        <input
          type="number"
          placeholder="Custo (R$)"
          value={custo}
          onChange={(e) => setCusto(e.target.value)}
        />

        <input
          type="number"
          placeholder="Despesas (%)"
          value={despesas}
          onChange={(e) => setDespesas(e.target.value)}
        />

        <input
          type="number"
          placeholder="Lucro desejado (%)"
          value={lucro}
          onChange={(e) => setLucro(e.target.value)}
        />

        <button onClick={calcular}>Calcular</button>

        {resultado && (
          <div className="resultado">
            <h2>Resultado</h2>
            <p>
              Custo
              <span>R$ {fmt(resultado.custo)}</span>
            </p>
            <p>
              Despesas
              <span>{resultado.despesas_percentual}%</span>
            </p>
            <p>
              Lucro
              <span>{resultado.lucro_percentual}%</span>
            </p>
            <p>
              Markup multiplicador
              <span>{resultado.markup_multiplicador}×</span>
            </p>
            <p>
              Lucro em valor
              <span>R$ {fmt(resultado.lucro_valor)}</span>
            </p>
            <p>
              Preço de venda
              <span>R$ {fmt(resultado.preco_venda)}</span>
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default CalculoMarkup