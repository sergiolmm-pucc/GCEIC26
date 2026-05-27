

const { calcularArea, decodificarChaveNF, calcularImpostosNFVenda } = require('../src/funcoes');

describe('Teste de unitario', () => {

	test('deve retornar calculos', async () => {

		expect(calcularArea(2,3)).toBe("6.00" );
        expect(() => calcularArea(0,3)).toThrow();
        expect(() => calcularArea(3,0)).toThrow();
        expect(() => calcularArea(-10,3)).toThrow();

	});

});

// ────────────────────────────────────────────────────────────
//  GRUPO 17 — Testes unitários NF de Venda
// ────────────────────────────────────────────────────────────

const CHAVE_SP  = '35260312345678000195550010000000011234567890';
const CHAVE_RJ  = '33260312345678000195550010000000011234567891';

describe('decodificarChaveNF', () => {

  test('deve decodificar estado SP corretamente', () => {
    const info = decodificarChaveNF(CHAVE_SP);
    expect(info.estadoSigla).toBe('SP');
    expect(info.icmsPadrao).toBe(18);
    expect(info.modelo).toBe('55');
    expect(info.modeloDescricao).toContain('NF-e');
  });

  test('deve decodificar estado RJ corretamente', () => {
    const info = decodificarChaveNF(CHAVE_RJ);
    expect(info.estadoSigla).toBe('RJ');
    expect(info.icmsPadrao).toBe(20);
  });

  test('deve formatar CNPJ corretamente', () => {
    const info = decodificarChaveNF(CHAVE_SP);
    expect(info.cnpjFormatado).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
  });

  test('deve lançar erro para chave com menos de 44 dígitos', () => {
    expect(() => decodificarChaveNF('123')).toThrow();
  });

  test('deve lançar erro para chave com mais de 44 dígitos', () => {
    expect(() => decodificarChaveNF('123456789012345678901234567890123456789012345')).toThrow();
  });

  test('deve ignorar caracteres não numéricos na chave', () => {
    const chaveComEspacos = CHAVE_SP.replace(/(.{4})/g, '$1 ').trim();
    const info = decodificarChaveNF(chaveComEspacos);
    expect(info.estadoSigla).toBe('SP');
  });

});

describe('calcularImpostosNFVenda', () => {

  test('deve calcular ICMS, IPI, PIS e COFINS no Lucro Real', () => {
    const r = calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 1000, ipi: 5, regime: 'lucroReal' });
    expect(r.impostos.icms.valor).toBeCloseTo(180, 2);
    expect(r.impostos.ipi.valor).toBeCloseTo(50, 2);
    expect(r.impostos.pis.valor).toBeCloseTo(16.5, 2);
    expect(r.impostos.cofins.valor).toBeCloseTo(76, 2);
    expect(r.totalImpostos).toBeCloseTo(322.5, 2);
  });

  test('deve calcular carga tributária corretamente', () => {
    const r = calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 1000, ipi: 0, regime: 'lucroReal' });
    expect(r.cargaTributaria).toBeCloseTo(27.25, 1);
  });

  test('deve usar regime Lucro Presumido com alíquotas corretas', () => {
    const r = calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 1000, ipi: 0, regime: 'lucroPresumido' });
    expect(r.impostos.pis.alicota).toBe(0.65);
    expect(r.impostos.cofins.alicota).toBe(3);
  });

  test('deve usar PIS/COFINS zerados no Simples Nacional', () => {
    const r = calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 1000, ipi: 0, regime: 'simplesNacional' });
    expect(r.impostos.pis.valor).toBe(0);
    expect(r.impostos.cofins.valor).toBe(0);
  });

  test('deve aceitar ICMS personalizado', () => {
    const r = calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 1000, ipi: 0, icmsPersonalizado: 12 });
    expect(r.impostos.icms.alicota).toBe(12);
    expect(r.impostos.icms.valor).toBeCloseTo(120, 2);
  });

  test('deve lançar erro para valor do produto zero', () => {
    expect(() => calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 0 })).toThrow();
  });

  test('deve lançar erro para IPI negativo', () => {
    expect(() => calcularImpostosNFVenda({ chave: CHAVE_SP, valorProduto: 100, ipi: -1 })).toThrow();
  });

  test('deve lançar erro quando chave não é informada', () => {
    expect(() => calcularImpostosNFVenda({ valorProduto: 100 })).toThrow();
  });

});