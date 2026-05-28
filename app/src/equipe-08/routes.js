const express = require('express');
const router = express.Router();

const API_URL = process.env.API_URL || 'http://localhost:3001';

// Auth middleware (Isolado para a equipe 08)
function requireAuth(req, res, next) {
    if (req.session && req.session.user) return next();
    res.redirect('/equipe-08/login');
}

// Redirect root to home or login
router.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/equipe-08/home');
    res.redirect('/equipe-08/login');
});

// Login Page
router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/equipe-08/home');
    res.render('equipe-08/login', { error: null });
});

// Login POST Action
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Admin only logic
    if (username === 'admin' && password === '1234') {
        req.session.user = { username: 'admin', nome: 'Administrador' };
        return res.redirect('/equipe-08/home');
    }
    res.render('equipe-08/login', { error: 'Usuário ou senha incorretos.' });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/equipe-08/login');
});

// Dashboard / Home Page
router.get('/home', requireAuth, (req, res) => {
    res.render('equipe-08/home', { user: req.session.user });
});

// Calculadoras Page
router.get('/calculadora/:tipo', requireAuth, (req, res) => {
    const tipo = req.params.tipo;
    const validTipos = ['volume', 'agua', 'materiais', 'manutencao', 'mao-de-obra'];
    if (!validTipos.includes(tipo)) return res.redirect('/equipe-08/home');
    res.render('equipe-08/calculadoras', { user: req.session.user, tipo: tipo, resultado: null, error: null });
});

// Proxy route to calculate via the Pool API (Atualizado para a rota isolada da API)
router.post('/api/calcular/:tipo', requireAuth, async (req, res) => {
    const tipo = req.params.tipo;
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${API_URL}/api/equipe-08/piscina/${tipo}`, {
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
router.get('/sobre', requireAuth, (req, res) => {
    res.render('equipe-08/sobre', { user: req.session.user });
});

// Ajuda Page
router.get('/help', requireAuth, (req, res) => {
    res.render('equipe-08/ajuda', { user: req.session.user });
});

module.exports = router;