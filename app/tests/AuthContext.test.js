import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../services/AuthContext';

function TesteAuth() {
  const { usuario, entrar, sair } = useAuth();
  return (
    <div>
      <span data-testid="status">{usuario ? `logado:${usuario.login}` : 'deslogado'}</span>
      <button onClick={() => entrar('admin', '1234')}>login-ok</button>
      <button onClick={() => entrar('admin', 'errada')}>login-errado</button>
      <button onClick={sair}>sair</button>
    </div>
  );
}

function renderizar() {
  render(<AuthProvider><TesteAuth /></AuthProvider>);
}

describe('AuthContext', () => {
  test('inicia sem usuário logado', () => {
    renderizar();
    expect(screen.getByTestId('status').textContent).toBe('deslogado');
  });

  test('entrar com credenciais corretas autentica o usuário', () => {
    renderizar();
    act(() => screen.getByText('login-ok').click());
    expect(screen.getByTestId('status').textContent).toBe('logado:admin');
  });

  test('entrar com senha errada não autentica', () => {
    renderizar();
    act(() => screen.getByText('login-errado').click());
    expect(screen.getByTestId('status').textContent).toBe('deslogado');
  });

  test('sair remove o usuário autenticado', () => {
    renderizar();
    act(() => screen.getByText('login-ok').click());
    act(() => screen.getByText('sair').click());
    expect(screen.getByTestId('status').textContent).toBe('deslogado');
  });

  test('usuário autenticado possui login e autenticadoEm', () => {
    let capturado;
    function Captura() {
      const { usuario, entrar } = useAuth();
      capturado = usuario;
      return <button onClick={() => entrar('admin', '1234')}>ok</button>;
    }
    render(<AuthProvider><Captura /></AuthProvider>);
    act(() => screen.getByText('ok').click());
    expect(capturado.login).toBe('admin');
    expect(capturado.autenticadoEm).toBeDefined();
  });
});
