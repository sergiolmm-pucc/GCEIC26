import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import SplashScreen          from './views/SplashScreen';
import LoginScreen           from './views/LoginScreen';
import HomeScreen            from './views/HomeScreen';
import SobreScreen           from './views/SobreScreen';
import HelpScreen            from './views/HelpScreen';
import CalculoScreen         from './views/CalculoScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/"      element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        {/* Protegidas */}
        <Route path="/home"    element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        <Route path="/sobre"   element={<ProtectedRoute><SobreScreen /></ProtectedRoute>} />
        <Route path="/help"    element={<ProtectedRoute><HelpScreen /></ProtectedRoute>} />
        <Route path="/calculo" element={<ProtectedRoute><CalculoScreen /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
