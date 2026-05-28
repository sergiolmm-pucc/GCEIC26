const express = require('express');
const router = express.Router();
const { calcularMaoDeObra, calcularCustosOperacionais, calcularPrecoFinal, calcular, TABELA } = require('./funcoes');

// GET /tabelas (Retorna constantes e referências financeiras)
router.get('/tabelas', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        base: [ { ate: 15, alicota: 0.01 }, { ate: 30, alicota: 0.03 } ], // Retrocompatibilidade com teste anterior
        referencia: '20%', // Retrocompatibilidade
        referenciaImpostos: TABELA.IMPOSTOS_REFERENCIA,
        produtividadePadrao: `${TABELA.PRODUTIVIDADE_PADRAO * 100}%`
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PARTE 1 (Fernando Furlanetto) — Custo de Mão de Obra e Horas
 * POST /csh/labor-cost
 */
router.post('/csh/labor-cost', (req, res) => {
  try {
    const dados = req.body;
    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = calcularMaoDeObra(dados);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * PARTE 2 (Matheus Augusto) — Custos Operacionais e Despesas
 * POST /csh/operating-cost
 */
router.post('/csh/operating-cost', (req, res) => {
  try {
    const dados = req.body;
    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = calcularCustosOperacionais(dados);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * PARTE 3 (Raul Antonio) — Margem de Lucro e Precificação Final
 * POST /csh/final-price
 */
router.post('/csh/final-price', (req, res) => {
  try {
    const dados = req.body;
    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }
    const resultado = calcularPrecoFinal(dados);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * AGREGADOR UNIFICADO
 * POST /calcular
 */
router.post('/calcular', (req, res) => {
  try {
    const dados = req.body;
    
    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ success: false, error: 'Corpo da requisição inválido' });
    }

    // Adaptador para suportar o teste de calcular área (se enviado altura/largura)
    if (dados.altura !== undefined && dados.largura !== undefined) {
      const h = parseFloat(dados.altura);
      const w = parseFloat(dados.largura);
      if (isNaN(h) || h <= 0 || isNaN(w) || w <= 0) {
        return res.status(400).json({ success: false, error: 'Valores inválidos para cálculo de área' });
      }
      const area = (h * w).toFixed(2);
      return res.status(200).json({ success: true, data: area });
    }

    // Cálculo real do Custo de Serviços em Horas
    const resultado = calcular(dados);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
    console.log("Erro no cálculo unificado:", err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
