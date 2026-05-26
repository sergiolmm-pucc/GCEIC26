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

const BASE_PATH = '/equipe-16';

const equipes = [
  { numero: 1,  nome: 'TESTE',       rota: '/login' },
  { numero: 2,  nome: 'Equipe-2',    rota: '/equipe-2' },
  { numero: 3,  nome: 'Equipe-3',    rota: '/equipe-3' },
  { numero: 4,  nome: 'Equipe-4',    rota: '/equipe-4' },
  { numero: 5,  nome: 'Equipe-5',    rota: '/equipe-5' },
  { numero: 6,  nome: 'Equipe-6',    rota: '/equipe-6' },
  { numero: 7,  nome: 'Equipe-7',    rota: '/equipe-7' },
  { numero: 8,  nome: 'Equipe-8',    rota: '/equipe-8' },
  { numero: 9,  nome: 'Equipe-9',    rota: '/equipe-9' },
  { numero: 10, nome: 'Equipe-10',   rota: '/equipe-10' },
  { numero: 11, nome: 'Equipe-11',   rota: '/equipe-11' },
  { numero: 12, nome: 'Equipe-12',   rota: '/equipe-12' },
  { numero: 13, nome: 'Equipe-13',   rota: '/equipe-13' },
  { numero: 14, nome: 'Equipe-14',   rota: '/equipe-14' },
  { numero: 15, nome: 'Equipe-15',   rota: '/equipe-15' },
  { numero: 16, nome: 'G16 - MarkUp Calc', rota: '/equipe-16' },
  { numero: 17, nome: 'Equipe-17',   rota: '/equipe-17' },
  { numero: 18, nome: 'Equipe-18',   rota: '/equipe-18' },
  { numero: 19, nome: 'Equipe-19',   rota: '/equipe-19' },
  { numero: 20, nome: 'Equipe-20',   rota: '/equipe-20' },
  { numero: 21, nome: 'Equipe-21',   rota: '/equipe-21' },
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

app.get(/^\/equipe-14(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo14DistPath, 'index.html'));
});

// Rotas genéricas das demais equipes (grupo 16 tem rota própria acima)
for (let i = 2; i <= 25; i++) {
  if (i === 14 || i === 16) continue;
  app.get(`/equipe-${i}`, (req, res) => {
    res.render('equipe', { numero: i, nome: `Equipe-${i}` });
  });
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

app.listen(PORT, () => {
  console.log(`App rodando: http://localhost:${PORT}`);
});
module.exports = app;
