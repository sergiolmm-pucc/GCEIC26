import { Router } from 'express';
import { ctrlCalcular, ctrlDistancia, ctrlListarCidades, ctrlPrazo } from '../controllers/frete.controller';
import { validarNumeroPositivo, validarTipoEntrega, validarCidades } from '../middlewares/validacao.middleware';

export const freteRouter = Router();

// ══════════════════════════════════════════
//  ALUNO 1 — Cálculo do Frete (consolidado)
//  Recebe: peso, distancia, tipo
//  Retorna: custoPeso, custoDistancia, valorBase, valorFinal, prazoEntrega
// ══════════════════════════════════════════
freteRouter.post(
  '/calcular',
  validarTipoEntrega,
  validarNumeroPositivo(['peso', 'distancia']),
  ctrlCalcular
);

// ══════════════════════════════════════════
//  ALUNO 2 — Cálculo de Distância por cidade
//  POST: recebe origem e destino, retorna distanciaKm, custoDistancia, faixaRegiao
//  GET cidades: lista todas as cidades disponíveis
// ══════════════════════════════════════════
freteRouter.post(
  '/distancia',
  validarCidades,
  ctrlDistancia
);

freteRouter.get(
  '/distancia/cidades',
  ctrlListarCidades
);

// ══════════════════════════════════════════
//  ALUNO 3 — Cálculo de Prazo de Entrega
//  Recebe: distanciaKm, tipo
//  Retorna: diasUteisMin, diasUteisMax, prazoEntrega, dataEstimada
// ══════════════════════════════════════════
freteRouter.post(
  '/prazo',
  validarTipoEntrega,
  validarNumeroPositivo(['distanciaKm']),
  ctrlPrazo
);
