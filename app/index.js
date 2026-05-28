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
const GRUPO5_PATH = '/equipe-5';
const grupo5DistPath = path.join(__dirname, 'equipe-5', 'dist');

// ── Equipe 2 ──
const GRUPO2_PATH = '/equipe-2';
const grupo2DistPath = path.join(__dirname, 'dist', 'equipe-2');
const grupo14ApiRoutes = new Map([
  ['GET /health', '/PBL/health'],
  ['POST /preco-liquido', '/PBL/preco-liquido'],
  ['POST /preco-bruto', '/PBL/preco-bruto'],
  ['POST /margem', '/PBL/margem']
]);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.use(GRUPO14_PATH, express.static(grupo14DistPath));
app.get(/^\/equipe-14(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo14DistPath, 'index.html'));
});
app.use(GRUPO5_PATH, express.static(grupo5DistPath));
app.use(GRUPO2_PATH, express.static(grupo2DistPath));

// ETEC - Encargos de empregada domestica (serve estáticos antes do session middleware)
const ETEC_PATH = '/etec';
const etecDistPath = path.join(__dirname, 'views', 'etec', 'dist');
const fs = require('fs');
if (!fs.existsSync(etecDistPath)) {
  console.warn('ETEC dist not found at', etecDistPath);
}
app.use(ETEC_PATH, express.static(etecDistPath));
app.get(/^\/etec(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(etecDistPath, 'index.html'));
});
// Keep legacy route working: redirect /equipe-4 to the new /etec path
app.get('/equipe-4', (_req, res) => res.redirect('/etec'));

// ── Proxy API Equipe 2 — IRP ──
app.post('/IRP/calcular', bodyParser.json(), async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}/IRP/calcular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Falha ao comunicar com a API da Equipe 2.', message: err.message });
  }
});

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
  secret: 'calculo-nf-secret-2026',
  secret: 'markup-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

// Rotas Equipe 9
const grupo9 = express.Router();

// rotas públicas
grupo9.get('/', (req, res) => res.redirect('/equipe-9/splash'));

grupo9.get('/splash', (req, res) => {
  res.render('equipe-9/splash');
});

grupo9.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/equipe-9/calculo');
  res.render('equipe-9/login', { error: null });
});

grupo9.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', nome: 'Administrador' };
    return res.redirect('/equipe-9/calculo');
  }
  res.render('equipe-9/login', { error: 'Usuário ou senha inválidos' });
});

grupo9.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/equipe-9/login');
});

// rotas protegidas
grupo9.get('/calculo', requireAuth, (req, res) => res.render('equipe-9/calculo', { user: req.session.user }));
grupo9.get('/inverso', requireAuth, (req, res) => res.render('equipe-9/inverso', { user: req.session.user }));
grupo9.get('/comparar', requireAuth, (req, res) => res.render('equipe-9/comparar', { user: req.session.user }));
grupo9.get('/sobre', requireAuth, (req, res) => res.render('equipe-9/sobre', { user: req.session.user }));
grupo9.get('/help', requireAuth, (req, res) => res.render('equipe-9/help', { user: req.session.user }));

// Proxies
async function proxyAPI(endpoint, req, res) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

const BASE_PATH = '/equipe-16';
const BASE_PATH_12 = '/equipe-12';
const BASE_PATH_13 = '/equipe-13';
const EQUIPE21_PATH = '/equipe-21';

app.use(`${EQUIPE21_PATH}/vendor/react`, express.static(path.join(__dirname, 'node_modules', 'react', 'umd')));
app.use(`${EQUIPE21_PATH}/vendor/react-dom`, express.static(path.join(__dirname, 'node_modules', 'react-dom', 'umd')));

