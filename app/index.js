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

// Sessão (Professor's base)
app.use(session({
  secret: 'piscina-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

// Redirect root to home or login
app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/home');
  res.redirect('/login');
});

// Login Page
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/home');
  res.render('login', { error: null });
});

// Login POST Action
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Admin only logic
  if (username === 'admin' && password === '1234') {
    req.session.user = { username: 'admin', nome: 'Administrador' };
    return res.redirect('/home');
  }
  res.render('login', { error: 'Usuário ou senha incorretos.' });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Dashboard / Home Page
app.get('/home', requireAuth, (req, res) => {
  res.render('home', { user: req.session.user });
});

// Calculadoras Page
app.get('/calculadora/:tipo', requireAuth, (req, res) => {
  const tipo = req.params.tipo;
  const validTipos = ['volume', 'agua', 'materiais', 'manutencao', 'mao-de-obra'];
  if(!validTipos.includes(tipo)) return res.redirect('/home');
  res.render('calculadoras', { user: req.session.user, tipo: tipo, resultado: null, error: null });
});

// Proxy route to calculate via the Pool API
app.post('/api/calcular/:tipo', requireAuth, async (req, res) => {
  const tipo = req.params.tipo;
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${API_URL}/PISCINA/${tipo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    if (!response.ok) {
       return res.status(response.status).json({ success: false, error: data.erro || 'Erro na API' });
    }
    
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro de comunicação com o servidor.' });  
  }
});

// Sobre Page
app.get('/sobre', requireAuth, (req, res) => {
  res.render('sobre', { user: req.session.user });
});

// Ajuda Page
app.get('/help', requireAuth, (req, res) => {
  res.render('ajuda', { user: req.session.user });
});

app.listen(PORT, () => {
  console.log(`✅ App EJS rodando: http://localhost:${PORT}`);
});
module.exports = app;