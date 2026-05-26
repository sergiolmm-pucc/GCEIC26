

const TABELA = {
	BASE_CALC: {
		faixas: [
		 { ate: 15, alicota: 0.01 },
		 { ate: 30, alicota: 0.03 },
		],
	},
	REFERENCIA : 20/100,
};

function calcularArea(base,altura) {

  if (base <= 0) throw new Error('Base com valor errado');
  if (altura <=0) throw new Error('Altura com valor errado');
  let resultado = 0;
  resultado = base * altura;
  return resultado.toFixed(2);

}

function calcular(dados) {
  console.log(dados);
  const {altura = 0, largura = 0 ,} = dados;
  if (altura <= 0) throw new Error('Base com valor errado');
  if (largura <=0) throw new Error('Altura com valor errado');
  let resultado = 0;
  resultado = largura * altura;
  return resultado.toFixed(2);

}

// ────────────────────────────────────────────────────────────
//  GRUPO 17 — Calculadora de Impostos NF de Venda
// ────────────────────────────────────────────────────────────

const TABELA_NF_VENDA = {
  estados: {
    '11': { sigla: 'RO', nome: 'Rondônia',              icms: 17.5 },
    '12': { sigla: 'AC', nome: 'Acre',                  icms: 19   },
    '13': { sigla: 'AM', nome: 'Amazonas',               icms: 20   },
    '14': { sigla: 'RR', nome: 'Roraima',               icms: 17   },
    '15': { sigla: 'PA', nome: 'Pará',                  icms: 17   },
    '16': { sigla: 'AP', nome: 'Amapá',                 icms: 18   },
    '17': { sigla: 'TO', nome: 'Tocantins',             icms: 20   },
    '21': { sigla: 'MA', nome: 'Maranhão',              icms: 22   },
    '22': { sigla: 'PI', nome: 'Piauí',                 icms: 21   },
    '23': { sigla: 'CE', nome: 'Ceará',                 icms: 18   },
    '24': { sigla: 'RN', nome: 'Rio Grande do Norte',   icms: 18   },
    '25': { sigla: 'PB', nome: 'Paraíba',               icms: 18   },
    '26': { sigla: 'PE', nome: 'Pernambuco',            icms: 18   },
    '27': { sigla: 'AL', nome: 'Alagoas',               icms: 19   },
    '28': { sigla: 'SE', nome: 'Sergipe',               icms: 19   },
    '29': { sigla: 'BA', nome: 'Bahia',                 icms: 19   },
    '31': { sigla: 'MG', nome: 'Minas Gerais',          icms: 18   },
    '32': { sigla: 'ES', nome: 'Espírito Santo',        icms: 17   },
    '33': { sigla: 'RJ', nome: 'Rio de Janeiro',        icms: 20   },
    '35': { sigla: 'SP', nome: 'São Paulo',             icms: 18   },
    '41': { sigla: 'PR', nome: 'Paraná',                icms: 12   },
    '42': { sigla: 'SC', nome: 'Santa Catarina',        icms: 17   },
    '43': { sigla: 'RS', nome: 'Rio Grande do Sul',     icms: 17   },
    '50': { sigla: 'MS', nome: 'Mato Grosso do Sul',    icms: 17   },
    '51': { sigla: 'MT', nome: 'Mato Grosso',           icms: 17   },
    '52': { sigla: 'GO', nome: 'Goiás',                 icms: 17   },
    '53': { sigla: 'DF', nome: 'Distrito Federal',      icms: 18   },
  },
  modelos: {
    '55': 'NF-e (Nota Fiscal Eletrônica)',
    '65': 'NFC-e (Nota Fiscal de Consumidor Eletrônica)',
  },
  tiposEmissao: {
    '1': 'Emissão normal',
    '2': 'Contingência FS-IA',
    '3': 'Contingência SCAN',
    '4': 'Contingência DPEC',
    '5': 'Contingência FS-DA',
    '6': 'Contingência SVC-AN',
    '7': 'Contingência SVC-RS',
    '9': 'Contingência off-line NFC-e',
  },
  regimes: {
    lucroReal: {
      nome: 'Lucro Real',
      pis: 1.65,
      cofins: 7.6,
    },
    lucroPresumido: {
      nome: 'Lucro Presumido',
      pis: 0.65,
      cofins: 3.0,
    },
    simplesNacional: {
      nome: 'Simples Nacional',
      pis: 0,
      cofins: 0,
    },
  },
};

