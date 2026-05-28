exports.calcularVolume = (req, res) => {
    const { largura, comprimento, profundidade } = req.body;

    if (!largura || !comprimento || !profundidade) {
        return res.status(400).json({ erro: 'Largura, comprimento e profundidade são obrigatórios' });
    }

    const volumeMetrosCubicos = largura * comprimento * profundidade;
    const volumeLitros = volumeMetrosCubicos * 1000;

    return res.status(200).json({
        volumeMetrosCubicos,
        volumeLitros
    });
};

exports.calcularAgua = (req, res) => {
    const { volumeMetrosCubicos, precoMetroCubico } = req.body;

    if (!volumeMetrosCubicos || !precoMetroCubico) {
        return res.status(400).json({ erro: 'volumeMetrosCubicos e precoMetroCubico são obrigatórios' });
    }

    const custoAgua = volumeMetrosCubicos * precoMetroCubico;

    return res.status(200).json({
        custoAgua
    });
};

exports.calcularMateriais = (req, res) => {
    const { volumeMetrosCubicos, tipoAcabamento } = req.body;

    if (!volumeMetrosCubicos || !tipoAcabamento) {
        return res.status(400).json({ erro: 'volumeMetrosCubicos e tipoAcabamento são obrigatórios' });
    }

    const custosPorM3 = {
        'vinil': 800,
        'fibra': 1000,
        'alvenaria': 1500
    };

    const precoBase = custosPorM3[tipoAcabamento.toLowerCase()];
    if (!precoBase) {
         return res.status(400).json({ erro: 'tipoAcabamento inválido. Use: vinil, fibra ou alvenaria' });
    }

    // Material elétrico/hidráulico é estimado em 20% do custo base
    const custoEstrutura = volumeMetrosCubicos * precoBase;
    const custoHidraulicaEletrica = custoEstrutura * 0.20;
    const custoMateriais = custoEstrutura + custoHidraulicaEletrica;

    return res.status(200).json({
        custoMateriais,
        detalhes: {
            custoEstrutura,
            custoHidraulicaEletrica
        }
    });
};

exports.calcularManutencao = (req, res) => {
    const { volumeMetrosCubicos, meses } = req.body;

    if (!volumeMetrosCubicos || !meses) {
        return res.status(400).json({ erro: 'volumeMetrosCubicos e meses são obrigatórios' });
    }

    // Custo estimado mensal por m3: R$ 5,00 (produtos químicos) + R$ 3,00 (energia da bomba)
    const custoMensalPorM3 = 8.00;
    const custoMensalTotal = volumeMetrosCubicos * custoMensalPorM3;
    const custoManutencao = custoMensalTotal * meses;

    return res.status(200).json({
        custoMensalTotal,
        custoManutencao,
        meses
    });
};

exports.calcularMaoDeObra = (req, res) => {
    const { diasEstimados, trabalhadores, valorDiaria } = req.body;

    if (!diasEstimados || !trabalhadores || !valorDiaria) {
        return res.status(400).json({ erro: 'diasEstimados, trabalhadores e valorDiaria são obrigatórios' });
    }

    const custoMaoDeObra = diasEstimados * trabalhadores * valorDiaria;

    return res.status(200).json({
        custoMaoDeObra
    });
};
