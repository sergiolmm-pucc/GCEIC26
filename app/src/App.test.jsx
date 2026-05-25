import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import App from './App.jsx';

const MOCK_RESULT = {
  horasBrutasAno: 2080,
  horasFeriasAno: 160,
  horasDisponiveisAno: 1920,
  horasFaturaveisAno: 1440,
  horasFaturaveisMes: 120,
  custoMaoDeObraAnual: 106666.67,
  custoMaoDeObraMensal: 8888.89,
  valorHoraBase: 74.07,
  despesaMensalTotal: 2000,
  custoOperacionalHora: 16.67,
  custoHoraEquilibrio: 90.74,
  precoHoraLimpo: 108.89,
  precoHoraFinal: 115.84,
  faturamentoMensalProjetado: 13900.6,
  impostoMensalProjetado: 834.04,
  custosMensaisTotais: 11722.93,
  lucroMensalLiquido: 2177.67
};

function mockApiSuccess(data) {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true, data: data || MOCK_RESULT })
  });
}

function mockApiFailure(error) {
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ success: false, error: error || 'Erro de validacao' })
  });
}

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function loginUser() {
  const user = userEvent.setup();
  render(<App />);
  await user.type(screen.getByLabelText(/usuario/i), 'admin');
  await user.type(screen.getByLabelText(/senha/i), 'admin');
  await user.click(screen.getByRole('button', { name: /entrar/i }));
  return user;
}

describe('HourlyCost React app', () => {
  test('renderiza login e mostra erro para credenciais invalidas', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/usuario/i), 'Adm');
    await user.type(screen.getByLabelText(/senha/i), 'admin');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/invalidos/i);
  });

  test('login valido abre a calculadora protegida', async () => {
    await loginUser();

    expect(screen.getByRole('heading', { name: /custo de servicos em horas/i })).toBeInTheDocument();
  });

  test('calcula usando a API e mostra preco final', async () => {
    mockApiSuccess();

    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(() => expect(screen.getByTestId('preco-hora-final')).toHaveTextContent('R$'));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/calcular'), expect.objectContaining({ method: 'POST' }));
  });

  test('mostra erro quando API falha', async () => {
    mockApiFailure('Erro de validacao');

    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /calcular/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Erro de validacao');
  });

  test('navega para sobre, ajuda e logout', async () => {
    const user = await loginUser();

    await user.click(screen.getByRole('button', { name: /sobre/i }));
    expect(screen.getByRole('heading', { name: /equipe desenvolvedora/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /ajuda/i }));
    expect(screen.getByRole('heading', { name: /como usar o hourlycost/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sair/i }));
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
});

describe('Exibicao completa dos 17 campos do resultado', () => {
  test('secao Mao de Obra exibe as 8 metricas de trabalho', async () => {
    mockApiSuccess();
    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(() => screen.getByTestId('secao-mao-de-obra'));

    expect(screen.getByText(/Horas brutas\/ano/i)).toBeInTheDocument();
    expect(screen.getByText(/Horas ferias\/ano/i)).toBeInTheDocument();
    expect(screen.getByText(/Horas disponiveis\/ano/i)).toBeInTheDocument();
    expect(screen.getByText(/Horas faturaveis\/ano/i)).toBeInTheDocument();
    expect(screen.getByText(/Horas faturaveis\/mes/i)).toBeInTheDocument();
    expect(screen.getByText(/Custo mao obra anual/i)).toBeInTheDocument();
    expect(screen.getByText(/Custo mao obra mensal/i)).toBeInTheDocument();
    expect(screen.getByText(/Valor hora base/i)).toBeInTheDocument();
  });

  test('secao Custos Operacionais exibe as 3 metricas de despesa', async () => {
    mockApiSuccess();
    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(() => screen.getByTestId('secao-operacional'));

    expect(screen.getByText(/Despesa mensal total/i)).toBeInTheDocument();
    expect(screen.getByText(/Custo operacional\/hora/i)).toBeInTheDocument();
    expect(screen.getByText(/Custo hora equilibrio/i)).toBeInTheDocument();
  });

  test('secao Precificacao Final exibe as 5 metricas de preco', async () => {
    mockApiSuccess();
    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(() => screen.getByTestId('secao-precificacao'));

    expect(screen.getByText(/Preco hora limpo/i)).toBeInTheDocument();
    expect(screen.getByText(/Faturamento mensal/i)).toBeInTheDocument();
    expect(screen.getByText(/Impostos mensais/i)).toBeInTheDocument();
    expect(screen.getByText(/Custos mensais totais/i)).toBeInTheDocument();
    expect(screen.getByText(/Lucro liquido/i)).toBeInTheDocument();
  });

  test('hero number exibe precoHoraFinal formatado em BRL', async () => {
    mockApiSuccess();
    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(() =>
      expect(screen.getByTestId('preco-hora-final')).toHaveTextContent('R$')
    );
    expect(screen.getByTestId('preco-hora-final').textContent).toMatch(/115/);
  });
});

describe('Payload da chamada /api/calcular', () => {
  test('envia os 9 campos numericos corretos', async () => {
    mockApiSuccess();
    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const [, options] = fetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(body).toMatchObject({
      salarioDesejado:       expect.any(Number),
      diasTrabalhadosSemana: expect.any(Number),
      horasTrabalhadasDia:   expect.any(Number),
      semanasFeriasAno:      expect.any(Number),
      percentualProdutivo:   expect.any(Number),
      despesasFixasMensais:  expect.any(Number),
      reservaSeguranca:      expect.any(Number),
      margemLucroDesejada:   expect.any(Number),
      percentualImpostos:    expect.any(Number)
    });
  });

  test('valores padrao correspondem ao initialForm', async () => {
    mockApiSuccess();
    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /calcular/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.salarioDesejado).toBe(8000);
    expect(body.diasTrabalhadosSemana).toBe(5);
    expect(body.horasTrabalhadasDia).toBe(8);
    expect(body.semanasFeriasAno).toBe(4);
    expect(body.percentualProdutivo).toBe(75);
    expect(body.despesasFixasMensais).toBe(1500);
    expect(body.reservaSeguranca).toBe(500);
    expect(body.margemLucroDesejada).toBe(20);
    expect(body.percentualImpostos).toBe(6);
  });
});

describe('Snapshots de UI', () => {
  test('snapshot: tela de login', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('snapshot: calculadora vazia apos login', async () => {
    const { asFragment } = render(<App />);
    const user = userEvent.setup({ document: document });
    await user.type(screen.getByLabelText(/usuario/i), 'admin');
    await user.type(screen.getByLabelText(/senha/i), 'admin');
    await user.click(screen.getByRole('button', { name: /entrar/i }));
    expect(asFragment()).toMatchSnapshot();
  });

  test('snapshot: calculadora com resultado completo', async () => {
    mockApiSuccess();
    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /calcular/i }));
    await waitFor(() => screen.getByTestId('preco-hora-final'));
    expect(document.body).toMatchSnapshot();
  });

  test('snapshot: tela Sobre', async () => {
    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /sobre/i }));
    expect(document.body).toMatchSnapshot();
  });

  test('snapshot: tela Ajuda', async () => {
    const user = await loginUser();
    await user.click(screen.getByRole('button', { name: /ajuda/i }));
    expect(document.body).toMatchSnapshot();
  });
});
