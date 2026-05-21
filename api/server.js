const express = require('express');
const cors = require('cors');
const app = express();

// Importando as rotas dos arquivos separados
const volumeRoutes = require('./routes/volume');
const materiaisRoutes = require('./routes/materiais');
const custosRoutes = require('./routes/custos');

app.use(cors());
app.use(express.json());

// Usando as rotas com seus respectivos prefixos
app.use('/PISCINA/volume', volumeRoutes);
app.use('/PISCINA/materiais', materiaisRoutes);
app.use('/PISCINA/custos', custosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});