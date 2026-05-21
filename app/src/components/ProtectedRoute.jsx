import { Navigate } from 'react-router-dom';
export default function ProtectedRoute({ children }) {
  return sessionStorage.getItem('mkp_auth') === 'true' ? children : <Navigate to="/login" replace />;
}
