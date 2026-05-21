import { 
    calcularConsumo, 
    calcularConta, 
    simularComparacao, 
    Appliance 
} from '../src/services/energyService.js'; 

// ─── calcularConsumo ───────────────────────────────────────────────────────────

describe('calcularConsumo', () => {
    // Usando a Interface Appliance para tipar os dados de teste
    const aparelhos: Appliance[] = [
        { name: 'Geladeira', watts: 150, hoursPerDay: 24 },
        { name: 'TV', watts: 100, hoursPerDay: 6 },
        { name: 'Ar-condicionado', watts: 1500, hoursPerDay: 8 },
    ];

    test('calcula kWh corretamente para lista de aparelhos', () => {
        const { items, totalKwh } = calcularConsumo(aparelhos);
        expect(items).toHaveLength(3);
        expect(items[0].kwhMes).toBeCloseTo(108, 1); // 0.15 * 24 * 30
        expect(items[1].kwhMes).toBeCloseTo(18, 1);  // 0.1 * 6 * 30
        expect(items[2].kwhMes).toBeCloseTo(360, 1); // 1.5 * 8 * 30
        expect(totalKwh).toBeCloseTo(486, 1);
    });

    test('usa 30 dias por padrão', () => {
        const { items } = calcularConsumo([{ name: 'Lamp', watts: 60, hoursPerDay: 5 }]);
        expect(items[0].kwhMes).toBeCloseTo(9, 1); // 0.06 * 5 * 30
    });

    test('aceita número de dias personalizado', () => {
        const { items } = calcularConsumo([{ name: 'Lamp', watts: 60, hoursPerDay: 5 }], 31);
        expect(items[0].kwhMes).toBeCloseTo(9.3, 1);
    });

    test('lança erro para lista vazia', () => {
        expect(() => calcularConsumo([])).toThrow('inválida ou vazia');
    });

    test('lança erro para aparelho com dados incompletos', () => {
        // @ts-ignore: Ignoramos o erro de tipo aqui de propósito para testar a falha em tempo de execução
        expect(() => calcularConsumo([{ name: 'TV', watts: 100 }])).toThrow('dados incompletos');
    });

    test('lança erro para valores negativos', () => {
        expect(() => calcularConsumo([{ name: 'TV', watts: -100, hoursPerDay: 5 }])).toThrow('negativos');
    });
});

// ─── calcularConta ────────────────────────────────────────────────────────────

describe('calcularConta', () => {
    test('calcula corretamente com bandeira verde (sem adicional)', () => {
        const result = calcularConta(100, 0.75, 'verde');
        expect(result.subtotal).toBeCloseTo(75, 2);
        expect(result.adicionalBandeira).toBe(0);
        expect(result.total).toBeCloseTo(75, 2);
    });

    test('aplica adicional de bandeira amarela', () => {
        const result = calcularConta(100, 0.75, 'amarela');
        expect(result.adicionalBandeira).toBeCloseTo(1.87, 1);
        expect(result.total).toBeCloseTo(76.87, 1);
    });

    test('aplica adicional de bandeira vermelha1', () => {
        const result = calcularConta(100, 0.75, 'vermelha1');
        expect(result.adicionalBandeira).toBeCloseTo(3.97, 1);
        expect(result.total).toBeCloseTo(78.97, 1);
    });

    test('aplica adicional de bandeira vermelha2', () => {
        const result = calcularConta(100, 0.75, 'vermelha2');
        expect(result.adicionalBandeira).toBeCloseTo(9.49, 1);
        expect(result.total).toBeCloseTo(84.49, 1);
    });

    test('lança erro para kWh negativo', () => {
        expect(() => calcularConta(-10, 0.75)).toThrow('negativo');
    });

    test('lança erro para tarifa zero ou negativa', () => {
        expect(() => calcularConta(100, 0)).toThrow('maior que zero');
    });

    test('lança erro para bandeira inválida', () => {
        expect(() => calcularConta(100, 0.75, 'azul')).toThrow('Bandeira inválida');
    });
});

// ─── simularComparacao ────────────────────────────────────────────────────────

describe('simularComparacao', () => {
    const cenarioA: Appliance[] = [{ name: 'Ar 8h', watts: 1500, hoursPerDay: 8 }];
    const cenarioB: Appliance[] = [{ name: 'Ar 4h', watts: 1500, hoursPerDay: 4 }];

    test('retorna cenário mais econômico corretamente', () => {
        const result = simularComparacao(cenarioA, cenarioB, 0.75);
        expect(result.cenarioMaisEconomico).toBe('B');
        expect(result.diffKwh).toBeGreaterThan(0);
        expect(result.economiaReais).toBeGreaterThan(0);
    });

    test('calcula diferença de kWh entre cenários', () => {
        const result = simularComparacao(cenarioA, cenarioB, 0.75);
        expect(result.diffKwh).toBeCloseTo(180, 1);
    });

    test('calcula economia em reais', () => {
        const result = simularComparacao(cenarioA, cenarioB, 0.75, 'verde');
        expect(result.economiaReais).toBeCloseTo(135, 1);
    });

    test('lança erro se cenários estão vazios', () => {
        expect(() => simularComparacao([], cenarioB, 0.75)).toThrow();
    });
});