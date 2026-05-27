// -------------------------------------------------------
// Grupo 20 — AguaCalc
// Calculadora de Consumo de Água Residencial
// -------------------------------------------------------
const express = require('express');

const BASE_PATH = '/equipe-20';
const API_URL   = process.env.API_URL || 'http://localhost:3001';

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect(BASE_PATH + '/login');
}

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

const grupo20 = express.Router();

// Splash
grupo20.get('/', (_req, res) => res.redirect(BASE_PATH + '/splash'));
grupo20.get('/splash', (req, res) => {
  res.render('equipe-20/splash', { basePath: BASE_PATH });
});

// Login
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

// Logout
grupo20.get('/logout',  (req, res) => { req.session.destroy(); res.redirect(BASE_PATH + '/login'); });
grupo20.post('/logout', (req, res) => { req.session.destroy(); res.redirect(BASE_PATH + '/login'); });

// Telas autenticadas
grupo20.get('/calculo', requireAuth, (req, res) =>
  res.render('equipe-20/calculo', { user: req.session.user, basePath: BASE_PATH }));
grupo20.get('/sobre', requireAuth, (req, res) =>
  res.render('equipe-20/sobre', { basePath: BASE_PATH }));
grupo20.get('/help', requireAuth, (req, res) =>
  res.render('equipe-20/help', { basePath: BASE_PATH }));

// API 1 — Ana: Consumo Diário
grupo20.post('/AGUA/consumoDiario', requireAuth, (req, res) =>
  proxyPost(req, res, '/AGUA/consumoDiario'));

// API 2 — Hugo: Custo Mensal
grupo20.post('/AGUA/custoMensal', requireAuth, (req, res) =>
  proxyPost(req, res, '/AGUA/custoMensal'));

// API 3 — Letícia: Projeção de Economia
grupo20.post('/AGUA/economia', requireAuth, (req, res) =>
  proxyPost(req, res, '/AGUA/economia'));

module.exports = { grupo20, BASE_PATH };