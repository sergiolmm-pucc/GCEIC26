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
const GRUPO5_PATH = '/equipe-5';
const GRUPO2_PATH = '/equipe-2';
const GRUPO12_PATH = '/equipe-12';
const GRUPO16_PATH = '/equipe-16';
const GRUPO13_PATH = '/equipe-13';
const GRUPO20_PATH = '/equipe-20';
const GRUPO7_PATH = '/equipe-7';
const EQUIPE21_PATH = '/equipe-21';
const ETEC64_PATH = '/equipe-64';

const grupo14DistPath = path.join(__dirname, 'dist');
const grupo5DistPath = path.join(__dirname, 'equipe-5', 'dist');
const grupo2DistPath = path.join(__dirname, 'dist', 'equipe-2');
const grupo18DistPath = path.join(__dirname, 'equipe-18', 'out');
const grupo23DistPath = path.join(__dirname, 'equipe-23');
const etec64DistPath = path.join(__dirname, 'views', 'etec64', 'dist');

const grupo14ApiRoutes = new Map([
  ['GET /health', '/PBL/health'],
  ['POST /preco-liquido', '/PBL/preco-liquido'],
  ['POST /preco-bruto', '/PBL/preco-bruto'],
  ['POST /margem', '/PBL/margem'],
]);

const equipes = [
  { numero: 1, nome: 'TESTE', rota: '/login' },
  { numero: 2, nome: 'Equipe-2', rota: '/equipe-2' },
  { numero: 3, nome: 'Equipe-3', rota: '/equipe-3' },
  { numero: 4, nome: 'Equipe-4', rota: '/equipe-4' },
  { numero: 5, nome: 'Equipe-5', rota: '/equipe-5' },
  { numero: 6, nome: 'Equipe-6', rota: '/sauna6' },
  { numero: 7, nome: 'G7 - Calculadora de Custo de Piscinas', rota: '/equipe-7' },
  { numero: 8, nome: 'Equipe-8 Calculo de Piscina', rota: '/equipe-08' },
  { numero: 9, nome: 'Equipe-9', rota: '/equipe-9' },
  { numero: 10, nome: 'Equipe-10', rota: '/equipe-10' },
  { numero: 11, nome: 'Equipe-11', rota: '/equipe-11' },
  { numero: 12, nome: 'G12 - MarkUp', rota: GRUPO12_PATH },
  { numero: 13, nome: 'G13 - MarkUp', rota: GRUPO13_PATH },
  { numero: 14, nome: 'Equipe-14', rota: GRUPO14_PATH },
  { numero: 15, nome: 'Equipe-15', rota: '/equipe-15' },
  { numero: 16, nome: 'G16 - MarkUp Calc', rota: GRUPO16_PATH },
  { numero: 17, nome: 'G17 - Calc NF Venda', rota: '/equipe-17' },
  { numero: 18, nome: 'G18 - Calculo de Impostos NF', rota: '/equipe-18' },
  { numero: 19, nome: 'Equipe-19', rota: '/equipe-19' },
  { numero: 20, nome: 'G20 - AguaCalc', rota: GRUPO20_PATH },
  { numero: 21, nome: 'G21 - BurgCalc', rota: EQUIPE21_PATH },
  { numero: 22, nome: 'Equipe-22', rota: '/equipe-22' },
  { numero: 23, nome: 'G23 - Calc Autonomia', rota: '/equipe-23' },
  { numero: 24, nome: 'Equipe-24', rota: '/equipe-24' },
  { numero: 25, nome: 'Equipe-25', rota: '/equipe-25' },
  { numero: 64, nome: 'Equipe-64', rota: ETEC64_PATH },
];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(GRUPO14_PATH, express.static(grupo14DistPath));
app.use(GRUPO5_PATH, express.static(grupo5DistPath));
app.use(GRUPO2_PATH, express.static(grupo2DistPath));
app.use('/equipe-18', express.static(grupo18DistPath));
app.use('/equipe-23', express.static(grupo23DistPath));
app.use('/static', express.static(path.join(grupo23DistPath, 'static')));
app.use(ETEC64_PATH, express.static(etec64DistPath));
app.use(`${EQUIPE21_PATH}/vendor/react`, express.static(path.join(__dirname, 'node_modules', 'react', 'umd')));
app.use(`${EQUIPE21_PATH}/vendor/react-dom`, express.static(path.join(__dirname, 'node_modules', 'react-dom', 'umd')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'gceic26-shared-session-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

app.get('/', (req, res) => {
  res.render('index', { equipes });
});

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect(`${GRUPO16_PATH}/calculo`);
  return res.render('equipe-16/login', { error: null, basePath: GRUPO16_PATH });
});

