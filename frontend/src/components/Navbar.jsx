import { Link, useNavigate } from 'react-router-dom'

function Navbar() {

  const navigate = useNavigate()

  function sair() {
    localStorage.removeItem('auth')
    navigate('/')
  }

  return (
    <div className="navbar">

      <Link to="/home">Home</Link>
      <Link to="/markup">Markup</Link>
      <Link to="/help">Help</Link>
      <Link to="/sobre">Sobre</Link>

      <button onClick={sair}>
        Sair
      </button>

    </div>
  )
}

export default Navbar