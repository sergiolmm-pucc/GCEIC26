import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Help } from './pages/Help';
import { Login } from './pages/Login';
import { CalculatorPage } from './pages/CalculatorPage';
import { Sobre } from './pages/Sobre';
import { Splash } from './pages/Splash';

export function App() {
  return (
    <Routes>
      <Route path="/splash" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="salario" element={<CalculatorPage type="salario" />} />
        <Route path="ferias" element={<CalculatorPage type="ferias" />} />
        <Route path="rescisao" element={<CalculatorPage type="rescisao" />} />
        <Route path="sobre" element={<Sobre />} />
        <Route path="help" element={<Help />} />
      </Route>
      <Route path="*" element={<Navigate to="/splash" replace />} />
    </Routes>
  );
}
