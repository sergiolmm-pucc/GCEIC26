import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import CalculadoraSauna from './views/CalculadoraSauna';
import Sobre from './views/About';
import Help from './views/Help';
import Splash from './views/Splash';
// Você pode criar um componente de Splash Screen depois e colocá-lo como rota inicial

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/calculadora" element={<CalculadoraSauna />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;