import { useState, useEffect } from 'react'
import './App.css'
import type { Screen } from './types'
import SplashScreen from './pages/SplashScreen'
import LoginScreen from './pages/LoginScreen'
import HomeScreen from './pages/HomeScreen'
import SobreScreen from './pages/SobreScreen'
import HelpScreen from './pages/HelpScreen'

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [prevScreen, setPrevScreen] = useState<Screen>('home')

  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('login'), 3000)
      return () => clearTimeout(t)
    }
  }, [screen])

  const navigate = (s: Screen) => {
    setPrevScreen(screen)
    setScreen(s)
  }

  return (
    <>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'login'  && <LoginScreen onLogin={() => setScreen('home')} />}
      {screen === 'home'   && <HomeScreen onLogout={() => setScreen('login')} onNavigate={navigate} />}
      {screen === 'sobre'  && <SobreScreen onBack={() => setScreen(prevScreen)} />}
      {screen === 'help'   && <HelpScreen onBack={() => setScreen(prevScreen)} />}
    </>
  )
}