const equipes = [
  { numero: 1, nome: 'TESTE', rota: '/login' },
  { numero: 67, nome: 'Equipe-1', rota: '/equipe-01' },
  { numero: 2, nome: 'Equipe-2', rota: '/equipe-2' },
  { numero: 3, nome: 'Equipe-3', rota: '/equipe-3' },
  { numero: 4, nome: 'ETEC - Domestica', rota: '/etec' },
  { numero: 5, nome: 'Equipe-5', rota: '/equipe-5' },
  { numero: 6, nome: 'Equipe-6', rota: '/sauna6' },
  { numero: 7, nome: 'G7 - Calculadora de Custo de Piscinas', rota: '/equipe-7' },
  { numero: 8, nome: 'Equipe-8 Calculo de Piscina', rota: '/equipe-08' },
  { numero: 9, nome: 'Equipe-9', rota: '/equipe-9' },
  { numero: 10, nome: 'Equipe-10', rota: '/equipe-10' },
  { numero: 11, nome: 'Equipe-11', rota: '/equipe-11' },
  { numero: 12, nome: 'G12 - MarkUp', rota: BASE_PATH_12 },
  { numero: 13, nome: 'G13 - MarkUp', rota: '/equipe-13' },
  { numero: 14, nome: 'Equipe-14', rota: '/equipe-14' },
  { numero: 15, nome: 'Equipe-15', rota: '/equipe-15' },
  { numero: 16, nome: 'G16 - MarkUp Calc', rota: '/equipe-16' },
  { numero: 17, nome: 'G17 - Calc NF Venda', rota: '/equipe-17' },
  { numero: 18, nome: 'G18 - Cálculo de Impostos NF', rota: '/equipe-18' },
  { numero: 19, nome: 'Equipe-19', rota: '/equipe-19' },
  { numero: 20, nome: 'G20 - AguaCalc', rota: '/equipe-20' },
  { numero: 21, nome: 'G21 - BurgCalc', rota: '/equipe-21' },
  { numero: 22, nome: 'Equipe-22', rota: '/equipe-22' },
  { numero: 23, nome: 'G23 - Calc Autonomia', rota: '/equipe-23' },
  { numero: 24, nome: 'Equipe-24', rota: '/equipe-24' },
  { numero: 25, nome: 'Equipe-25', rota: '/equipe-25' },
  { numero: 64, nome: 'Equipe-64', rota: '/equipe-64' },
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

grupo9.post('/calcular', requireAuth, (req, res) => proxyAPI('/api/equipe-9/calcular', req, res));
grupo9.post('/calcular-inverso', requireAuth, (req, res) => proxyAPI('/api/equipe-9/calcular-inverso', req, res));
grupo9.post('/comparar', requireAuth, (req, res) => proxyAPI('/api/equipe-9/comparar', req, res));

app.use('/equipe-9', grupo9);

app.use(BASE_PATH, grupo16);

// Grupo 12 - MarkUp

function requireAuth12(req, res, next) {
  if (req.session && req.session.user12) return next();
  res.redirect(BASE_PATH_12 + '/login');
}

const grupo12 = express.Router();

grupo12.get('/', (req, res) => {
  if (req.session.user12) return res.redirect(BASE_PATH_12 + '/home');
  res.redirect(BASE_PATH_12 + '/splash');
});

grupo12.get('/splash', (req, res) => {
  res.render('equipe-12/splash', { user: req.session.user12 || null, basePath: BASE_PATH_12 });
});

grupo12.get('/login', (req, res) => {
  if (req.session.user12) return res.redirect(BASE_PATH_12 + '/home');
  res.render('equipe-12/login', { error: null, basePath: BASE_PATH_12 });
});

grupo12.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user12 = { username: 'admin', nome: 'Administrador' };
    return res.redirect(BASE_PATH_12 + '/home');
  }
  res.render('equipe-12/login', { error: 'Usuario ou senha invalidos', basePath: BASE_PATH_12 });
});

grupo12.get('/logout', (req, res) => {
  req.session.user12 = null;
  res.redirect(BASE_PATH_12 + '/login');
});

grupo12.get('/home', requireAuth12, (req, res) => {
  res.render('equipe-12/home', { user: req.session.user12, basePath: BASE_PATH_12 });
});

grupo12.get('/calculo', requireAuth12, (req, res) => {
  res.render('equipe-12/calculo', { user: req.session.user12, basePath: BASE_PATH_12 });
});

grupo12.get('/sobre', requireAuth12, (req, res) => {
  res.render('equipe-12/sobre', { user: req.session.user12, basePath: BASE_PATH_12 });
});