function _calcularDV(chave43) {
  const pesos = [2,3,4,5,6,7,8,9,2,3,4,5,6,7,8,9,2,3,4,5,6,7,8,9,
                 2,3,4,5,6,7,8,9,2,3,4,5,6,7,8,9,2,3,4];
  let soma = 0;
  for (let i = 0; i < 43; i++) soma += parseInt(chave43[i]) * pesos[i];
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function decodificarChaveNF(chave) {
  const c = String(chave).replace(/\D/g, '');
  if (c.length !== 44) throw new Error('Chave de acesso deve ter exatamente 44 dígitos numéricos');

  const cUF    = c.substring(0, 2);
  const aamm   = c.substring(2, 6);
  const cnpj   = c.substring(6, 20);
  const mod    = c.substring(20, 22);
  const serie  = c.substring(22, 25);
  const numero = c.substring(25, 34);
  const tpEmis = c.substring(34, 35);
  const cNF    = c.substring(35, 43);
  const cDV    = parseInt(c.substring(43, 44));

  const dvValido = cDV === _calcularDV(c.substring(0, 43));
  const estado   = TABELA_NF_VENDA.estados[cUF];
  const ano      = '20' + aamm.substring(0, 2);
  const mes      = aamm.substring(2, 4);
  const cnpjFmt  = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

  return {
    chave:          c,
    dvValido,
    cUF,
    estado:         estado ? `${estado.sigla} - ${estado.nome}` : `Código ${cUF}`,
    estadoSigla:    estado ? estado.sigla : null,
    icmsPadrao:     estado ? estado.icms : 18,
    dataEmissao:    `${mes}/${ano}`,
    cnpj,
    cnpjFormatado:  cnpjFmt,
    modelo:         mod,
    modeloDescricao: TABELA_NF_VENDA.modelos[mod] || `Modelo ${mod}`,
    serie:          parseInt(serie, 10).toString(),
    numero:         parseInt(numero, 10).toString(),
    tpEmis,
    tipoEmissao:    TABELA_NF_VENDA.tiposEmissao[tpEmis] || `Tipo ${tpEmis}`,
    cNF,
  };
}

function calcularImpostosNFVenda(dados) {
  const {
    chave,
    valorProduto      = 0,
    ipi               = 0,
    regime            = 'lucroReal',
    icmsPersonalizado = null,
    frete             = 0,
    seguro            = 0,
    outrasDespesas    = 0,
    descontos         = 0,
  } = dados;

  if (!chave) throw new Error('Chave de acesso é obrigatória');
  if (valorProduto <= 0) throw new Error('Valor do produto deve ser maior que zero');
  if (ipi < 0) throw new Error('IPI não pode ser negativo');
  if (frete < 0 || seguro < 0 || outrasDespesas < 0 || descontos < 0) {
    throw new Error('Valores adicionais não podem ser negativos');
  }

  const info = decodificarChaveNF(chave);

  const baseCalculo = valorProduto + frete + seguro + outrasDespesas - descontos;
  if (baseCalculo <= 0) throw new Error('Base de cálculo inválida');

  const alicotaICMS  = icmsPersonalizado !== null && icmsPersonalizado >= 0
    ? icmsPersonalizado
    : info.icmsPadrao;

  const regimeInfo   = TABELA_NF_VENDA.regimes[regime] || TABELA_NF_VENDA.regimes.lucroReal;

  const valorICMS   = parseFloat(((alicotaICMS / 100)         * baseCalculo).toFixed(2));
  const valorIPI    = parseFloat(((ipi / 100)                 * valorProduto).toFixed(2));
  const valorPIS    = parseFloat(((regimeInfo.pis / 100)      * valorProduto).toFixed(2));
  const valorCOFINS = parseFloat(((regimeInfo.cofins / 100)   * valorProduto).toFixed(2));

  const totalImpostos  = parseFloat((valorICMS + valorIPI + valorPIS + valorCOFINS).toFixed(2));
  const totalNF        = parseFloat((valorProduto + valorIPI + frete + seguro + outrasDespesas - descontos).toFixed(2));
  const cargaTributaria = parseFloat(((totalImpostos / valorProduto) * 100).toFixed(2));

  return {
    chave:          info.chave,
    dvValido:       info.dvValido,
    estado:         info.estado,
    dataEmissao:    info.dataEmissao,
    cnpjEmissor:    info.cnpjFormatado,
    modelo:         info.modeloDescricao,
    serie:          info.serie,
    numeroNF:       info.numero,
    tipoEmissao:    info.tipoEmissao,
    regime:         regimeInfo.nome,
    valorProduto:   parseFloat(valorProduto.toFixed(2)),
    baseCalculo:    parseFloat(baseCalculo.toFixed(2)),
    impostos: {
      icms:   { alicota: alicotaICMS,       valor: valorICMS   },
      ipi:    { alicota: ipi,               valor: valorIPI    },
      pis:    { alicota: regimeInfo.pis,    valor: valorPIS    },
      cofins: { alicota: regimeInfo.cofins, valor: valorCOFINS },
    },
    totalImpostos,
    totalNF,
    cargaTributaria,
  };
}


module.exports = {
	calcularArea,
	TABELA,
	calcular,
	// grupo17
	decodificarChaveNF,
	calcularImpostosNFVenda,
	TABELA_NF_VENDA,
};
