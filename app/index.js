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
  secret: 'domestic-worker-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));



const equipes = [
  { numero: 1, nome: 'TESTE', rota: '/login' },
  { numero: 2, nome: 'Equipe-2', rota: '/equipe-2' },
  { numero: 3, nome: 'Equipe-3', rota: '/equipe-3' },
  { numero: 4, nome: 'Equipe-4', rota: '/equipe-4' },
  { numero: 5, nome: 'Equipe-5', rota: '/equipe-5' },
  { numero: 6, nome: 'Equipe-6', rota: '/equipe-6' },
  { numero: 7, nome: 'Equipe-7', rota: '/equipe-7' },
  { numero: 8, nome: 'Equipe-8', rota: '/equipe-8' },
  { numero: 9, nome: 'Equipe-9', rota: '/equipe-9' },
  { numero: 10, nome: 'Equipe-10', rota: '/equipe-10' },
  { numero: 11, nome: 'Equipe-11', rota: '/equipe-11' },
  { numero: 12, nome: 'Equipe-12', rota: '/equipe-12' },
  { numero: 13, nome: 'Equipe-13', rota: '/equipe-13' },
  { numero: 14, nome: 'Equipe-14', rota: '/equipe-14' },
  { numero: 15, nome: 'Equipe-15', rota: '/equipe-15' },
  { numero: 16, nome: 'Equipe-16', rota: '/equipe-16' },
  { numero: 17, nome: 'Equipe-17', rota: '/equipe-17' },
  { numero: 18, nome: 'Equipe-18', rota: '/equipe-18' },
  { numero: 19, nome: 'Equipe-19', rota: '/equipe-19' },
  { numero: 20, nome: 'Equipe-20', rota: '/equipe-20' }
]

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}
/*
app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('login', { error: null });
});
*/
app.get("/", (req, res) => {
  res.render('index', { equipes });
  //if (req.session.user) return res.redirect("/dashboard");
  //res.render("inicial", { error: null });
});


app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('base/login', { error: null });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('base/login');
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username: 'admin', nome: 'Administrador' };
    return res.redirect('/calculo');
  }
  res.render('login', { error: 'Usuário ou senha inválidos' });
});

// Dashboard
app.get('/calculo', requireAuth, (req, res) => {
  res.render('base/calculo', { user: req.session.user });
});

// Calcular encargos (proxy para API)
app.post('/calcular', requireAuth, async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    console.log("passou 1");
    const response = await fetch(`${API_URL}/api/calcular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    console.log("passou 1a");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err.message)
    res.status(400).json({ success: false, error: err.message});  
  }
});

//Rotas Calculadora Financeira (grupo 10)

function requireEquipe10Auth(req, res, next) {
  if (req.session && req.session.equipe10User) return next();
  res.redirect('/equipe-10/login');
}

app.get('/equipe-10', (req, res) => {
  res.render('equipe-10/splash');
});

app.get('/equipe-10/login', (req, res) => {
  if (req.session.equipe10User) return res.redirect('/equipe-10/calculo');
  res.render('equipe-10/login', { error: null }); 
});

app.post('/equipe-10/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.render('equipe-10/login', { error: 'Preencha todos os campos' });

  if (username === 'admin' && password === '1234') {
    req.session.equipe10User = { username: 'adm', nome: 'Administrador' };
    return res.redirect('/equipe-10/calculo');
  }

  res.render('equipe-10/login', { error: 'Usuário ou senha inválidos' });
});

app.get('/equipe-10/logout', (req, res) => {
  req.session.equipe10User = null;
  res.redirect('/equipe-10/login');
});

app.get('/equipe-10/calculo', requireEquipe10Auth, (req, res) => {
  res.render('equipe-10/calculadora', { user: req.session.equipe10User || null, resultado: null });
});

app.post('/equipe-10/calcular', requireEquipe10Auth, async (req, res) => {
  const { capital, taxa, tempo, tipo } = req.body;

  try {
    const endpointAPI = tipo === 'simples' ? '/juros-simples' : '/juros-compostos';

    const urlDaSuaApi = `http://localhost:3001/api/calc-financeira${endpointAPI}`;

    const respostaApi = await fetch(urlDaSuaApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        capital: Number(capital),
        taxa: Number(taxa),
        tempo: Number(tempo)
      })
    });

    const dados = await respostaApi.json();

    if (dados.success) {
      res.render('equipe-10/calculadora', { 
        user: req.session.equipe10User, 
        resultado: dados.data 
      });
    } else {
      throw new Error(dados.error || 'Erro no cálculo');
    }

  } catch (error) {
    console.error("Erro ao comunicar com a API:", error);
    res.render('equipe-10/calculadora', { 
      user: req.session.equipe10User, 
      resultado: null 
    });
  }
});

app.get('/equipe-10/sobre', requireEquipe10Auth, (req, res) => {
  res.render('equipe-10/sobre');
});

app.get('/equipe-10/help', requireEquipe10Auth, (req, res) => {
  res.render('equipe-10/help');
});

// 20 dynamic team endpoints
for (let i = 5; i <= 20; i++) {
  app.get(`/equipe-${i}`, (req, res) => {
    console.log(`/equipe-${i}/equipe`);
    res.render(`equipe`, {
      numero: i,
      nome: `Equipe-${i}`
    });
  });
}




app.listen(PORT, () => {
  console.log(`✅ App Doméstica rodando: http://localhost:${PORT}`);
});
module.exports = app;