grupo12.get('/help', requireAuth12, (req, res) => {
  res.render('equipe-12/help', { user: req.session.user12, basePath: BASE_PATH_12 });
});

grupo12.post('/api/calcular', requireAuth12, (req, res) => proxyAPI('/api/equipe-12/calcular', req, res));

app.use(BASE_PATH_12, grupo12);

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

grupo13.post('/markup', requireAuth13, (req, res) => mkpProxy('/markup', req.body, res));
grupo13.post('/lucro', requireAuth13, (req, res) => mkpProxy('/lucro', req.body, res));
grupo13.post('/equilibrio', requireAuth13, (req, res) => mkpProxy('/equilibrio', req.body, res));

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



// ── Grupo 7 — PISCINA2 ──

// ── Grupo 7 — PISCINA2 ──

const GRUPO7_PATH = '/equipe-7';
// ✨ CORREÇÃO: Adicionado 'views' no caminho para achar sua pasta real!
const grupo7DistPath = path.join(__dirname, 'views', 'equipe-7', 'dist'); 

app.use(GRUPO7_PATH, express.static(grupo7DistPath));

// 2. Define que o express deve servir os arquivos js/css/assets estáticos do seu grupo
app.use(GRUPO7_PATH, express.static(grupo7DistPath));

// 3. Função de proxy para as APIs da equipe 7 (apenas se vocês não arrumaram a porta no front-end para 3001)
async function proxyGrupo7(req, res, endpointBackend) {
  try {
    const fetch = (await import('node-fetch')).default;
    const options = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(`${API_URL}${endpointBackend}`, options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// 4. Se o seu Front-end react chamar a rota /equipe-7/api/..., passa pelo proxy
app.post(`${GRUPO7_PATH}/api/volume`, (req, res) => proxyGrupo7(req, res, '/PISCINA2/volume/calcular'));
app.post(`${GRUPO7_PATH}/api/materiais`, (req, res) => proxyGrupo7(req, res, '/PISCINA2/materiais/calcular'));
app.post(`${GRUPO7_PATH}/api/custos`, (req, res) => proxyGrupo7(req, res, '/PISCINA2/custos/calcular'));

// 5. O MAIS IMPORTANTE: Suporte ao React Router!
// Se o usuário acessar qualquer sub-rota do React (ex: /equipe-7/login), cai no index.html e o React toma conta
app.get(/^\/equipe-7(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo7DistPath, 'index.html'));
});


// ── Grupo 17 — Calculadora de Impostos NF de Venda ──

const EQUIPE17_PATH = '/equipe-17';

function requireAuth17(req, res, next) {
  if (req.session && req.session.user17) return next();
  res.redirect(EQUIPE17_PATH + '/login');
}

const grupo17 = express.Router();

grupo17.get('/', (req, res) => {
  if (req.session.user17) return res.redirect(EQUIPE17_PATH + '/calcular');
  res.render('equipe-17/splash', { user: req.session.user17 || null, basePath: EQUIPE17_PATH });
});

grupo17.get('/splash', (req, res) => {
  res.render('equipe-17/splash', { user: req.session.user17 || null, basePath: EQUIPE17_PATH });
});

grupo17.get('/login', (req, res) => {
  if (req.session.user17) return res.redirect(EQUIPE17_PATH + '/calcular');
  res.render('equipe-17/login', { error: null, basePath: EQUIPE17_PATH });
});

grupo17.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user17 = { username: 'admin', nome: 'Administrador' };
    return res.redirect(EQUIPE17_PATH + '/calcular');
  }
  res.render('equipe-17/login', { error: 'Usuário ou senha inválidos', basePath: EQUIPE17_PATH });
});

grupo17.get('/logout', (req, res) => {
  req.session.user17 = null;
  res.redirect(EQUIPE17_PATH + '/login');
});

grupo17.get('/calcular', requireAuth17, (req, res) => {
  res.render('equipe-17/nfvenda', { user: req.session.user17, basePath: EQUIPE17_PATH });
});

grupo17.get('/sobre', requireAuth17, (req, res) => {
  res.render('equipe-17/sobre', { user: req.session.user17, basePath: EQUIPE17_PATH });
});

