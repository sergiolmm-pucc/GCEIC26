const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`   API Consumo de Água rodando na porta ${PORT}`);
  console.log(`   Saúde: http://localhost:${PORT}/health`);
  console.log(`   Calcular: POST http://localhost:${PORT}/api/calcular`);
});