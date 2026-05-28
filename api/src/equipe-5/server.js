const express = require('express');
const cors = require('cors');
const energyRoutes = require('./routes/energy');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API de Consumo de Energia', version: '1.0.0' });
});

app.use('/ENRG', energyRoutes);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = { app };
