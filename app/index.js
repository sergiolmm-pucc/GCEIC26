const express    = require('express');
const session    = require('express-session');
const bodyParser = require('body-parser');
const path       = require('path');

const app     = express();
const PORT    = process.env.PORT    || 3000;
const API_URL = process.env.API_URL || 'http://localhost:3001';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'calculo-nf-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

// rotas públicas
app.get('/',       (req, res) => res.redirect('/splash'));
app.get('/splash', (req, res) => res.render('splash'));

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/calculo');
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', nome: 'Administrador' };
    return res.redirect('/calculo');
  }
  res.render('login', { error: 'Usuário ou senha inválidos' });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// rotas protegidas
app.get('/calculo',   requireAuth, (req, res) => res.render('calculo',   { user: req.session.user }));
app.get('/inverso',   requireAuth, (req, res) => res.render('inverso',   { user: req.session.user }));
app.get('/comparar',  requireAuth, (req, res) => res.render('comparar',  { user: req.session.user }));
app.get('/sobre',     requireAuth, (req, res) => res.render('sobre',     { user: req.session.user }));
app.get('/help',      requireAuth, (req, res) => res.render('help',      { user: req.session.user }));

// proxies para a API
async function proxyAPI(endpoint, req, res) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

app.post('/calcular',          requireAuth, (req, res) => proxyAPI('/NF/calcular',           req, res));
app.post('/calcular-inverso',  requireAuth, (req, res) => proxyAPI('/NF/calcular-inverso',    req, res));
app.post('/comparar',          requireAuth, (req, res) => proxyAPI('/NF/comparar',             req, res));

app.listen(PORT, () => {
  console.log(`App rodando: http://localhost:${PORT}`);
});

module.exports = app;
