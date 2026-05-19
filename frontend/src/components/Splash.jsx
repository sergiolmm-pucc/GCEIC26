import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate('/login')
    }, 2500)
  }, [])

    return (
    <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '24px'
      }}>
      <img src="/mkp_logo.svg" alt="MKP Logo" width="480" />

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '18px'
      }}>
        Carregando...
      </p>
    </div>
  )
}

export default Splash