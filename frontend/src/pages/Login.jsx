import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')

  function entrar() {

    if (
      usuario === 'admin'
      &&
      senha === '123'
    ) {

      localStorage.setItem('auth', true)

      navigate('/home')

    } else {

      alert('Usuário ou senha inválidos')
    }
  }

  return (

    <div>

      <h1>Login</h1>

      <input
        type="text"
        placeholder="Usuário"
        value={usuario}
        onChange={(e) =>
          setUsuario(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) =>
          setSenha(e.target.value)
        }
      />

      <br /><br />

      <button onClick={entrar}>
        Entrar
      </button>

    </div>
  )
}

export default Login