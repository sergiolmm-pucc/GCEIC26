const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const rotasGrupo6 = require('./equipe-6/rotasSaunaGrupo6');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const pricingRouter  = require('./equipe-14/pricingRoutes');
const nfvendaRouter  = require('./equipe-17/nfvendaRoutes');
const equipe15Router = require('./equipe-15/freteRoutes');
const equipe21Router = require('./equipe-21/routes');
const mkpRouter      = require('./grupo13-markup/routes');
const energyRouter   = require('./equipe-5/routes/energy');
const irpRouter      = require('./equipe-2/irpRoutes');

const volumeRoutes    = require('./equipe-7/volume');
const materiaisRoutes = require('./equipe-7/materiais');
const custosRoutes    = require('./equipe-7/custos');

// checa se api está no ar
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() , by:'SLMM-33', turma:'101'});
});

app.use('/PBL',           pricingRouter);
app.use('/IRP',           irpRouter);
app.use('/ENRG',          energyRouter);
app.use('/nfvenda',       nfvendaRouter);
app.use('/api/equipe-21', equipe21Router);
app.use('/equipe-15',     equipe15Router);

// ── Grupo 13 — MarkUp ──
app.get('/MKP', (req, res) => res.json({ message: 'API MarkUp - Grupo 13 funcionando!' }));
app.use('/MKP', mkpRouter);

// Proxy para o Backend do Grupo 18
app.use('/equipe-18', (req, res) => {
  const https = require('https');
  const target = new URL(req.path.replace(/^\//, ''), 'https://d36mf6v2e37tzy.cloudfront.net/');

  const proxyRequest = https.request(target, {
    method: req.method,
    headers: {
      ...req.headers,
      host: target.host
    }
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
      message: error.message
    });
  });

  req.pipe(proxyRequest);
});

/** ------------------------------------------------
 * Rotas grupo 6 - Calculo de Sauna
 */
app.use('/api/SAUNA', rotasGrupo6)

// Grupo 16 - Tabelas auxiliares
app.get('/api/tabelas', (req, res) => {
  const { TABELA } = require('./equipe-16/funcoes');
  res.json({
    success: true,
    data: {
      campos: TABELA.CAMPOS,
      formula: TABELA.FORMULA,
    },
  });
});


// ROTAS DA EQUIPE 9
// retorna tabela padrão de impostos
app.get('/api/equipe-9/tabelas', (req, res) => {
  const { TABELA } = require('./equipe-9/funcoes');
  res.json({
    success: true,
    data: TABELA.IMPOSTOS_PADRAO,
  });
});

// POST /api/equipe-9/calcular
app.post('/api/equipe-9/calcular', (req, res) => {
  try {
    const { calcularNF } = require('./equipe-9/funcoes');
    const dados = req.body;

    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Corpo da requisição inválido'
      });
    }

    const resultado = calcularNF(dados);
    return res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// POST /api/equipe-9/calcular-inverso
app.post('/api/equipe-9/calcular-inverso', (req, res) => {
  try {
    const { calcularNFInverso } = require('./equipe-9/funcoes');
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = calcularNFInverso(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/equipe-9/comparar
app.post('/api/equipe-9/comparar', (req, res) => {
  try {
    const { cortarAliquotas, compararAliquotas } = require('./equipe-9/funcoes');
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = compararAliquotas(req.body);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});


// ROTAS DA EQUIPE 16
// POST /api/equipe-16/calcular
app.post('/api/equipe-16/calcular', (req, res) => {
  try {
    const { calcular } = require('./equipe-16/funcoes');
    const dados = req.body;

    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }

    const resultado = calcular(dados);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// ── Grupo 20 — AguaCalc ──
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
    const resultado = calcularEconomia(Number(litrosAtuais), Number(reducaoPercentual), Number(tarifa), Number(pessoas));
    res.json({ success: true, data: resultado });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.use('/PISCINA2/volume',    volumeRoutes);
app.use('/PISCINA2/materiais', materiaisRoutes);
app.use('/PISCINA2/custos',    custosRoutes);

// ── Grupo 23 — Autonomia de Carros ──
const autonomiaController = require('./equipe-23/autonomiaController');

// POST /autonomia/calcular
app.post('/autonomia/calcular', (req, res) => {
  try {
    const { kmPercorridos, litrosAbastecidos } = req.body;
    const resultado = autonomiaController.calcularAutonomia(
      Number(kmPercorridos),
      Number(litrosAbastecidos)
    );
    res.json({ sucesso: true, dados: resultado });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
});

// POST /autonomia/custo-viagem
app.post('/autonomia/custo-viagem', (req, res) => {
  try {
    const { distanciaKm, autonomiaKmL, precoCombustivel } = req.body;
    const resultado = autonomiaController.calcularCustoViagem(
      Number(distanciaKm),
      Number(autonomiaKmL),
      Number(precoCombustivel)
    );
    res.json({ sucesso: true, dados: resultado });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
});

// POST /autonomia/comparar-combustivel
app.post('/autonomia/comparar-combustivel', (req, res) => {
  try {
    const { precoGasolina, precoEtanol, autonomiaGasolina, autonomiaEtanol } = req.body;
    const resultado = autonomiaController.compararCombustivel(
      Number(precoGasolina),
      Number(precoEtanol),
      Number(autonomiaGasolina),
      Number(autonomiaEtanol)
    );
    res.json({ sucesso: true, dados: resultado });
  } catch (error) {
    res.status(400).json({ sucesso: false, erro: error.message });
  }
});

module.exports = app;
