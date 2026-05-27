console.log('Iniciando AguaCalc App...');

const express    = require('express');
const session    = require('express-session');
const bodyParser = require('body-parser');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost:3001';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'agua-calc-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

// -------------------------------------------------------
// Rota raiz — redireciona para o grupo
// -------------------------------------------------------
app.get('/', (req, res) => {
  res.redirect('/equipe-20');
});

// -------------------------------------------------------
// Router do Grupo 20 — AguaCalc
// Prefixo: /equipe-20
// -------------------------------------------------------
const BASE_PATH = '/equipe-20';

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect(BASE_PATH + '/login');
}

const grupo20 = express.Router();

grupo20.get('/', (req, res) => {
  res.redirect(BASE_PATH + '/splash');
});

grupo20.get('/splash', (req, res) => {
  res.render('equipe-20/splash', { basePath: BASE_PATH });
});

grupo20.get('/login', (req, res) => {
  if (req.session.user) return res.redirect(BASE_PATH + '/calculo');
  res.render('equipe-20/login', { error: null, basePath: BASE_PATH });
});

grupo20.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', nome: 'Administrador' };
    return res.redirect(BASE_PATH + '/calculo');
  }
  res.render('equipe-20/login', { error: 'Usuário ou senha inválidos', basePath: BASE_PATH });
});

grupo20.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect(BASE_PATH + '/login');
});

grupo20.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect(BASE_PATH + '/login');
});

grupo20.get('/calculo', requireAuth, (req, res) => {
  res.render('equipe-20/calculo', { user: req.session.user, basePath: BASE_PATH });
});

grupo20.get('/sobre', requireAuth, (req, res) => {
  res.render('equipe-20/sobre', { basePath: BASE_PATH });
});

grupo20.get('/help', requireAuth, (req, res) => {
  res.render('equipe-20/help', { basePath: BASE_PATH });
});

// -------------------------------------------------------
// Proxy para a API — 3 rotas do projeto
// -------------------------------------------------------
async function proxyPost(req, res, rota) {
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

// API 1 — Ana
grupo20.post('/AGUA/consumoDiario', requireAuth, (req, res) =>
  proxyPost(req, res, '/AGUA/consumoDiario'));

// API 2 — Hugo
grupo20.post('/AGUA/custoMensal', requireAuth, (req, res) =>
  proxyPost(req, res, '/AGUA/custoMensal'));

// API 3 — Letícia
grupo20.post('/AGUA/economia', requireAuth, (req, res) =>
  proxyPost(req, res, '/AGUA/economia'));

app.use(BASE_PATH, grupo20);

// -------------------------------------------------------
// Rotas genéricas para outras equipes
// -------------------------------------------------------
for (let i = 1; i <= 25; i++) {
  if (i === 20) continue;
  app.get(`/equipe-${i}`, (req, res) => {
    res.render('equipe', { numero: i, nome: `Equipe-${i}` });
  });
}

app.listen(PORT, () => {
  console.log(`✅ AguaCalc App rodando: http://localhost:${PORT}`);
  console.log(`   Acesse: http://localhost:${PORT}/equipe-20`);
});

module.exports = app;
