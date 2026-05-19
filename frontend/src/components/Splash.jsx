import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate('/login')
    }, 3000)
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

      <img 
        src="/mkp_logo.svg" 
        alt="MKP Logo" 
        width="700"
        style={{
          animation: 'float 2.5s ease-in-out infinite'
        }}
      />

      <p style={{
        color: '#94a3b8',
        fontSize: '18px',
        animation: 'pulse 1.5s infinite'
        }}>
        Carregando...
      </p>
    </div>
  )
}

export default Splash