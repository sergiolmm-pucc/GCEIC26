const { Router } = require('express');
const {
  calcularLucroMargem,
  calcularPrecoBrutoNecessario,
  calcularPrecoLiquido
} = require('./pricingService');
const { validarNumero } = require('./validation');

const pricingRouter = Router();

pricingRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'preco-bruto-liquido' });
});

pricingRouter.post('/preco-liquido', (req, res) => {
  responderCalculo(res, () => calcularPrecoLiquido(normalizarEntrada(req.body, {
    precoBruto: { obrigatorio: true },
    quantidade: {},
    icmsPercentual: { maximo: 100 },
    pisPercentual: { maximo: 100 },
    cofinsPercentual: { maximo: 100 },
    ipiPercentual: { maximo: 100 }
  })));
});

pricingRouter.post('/preco-bruto', (req, res) => {
  responderCalculo(res, () => calcularPrecoBrutoNecessario(normalizarEntrada(req.body, {
    precoLiquido: { obrigatorio: true, aliases: ['precoLiquidoDesejado'] },
    quantidade: {},
    icmsPercentual: { maximo: 100 },
    pisPercentual: { maximo: 100 },
    cofinsPercentual: { maximo: 100 },
    ipiPercentual: { maximo: 100 }
  })));
});

pricingRouter.post('/margem', (req, res) => {
  responderCalculo(res, () => calcularLucroMargem(normalizarEntrada(req.body, {
    precoVenda: { obrigatorio: true },
    custoUnitario: { obrigatorio: true },
    quantidade: {},
    icmsPercentual: { maximo: 100 },
    pisPercentual: { maximo: 100 },
    cofinsPercentual: { maximo: 100 },
    ipiPercentual: { maximo: 100 }
  })));
});

function responderCalculo(res, calculo) {
  try {
    res.json(calculo());
  } catch (error) {
    res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      message: error.message,
      error: error.message
    });
  }
}

function normalizarEntrada(body, campos) {
  return Object.entries(campos).reduce((acc, [campo, configuracao]) => {
    const { obrigatorio = false, aliases = [], maximo } = configuracao;
    const valorPadrao = campo === 'quantidade' ? 1 : 0;
    const valorRecebido = [body[campo], ...aliases.map((alias) => body[alias])].find(
      (valor) => valor !== undefined && valor !== null && valor !== ''
    );
    acc[campo] = validarNumero(campo, valorRecebido ?? valorPadrao, { obrigatorio, maximo });
    return acc;
  }, {});
}

module.exports = pricingRouter;
