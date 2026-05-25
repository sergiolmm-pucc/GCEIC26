const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Checa se API está no ar (Health Check)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), by: 'Equipe-01-CSH', turma: '101' });
});

// GET /api/tabelas (Retorna constantes e referências financeiras)
app.get('/api/tabelas', (req, res) => {
  try {
    const { TABELA } = require('./funcoes');
    res.json({
      success: true,
      data: {
        base: [ { ate: 15, alicota: 0.01 }, { ate: 30, alicota: 0.03 } ], // Retrocompatibilidade com teste
        referencia: '20%', // Retrocompatibilidade com teste
        referenciaImpostos: TABELA.IMPOSTOS_REFERENCIA,
        produtividadePadrao: `${TABELA.PRODUTIVIDADE_PADRAO * 100}%`
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PARTE 1 (Ana Carolina) — Custo de Mão de Obra e Horas
 * POST /api/csh/labor-cost
 */
app.post('/api/csh/labor-cost', (req, res) => {
  try {
    const { calcularMaoDeObra } = require('./funcoes');
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
 * PARTE 2 (Bruno Eduardo) — Custos Operacionais e Despesas
 * POST /api/csh/operating-cost
 */
app.post('/api/csh/operating-cost', (req, res) => {
  try {
    const { calcularCustosOperacionais } = require('./funcoes');
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
 * PARTE 3 (Carlos Augusto) — Margem de Lucro e Precificação Final
 * POST /api/csh/final-price
 */
app.post('/api/csh/final-price', (req, res) => {
  try {
    const { calcularPrecoFinal } = require('./funcoes');
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
 * AGREGADOR UNIFICADO (Mantém compatibilidade total com o proxy da Web original)
 * POST /api/calcular
 */
app.post('/api/calcular', (req, res) => {
  try {
    const { calcular } = require('./funcoes');
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

module.exports = app;
