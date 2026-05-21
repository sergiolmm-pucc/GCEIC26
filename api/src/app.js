const express = require('express');
const cors = require('cors');
const markupRoutes = require('./routes/markup');

const app = express();

app.use(cors());
app.use(express.json());

// Rota base para verificar se a API está online
app.get('/MKP', (req, res) => {
  res.json({ message: 'API de MarkUp funcionando!' });
});

// Rotas de cálculo
app.use('/MKP', markupRoutes);

module.exports = app;