grupo17.get('/help', requireAuth17, (req, res) => {
  res.render('equipe-17/help', { user: req.session.user17, basePath: EQUIPE17_PATH });
});

grupo17.post('/decodificar', requireAuth17, async (req, res) => {
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

grupo17.post('/calcular', requireAuth17, async (req, res) => {
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

app.get(/^\/equipe-5(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo5DistPath, 'index.html'));
});

// Suporte para client-side routing do React (BrowserRouter) da Equipe 2
app.get(/^\/equipe-2(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo2DistPath, 'index.html'));
});

// ── Grupo 23 — Autonomia de Carros ──
const grupo23DistPath = path.join(__dirname, 'equipe-23');
app.use('/equipe-23', express.static(grupo23DistPath));
// CRA build uses absolute /static paths when hosted under /equipe-23.
app.use('/static', express.static(path.join(grupo23DistPath, 'static')));
app.get(/^\/equipe-23(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo23DistPath, 'index.html'));
});

// ETEC proxy routes (static files served earlier)
app.post(`/etec/api/salario`, (req, res) => proxyAPI('/ETEC/salario', req, res));
app.post(`/etec/api/ferias`, (req, res) => proxyAPI('/ETEC/ferias', req, res));
app.post(`/etec/api/rescisao`, (req, res) => proxyAPI('/ETEC/rescisao', req, res));

// Rotas genéricas das demais equipes (grupos 2, 5, 6, 13, 14, 16, 17, 18 e 21 têm rotas próprias acima)
for (let i = 2; i <= 25; i++) {
  if (i === 2 || i === 4 || i === 5 || i === 6 || i === 7 || i === 12 || i === 13 || i === 14 || i === 15 || i === 16 || i === 17 || i === 18 || i === 20 || i === 21 || i === 23) continue;
  app.get(`/equipe-${i}`, (req, res) => {
    res.render('equipe', { numero: i, nome: `Equipe-${i}` });
  });
}

// ── Grupo 15 — Cálculo de Frete ──
const GRUPO15_PATH = '/equipe-15';
const grupo15DistPath = path.join(__dirname, 'views', 'grupo15-calc_frete', 'dist');
app.use(GRUPO15_PATH, express.static(grupo15DistPath));
app.get(/^\/equipe-15(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo15DistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`App rodando: http://localhost:${PORT}`);
});

// ── Grupo 64 — ETEC64 ──
const ETEC64_PATH = '/equipe-64';
const etec64DistPath = path.join(__dirname, 'views', 'etec64', 'dist');
app.use(ETEC64_PATH, express.static(etec64DistPath));
app.get(/^\/equipe-64(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(etec64DistPath, 'index.html'));
});

// Proxy API ETEC64
app.post('/api/etec64/media', (req, res) => proxyAPI('/api/etec64/media', req, res));
app.post('/api/etec64/frequencia', (req, res) => proxyAPI('/api/etec64/frequencia', req, res));
app.post('/api/etec64/aprovacao', (req, res) => proxyAPI('/api/etec64/aprovacao', req, res));


function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

// ROTAS GRUPO 1 ------------------------------------ //
app.get('/equipe-01', (req, res) => {
  res.render('equipe-01/splash');
});

app.get('/equipe-01/login', (req, res) => {
  res.render('equipe-01/login');
});

app.get('/equipe-01/calculo', (req, res) => {
  res.render('equipe-01/calculo');
});

app.get('/equipe-01/capacidade', (req, res) => {
  res.render('equipe-01/capacidade');
});

app.get('/equipe-01/simulador', (req, res) => {
  res.render('equipe-01/simulador');
});

app.get('/equipe-01/sobre', (req, res) => {
  res.render('equipe-01/sobre');
});

app.get('/equipe-01/home', (req, res) => {
  res.render('equipe-01/home');
});

app.get('/equipe-01/help', (req, res) => {
  res.render('equipe-01/help');
});


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
// --------------------------------------------------- //

// ── GRUPO 08 — Calculadora de Piscina ──
const grupo08 = require('./src/equipe-08/routes.js');
app.use('/equipe-08', (req, res, next) => {
  res.locals.basePath = '/equipe-08';
  next();
}, grupo08);

//teste

module.exports = app;
