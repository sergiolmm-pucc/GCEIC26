import { useState } from 'react'

interface Props {
  onLogin: () => void
}

export default function LoginScreen({ onLogin }: Props) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const verificar = () => {
    setLoading(true)
    setTimeout(() => {
      if (user === 'admin' && pass === '1234') {
        onLogin()
      } else {
        setError(true)
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="login-body">
      <div className="login-split">
        <div className="login-brand">
          <div className="login-brand-icon">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L44 16V32L24 44L4 32V16L24 4Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M24 14V24L32 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="24" cy="24" r="3" fill="currentColor" />
            </svg>
          </div>
          <h1 className="login-brand-title">Calculadora<br />de Energia</h1>
          <p className="login-brand-desc">
            Análise de consumo elétrico residencial,<br />
            cálculo de tarifas e simulação de economia.
          </p>
          <div className="login-stats">
            <div className="login-stat">
              <span className="login-stat-val">kWh</span>
              <span className="login-stat-label">Consumo</span>
            </div>
            <div className="login-stat-divider" />
            <div className="login-stat">
              <span className="login-stat-val">R$</span>
              <span className="login-stat-label">Tarifas</span>
            </div>
            <div className="login-stat-divider" />
            <div className="login-stat">
              <span className="login-stat-val">∆%</span>
              <span className="login-stat-label">Economia</span>
            </div>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-box">
            <div className="login-form-header">
              <span className="login-form-tag">ACESSO AO SISTEMA</span>
              <h2>Entrar</h2>
            </div>

            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Usuário ou senha incorretos.
              </div>
            )}

            <div className="form-group">
              <label>Usuário</label>
              <input
                type="text"
                placeholder="admin"
                value={user}
                onChange={e => { setUser(e.target.value); setError(false) }}
                onKeyDown={e => e.key === 'Enter' && verificar()}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                placeholder="••••"
                value={pass}
                onChange={e => { setPass(e.target.value); setError(false) }}
                onKeyDown={e => e.key === 'Enter' && verificar()}
                autoComplete="current-password"
              />
            </div>

            <button
              className={`btn-primary btn-login${loading ? ' loading' : ''}`}
              onClick={verificar}
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  Entrar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            <p className="login-hint">Use <code>admin</code> / <code>1234</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}