const express = require('express');
const app = express();
app.use(express.json());

// API de materiais de construção (Pedro Pelaes Malinconico)
app.post('/api/SAUNA/materiais', (req, res) => {
    const { largura, comprimento, altura, tipo } = req.body;

    if (!largura || !comprimento || !altura || !tipo) {
        return res.status(400).json({ erro: "Faltam parâmetros obrigatórios." });
    }

    const areaTeto = largura * comprimento;
    const areaParedes = (largura * altura * 2) + (comprimento * altura * 2);
    const areaTotalM2 = areaTeto + areaParedes;
    const volumeM3 = largura * comprimento * altura;

    // Valores fixos para entrega parcial 
    const precoRevestimentoM2 = tipo === 'umida' ? 75.00 : 120.00; // Úmida usa pastilha, seca usa madeira
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

// API de equipamentos (Pedro Facine Nery)
app.post('/api/SAUNA/equipamentos', (req, res) => {
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

// API de manutencao (William Kenzo Nakao)
app.post('/api/SAUNA/manutencao', (req, res) => {
    const { potenciaGeradorKW, horasUsoMes, precoKWh } = req.body;

    if (potenciaGeradorKW === undefined || horasUsoMes === undefined || precoKWh === undefined) {
        return res.status(400).json({ erro: "Faltam parâmetros obrigatórios." });
    }

    // Cálculo do consumo energético mensal
    const consumoMensalKWh = potenciaGeradorKW * horasUsoMes;
    const custoEnergiaMensal = consumoMensalKWh * precoKWh;
    
    const custoEssenciasELimpeza = 50.00; // Valor fixo médio para a entrega parcial

    const totalManutencaoMensal = custoEnergiaMensal + custoEssenciasELimpeza;

    res.json({
        consumoMensalKWh,
        custoEnergiaMensal,
        custoEssenciasELimpeza,
        totalManutencaoMensal
    });
});

module.exports = app;