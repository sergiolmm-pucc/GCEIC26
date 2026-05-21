import { Request, Response } from 'express';
import { calcularConsumo, calcularConta, simularComparacao } from '../services/energyService.js';

// Interfaces para tipar o corpo das requisições
interface ConsumoRequest {
    appliances: any[];
    days: number;
}

interface ContaRequest {
    totalKwh: number;
    tarifa: number;
    bandeira?: string;
}

interface SimularRequest {
    cenarioA: any;
    cenarioB: any;
    tarifa: number;
    bandeira?: string;
}

export const consumo = (req: Request, res: Response): Response => {
    try {
        const { appliances, days } = req.body as ConsumoRequest;
        const result = calcularConsumo(appliances, days);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
};

export const conta = (req: Request, res: Response): Response => {
    try {
        const { totalKwh, tarifa, bandeira } = req.body as ContaRequest;

        if (totalKwh == null || tarifa == null) {
            return res.status(400).json({ error: 'totalKwh e tarifa são obrigatórios.' });
        }

        const result = calcularConta(Number(totalKwh), Number(tarifa), bandeira);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
};

export const simular = (req: Request, res: Response): Response => {
    try {
        const { cenarioA, cenarioB, tarifa, bandeira } = req.body as SimularRequest;

        if (!cenarioA || !cenarioB || tarifa == null) {
            return res.status(400).json({ error: 'cenarioA, cenarioB e tarifa são obrigatórios.' });
        }

        const result = simularComparacao(cenarioA, cenarioB, Number(tarifa), bandeira);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
};