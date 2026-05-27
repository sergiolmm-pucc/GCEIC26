const express = require('express');
const cors = require('cors');

const mkpRouter = require('./grupo13-markup/routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/MKP', (req, res) => {
  res.json({ message: 'API MarkUp - Grupo 13 funcionando!' });
});

app.use('/MKP', mkpRouter);

module.exports = app;
