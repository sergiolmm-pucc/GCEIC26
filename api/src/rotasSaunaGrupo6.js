const express = require('express');
const router = express.Router();

// Endpoint 1 Materiais (Pedro Pelaes Malinconico)
router.post('/materiais', (req, res) => {
    const { largura, comprimento, altura, tipo } = req.body;

    // Validação básica
    if (!largura || !comprimento || !altura || !tipo) {
        return res.status(400).json({ erro: "Faltam parâmetros obrigatórios." });
    }

    // Cálculos de área e volume
    const areaTeto = largura * comprimento;
    const areaParedes = (largura * altura * 2) + (comprimento * altura * 2);
    const areaTotalM2 = areaTeto + areaParedes;
    const volumeM3 = largura * comprimento * altura;

    // Regras de negócio para os custos
    const precoRevestimentoM2 = tipo === 'umida' ? 75.00 : 120.00; // Pastilha vs Madeira
    const custoRevestimento = areaTotalM2 * precoRevestimentoM2;
    const custoIsolamento = areaTotalM2 * 20.00; 
    const custoPorta = tipo === 'umida' ? 800.00 : 1100.00;

    const totalMateriais = custoRevestimento + custoIsolamento + custoPorta;

    res.json({
        areaTotalM2,
        volumeM3,
        custoRevestimento,
        custoIsolamento,
        custoPorta,
        totalMateriais
    });
});

// Endpoint 2 Cálculo de Equipamentos (Aluno 2)
router.post('/equipamentos', (req, res) => {
    const { volumeM3, tipo } = req.body;

    if (!volumeM3 || !tipo) {
        return res.status(400).json({ erro: "Faltam parâmetros obrigatórios." });
    }

    // Lógica para definir a potência do gerador/forno baseada no volume
    let potenciaGeradorKW = 9.0; // Base para até 10m3
    if (volumeM3 > 10 && volumeM3 <= 18) {
        potenciaGeradorKW = 12.0;
    } else if (volumeM3 > 18) {
        potenciaGeradorKW = 18.0;
    }

    // Custo base do equipamento
    let custoGerador = 2500.00;
    if (potenciaGeradorKW === 12.0) custoGerador = 3200.00;
    if (potenciaGeradorKW === 18.0) custoGerador = 4500.00;

    const custoQuadroComando = 350.00;
    const custoAcessorios = tipo === 'seca' ? 600.00 : 400.00; // Seca precisa de pedras dolomitas

    const totalEquipamentos = custoGerador + custoQuadroComando + custoAcessorios;

    res.json({
        potenciaGeradorKW,
        custoGerador,
        custoQuadroComando,
        custoAcessorios,
        totalEquipamentos
    });
});

// Endpoint 3 Cálculo de Manutenção (Aluno 3)
router.post('/manutencao', (req, res) => {
    const { potenciaGeradorKW, horasUsoMes, precoKWh } = req.body;

    if (!potenciaGeradorKW || !horasUsoMes || !precoKWh) {
        return res.status(400).json({ erro: "Faltam parâmetros obrigatórios." });
    }

    // Cálculo do consumo energético mensal
    const consumoMensalKWh = potenciaGeradorKW * horasUsoMes;
    const custoEnergiaMensal = consumoMensalKWh * precoKWh;
    
    const custoEssenciasELimpeza = 50.00; // Valor fixo médio

    const totalManutencaoMensal = custoEnergiaMensal + custoEssenciasELimpeza;

    res.json({
        consumoMensalKWh,
        custoEnergiaMensal,
        custoEssenciasELimpeza,
        totalManutencaoMensal
    });
});

module.exports = router;