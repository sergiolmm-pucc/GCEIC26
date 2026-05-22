import { Router } from 'express';
import {
  calcularLucroMargem,
  calcularPrecoBrutoNecessario,
  calcularPrecoLiquido
} from '../services/pricingService.js';
import { validarNumero } from '../utils/validation.js';

export const pricingRouter = Router();

// Rota de saúde para verificar se o serviço está funcionando
pricingRouter.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'preco-bruto-liquido' });
});

// Rota para calcular o preço líquido a partir do preço bruto
pricingRouter.post('/preco-liquido', (request, response, next) => {
  try {
    const entrada = normalizarEntrada(request.body, {
      precoBruto: { obrigatorio: true },
      quantidade: { obrigatorio: false },
      icmsPercentual: { obrigatorio: false, maximo: 100 },
      pisPercentual: { obrigatorio: false, maximo: 100 },
      cofinsPercentual: { obrigatorio: false, maximo: 100 },
      ipiPercentual: { obrigatorio: false, maximo: 100 }
    });

    response.json(calcularPrecoLiquido(entrada));
  } catch (error) {
    next(error);
  }
});

// Rota para calcular o preço bruto necessário para atingir um preço líquido desejado
pricingRouter.post('/preco-bruto', (request, response, next) => {
  try {
    const entrada = normalizarEntrada(request.body, {
      precoLiquido: { obrigatorio: true, aliases: ['precoLiquidoDesejado'] },
      quantidade: { obrigatorio: false },
      icmsPercentual: { obrigatorio: false, maximo: 100 },
      pisPercentual: { obrigatorio: false, maximo: 100 },
      cofinsPercentual: { obrigatorio: false, maximo: 100 },
      ipiPercentual: { obrigatorio: false, maximo: 100 }
    });

    response.json(calcularPrecoBrutoNecessario(entrada));
  } catch (error) {
    next(error);
  }
});

// Rota para calcular a margem de lucro a partir do preço de venda e custo unitário
pricingRouter.post('/margem', (request, response, next) => {
  try {
    const entrada = normalizarEntrada(request.body, {
      precoVenda: { obrigatorio: true },
      custoUnitario: { obrigatorio: true },
      quantidade: { obrigatorio: false },
      icmsPercentual: { obrigatorio: false, maximo: 100 },
      pisPercentual: { obrigatorio: false, maximo: 100 },
      cofinsPercentual: { obrigatorio: false, maximo: 100 },
      ipiPercentual: { obrigatorio: false, maximo: 100 }
    });

    response.json(calcularLucroMargem(entrada));
  } catch (error) {
    next(error);
  }
});

// Função para normalizar e validar a entrada dos dados
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
