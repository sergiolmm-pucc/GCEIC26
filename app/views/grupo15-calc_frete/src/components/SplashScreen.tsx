export default function SplashScreen() {
  return (
    <div className="fc-splash">
      <div className="splash-logo">
        <span style={{ color: 'var(--fc-text)' }}>Frete</span>
        <span className="text-orange">Calc</span>
      </div>
      <div className="splash-sub">Simulador de Frete</div>
      <div className="splash-bar">
        <div className="splash-bar-fill" />
      </div>
    </div>
  );
}
