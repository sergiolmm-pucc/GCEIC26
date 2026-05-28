const controller = require('../src/controllers/FinanciamentoController');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockReq(body) {
  return { body };
}

describe('FinanciamentoController._extrairParams', () => {
  test('extrai e converte parâmetros numéricos corretamente', () => {
    const params = controller._extrairParams({
      valorImovel: '500000',
      entrada: '100000',
      taxaAnual: '12',
      prazoMeses: '120',
    });
    expect(params).toEqual({ valorImovel: 500000, entrada: 100000, taxaAnual: 12, prazoMeses: 120 });
  });

  test('lança erro quando algum parâmetro não é numérico', () => {
    expect(() =>
      controller._extrairParams({ valorImovel: 'abc', entrada: 100000, taxaAnual: 12, prazoMeses: 120 })
    ).toThrow('Parâmetros inválidos');
  });

  test('lança erro quando prazoMeses está ausente', () => {
    expect(() =>
      controller._extrairParams({ valorImovel: 500000, entrada: 100000, taxaAnual: 12 })
    ).toThrow('Parâmetros inválidos');
  });
});

describe('FinanciamentoController.calcularSAC', () => {
  test('retorna 200 com dados do SAC para requisição válida', () => {
    const req = mockReq({ valorImovel: 500000, entrada: 100000, taxaAnual: 12, prazoMeses: 120 });
    const res = mockRes();
    controller.calcularSAC(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: true, dados: expect.objectContaining({ tipo: 'FinanciamentoSAC' }) })
    );
  });

  test('retorna 400 quando parâmetros são inválidos', () => {
    const req = mockReq({ valorImovel: 'erro', entrada: 100000, taxaAnual: 12, prazoMeses: 120 });
    const res = mockRes();
    controller.calcularSAC(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ sucesso: false }));
  });

  test('retorna 400 quando entrada >= valor do imóvel', () => {
    const req = mockReq({ valorImovel: 100000, entrada: 200000, taxaAnual: 12, prazoMeses: 120 });
    const res = mockRes();
    controller.calcularSAC(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ sucesso: false }));
  });
});

describe('FinanciamentoController.calcularPRICE', () => {
  test('retorna 200 com dados do PRICE para requisição válida', () => {
    const req = mockReq({ valorImovel: 500000, entrada: 100000, taxaAnual: 12, prazoMeses: 120 });
    const res = mockRes();
    controller.calcularPRICE(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: true, dados: expect.objectContaining({ tipo: 'FinanciamentoPRICE' }) })
    );
  });

  test('retorna 400 para parâmetros inválidos', () => {
    const req = mockReq({ valorImovel: 500000, entrada: 100000, taxaAnual: -5, prazoMeses: 120 });
    const res = mockRes();
    controller.calcularPRICE(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('FinanciamentoController.comparar', () => {
  test('retorna 200 com comparação SAC x PRICE', () => {
    const req = mockReq({ valorImovel: 500000, entrada: 100000, taxaAnual: 12, prazoMeses: 120 });
    const res = mockRes();
    controller.comparar(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(payload.sucesso).toBe(true);
    expect(payload.dados).toHaveProperty('sac');
    expect(payload.dados).toHaveProperty('price');
    expect(payload.dados).toHaveProperty('comparacao');
  });

  test('retorna 400 para body vazio', () => {
    const req = mockReq({});
    const res = mockRes();
    controller.comparar(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('FinanciamentoController.simularCapacidade', () => {
  test('retorna 200 com capacidade calculada corretamente', () => {
    const req = mockReq({ rendaMensal: 8000, taxaAnual: 10.5, prazoMeses: 360 });
    const res = mockRes();
    controller.simularCapacidade(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(payload.sucesso).toBe(true);
    expect(payload.dados.parcelaMaximaRecomendada).toBeCloseTo(2400, 0);
    expect(payload.dados.percentualRenda).toBe(30);
  });

  test('retorna 400 para renda mensal zero', () => {
    const req = mockReq({ rendaMensal: 0, taxaAnual: 10.5, prazoMeses: 360 });
    const res = mockRes();
    controller.simularCapacidade(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ sucesso: false }));
  });

  test('retorna 400 para renda mensal negativa', () => {
    const req = mockReq({ rendaMensal: -1000, taxaAnual: 10.5, prazoMeses: 360 });
    const res = mockRes();
    controller.simularCapacidade(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('retorna 400 para parâmetros ausentes', () => {
    const req = mockReq({});
    const res = mockRes();
    controller.simularCapacidade(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
