import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SimulacaoPage from './pages/SimulacaoPage';
import {HistoricoPage} from './pages/HistoricoPage';
import {SobrePage} from './pages/SobrePage';
import {HelpPage} from './pages/HelpPage';
import './styles/global.css';

// Guard: redireciona para login se não autenticado
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

// Layout com navbar + footer
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="fc-footer">
        <div className="container">
          FreteCalc &nbsp;·&nbsp; Projeto Universitário &nbsp;·&nbsp;
          <span className="text-orange">Node + React + TypeScript</span>
        </div>
      </footer>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/simulacao" replace />} />
      <Route path="/simulacao" element={
        <PrivateRoute>
          <AppLayout><SimulacaoPage /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/historico" element={
        <PrivateRoute>
          <AppLayout><HistoricoPage /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/sobre" element={
        <PrivateRoute>
          <AppLayout><SobrePage /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/help" element={
        <PrivateRoute>
          <AppLayout><HelpPage /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/simulacao" replace />} />
    </Routes>
  );
}

export default function App() {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AuthProvider>
      {splash && <SplashScreen />}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
