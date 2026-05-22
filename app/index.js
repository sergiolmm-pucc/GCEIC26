const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API rodando em ${PORT}`);
  console.log(`para verificar saude da API: http://localhost:${PORT}/health`);
});