app.post('/IRP/calcular', (req, res) => proxyPost('/IRP/calcular', req, res, 'Falha ao comunicar com a API da Equipe 2.'));

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
      error: 'Falha ao comunicar com a API do Grupo 14.',
      message: error.message,
    });
  });

  req.pipe(proxyRequest);
});

const grupo9 = express.Router();

grupo9.get('/', (req, res) => res.redirect('/equipe-9/splash'));
grupo9.get('/splash', (req, res) => res.render('equipe-9/splash'));
grupo9.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/equipe-9/calculo');
  return res.render('equipe-9/login', { error: null });
});
grupo9.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', nome: 'Administrador' };
    return res.redirect('/equipe-9/calculo');
  }
  return res.render('equipe-9/login', { error: 'Usuario ou senha invalidos' });
});
grupo9.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/equipe-9/login');
});
grupo9.get('/calculo', requireAuth, (req, res) => res.render('equipe-9/calculo', { user: req.session.user }));
grupo9.get('/inverso', requireAuth, (req, res) => res.render('equipe-9/inverso', { user: req.session.user }));
grupo9.get('/comparar', requireAuth, (req, res) => res.render('equipe-9/comparar', { user: req.session.user }));
grupo9.get('/sobre', requireAuth, (req, res) => res.render('equipe-9/sobre', { user: req.session.user }));
grupo9.get('/help', requireAuth, (req, res) => res.render('equipe-9/help', { user: req.session.user }));
grupo9.post('/calcular', requireAuth, (req, res) => proxyPost('/api/equipe-9/calcular', req, res));
grupo9.post('/calcular-inverso', requireAuth, (req, res) => proxyPost('/api/equipe-9/calcular-inverso', req, res));
grupo9.post('/comparar', requireAuth, (req, res) => proxyPost('/api/equipe-9/comparar', req, res));
app.use('/equipe-9', grupo9);

const grupo16 = express.Router();

grupo16.get('/', (req, res) => {
  if (req.session.user) return res.redirect(`${GRUPO16_PATH}/calculo`);
  return res.redirect(`${GRUPO16_PATH}/splash`);
});
grupo16.get('/splash', (req, res) => {
  res.render('equipe-16/splash', { user: req.session.user || null, basePath: GRUPO16_PATH });
});
grupo16.get('/login', (req, res) => {
  if (req.session.user) return res.redirect(`${GRUPO16_PATH}/calculo`);
  return res.render('equipe-16/login', { error: null, basePath: GRUPO16_PATH });
});
grupo16.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', nome: 'Administrador' };
    return res.redirect(`${GRUPO16_PATH}/calculo`);
  }
  return res.render('equipe-16/login', { error: 'Usuario ou senha invalidos', basePath: GRUPO16_PATH });
});
grupo16.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect(`${GRUPO16_PATH}/login`);
});
grupo16.get('/calculo', requireAuth, (req, res) => {
  res.render('equipe-16/calculo', { user: req.session.user, basePath: GRUPO16_PATH });
});
grupo16.get('/sobre', requireAuth, (req, res) => {
  res.render('equipe-16/sobre', { user: req.session.user, basePath: GRUPO16_PATH });
});
grupo16.get('/help', requireAuth, (req, res) => {
  res.render('equipe-16/help', { user: req.session.user, basePath: GRUPO16_PATH });
});
grupo16.post('/calcular', requireAuth, (req, res) => proxyPost('/api/equipe-16/calcular', req, res));
app.use(GRUPO16_PATH, grupo16);

const grupo12 = express.Router();

grupo12.get('/', (req, res) => {
  if (req.session.user12) return res.redirect(`${GRUPO12_PATH}/home`);
  return res.redirect(`${GRUPO12_PATH}/splash`);
});
grupo12.get('/splash', (req, res) => {
  res.render('equipe-12/splash', { user: req.session.user12 || null, basePath: GRUPO12_PATH });
});
grupo12.get('/login', (req, res) => {
  if (req.session.user12) return res.redirect(`${GRUPO12_PATH}/home`);
  return res.render('equipe-12/login', { error: null, basePath: GRUPO12_PATH });
});
grupo12.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user12 = { username: 'admin', nome: 'Administrador' };
    return res.redirect(`${GRUPO12_PATH}/home`);
  }
  return res.render('equipe-12/login', { error: 'Usuário ou senha inválidos', basePath: GRUPO12_PATH });
});
grupo12.get('/logout', (req, res) => {
  req.session.user12 = null;
  res.redirect(`${GRUPO12_PATH}/login`);
});
grupo12.get('/home', requireAuth12, (req, res) => {
  res.render('equipe-12/home', { user: req.session.user12, basePath: GRUPO12_PATH });
});
grupo12.get('/calculo', requireAuth12, (req, res) => {
  res.render('equipe-12/calculo', { user: req.session.user12, basePath: GRUPO12_PATH });
});
grupo12.get('/sobre', requireAuth12, (req, res) => {
  res.render('equipe-12/sobre', { user: req.session.user12, basePath: GRUPO12_PATH });
});
grupo12.get('/help', requireAuth12, (req, res) => {
  res.render('equipe-12/help', { user: req.session.user12, basePath: GRUPO12_PATH });
});
grupo12.post('/api/calcular', requireAuth12, (req, res) => proxyPost('/api/equipe-12/calcular', req, res));
app.use(GRUPO12_PATH, grupo12);

