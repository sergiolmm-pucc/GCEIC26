import { calcularFrete, calcularDistancia, calcularPrazo, listarCidades } from '../src/services/frete.service';

// ══════════════════════════════════════════
//  calcularFrete
// ══════════════════════════════════════════
describe('calcularFrete', () => {
  it('retorna valores corretos para frete normal', () => {
    const res = calcularFrete({ peso: 10, distancia: 100, tipo: 'normal' });
    expect(res.custoPeso).toBe(25.00);
    expect(res.custoDistancia).toBe(15.00);
    expect(res.valorBase).toBe(40.00);
    expect(res.valorFinal).toBe(40.00);
    expect(res.multiplicadorTipo).toBe(1.0);
  });

  it('aplica multiplicador expresso corretamente', () => {
    const res = calcularFrete({ peso: 10, distancia: 100, tipo: 'expresso' });
    expect(res.multiplicadorTipo).toBe(1.8);
    expect(res.valorFinal).toBe(72.00);
  });

  it('aplica multiplicador economico corretamente', () => {
    const res = calcularFrete({ peso: 10, distancia: 100, tipo: 'economico' });
    expect(res.multiplicadorTipo).toBe(0.8);
    expect(res.valorFinal).toBe(32.00);
  });

  it('lança erro para peso zero', () => {
    expect(() => calcularFrete({ peso: 0, distancia: 100, tipo: 'normal' }))
      .toThrow('Peso deve ser maior que zero');
  });

  it('lança erro para peso negativo', () => {
    expect(() => calcularFrete({ peso: -1, distancia: 100, tipo: 'normal' }))
      .toThrow('Peso deve ser maior que zero');
  });

  it('lança erro para distancia zero', () => {
    expect(() => calcularFrete({ peso: 10, distancia: 0, tipo: 'normal' }))
      .toThrow('Distância deve ser maior que zero');
  });

  it('lança erro para tipo inválido', () => {
    expect(() => calcularFrete({ peso: 10, distancia: 100, tipo: 'drone' as any }))
      .toThrow('Tipo inválido');
  });
});

// ══════════════════════════════════════════
//  calcularDistancia
// ══════════════════════════════════════════
describe('calcularDistancia', () => {
  it('retorna distância correta entre São Paulo e Rio de Janeiro', () => {
    const res = calcularDistancia({ origem: 'São Paulo', destino: 'Rio de Janeiro' });
    expect(res.distanciaKm).toBe(430);
    expect(res.custoDistancia).toBe(64.50);
  });

  it('funciona nos dois sentidos', () => {
    const res = calcularDistancia({ origem: 'Rio de Janeiro', destino: 'São Paulo' });
    expect(res.distanciaKm).toBe(430);
  });

  it('classifica faixa interestadual corretamente', () => {
    const res = calcularDistancia({ origem: 'São Paulo', destino: 'Rio de Janeiro' });
    expect(res.faixaRegiao).toBe('estadual');
  });

  it('lança erro se origem e destino iguais', () => {
    expect(() => calcularDistancia({ origem: 'São Paulo', destino: 'São Paulo' }))
      .toThrow('Origem e destino não podem ser iguais');
  });

  it('lança erro se rota não encontrada', () => {
    expect(() => calcularDistancia({ origem: 'São Paulo', destino: 'CidadeX' }))
      .toThrow('Rota não encontrada');
  });
});

// ══════════════════════════════════════════
//  calcularPrazo
// ══════════════════════════════════════════
describe('calcularPrazo', () => {
  it('retorna prazo correto para tipo normal e 100km', () => {
    const res = calcularPrazo({ distanciaKm: 100, tipo: 'normal' });
    expect(res.diasUteisMin).toBe(3);
    expect(res.diasUteisMax).toBe(5);
  });

  it('retorna prazo correto para tipo expresso', () => {
    const res = calcularPrazo({ distanciaKm: 100, tipo: 'expresso' });
    expect(res.diasUteisMin).toBe(1);
    expect(res.diasUteisMax).toBe(2);
  });

  it('lança erro para distância zero', () => {
    expect(() => calcularPrazo({ distanciaKm: 0, tipo: 'normal' }))
      .toThrow('Distância deve ser maior que zero');
  });
});

// ══════════════════════════════════════════
//  listarCidades
// ══════════════════════════════════════════
describe('listarCidades', () => {
  it('retorna array com cidades', () => {
    const cidades = listarCidades();
    expect(Array.isArray(cidades)).toBe(true);
    expect(cidades.length).toBeGreaterThan(0);
  });

  it('contém São Paulo na lista', () => {
    expect(listarCidades()).toContain('São Paulo');
  });
});
