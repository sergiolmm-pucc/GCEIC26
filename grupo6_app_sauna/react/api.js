const express = require('express');
const app = express();
app.use(express.json());

// API de materiais de construção (Pedro Pelaes Malinconico)
app.post('/api/SAUNA/materiais', (req, res) => {
    const { largura, comprimento, altura, tipo } = req.body;
    
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

// API de equipamentos ()
app.post('/api/SAUNA/equipamentos', (req, res) => {

});

// API de manutencao ()
app.post('/api/SAUNA/manutencao', (req, res) => {

});

module.exports = app;