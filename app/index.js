const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('node:http');
const https = require('node:https');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost:3001';
const GRUPO14_PATH = '/equipe-14';
const grupo14DistPath = path.join(__dirname, 'dist');
const grupo14ApiRoutes = new Map([
  ['GET /health', '/PBL/health'],
  ['POST /preco-liquido', '/PBL/preco-liquido'],
  ['POST /preco-bruto', '/PBL/preco-bruto'],
  ['POST /margem', '/PBL/margem']
]);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(GRUPO14_PATH, express.static(grupo14DistPath));

app.use('/PBL', (req, res) => {
  const targetPath = grupo14ApiRoutes.get(`${req.method} ${req.path}`);

  if (!targetPath) {
    return res.status(404).json({ error: 'Rota do Grupo 14 nao encontrada.' });
  }

  const target = new URL(targetPath, ensureTrailingSlash(API_URL));
  const client = target.protocol === 'https:' ? https : http;
  const proxyRequest = client.request(target, {
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
      error: 'Falha ao comunicar com a API do Grupo 14.',
      message: error.message
    });
  });

  req.pipe(proxyRequest);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'markup-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

const BASE_PATH    = '/equipe-16';
const BASE_PATH_13 = '/equipe-13';
const EQUIPE21_PATH = '/equipe-21';

app.use(`${EQUIPE21_PATH}/vendor/react`, express.static(path.join(__dirname, 'node_modules', 'react', 'umd')));
app.use(`${EQUIPE21_PATH}/vendor/react-dom`, express.static(path.join(__dirname, 'node_modules', 'react-dom', 'umd')));

const equipes = [
  { numero: 1,  nome: 'TESTE',       rota: '/login' },
  { numero: 2,  nome: 'Equipe-2',    rota: '/equipe-2' },
  { numero: 3,  nome: 'Equipe-3',    rota: '/equipe-3' },
  { numero: 4,  nome: 'Equipe-4',    rota: '/equipe-4' },
  { numero: 5,  nome: 'Equipe-5',    rota: '/equipe-5' },
  { numero: 6,  nome: 'Equipe-6',    rota: '/sauna6' },
  { numero: 7,  nome: 'Equipe-7',    rota: '/equipe-7' },
  { numero: 8,  nome: 'Equipe-8',    rota: '/equipe-8' },
  { numero: 9,  nome: 'Equipe-9',    rota: '/equipe-9' },
  { numero: 10, nome: 'Equipe-10',   rota: '/equipe-10' },
  { numero: 11, nome: 'Equipe-11',   rota: '/equipe-11' },
  { numero: 12, nome: 'Equipe-12',   rota: '/equipe-12' },
  { numero: 13, nome: 'G13 - MarkUp', rota: '/equipe-13' },
  { numero: 14, nome: 'Equipe-14',   rota: '/equipe-14' },
  { numero: 15, nome: 'Equipe-15',   rota: '/equipe-15' },
  { numero: 16, nome: 'G16 - MarkUp Calc', rota: '/equipe-16' },
  { numero: 17, nome: 'G17 - Calc NF Venda', rota: '/equipe-17' },
  { numero: 18, nome: 'G18 - Cálculo de Impostos NF', rota: '/equipe-18' },
  { numero: 19, nome: 'Equipe-19',   rota: '/equipe-19' },
  { numero: 20, nome: 'G20 - AguaCalc', rota: '/equipe-20' },
  { numero: 21, nome: 'G21 - BurgCalc',   rota: '/equipe-21' },
  { numero: 22, nome: 'Equipe-22',   rota: '/equipe-22' },
  { numero: 23, nome: 'Equipe-23',   rota: '/equipe-23' },
  { numero: 24, nome: 'Equipe-24',   rota: '/equipe-24' },
  { numero: 25, nome: 'Equipe-25',   rota: '/equipe-25' },
];

// Página inicial — lista de equipes
app.get('/', (req, res) => {
  res.render('index', { equipes });
});

// Rota legada equipe 1
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect(BASE_PATH + '/calculo');
  res.render('equipe-16/login', { error: null, basePath: BASE_PATH });
});

// ── Grupo 16 — MarkUp Calc ──

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect(BASE_PATH + '/login');
}

const grupo16 = express.Router();

grupo16.get('/', (req, res) => {
  if (req.session.user) return res.redirect(BASE_PATH + '/calculo');
  res.redirect(BASE_PATH + '/splash');
});

grupo16.get('/splash', (req, res) => {
  res.render('equipe-16/splash', { user: req.session.user || null, basePath: BASE_PATH });
});

