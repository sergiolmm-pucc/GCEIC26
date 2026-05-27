import './SplashScreen.css';

function SplashScreen() {
  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo">⚽</div>
        <h1>Calculadora de Campo</h1>
        <p>Cálculo de construção e manutenção</p>
        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
