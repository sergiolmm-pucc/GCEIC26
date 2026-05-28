const { Router } = require('express');
const {
  getMetadata,
  getTables,
  postSalary,
  postVacation,
  postTermination,
  validateJsonBody,
} = require('../controllers/etecController');
const { handleError } = require('../middlewares/errorMiddleware');

const router = Router();

router.get('/', getMetadata);
router.get('/tabelas', getTables);
router.post('/salario', validateJsonBody, postSalary);
router.post('/ferias', validateJsonBody, postVacation);
router.post('/rescisao', validateJsonBody, postTermination);
router.use(handleError);

module.exports = router;
