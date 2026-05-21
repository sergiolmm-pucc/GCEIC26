import express from 'express';
import { calcularMedia } from '../controllers/mediaController.js';
import { calcularFrequencia } from '../controllers/frequenciaController.js';
import { calcularAprovacao } from '../controllers/aprovacaoController.js';

const router = express.Router();

// Rota para cálculo de média de notas
// Endpoint: POST /api/etec64/media
router.post('/etec64/media', calcularMedia);

// Rota para cálculo de frequência e faltas
// Endpoint: POST /api/etec64/frequencia
router.post('/etec64/frequencia', calcularFrequencia);

// Rota para simulação de aprovação acadêmica
// Endpoint: POST /api/etec64/aprovacao
router.post('/etec64/aprovacao', calcularAprovacao);

export default router;