grupo16.get('/login', (req, res) => {
  if (req.session.user) return res.redirect(BASE_PATH + '/calculo');
  res.render('equipe-16/login', { error: null, basePath: BASE_PATH });
});

grupo16.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', nome: 'Administrador' };
    return res.redirect(BASE_PATH + '/calculo');
  }
  res.render('equipe-16/login', { error: 'Usuário ou senha inválidos', basePath: BASE_PATH });
});

grupo16.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect(BASE_PATH + '/login');
});

grupo16.get('/calculo', requireAuth, (req, res) => {
  res.render('equipe-16/calculo', { user: req.session.user, basePath: BASE_PATH });
});

grupo16.get('/sobre', requireAuth, (req, res) => {
  res.render('equipe-16/sobre', { user: req.session.user, basePath: BASE_PATH });
});

grupo16.get('/help', requireAuth, (req, res) => {
  res.render('equipe-16/help', { user: req.session.user, basePath: BASE_PATH });
});

grupo16.post('/calcular', requireAuth, async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}/api/calcular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.use(BASE_PATH, grupo16);

// ── Grupo 13 — MarkUp ──

function requireAuth13(req, res, next) {
  if (req.session && req.session.user13) return next();
  res.redirect(BASE_PATH_13 + '/login');
}

const grupo13 = express.Router();

grupo13.get('/', (req, res) => {
  if (req.session.user13) return res.redirect(BASE_PATH_13 + '/calculo');
  res.redirect(BASE_PATH_13 + '/splash');
});

grupo13.get('/splash', (req, res) => {
  res.render('equipe-13/splash', { user: req.session.user13 || null, basePath: BASE_PATH_13 });
});

grupo13.get('/login', (req, res) => {
  if (req.session.user13) return res.redirect(BASE_PATH_13 + '/calculo');
  res.render('equipe-13/login', { error: null, basePath: BASE_PATH_13 });
});

grupo13.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123') {
    req.session.user13 = { username: 'admin', nome: 'Administrador' };
    return res.redirect(BASE_PATH_13 + '/calculo');
  }
  res.render('equipe-13/login', { error: 'Usuario ou senha invalidos', basePath: BASE_PATH_13 });
});

grupo13.get('/logout', (req, res) => {
  req.session.user13 = null;
  res.redirect(BASE_PATH_13 + '/login');
});

grupo13.get('/calculo', requireAuth13, (req, res) => {
  res.render('equipe-13/calculo', { user: req.session.user13, basePath: BASE_PATH_13 });
});

grupo13.get('/sobre', requireAuth13, (req, res) => {
  res.render('equipe-13/sobre', { user: req.session.user13, basePath: BASE_PATH_13 });
});

grupo13.get('/help', requireAuth13, (req, res) => {
  res.render('equipe-13/help', { user: req.session.user13, basePath: BASE_PATH_13 });
});

async function mkpProxy(mkpPath, body, res) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}/MKP${mkpPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

grupo13.post('/markup',    requireAuth13, (req, res) => mkpProxy('/markup',    req.body, res));
grupo13.post('/lucro',     requireAuth13, (req, res) => mkpProxy('/lucro',     req.body, res));
grupo13.post('/equilibrio',requireAuth13, (req, res) => mkpProxy('/equilibrio',req.body, res));

app.use(BASE_PATH_13, grupo13);

// ── Grupo 21 — BurgCalc ──

const equipe21 = express.Router();

equipe21.get('/', (_req, res) => {
  res.redirect(`${EQUIPE21_PATH}/login`);
});

equipe21.get('/login', (req, res) => {
  if (req.query.ready === '1') {
    return res.render('equipe-21/login', {
      error: null,
      basePath: EQUIPE21_PATH,
    });
  }

  return res.render('equipe-21/splash', {
    loginUrl: `${EQUIPE21_PATH}/login?ready=1`,
  });
});

equipe21.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    return res.redirect(`${EQUIPE21_PATH}/calculo`);
  }

  return res.render('equipe-21/login', {
    error: 'Usuario ou senha invalidos',
    basePath: EQUIPE21_PATH,
  });
});

equipe21.get('/calculo', (_req, res) => {
  res.render('equipe-21/calculo', {
    apiPath: `${EQUIPE21_PATH}/api/calcular`,
    basePath: EQUIPE21_PATH,
  });
});

equipe21.get('/sobre', (_req, res) => {
  res.render('equipe-21/sobre', { basePath: EQUIPE21_PATH });
});

equipe21.get('/help', (_req, res) => {
  res.render('equipe-21/help', { basePath: EQUIPE21_PATH });
});

equipe21.post('/api/calcular', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}/api/equipe-21/calcular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.use(EQUIPE21_PATH, equipe21);

