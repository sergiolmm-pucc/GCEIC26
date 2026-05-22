import service from '../services/FinanciamentoService';

const mockFetch = (dados, sucesso = true) => {
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({ sucesso, dados, erro: sucesso ? undefined : 'Erro na API' }),
  });
};

afterEach(() => jest.resetAllMocks());

const params = { valorImovel: 500000, entrada: 100000, taxaAnual: 10.5, prazoMeses: 360 };

describe('FinanciamentoService', () => {
  test('calcularSAC chama o endpoint correto', async () => {
    mockFetch({ parcelas: [] });
    await service.calcularSAC(params);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/sac'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('calcularPRICE chama o endpoint correto', async () => {
    mockFetch({ parcelas: [] });
    await service.calcularPRICE(params);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/price'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('comparar chama o endpoint correto', async () => {
    mockFetch({ sac: {}, price: {} });
    await service.comparar(params);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/comparar'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('simularCapacidade chama o endpoint correto', async () => {
    mockFetch({ parcelaMax: 1500 });
    await service.simularCapacidade({ rendaMensal: 5000 });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/capacidade'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('envia o body como JSON com os parâmetros corretos', async () => {
    mockFetch({ parcelas: [] });
    await service.calcularSAC(params);
    const chamada = fetch.mock.calls[0][1];
    expect(JSON.parse(chamada.body)).toEqual(params);
    expect(chamada.headers['Content-Type']).toBe('application/json');
  });

  test('retorna os dados da resposta quando sucesso=true', async () => {
    const dados = { parcelas: [{ mes: 1 }] };
    mockFetch(dados);
    const resultado = await service.calcularSAC(params);
    expect(resultado).toEqual(dados);
  });

  test('lança erro quando a API retorna sucesso=false', async () => {
    mockFetch(null, false);
    await expect(service.calcularSAC(params)).rejects.toThrow('Erro na API');
  });
});
