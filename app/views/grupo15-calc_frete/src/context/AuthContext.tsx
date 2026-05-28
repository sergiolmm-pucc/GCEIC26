import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthUser } from '../types/frete.types';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Credenciais fixas conforme requisito
const USUARIOS_FIXOS = [
  { username: 'admin',  password: '1234'  },
  { username: 'aluno',  password: 'frete' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (username: string, password: string): boolean => {
    const found = USUARIOS_FIXOS.find(
      u => u.username === username && u.password === password
    );
    if (found) { setUser({ username: found.username }); return true; }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fora do AuthProvider');
  return ctx;
}
