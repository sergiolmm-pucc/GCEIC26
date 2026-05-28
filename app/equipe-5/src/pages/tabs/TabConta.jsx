import { useState } from 'react'
import { fetchConta } from '../../services/api'
import { FLAG_LABELS } from '../../types'

const FLAGS = [
  { key: 'verde', color: 'flag-verde', desc: 'Sem adicional' },
  { key: 'amarela', color: 'flag-amarela', desc: '+R$0,01874/kWh' },
  { key: 'vermelha1', color: 'flag-vermelha1', desc: '+R$0,03971/kWh' },
  { key: 'vermelha2', color: 'flag-vermelha2', desc: '+R$0,09492/kWh' },
]

export default function TabConta() {
  const [kwh, setKwh] = useState('')
  const [tarifa, setTarifa] = useState('')
  const [flag, setFlag] = useState('verde')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const calcular = async () => {
    setError(''); setResult(null)
    if (!kwh || !tarifa) { setError('Preencha os campos de kWh e tarifa.'); return }
    setLoading(true)
    try {
      const data = await fetchConta(parseFloat(kwh), parseFloat(tarifa), flag)
      setResult(data)
    } catch (e) {
      setError(e.message || 'Não foi possível conectar à API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            Dados da Conta
          </div>
        </div>

        <div className="form-row-2">
          <div className="field">
            <label>Consumo total</label>
            <div className="input-with-unit">
              <input
                type="number"
                placeholder="200"
                min="0"
                value={kwh}
                onChange={e => setKwh(e.target.value)}
              />
              <span className="input-unit">kWh</span>
            </div>
          </div>
          <div className="field">
            <label>Tarifa da distribuidora</label>
            <div className="input-with-unit">
              <span className="input-unit input-unit-left">R$</span>
              <input
                type="number"
                placeholder="0,75"
                step="0.01"
                min="0"
                value={tarifa}
                onChange={e => setTarifa(e.target.value)}
                className="input-has-left-unit"
              />
              <span className="input-unit">/kWh</span>
            </div>
          </div>
        </div>

        <div className="field" style={{ marginTop: '1rem' }}>
          <label>Bandeira tarifária</label>
          <div className="flag-grid">
            {FLAGS.map(f => (
              <button
                key={f.key}
                className={`flag-card${flag === f.key ? ' active' : ''} ${f.color}`}
                onClick={() => setFlag(f.key)}
              >
                <span className="flag-dot" />
                <span className="flag-name">{FLAG_LABELS[f.key]}</span>
                <span className="flag-desc">{f.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="action-row">
        <button className="btn-primary" onClick={calcular} disabled={loading}>
          {loading ? (
            <><span className="btn-spinner-sm" /> Calculando...</>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Calcular conta
            </>
          )}
        </button>
        {error && <div className="error-msg">{error}</div>}
      </div>

      {result && (
        <div className="result-section">
          <div className="metric-grid">
            <div className="metric">
              <div className="metric-label">Subtotal energia</div>
              <div className="metric-value">R$ {result.subtotal.toFixed(2)}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Adicional bandeira</div>
              <div className="metric-value metric-accent">+ R$ {result.adicionalBandeira.toFixed(2)}</div>
            </div>
            <div className="metric metric-highlight">
              <div className="metric-label">Total a pagar</div>
              <div className="metric-value">R$ {result.total.toFixed(2)}</div>
            </div>
          </div>
          <div className="result-formula">
            {kwh} kWh × R$ {tarifa}/kWh · Bandeira {FLAG_LABELS[flag]}
          </div>
        </div>
      )}
    </div>
  )
}
