const express = require('express');
const cors = require('cors');
const piscinaRoutes = require('./routes/piscina');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/PISCINA', piscinaRoutes);

module.exports = app;
