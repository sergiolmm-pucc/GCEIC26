import React, { createContext, useContext, useState } from 'react';

/**
 * Classe de Usuário (POO: Encapsulamento dos dados de autenticação).
 */
class Usuario {
  constructor(login, nome) {
    this.login = login;
    this.nome = nome;
    this.autenticadoEm = new Date().toISOString();
  }
}

const AuthContext = createContext(null);

// Credenciais fixas conforme especificação do projeto
const CREDENCIAIS = { login: 'admin', senha: '1234' };

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const entrar = (login, senha) => {
    if (login === CREDENCIAIS.login && senha === CREDENCIAIS.senha) {
      setUsuario(new Usuario(login, 'Administrador'));
      return true;
    }
    return false;
  };

  const sair = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
