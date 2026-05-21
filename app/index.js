console.log("Iniciando...");
    console.log("Deu certo");

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
  secret: 'saunacalc-elite-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

// Auth middleware (o segurança das páginas)
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

// ROTAS DAS TELAS

// Rota raiz manda para o Splash Screen
app.get('/', (req, res) => {
  res.render('splash');
});

// Telas de Informação
app.get('/sobre', (req, res) => res.render('sobre'));
app.get('/help', (req, res) => res.render('help'));

// Tela de Login
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/simulacao');
  res.render('login', { erro: null });
});

// Tela Principal
app.get('/simulacao', requireAuth, (req, res) => {
  res.render('simulacao', { user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// LÓGICA DE LOGIN 

app.post('/login', (req, res) => {
  // Pegamos usuario e senha vindos do HTML
  const { usuario, senha } = req.body;
  
  if (usuario === 'admin' && senha === '123') {
    req.session.user = { usuario: 'admin', nome: 'Administrador' };
    return res.redirect('/simulacao');
  }
  // Se errar, volta
  res.render('login', { erro: 'Usuário ou senha inválidos' });
});

// PROXY PARA A API 

// Quando o front quiser calcular, ele bate aqui e este servidor pede pra API na 3001
app.post('/calcular', requireAuth, async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    // Ele manda a requisição lá para o seu app.js do backend
    const response = await fetch(`${API_URL}/api/calcular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ success: false, error: err.message});  
  }
});

app.listen(PORT, () => {
  console.log(`✅ App Web da Sauna rodando: http://localhost:${PORT}`);
});

module.exports = app;