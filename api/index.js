const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(` API MKP rodando na porta ${PORT}`);
  console.log(` para verificar saude da API acesse:`);
  console.log(` http://localhost:${PORT}/health`);
});
