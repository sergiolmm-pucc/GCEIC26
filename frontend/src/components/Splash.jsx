import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Splash() {

  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }, [])

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h1>MKP System</h1>
      <p>Carregando...</p>
    </div>
  )
}

export default Splash