// ── Grupo 20 — AguaCalc ──

const GRUPO20_PATH = '/equipe-20';

function requireAuth20(req, res, next) {
  if (req.session && req.session.user20) return next();
  res.redirect(GRUPO20_PATH + '/login');
}

async function proxyPostAgua(req, res, rota) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}${rota}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

const grupo20 = express.Router();

grupo20.get('/', (_req, res) => res.redirect(GRUPO20_PATH + '/splash'));

grupo20.get('/splash', (req, res) => {
  res.render('equipe-20/splash', { basePath: GRUPO20_PATH });
});

grupo20.get('/login', (req, res) => {
  if (req.session.user20) return res.redirect(GRUPO20_PATH + '/calculo');
  res.render('equipe-20/login', { error: null, basePath: GRUPO20_PATH });
});

grupo20.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user20 = { username: 'admin', nome: 'Administrador' };
    return res.redirect(GRUPO20_PATH + '/calculo');
  }
  res.render('equipe-20/login', { error: 'Usuário ou senha inválidos', basePath: GRUPO20_PATH });
});

grupo20.get('/logout', (req, res) => {
  req.session.user20 = null;
  res.redirect(GRUPO20_PATH + '/login');
});

grupo20.post('/logout', (req, res) => {
  req.session.user20 = null;
  res.redirect(GRUPO20_PATH + '/login');
});

grupo20.get('/calculo', requireAuth20, (req, res) => {
  res.render('equipe-20/calculo', { user: req.session.user20, basePath: GRUPO20_PATH });
});

grupo20.get('/sobre', requireAuth20, (req, res) => {
  res.render('equipe-20/sobre', { basePath: GRUPO20_PATH });
});

grupo20.get('/help', requireAuth20, (req, res) => {
  res.render('equipe-20/help', { basePath: GRUPO20_PATH });
});

grupo20.post('/AGUA/consumoDiario', requireAuth20, (req, res) =>
  proxyPostAgua(req, res, '/AGUA/consumoDiario'));

grupo20.post('/AGUA/custoMensal', requireAuth20, (req, res) =>
  proxyPostAgua(req, res, '/AGUA/custoMensal'));

grupo20.post('/AGUA/economia', requireAuth20, (req, res) =>
  proxyPostAgua(req, res, '/AGUA/economia'));

app.use(GRUPO20_PATH, grupo20);

// ── Grupo 17 — Calculadora de Impostos NF de Venda ──

const grupo17 = express.Router();

grupo17.get('/', (_req, res) => res.render('equipe-17/nfvenda'));

grupo17.post('/decodificar', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}/nfvenda/decodificar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

grupo17.post('/calcular', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}/nfvenda/calcular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.use('/equipe-17', grupo17);

// Servir arquivos estáticos do Grupo 18 (Next.js export)
const grupo18DistPath = path.join(__dirname, 'equipe-18', 'out');
app.use('/equipe-18', express.static(grupo18DistPath));

// Proxy para o Backend do Grupo 18
app.use('/equipe-18/api', (req, res) => {
  const target = new URL(req.path.replace(/^\//, ''), ensureTrailingSlash('https://d36mf6v2e37tzy.cloudfront.net'));
  const client = https;

  const proxyRequest = client.request(target, {
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

// Suporte para client-side routing do Next.js
app.get(/^\/equipe-18(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo18DistPath, 'index.html'));
});

// Rotas genéricas das demais equipes (grupos 6, 13, 14, 16, 17, 18 e 21 têm rotas próprias acima)
for (let i = 2; i <= 25; i++) {
  if (i === 6 || i === 13 || i === 14 || i === 16 || i === 17 || i === 18 || i === 20 || i === 21) continue;
  app.get(`/equipe-${i}`, (req, res) => {
    res.render('equipe', { numero: i, nome: `Equipe-${i}` });
  });
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}


// ROTAS GRUPO 6 ------------------------------------ //
app.get('/sauna6', (req, res) => {
  res.render('sauna_grupo6/splash'); 
});

app.get('/sauna6/login', (req, res) => {
  res.render('sauna_grupo6/login');
});

app.get('/sauna6/calculadora', (req, res) => {
  res.render('sauna_grupo6/calculadora_sauna');
});

app.get('/sauna6/sobre', (req, res) => {
  res.render('sauna_grupo6/about');
});

app.get('/sauna6/help', (req, res) => {
  res.render('sauna_grupo6/help');
});
// --------------------------------------------------- //

app.listen(PORT, () => {
  console.log(`App rodando: http://localhost:${PORT}`);
});
module.exports = app;
