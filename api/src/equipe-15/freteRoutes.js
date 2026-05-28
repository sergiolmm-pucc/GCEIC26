const { Router } = require('express');
const { calcularFrete, calcularDistancia, listarCidades, calcularPrazo } = require('./freteService');

const freteRouter = Router();

// ─────────────────────────────────────────
//  Middlewares de validação
// ─────────────────────────────────────────

function validarNumeroPositivo(campos) {
  return (req, res, next) => {
    for (const campo of campos) {
      const valor = req.body[campo];
      if (valor === undefined || valor === null || valor === '') {
        return res.status(400).json({ sucesso: false, erro: `Campo obrigatório: "${campo}"` });
      }
      const num = Number(valor);
      if (isNaN(num) || num <= 0) {
        return res.status(400).json({ sucesso: false, erro: `"${campo}" deve ser um número maior que zero` });
      }
    }
    next();
  };
}

function validarTipoEntrega(req, res, next) {
  const tiposValidos = ['economico', 'normal', 'expresso'];
  const { tipo } = req.body;
  if (!tipo) {
    return res.status(400).json({ sucesso: false, erro: 'Campo obrigatório: "tipo"' });
  }
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ sucesso: false, erro: `"tipo" inválido. Use: ${tiposValidos.join(', ')}` });
  }
  next();
}

function validarCidades(req, res, next) {
  const { origem, destino } = req.body;
  if (!origem || String(origem).trim() === '') {
    return res.status(400).json({ sucesso: false, erro: 'Campo obrigatório: "origem"' });
  }
  if (!destino || String(destino).trim() === '') {
    return res.status(400).json({ sucesso: false, erro: 'Campo obrigatório: "destino"' });
  }
  if (String(origem).trim() === String(destino).trim()) {
    return res.status(400).json({ sucesso: false, erro: 'Origem e destino não podem ser iguais' });
  }
  next();
}

// ─────────────────────────────────────────
//  Health check da equipe 15
// ─────────────────────────────────────────
freteRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'frete-equipe-15' });
});

// ══════════════════════════════════════════
//  ALUNO 1 — POST /equipe-15/frete/calcular
// ══════════════════════════════════════════
freteRouter.post(
  '/frete/calcular',
  validarTipoEntrega,
  validarNumeroPositivo(['peso', 'distancia']),
  (req, res) => {
    try {
      const dados = calcularFrete({
        peso:      Number(req.body.peso),
        distancia: Number(req.body.distancia),
        tipo:      req.body.tipo,
      });
      res.status(200).json({ sucesso: true, dados });
    } catch (err) {
      res.status(400).json({ sucesso: false, erro: err.message });
    }
  }
);

// ══════════════════════════════════════════
//  ALUNO 2 — POST /equipe-15/frete/distancia
//            GET  /equipe-15/frete/distancia/cidades
// ══════════════════════════════════════════
freteRouter.post(
  '/frete/distancia',
  validarCidades,
  (req, res) => {
    try {
      const dados = calcularDistancia({
        origem:  String(req.body.origem ?? '').trim(),
        destino: String(req.body.destino ?? '').trim(),
      });
      res.status(200).json({ sucesso: true, dados });
    } catch (err) {
      res.status(400).json({ sucesso: false, erro: err.message });
    }
  }
);

freteRouter.get('/frete/distancia/cidades', (_req, res) => {
  const dados = listarCidades();
  res.status(200).json({ sucesso: true, dados });
});

// ══════════════════════════════════════════
//  ALUNO 3 — POST /equipe-15/frete/prazo
// ══════════════════════════════════════════
freteRouter.post(
  '/frete/prazo',
  validarTipoEntrega,
  validarNumeroPositivo(['distanciaKm']),
  (req, res) => {
    try {
      const dados = calcularPrazo({
        distanciaKm: Number(req.body.distanciaKm),
        tipo:        req.body.tipo,
      });
      res.status(200).json({ sucesso: true, dados });
    } catch (err) {
      res.status(400).json({ sucesso: false, erro: err.message });
    }
  }
);

module.exports = freteRouter;
