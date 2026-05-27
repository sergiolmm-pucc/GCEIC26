const { calcularConsumo, calcularConta, simularComparacao } = require('../services/energyService');

const consumo = (req, res) => {
    try {
        const { appliances, days } = req.body;
        const result = calcularConsumo(appliances, days);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const conta = (req, res) => {
    try {
        const { totalKwh, tarifa, bandeira } = req.body;

        if (totalKwh == null || tarifa == null) {
            return res.status(400).json({ error: 'totalKwh e tarifa são obrigatórios.' });
        }

        const result = calcularConta(Number(totalKwh), Number(tarifa), bandeira);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const simular = (req, res) => {
    try {
        const { cenarioA, cenarioB, tarifa, bandeira } = req.body;

        if (!cenarioA || !cenarioB || tarifa == null) {
            return res.status(400).json({ error: 'cenarioA, cenarioB e tarifa são obrigatórios.' });
        }

        const result = simularComparacao(cenarioA, cenarioB, Number(tarifa), bandeira);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

module.exports = { consumo, conta, simular };
