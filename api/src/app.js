const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const pricingRouter = require('./equipe-14/pricingRoutes');

// checa se api no ar
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() , by:'SLMM-33', turma:'101'});
});

app.use('/PBL', pricingRouter);

// Proxy para o Backend na AWS do Grupo 18 (Fastify)
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
      error: 'Falha ao comunicar com o Backend do Grupo 18 na AWS.',
      message: error.message
    });
  });

  req.pipe(proxyRequest);
});

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

// POST /api/calcular
app.post('/api/calcular', (req, res) => {
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

module.exports = app

