import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Home from './pages/Home'
import CalculoMarkup from './pages/CalculoMarkup'
import Help from './pages/Help'
import Sobre from './pages/Sobre'
import './styles/App.css'

import PrivateRoute from './components/PrivateRoute'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/markup"
          element={
            <PrivateRoute>
              <CalculoMarkup />
            </PrivateRoute>
          }
        />

        <Route
          path="/help"
          element={
            <PrivateRoute>
              <Help />
            </PrivateRoute>
          }
        />

        <Route
          path="/sobre"
          element={
            <PrivateRoute>
              <Sobre />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App