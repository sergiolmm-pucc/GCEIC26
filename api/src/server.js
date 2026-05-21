const app = require('./app');
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Servidor da Calculadora de Piscina rodando na porta ${port}`);
});
