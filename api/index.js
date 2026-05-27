
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen( PORT, () => {
  console.log(`API MarkUp rodando em ${PORT}`); 
  console.log(`Para verificar saude da API, acesse:`);
  console.log(` http://localhost:${PORT}/health`);	

});
