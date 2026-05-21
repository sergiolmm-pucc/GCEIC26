import { useState } from 'react'
import ApplianceRow from '../../components/ApplianceRow'
import { fetchConsumo } from '../../services/api'
import { emptyAppliance } from '../../types'

export default function TabConsumo() {
  const [appliances, setAppliances] = useState([emptyAppliance()])
  const [days, setDays] = useState(30)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const update = (i, field, val) =>
    setAppliances(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a))

  const remove = (i) => {
    if (appliances.length > 1) setAppliances(prev => prev.filter((_, idx) => idx !== i))
  }

  const calcular = async () => {
    setError(''); setResult(null); setLoading(true)
    try {
      const data = await fetchConsumo(appliances, days)
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
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Aparelhos
          </div>
          <div className="card-count">{appliances.length} aparelho{appliances.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="appliance-list">
          {appliances.map((a, i) => (
            <ApplianceRow key={i} appliance={a} index={i} showLabels={i === 0} onUpdate={update} onRemove={remove} />
          ))}
        </div>

        <button className="btn-add" onClick={() => setAppliances(prev => [...prev, emptyAppliance()])}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar aparelho
        </button>
      </div>

      <div className="card card-inline">
        <div className="field-inline">
          <label>Dias no mês</label>
          <div className="days-input-wrap">
            <input
              type="number"
              value={days}
              min={1}
              max={31}
              onChange={e => setDays(Number(e.target.value))}
            />
            <span className="days-suffix">dias</span>
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
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Calcular consumo
            </>
          )}
        </button>
        {error && <div className="error-msg">{error}</div>}
      </div>

      {result && (
        <div className="result-section">
          <div className="metric-grid">
            <div className="metric">
              <div className="metric-label">Total mensal</div>
              <div className="metric-value">
                {result.totalKwh.toFixed(1)}
                <span className="metric-unit"> kWh</span>
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">Aparelhos</div>
              <div className="metric-value">{result.items.length}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Período</div>
              <div className="metric-value">{days}<span className="metric-unit"> dias</span></div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.25rem' }}>
            <div className="card-header">
              <div className="card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                Detalhamento
              </div>
            </div>
            <div className="result-items">
              {result.items.map((item, i) => {
                const pct = result.totalKwh > 0 ? Math.round((item.kwhMes / result.totalKwh) * 100) : 0
                return (
                  <div className="result-item" key={i}>
                    <div className="result-item-info">
                      <div className="result-name">{item.name}</div>
                      <div className="result-sub">{item.watts}W · {item.hoursPerDay}h/dia</div>
                    </div>
                    <div className="result-item-bar">
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="result-item-val">
                        <span>{item.kwhMes.toFixed(1)} kWh</span>
                        <span className="result-pct">{pct}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
