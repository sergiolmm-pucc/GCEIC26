const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');

const rotasGrupo6 = require('./equipe-6/rotasSaunaGrupo6');
const pricingRouter = require('./equipe-14/pricingRoutes');
const nfvendaRouter = require('./equipe-17/nfvendaRoutes');
const equipe15Router = require('./equipe-15/freteRoutes');
const equipe21Router = require('./equipe-21/routes');
const mkpRouter = require('./grupo13-markup/routes');
const grupo12Router = require('./equipe-12/routes');
const energyRouter = require('./equipe-5/routes/energy');
const irpRouter = require('./equipe-2/irpRoutes');
const volumeRoutes = require('./equipe-7/volume');
const materiaisRoutes = require('./equipe-7/materiais');
const custosRoutes = require('./equipe-7/custos');
const etec64Routes = require('./etec64/routes/etecRoutes.js');
const piscinaRouter08 = require('./equipe-08/routes/piscina');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    by: 'SLMM-33',
    turma: '101',
  });
});

app.use('/PBL', pricingRouter);
app.use('/IRP', irpRouter);
app.use('/ENRG', energyRouter);
app.use('/nfvenda', nfvendaRouter);
app.use('/api/equipe-21', equipe21Router);
app.use('/equipe-15', equipe15Router);
app.use('/api/equipe-08/piscina', piscinaRouter08);

app.get('/MKP', (req, res) => res.json({ message: 'API MarkUp - Grupo 13 funcionando!' }));
app.use('/MKP', mkpRouter);

app.get('/api/equipe-12', (req, res) => {
  res.json({ message: 'API MarkUp - Grupo 12 funcionando!' });
});
app.use('/api/equipe-12', grupo12Router);

app.use('/equipe-18', (req, res) => {
  const target = new URL(req.path.replace(/^\//, ''), 'https://d36mf6v2e37tzy.cloudfront.net/');
  const proxyRequest = https.request(target, {
    method: req.method,
    headers: {
      ...req.headers,
      host: target.host,
    },
  }, (proxyResponse) => {
    res.status(proxyResponse.statusCode || 502);
    for (const [header, value] of Object.entries(proxyResponse.headers)) {
      if (value !== undefined) {
        res.setHeader(header, value);
      }
    }
    proxyResponse.pipe(res);
  });

  proxyRequest.on('error', (error) => {
    res.status(502).json({
      error: 'Falha ao comunicar com o Backend do Grupo 18.',
      message: error.message,
    });
  });

  req.pipe(proxyRequest);
});

app.use('/api/SAUNA', rotasGrupo6);

app.get('/api/tabelas', (req, res) => {
  const { TABELA } = require('./equipe-16/funcoes');
  res.json({
    success: true,
    data: {
      tiposCalculo: TABELA.TIPOS_CALCULO,
      exemplos: TABELA.EXEMPLOS,
    },
  });
});

app.get('/api/equipe-9/tabelas', (req, res) => {
  const { TABELA } = require('./equipe-9/funcoes');
  res.json({
    success: true,
    data: TABELA.IMPOSTOS_PADRAO,
  });
});

app.post('/api/equipe-9/calcular', (req, res) => {
  try {
    const { calcular } = require('./funcoes');
    const dados = req.body;
    console.log(dados);

    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Corpo da requisicao invalido',
      });
    }

    const resultado = calcularNF(dados);
    return res.status(200).json({
      success: true,
      data: resultado,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

app.post('/api/equipe-9/calcular-inverso', (req, res) => {
  try {
    const { calcularNFInverso } = require('./equipe-9/funcoes');
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisicao invalido' });
    }
    const resultado = calcularNFInverso(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/equipe-9/comparar', (req, res) => {
  try {
    const { compararAliquotas } = require('./equipe-9/funcoes');
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisicao invalido' });
    }
    const resultado = compararAliquotas(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/equipe-16/calcular', (req, res) => {
  try {
    const { calcular } = require('./equipe-16/funcoes');
    const dados = req.body;

    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisicao invalido' });
    }

    const resultado = calcular(dados);
    console.log(resultado);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

const { calcularConsumoDiario, calcularCustoMensal, calcularEconomia } = require('./equipe-20/funcoes');

app.post('/AGUA/consumoDiario', (req, res) => {
  try {
    const { tempoBanhoMin, descargasDia, pessoas } = req.body;
    const resultado = calcularConsumoDiario(Number(tempoBanhoMin), Number(descargasDia), Number(pessoas));
    res.json({ success: true, data: resultado });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/AGUA/custoMensal', (req, res) => {
  try {
    const { consumoDiarioLitros, tarifa, dias } = req.body;
    const resultado = calcularCustoMensal(Number(consumoDiarioLitros), Number(tarifa), Number(dias) || 30);
    res.json({ success: true, data: resultado });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/AGUA/economia', (req, res) => {
  try {
    const { litrosAtuais, reducaoPercentual, tarifa, pessoas } = req.body;
    const resultado = calcularEconomia(
      Number(litrosAtuais),
      Number(reducaoPercentual),
      Number(tarifa),
      Number(pessoas),
    );
    res.json({ success: true, data: resultado });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.use('/PISCINA2/volume', volumeRoutes);
app.use('/PISCINA2/materiais', materiaisRoutes);
app.use('/PISCINA2/custos', custosRoutes);

const autonomiaController = require('./equipe-23/autonomiaController');

app.post('/autonomia/calcular', (req, res) => {
  try {
    const { kmPercorridos, litrosAbastecidos } = req.body;
    const resultado = autonomiaController.calcularAutonomia(Number(kmPercorridos), Number(litrosAbastecidos));
    res.json({ sucesso: true, dados: resultado });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
});

app.post('/autonomia/custo-viagem', (req, res) => {
  try {
    const { distanciaKm, autonomiaKmL, precoCombustivel } = req.body;
    const resultado = autonomiaController.calcularCustoViagem(
      Number(distanciaKm),
      Number(autonomiaKmL),
      Number(precoCombustivel),
    );
    res.json({ sucesso: true, dados: resultado });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
});

app.post('/autonomia/comparar-combustivel', (req, res) => {
  try {
    const { precoGasolina, precoEtanol, autonomiaGasolina, autonomiaEtanol } = req.body;
    const resultado = autonomiaController.compararCombustivel(
      Number(precoGasolina),
      Number(precoEtanol),
      Number(autonomiaGasolina),
      Number(autonomiaEtanol),
    );
    res.json({ sucesso: true, dados: resultado });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
});

app.use('/api/etec64', etec64Routes);

module.exports = app;
