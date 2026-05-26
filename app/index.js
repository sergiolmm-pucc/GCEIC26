const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = normalizeApiUrl(process.env.API_URL || 'http://localhost:3001');
const BASE_PATH = '/equipe-14';
const distPath = path.join(__dirname, 'dist');

const equipes = Array.from({ length: 25 }, (_, index) => {
  const numero = index + 1;
  const ativo = numero === 14;

  return {
    numero,
    nome: `Equipe-${numero}`,
    rota: ativo ? BASE_PATH : '#',
    ativo
  };
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_request, response) => {
  response.render('index', { equipes });
});

app.use('/PBL', (request, response) => {
  const target = new URL(request.originalUrl, ensureTrailingSlash(API_URL));
  const client = target.protocol === 'https:' ? https : http;
  const proxyRequest = client.request(target, {
    method: request.method,
    headers: {
      ...request.headers,
      host: target.host
    }
  }, (proxyResponse) => {
    response.status(proxyResponse.statusCode || 502);
    for (const [header, value] of Object.entries(proxyResponse.headers)) {
      if (value !== undefined) {
        response.setHeader(header, value);
      }
    }
    proxyResponse.pipe(response);
  });

  proxyRequest.on('error', (error) => {
    response.status(502).json({
      error: 'Falha ao comunicar com a API.',
      message: error.message
    });
  });

  request.pipe(proxyRequest);
});

app.use(BASE_PATH, express.static(distPath));
app.get(/^\/equipe-14(?:\/.*)?$/, (_request, response) => {
  response.sendFile(path.join(distPath, 'index.html'));
});

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

function normalizeApiUrl(url) {
  return /^https?:\/\//i.test(url) ? url : `http://${url}`;
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Portal rodando em http://localhost:${PORT}`);
    console.log(`Equipe 14 disponivel em http://localhost:${PORT}${BASE_PATH}`);
  });
}

module.exports = app;
