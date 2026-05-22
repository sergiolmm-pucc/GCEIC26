import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('exibe login depois da splash screen', async () => {
    render(<App />);

    expect(screen.getByText('Simulador de Preco')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Entrar' }, { timeout: 1500 })).toBeInTheDocument();
  });

  it('autentica com usuario e senha fixos', async () => {
    render(<App />);
    const user = userEvent.setup();

    await screen.findByRole('heading', { name: 'Entrar' }, { timeout: 1500 });
    await user.type(screen.getByLabelText('Usuario'), 'admin');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Acessar' }));

    expect(screen.getByRole('heading', { name: 'Simulador financeiro de venda' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Escolha o modo de calculo' })).toBeInTheDocument();
  });

  it('renderiza o seletor de modo apos o login', async () => {
    render(<App />);
    const user = userEvent.setup();

    await screen.findByRole('heading', { name: 'Entrar' }, { timeout: 1500 });
    await user.type(screen.getByLabelText('Usuario'), 'admin');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Acessar' }));

    expect(screen.getByRole('button', { name: /Preco Bruto/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Preco Liquido/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Margem/i })).toBeInTheDocument();
  });

  it('troca entre modos preservando os campos comuns', async () => {
    render(<App />);
    const user = userEvent.setup();

    await fazerLogin(user);
    await user.click(screen.getByRole('button', { name: /Preco Bruto/i }));

    const icmsInput = within(screen.getByText('ICMS %').closest('label')).getByRole('spinbutton');
    await user.clear(icmsInput);
    await user.type(icmsInput, '12');
    await user.click(screen.getByRole('button', { name: /Trocar modo/i }));
    await user.click(screen.getByRole('button', { name: /Preco Liquido/i }));

    expect(within(screen.getByText('ICMS %').closest('label')).getByRole('spinbutton')).toHaveValue(12);
  });

  it('abre a cola tributaria e faz quick-fill do ICMS', async () => {
    render(<App />);
    const user = userEvent.setup();

    await fazerLogin(user);
    await user.click(screen.getByRole('button', { name: /Preco Bruto/i }));
    await user.click(screen.getByRole('button', { name: /Cola Tributaria/i }));

    const dialog = screen.getByRole('dialog', { name: /Aliquotas de ICMS interestadual/i });
    const linhaImportados = within(dialog).getByText('IM').closest('tr');
    await user.click(linhaImportados);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(within(screen.getByText('ICMS %').closest('label')).getByRole('spinbutton')).toHaveValue(4);
  });
});

async function fazerLogin(user) {
  await screen.findByRole('heading', { name: 'Entrar' }, { timeout: 1500 });
  await user.type(screen.getByLabelText('Usuario'), 'admin');
  await user.type(screen.getByLabelText('Senha'), '123456');
  await user.click(screen.getByRole('button', { name: 'Acessar' }));
}
