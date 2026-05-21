import { Router } from 'express';
import { consumo, conta, simular } from '../controllers/energyController.js';

const router: Router = Router();

/**
 * POST /ENRG/consumo
 * Calcula o consumo mensal em kWh com base nos aparelhos e dias de uso.
 */
router.post('/consumo', consumo);

/**
 * POST /ENRG/conta
 * Calcula o valor estimado da conta em Reais (R$) considerando tarifa e bandeira.
 */
router.post('/conta', conta);

/**
 * POST /ENRG/simular
 * Compara dois cenários de uso para identificar a economia potencial.
 */
router.post('/simular', simular);

export default router;