const grupo13 = express.Router();

grupo13.get('/', (req, res) => {
  if (req.session.user13) return res.redirect(`${GRUPO13_PATH}/calculo`);
  return res.redirect(`${GRUPO13_PATH}/splash`);
});
grupo13.get('/splash', (req, res) => {
  res.render('equipe-13/splash', { user: req.session.user13 || null, basePath: GRUPO13_PATH });
});
grupo13.get('/login', (req, res) => {
  if (req.session.user13) return res.redirect(`${GRUPO13_PATH}/calculo`);
  return res.render('equipe-13/login', { error: null, basePath: GRUPO13_PATH });
});
grupo13.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123') {
    req.session.user13 = { username: 'admin', nome: 'Administrador' };
    return res.redirect(`${GRUPO13_PATH}/calculo`);
  }
  return res.render('equipe-13/login', { error: 'Usuario ou senha invalidos', basePath: GRUPO13_PATH });
});
grupo13.get('/logout', (req, res) => {
  req.session.user13 = null;
  res.redirect(`${GRUPO13_PATH}/login`);
});
grupo13.get('/calculo', requireAuth13, (req, res) => {
  res.render('equipe-13/calculo', { user: req.session.user13, basePath: GRUPO13_PATH });
});
grupo13.get('/sobre', requireAuth13, (req, res) => {
  res.render('equipe-13/sobre', { user: req.session.user13, basePath: GRUPO13_PATH });
});
grupo13.get('/help', requireAuth13, (req, res) => {
  res.render('equipe-13/help', { user: req.session.user13, basePath: GRUPO13_PATH });
});
grupo13.post('/markup', requireAuth13, (req, res) => proxyMarkup('/markup', req.body, res));
grupo13.post('/lucro', requireAuth13, (req, res) => proxyMarkup('/lucro', req.body, res));
grupo13.post('/equilibrio', requireAuth13, (req, res) => proxyMarkup('/equilibrio', req.body, res));
app.use(GRUPO13_PATH, grupo13);

const equipe21 = express.Router();

equipe21.get('/', (_req, res) => res.redirect(`${EQUIPE21_PATH}/login`));
equipe21.get('/login', (req, res) => {
  if (req.query.ready === '1') {
    return res.render('equipe-21/login', { error: null, basePath: EQUIPE21_PATH });
  }
  return res.render('equipe-21/splash', { loginUrl: `${EQUIPE21_PATH}/login?ready=1` });
});
equipe21.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.redirect(`${EQUIPE21_PATH}/calculo`);
  }
  return res.render('equipe-21/login', { error: 'Usuario ou senha invalidos', basePath: EQUIPE21_PATH });
});
equipe21.get('/calculo', (_req, res) => {
  res.render('equipe-21/calculo', { apiPath: `${EQUIPE21_PATH}/api/calcular`, basePath: EQUIPE21_PATH });
});
equipe21.get('/sobre', (_req, res) => res.render('equipe-21/sobre', { basePath: EQUIPE21_PATH }));
equipe21.get('/help', (_req, res) => res.render('equipe-21/help', { basePath: EQUIPE21_PATH }));
equipe21.post('/api/calcular', (req, res) => proxyPost('/api/equipe-21/calcular', req, res));
app.use(EQUIPE21_PATH, equipe21);

const grupo20 = express.Router();

