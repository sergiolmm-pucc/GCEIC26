export default function SplashScreen() {
  return (
    <div className="splash-body">
      <div className="splash-content">
        <div className="splash-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 4L44 16V32L24 44L4 32V16L24 4Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M24 14V24L32 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="24" cy="24" r="3" fill="currentColor" />
          </svg>
        </div>
        <div className="splash-logo">Calculadora de Energia</div>
        <div className="splash-sub">Sistema de análise de consumo elétrico</div>
        <div className="splash-loader">
          <div className="splash-loader-bar" />
        </div>
        <p className="splash-caption">Inicializando sistema...</p>
      </div>
    </div>
  )
}
