const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost:3001';
const BASE_PATH = process.env.BASE_PATH || '';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(BASE_PATH, express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'markup-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

const router = express.Router();

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect(BASE_PATH + '/login');
}

router.get('/', (req, res) => {
  if (req.session.user) return res.redirect(BASE_PATH + '/calculo');
  res.redirect(BASE_PATH + '/splash');
});

router.get('/splash', (req, res) => {
  res.render('splash', { user: req.session.user || null, basePath: BASE_PATH });
});

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect(BASE_PATH + '/calculo');
  res.render('base/login', { error: null, basePath: BASE_PATH });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect(BASE_PATH + '/login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', nome: 'Administrador' };
    return res.redirect(BASE_PATH + '/calculo');
  }
  res.render('base/login', { error: 'Usuário ou senha inválidos', basePath: BASE_PATH });
});

router.get('/calculo', requireAuth, (req, res) => {
  res.render('base/calculo', { user: req.session.user, basePath: BASE_PATH });
});

router.get('/sobre', requireAuth, (req, res) => {
  res.render('sobre', { user: req.session.user, basePath: BASE_PATH });
});

router.get('/help', requireAuth, (req, res) => {
  res.render('help', { user: req.session.user, basePath: BASE_PATH });
});

router.post('/calcular', requireAuth, async (req, res) => {
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

app.use(BASE_PATH, router);

app.listen(PORT, () => {
  console.log(`App MarkUp rodando: http://localhost:${PORT}${BASE_PATH}`);
});
module.exports = app;
