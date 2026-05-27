const express = require("express");
const router = express.Router();
const { calcular } = require("../controllers/impostoController");

// POST /IRP/calcular
router.post("/calcular", calcular);

module.exports = router;
