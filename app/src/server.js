const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: 'finv-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 },
}));

function requireAuth(req, res, next) {
  if (req.session.logado) return next();
  res.redirect('/login');
}

app.get('/', (req, res) => res.render('splash'));

app.get('/login', (req, res) => res.render('login', { error: null }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    req.session.logado = true;
    res.redirect('/home');
  } else {
    res.render('login', { error: 'Usuário ou senha inválidos.' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.get('/home', requireAuth, (req, res) => res.render('home'));
app.get('/simulador', requireAuth, (req, res) => res.render('simulador'));
app.get('/capacidade', requireAuth, (req, res) => res.render('capacidade'));
app.get('/sobre', requireAuth, (req, res) => res.render('sobre'));
app.get('/help', requireAuth, (req, res) => res.render('help'));

module.exports = app;
