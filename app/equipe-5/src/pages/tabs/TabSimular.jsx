import { useState } from 'react'
import ApplianceRow from '../../components/ApplianceRow'
import { fetchSimular } from '../../services/api'
import { FLAG_LABELS, emptyAppliance } from '../../types'

const FLAGS = ['verde', 'amarela', 'vermelha1', 'vermelha2']

export default function TabSimular() {
  const [simA, setSimA] = useState([emptyAppliance()])
  const [simB, setSimB] = useState([emptyAppliance()])
  const [tarifa, setTarifa] = useState('')
  const [bandeira, setBandeira] = useState('verde')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const updateSim = (setter) => (i, field, val) =>
    setter(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a))

  const removeSim = (setter, arr) => (i) => {
    if (arr.length > 1) setter(prev => prev.filter((_, idx) => idx !== i))
  }

  const simular = async () => {
    setError(''); setResult(null)
    if (!tarifa) { setError('Informe a tarifa para continuar.'); return }
    setLoading(true)
    try {
      const data = await fetchSimular(simA, simB, parseFloat(tarifa), bandeira)
      setResult(data)
    } catch (e) {
      setError(e.message || 'Não foi possível conectar à API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tab-content">
      <div className="sim-scenarios">
        {[
          { label: 'Cenário A', sim: simA, setter: setSimA },
          { label: 'Cenário B', sim: simB, setter: setSimB },
        ].map(({ label, sim, setter }) => (
          <div className="sim-scenario-card" key={label}>
            <div className="sim-scenario-header">
              <span className="sim-scenario-badge">{label}</span>
            </div>
            <div className="appliance-list">
              {sim.map((a, i) => (
                <ApplianceRow
                  key={i}
                  appliance={a}
                  index={i}
                  showLabels={i === 0}
                  onUpdate={updateSim(setter)}
                  onRemove={removeSim(setter, sim)}
                  small
                />
              ))}
            </div>
            <button className="btn-add" onClick={() => setter(prev => [...prev, emptyAppliance()])}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Adicionar
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            Parâmetros de cálculo
          </div>
        </div>
        <div className="form-row-2">
          <div className="field">
            <label>Tarifa (R$/kWh)</label>
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
            </div>
          </div>
          <div className="field">
            <label>Bandeira tarifária</label>
            <select value={bandeira} onChange={e => setBandeira(e.target.value)}>
              {FLAGS.map(f => <option key={f} value={f}>{FLAG_LABELS[f]}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="action-row">
        <button className="btn-primary" onClick={simular} disabled={loading}>
          {loading ? (
            <><span className="btn-spinner-sm" /> Simulando...</>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
              </svg>
              Simular e comparar
            </>
          )}
        </button>
        {error && <div className="error-msg">{error}</div>}
      </div>

      {result && (
        <div className="result-section">
          <div className="winner-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Cenário <strong>{result.cenarioMaisEconomico}</strong> é mais econômico
            <span className="winner-save">— economia de R$ {Math.abs(result.economiaReais).toFixed(2)}/mês</span>
          </div>

          <div className="sim-result-grid">
            {['A', 'B'].map(c => {
              const data = c === 'A' ? result.cenarioA : result.cenarioB
              const isWinner = result.cenarioMaisEconomico === c
              return (
                <div className={`sim-result-card${isWinner ? ' sim-winner' : ''}`} key={c}>
                  <div className="sim-result-header">
                    <span className="sim-scenario-badge">Cenário {c}</span>
                    {isWinner && <span className="badge-winner">Mais econômico</span>}
                  </div>
                  <div className="sim-result-row">
                    <span>Consumo</span>
                    <span className="sim-result-val">{data.totalKwh.toFixed(1)} kWh</span>
                  </div>
                  <div className="sim-result-row sim-result-total">
                    <span>Total mensal</span>
                    <span className="sim-result-val">R$ {data.conta.total.toFixed(2)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="metric-grid" style={{ marginTop: '1rem' }}>
            <div className="metric">
              <div className="metric-label">Diferença consumo</div>
              <div className="metric-value">
                {Math.abs(result.diffKwh).toFixed(1)}
                <span className="metric-unit"> kWh</span>
              </div>
            </div>
            <div className="metric metric-highlight">
              <div className="metric-label">Economia mensal</div>
              <div className="metric-value">R$ {Math.abs(result.economiaReais).toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
