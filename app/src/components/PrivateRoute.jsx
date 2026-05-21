import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {

  const autenticado =
    localStorage.getItem('auth')

  return autenticado
    ? children
    : <Navigate to="/" />
}

export default PrivateRoute