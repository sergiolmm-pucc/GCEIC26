import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

function passarSplash() {
  act(() => { jest.advanceTimersByTime(3000); });
}

function fazerLogin() {
  passarSplash();
  fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'admin' } });
  fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: '1234' } });
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
}

describe('Splash', () => {
  test('exibe tela de splash ao iniciar', () => {
    render(<App />);
    expect(screen.getByText('FinanciApp')).toBeInTheDocument();
  });

  test('transiciona para login após o timer', () => {
    render(<App />);
    passarSplash();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });
});

describe('Login', () => {
  test('exibe formulário de login após o splash', () => {
    render(<App />);
    passarSplash();
    expect(screen.getByPlaceholderText('admin')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  test('login com credenciais corretas acessa o app', () => {
    render(<App />);
    fazerLogin();
    expect(screen.getByText('Financiamentos')).toBeInTheDocument();
  });

  test('login com senha errada exibe mensagem de erro', () => {
    render(<App />);
    passarSplash();
    fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('••••'), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(screen.getByText('Usuário ou senha incorretos.')).toBeInTheDocument();
  });

  test('login com Enter na senha aciona autenticação', () => {
    render(<App />);
    passarSplash();
    fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'admin' } });
    const senhaInput = screen.getByPlaceholderText('••••');
    fireEvent.change(senhaInput, { target: { value: '1234' } });
    fireEvent.keyDown(senhaInput, { key: 'Enter' });
    expect(screen.getByText('Financiamentos')).toBeInTheDocument();
  });
});

describe('App principal', () => {
  test('exibe menu inicial com as 4 calculadoras', () => {
    render(<App />);
    fazerLogin();
    expect(screen.getByText('Sistema SAC')).toBeInTheDocument();
    expect(screen.getByText('Tabela PRICE')).toBeInTheDocument();
    expect(screen.getByText('SAC × PRICE')).toBeInTheDocument();
    expect(screen.getByText('Capacidade')).toBeInTheDocument();
  });

  test('botão Sair retorna à tela de login', () => {
    render(<App />);
    fazerLogin();
    fireEvent.click(screen.getByTitle('Sair'));
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  test('navegação para aba Sobre exibe conteúdo', () => {
    render(<App />);
    fazerLogin();
    fireEvent.click(screen.getByText('Sobre'));
    expect(screen.getByText('Sobre o projeto')).toBeInTheDocument();
  });

  test('navegação para aba Ajuda exibe conteúdo', () => {
    render(<App />);
    fazerLogin();
    fireEvent.click(screen.getByText('Ajuda'));
    expect(screen.getByText('O que é o Sistema SAC?')).toBeInTheDocument();
  });
});

describe('Calculadora SAC', () => {
  function abrirSAC() {
    render(<App />);
    fazerLogin();
    fireEvent.click(screen.getByText('Sistema SAC'));
  }

  test('abre a calculadora SAC ao clicar no menu', () => {
    abrirSAC();
    expect(screen.getByText('Calcular SAC')).toBeInTheDocument();
  });

  test('exibe resultados após calcular', () => {
    abrirSAC();
    fireEvent.click(screen.getByText('Calcular SAC'));
    expect(screen.getByText('Valor Financiado')).toBeInTheDocument();
    expect(screen.getByText('1ª Parcela')).toBeInTheDocument();
    expect(screen.getByText('Total de Juros')).toBeInTheDocument();
  });

  test('botão Voltar retorna ao menu', () => {
    abrirSAC();
    fireEvent.click(screen.getByText('← Voltar'));
    expect(screen.getByText('Financiamentos')).toBeInTheDocument();
  });
});

describe('Calculadora PRICE', () => {
  function abrirPRICE() {
    render(<App />);
    fazerLogin();
    fireEvent.click(screen.getByText('Tabela PRICE'));
  }

  test('abre a calculadora PRICE ao clicar no menu', () => {
    abrirPRICE();
    expect(screen.getByText('Calcular PRICE')).toBeInTheDocument();
  });

  test('exibe resultados após calcular', () => {
    abrirPRICE();
    fireEvent.click(screen.getByText('Calcular PRICE'));
    expect(screen.getByText('Parcela Fixa')).toBeInTheDocument();
    expect(screen.getByText('Total Pago')).toBeInTheDocument();
  });
});

describe('Comparação SAC × PRICE', () => {
  function abrirComparar() {
    render(<App />);
    fazerLogin();
    fireEvent.click(screen.getByText('SAC × PRICE'));
  }

  test('abre a tela de comparação ao clicar no menu', () => {
    abrirComparar();
    expect(screen.getByText('Comparar')).toBeInTheDocument();
  });

  test('exibe comparação após calcular', () => {
    abrirComparar();
    fireEvent.click(screen.getByText('Comparar'));
    expect(screen.getByText('SAC')).toBeInTheDocument();
    expect(screen.getByText('PRICE')).toBeInTheDocument();
    expect(screen.getByText('Sistema recomendado')).toBeInTheDocument();
  });

  test('recomenda SAC como sistema mais barato', () => {
    abrirComparar();
    fireEvent.click(screen.getByText('Comparar'));
    expect(screen.getByText(/SAC.*recomendado/)).toBeInTheDocument();
  });
});

describe('Capacidade de Compra', () => {
  function abrirCapacidade() {
    render(<App />);
    fazerLogin();
    fireEvent.click(screen.getByText('Capacidade'));
  }

  test('abre a tela de capacidade ao clicar no menu', () => {
    abrirCapacidade();
    expect(screen.getByText('Simular')).toBeInTheDocument();
  });

  test('exibe resultado após simular', () => {
    abrirCapacidade();
    fireEvent.click(screen.getByText('Simular'));
    expect(screen.getByText('Parcela Máx. (30%)')).toBeInTheDocument();
    expect(screen.getByText('Valor Máx. Financiável')).toBeInTheDocument();
  });
});
