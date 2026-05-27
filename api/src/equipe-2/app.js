const express = require("express");
const cors = require("cors");
const irpRoutes = require("./routes/irpRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/IRP", irpRoutes);

// Rota raiz — health check
app.get("/", (req, res) => {
  res.json({ status: "API Simulador de Imposto Progressivo rodando!" });
});

module.exports = app;
