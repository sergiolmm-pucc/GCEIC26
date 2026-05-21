// Interface para definir a estrutura de um aparelho
export interface Appliance {
    name: string;
    watts: number;
    hoursPerDay: number;
}

// Interface para o item calculado individualmente
export interface CalculatedItem extends Appliance {
    kwhMes: number;
}

// Tarifas de bandeiras tarifárias ANEEL (R$/kWh adicionais)
export const BANDEIRAS: Record<string, number> = {
    verde: 0.0,
    amarela: 0.01874,
    vermelha1: 0.03971,
    vermelha2: 0.09492,
};

/**
 * Calcula o consumo mensal de cada aparelho e o total.
 */
export function calcularConsumo(appliances: Appliance[], days: number = 30) {
    if (!Array.isArray(appliances) || appliances.length === 0) {
        throw new Error('Lista de aparelhos inválida ou vazia.');
    }

    const items: CalculatedItem[] = appliances.map((ap) => {
        if (!ap.name || ap.watts == null || ap.hoursPerDay == null) {
            throw new Error(`Aparelho com dados incompletos: ${JSON.stringify(ap)}`);
        }
        if (ap.watts < 0 || ap.hoursPerDay < 0) {
            throw new Error('Potência e horas de uso não podem ser negativos.');
        }
        
        const kwh = parseFloat(((ap.watts / 1000) * ap.hoursPerDay * days).toFixed(2));
        return { 
            name: ap.name, 
            watts: ap.watts, 
            hoursPerDay: ap.hoursPerDay, 
            kwhMes: kwh 
        };
    });

    const totalKwh = parseFloat(items.reduce((acc, i) => acc + i.kwhMes, 0).toFixed(2));
    return { items, totalKwh };
}

/**
 * Calcula o valor da conta de luz.
 */
export function calcularConta(totalKwh: number, tarifa: number, bandeira: string = 'verde') {
    if (totalKwh < 0) throw new Error('Total de kWh não pode ser negativo.');
    if (tarifa <= 0) throw new Error('Tarifa deve ser maior que zero.');
    
    if (!Object.prototype.hasOwnProperty.call(BANDEIRAS, bandeira)) {
        throw new Error(`Bandeira inválida. Use: ${Object.keys(BANDEIRAS).join(', ')}`);
    }

    const subtotal = parseFloat((totalKwh * tarifa).toFixed(2));
    const adicionalBandeira = parseFloat((totalKwh * BANDEIRAS[bandeira]).toFixed(2));
    const total = parseFloat((subtotal + adicionalBandeira).toFixed(2));

    return { subtotal, adicionalBandeira, total, bandeira, totalKwh, tarifa };
}

/**
 * Simula e compara dois cenários de uso.
 */
export function simularComparacao(
    cenarioA: Appliance[], 
    cenarioB: Appliance[], 
    tarifa: number, 
    bandeira: string = 'verde'
) {
    const resultA = calcularConsumo(cenarioA);
    const resultB = calcularConsumo(cenarioB);

    const contaA = calcularConta(resultA.totalKwh, tarifa, bandeira);
    const contaB = calcularConta(resultB.totalKwh, tarifa, bandeira);

    const diffKwh = parseFloat((resultA.totalKwh - resultB.totalKwh).toFixed(2));
    const economiaReais = parseFloat((contaA.total - contaB.total).toFixed(2));

    return {
        cenarioA: { ...resultA, conta: contaA },
        cenarioB: { ...resultB, conta: contaB },
        diffKwh,
        economiaReais,
        cenarioMaisEconomico: economiaReais >= 0 ? 'B' : 'A',
    };
}