import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Sobre from './pages/Sobre';
import Help from './pages/Help';
import Calculadora from './pages/Calculadora';

function App() {
  return (
    <Router basename="/equipe-7">
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calculadora" element={<Calculadora />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;