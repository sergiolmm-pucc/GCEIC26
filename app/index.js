console.log('Iniciando AguaCalc App...');

const express    = require('express');
const session    = require('express-session');
const bodyParser = require('body-parser');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

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
// Grupo 20 — AguaCalc
// -------------------------------------------------------
const { grupo20, BASE_PATH } = require('./equipe-20');
app.use(BASE_PATH, grupo20);

// Rota raiz — redireciona para o grupo (uso local)
app.get('/', (_req, res) => res.redirect(BASE_PATH));

// Rotas genéricas para outras equipes (uso local)
for (let i = 1; i <= 25; i++) {
  if (i === 20) continue;
  app.get(`/equipe-${i}`, (req, res) => {
    res.render('equipe', { numero: i, nome: `Equipe-${i}` });
  });
}

app.listen(PORT, () => {
  console.log(`✅ AguaCalc App rodando: http://localhost:${PORT}`);
  console.log(`   Acesse: http://localhost:${PORT}${BASE_PATH}`);
});

module.exports = app;