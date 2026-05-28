const { Router } = require('express');
const { consumo, conta, simular } = require('../controllers/energyController');

const router = Router();

router.post('/consumo', consumo);
router.post('/conta', conta);
router.post('/simular', simular);

module.exports = router;
