const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost:3001';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'markup-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/calculo');
  res.redirect('/splash');
});

app.get('/splash', (req, res) => {
  res.render('splash', { user: req.session.user || null });
});

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/calculo');
  res.render('login', { error: null });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', nome: 'Administrador' };
    return res.redirect('/calculo');
  }
  res.render('login', { error: 'Usuário ou senha inválidos' });
});

app.get('/calculo', requireAuth, (req, res) => {
  res.render('calculo', { user: req.session.user });
});

app.get('/sobre', requireAuth, (req, res) => {
  res.render('sobre', { user: req.session.user });
});

app.get('/help', requireAuth, (req, res) => {
  res.render('help', { user: req.session.user });
});

// Proxy para a API de calculo de MarkUp.
app.post('/calcular', requireAuth, async (req, res) => {
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
    res.status(400).json({ success: false, error: err.message});  
  }
});

app.listen(PORT, () => {
  console.log(`App MarkUp rodando: http://localhost:${PORT}`);
});
module.exports = app;
