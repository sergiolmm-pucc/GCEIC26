const app = require('./src/server');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App rodando em http://localhost:${PORT}`);
});
