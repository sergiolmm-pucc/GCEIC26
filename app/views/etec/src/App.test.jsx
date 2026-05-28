import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

function renderApp(initialEntries = ['/login']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  );
}

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test('mostra erro em login invalido', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText(/usuario/i), 'adm');
    await user.type(screen.getByLabelText(/senha/i), 'admin');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(screen.getByText(/usuario ou senha invalidos/i)).toBeInTheDocument();
  });

  test('faz login valido e mostra dashboard', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText(/usuario/i), 'admin');
    await user.type(screen.getByLabelText(/senha/i), 'admin');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByRole('heading', { name: /ETEC - Encargos/i })).toBeInTheDocument();
  });

  test('calcula salario usando API mockada', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('gceic26-etec-auth', 'true');
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          remuneracaoBruta: 1621,
          salarioLiquido: 1499.42,
          custoTotalEmpregador: 1945.2,
        },
      }),
    });

    renderApp(['/salario']);

    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/etec/api/salario'),
        expect.any(Object),
      );
    });
    expect(await screen.findByText(/R\$\s*1\.499,42/)).toBeInTheDocument();
  });
});
