const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const financiamentoRoutes = require('./routes/financiamento');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


// checa se api no ar
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() , by:'SLMM28', turma:'101'});
});

app.get('/', (req, res) => {
  res.json({
    nome: 'API Financiamento Imobiliário',
    versao: '1.0.0',
    endpoints: {
      'POST /FIN/sac': 'Calcula financiamento pelo Sistema SAC',
      'POST /FIN/price': 'Calcula financiamento pela Tabela PRICE',
      'POST /FIN/comparar': 'Compara SAC x PRICE',
      'POST /FIN/capacidade': 'Simula capacidade de financiamento pela renda',
      'GET /FIN/health': 'Status da API',
    },
  });
});

/** ------------------------------------------------
 * Rotas grupo 19 - Cálculo de Financiamento Imobiliário
 */
app.use('/FIN', financiamentoRoutes);
// ------------------------------------------------ */

app.get('/api/tabelas', (req, res) => {
  const { TABELA, calcular } = require('./funcoes');
  res.json({
	success: true,
	data: {
		base: TABELA.BASE_CALC.faixas,
		referencia: `${TABELA.REFERENCIA * 100}%`,
	},
  });

});

// POST /api/calcular
app.post('/api/calcular', (req, res) => {
  try {
	const { TABELA, calcular } = require('./funcoes');
    const dados = req.body;
	console.log(dados);

    if (!dados || typeof dados !== 'object') {
      return res.status(400).json({ error: 'Corpo da requisição inválido' });
    }
    
    const resultado = calcular(dados);
	console.log(resultado);
    return res.status(200).json({ success: true, data: resultado });
  } catch (err) {
	console.log(err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = app