grupo20.get('/', (_req, res) => res.redirect(`${GRUPO20_PATH}/splash`));
grupo20.get('/splash', (req, res) => res.render('equipe-20/splash', { basePath: GRUPO20_PATH }));
grupo20.get('/login', (req, res) => {
  if (req.session.user20) return res.redirect(`${GRUPO20_PATH}/calculo`);
  return res.render('equipe-20/login', { error: null, basePath: GRUPO20_PATH });
});
grupo20.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user20 = { username: 'admin', nome: 'Administrador' };
    return res.redirect(`${GRUPO20_PATH}/calculo`);
  }
  return res.render('equipe-20/login', { error: 'Usuario ou senha invalidos', basePath: GRUPO20_PATH });
});
grupo20.get('/logout', (req, res) => {
  req.session.user20 = null;
  res.redirect(`${GRUPO20_PATH}/login`);
});
grupo20.post('/logout', (req, res) => {
  req.session.user20 = null;
  res.redirect(`${GRUPO20_PATH}/login`);
});
grupo20.get('/calculo', requireAuth20, (req, res) => {
  res.render('equipe-20/calculo', { user: req.session.user20, basePath: GRUPO20_PATH });
});
grupo20.get('/sobre', requireAuth20, (req, res) => res.render('equipe-20/sobre', { basePath: GRUPO20_PATH }));
grupo20.get('/help', requireAuth20, (req, res) => res.render('equipe-20/help', { basePath: GRUPO20_PATH }));
grupo20.post('/AGUA/consumoDiario', requireAuth20, (req, res) => proxyPost('/AGUA/consumoDiario', req, res));
grupo20.post('/AGUA/custoMensal', requireAuth20, (req, res) => proxyPost('/AGUA/custoMensal', req, res));
grupo20.post('/AGUA/economia', requireAuth20, (req, res) => proxyPost('/AGUA/economia', req, res));
app.use(GRUPO20_PATH, grupo20);

const grupo7 = express.Router();

grupo7.get('/', (req, res) => {
  res.render('equipe-7/index', { basePath: GRUPO7_PATH });
});
grupo7.use('/api/volume', (req, res) => proxyJson(req, res, '/PISCINA2/volume'));
grupo7.use('/api/materiais', (req, res) => proxyJson(req, res, '/PISCINA2/materiais'));
grupo7.use('/api/custos', (req, res) => proxyJson(req, res, '/PISCINA2/custos'));
app.use(GRUPO7_PATH, grupo7);

const grupo17 = express.Router();

grupo17.get('/', (_req, res) => res.render('equipe-17/nfvenda'));
grupo17.post('/decodificar', (req, res) => proxyPost('/nfvenda/decodificar', req, res));
grupo17.post('/calcular', (req, res) => proxyPost('/nfvenda/calcular', req, res));
app.use('/equipe-17', grupo17);

const grupo08 = require('./src/equipe-08/routes');
app.use('/equipe-08', (req, res, next) => {
  res.locals.basePath = '/equipe-08';
  next();
}, grupo08);

app.use('/equipe-18/api', (req, res) => {
  const target = new URL(req.path.replace(/^\//, ''), ensureTrailingSlash('https://d36mf6v2e37tzy.cloudfront.net'));
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

app.get(/^\/equipe-18(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo18DistPath, 'index.html'));
});
app.get(/^\/equipe-5(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo5DistPath, 'index.html'));
});
app.get(/^\/equipe-2(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo2DistPath, 'index.html'));
});
app.get(/^\/equipe-23(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(grupo23DistPath, 'index.html'));
});
app.get(/^\/equipe-64(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(etec64DistPath, 'index.html'));
});

app.post('/api/etec64/media', (req, res) => proxyPost('/api/etec64/media', req, res));
app.post('/api/etec64/frequencia', (req, res) => proxyPost('/api/etec64/frequencia', req, res));
app.post('/api/etec64/aprovacao', (req, res) => proxyPost('/api/etec64/aprovacao', req, res));

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

for (let i = 2; i <= 25; i += 1) {
  if ([2, 5, 6, 7, 8, 9, 12, 13, 14, 16, 17, 18, 20, 21, 23].includes(i)) continue;
  app.get(`/equipe-${i}`, (req, res) => {
    res.render('equipe', { numero: i, nome: `Equipe-${i}` });
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App rodando: http://localhost:${PORT}`);
  });
}

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect(`${GRUPO16_PATH}/login`);
}

function requireAuth12(req, res, next) {
  if (req.session && req.session.user12) return next();
  return res.redirect(`${GRUPO12_PATH}/login`);
}

function requireAuth13(req, res, next) {
  if (req.session && req.session.user13) return next();
  return res.redirect(`${GRUPO13_PATH}/login`);
}

function requireAuth20(req, res, next) {
  if (req.session && req.session.user20) return next();
  return res.redirect(`${GRUPO20_PATH}/login`);
}

async function proxyPost(endpoint, req, res, message = 'Falha ao comunicar com a API.') {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(502).json({ success: false, error: message, message: err.message });
  }
}

async function proxyJson(req, res, endpointBackend) {
  try {
    const fetch = (await import('node-fetch')).default;
    const options = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(`${API_URL}${endpointBackend}`, options);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function proxyMarkup(mkpPath, body, res) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}/MKP${mkpPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
}

function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

module.exports = app;
