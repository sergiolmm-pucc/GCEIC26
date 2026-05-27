import { useState } from 'react'
import TabConsumo from './tabs/TabConsumo'
import TabConta from './tabs/TabConta'
import TabSimular from './tabs/TabSimular'

const TABS = [
  {
    key: 'consumo',
    label: 'Consumo kWh',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    key: 'conta',
    label: 'Valor da Conta',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    key: 'simular',
    label: 'Simulador',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
]

export default function HomeScreen({ onLogout, onNavigate }) {
  const [tab, setTab] = useState('consumo')

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair do sistema?')) onLogout()
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L44 16V32L24 44L4 32V16L24 4Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M24 14V24L32 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="24" cy="24" r="3" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="sidebar-brand-name">CalcEnergia</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-label">Ferramentas</div>
          {TABS.map(t => (
            <button
              key={t.key}
              className={`sidebar-nav-item${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              <span className="sidebar-nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <nav className="sidebar-nav sidebar-nav-bottom">
          <div className="sidebar-nav-label">Informações</div>
          <button className="sidebar-nav-item" onClick={() => onNavigate('sobre')}>
            <span className="sidebar-nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            Sobre a Equipe
          </button>
          <button className="sidebar-nav-item" onClick={() => onNavigate('help')}>
            <span className="sidebar-nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            Ajuda / Tutorial
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair do sistema
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="main-topbar">
          <div className="main-topbar-title">
            {TABS.find(t => t.key === tab)?.icon}
            {TABS.find(t => t.key === tab)?.label}
          </div>
          <div className="main-topbar-breadcrumb">
            CalcEnergia / {TABS.find(t => t.key === tab)?.label}
          </div>
        </div>

        <div className="main-body">
          {tab === 'consumo' && <TabConsumo />}
          {tab === 'conta' && <TabConta />}
          {tab === 'simular' && <TabSimular />}
        </div>
      </main>
    </div>
  )
}
