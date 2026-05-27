(function () {
  const e = React.createElement;
  const apiPath = window.BURGCALC_API_PATH || '/equipe-21/api/calcular';

  const campos = [
    { name: 'pao', label: 'Custo do pao', step: '0.01', min: '0' },
    { name: 'carne', label: 'Custo da carne', step: '0.01', min: '0' },
    { name: 'queijo', label: 'Custo do queijo', step: '0.01', min: '0' },
    { name: 'molho', label: 'Custo do molho', step: '0.01', min: '0' },
    { name: 'salada', label: 'Custo da salada/vegetais', step: '0.01', min: '0' },
    { name: 'embalagem', label: 'Custo da embalagem', step: '0.01', min: '0' },
    { name: 'custoAdicional', label: 'Outros custos', step: '0.01', min: '0' },
    { name: 'quantidade', label: 'Quantidade produzida', step: '1', min: '1' },
    { name: 'margemLucro', label: 'Margem de lucro desejada (%)', step: '0.01', min: '0' },
  ];

  const valoresIniciais = {
    pao: '0',
    carne: '0',
    queijo: '0',
    molho: '0',
    salada: '0',
    embalagem: '0',
    custoAdicional: '0',
    quantidade: '1',
    margemLucro: '0',
  };

  function moeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function montarPayload(formulario) {
    return Object.keys(formulario).reduce((payload, campo) => {
      payload[campo] = Number(formulario[campo]);
      return payload;
    }, {});
  }

  function CampoNumero({ campo, valor, onChange }) {
    return e('div', null,
      e('label', { htmlFor: campo.name }, campo.label),
      e('input', {
        id: campo.name,
        name: campo.name,
        type: 'number',
        min: campo.min,
        step: campo.step,
        value: valor,
        onChange,
        required: true,
      })
    );
  }

  function Resultado({ resultado }) {
    if (!resultado) {
      return e('p', null, 'Preencha os campos e calcule para ver o resultado.');
    }

    const itens = [
      ['Custo total de producao', moeda(resultado.custoTotal)],
      ['Custo unitario', moeda(resultado.custoUnitario)],
      ['Preco de venda sugerido', moeda(resultado.precoVendaSugerido)],
      ['Lucro estimado por unidade', moeda(resultado.lucroEstimadoPorUnidade)],
    ];

    return e('div', { className: 'resultado-lista' },
      itens.map(([rotulo, valor]) =>
        e('div', { className: 'resultado-item', key: rotulo },
          e('span', null, rotulo),
          e('strong', null, valor)
        )
      )
    );
  }

  function BurgcalcApp() {
    const [formulario, setFormulario] = React.useState(valoresIniciais);
    const [resultado, setResultado] = React.useState(null);
    const [erro, setErro] = React.useState('');
    const [sucesso, setSucesso] = React.useState('');
    const [carregando, setCarregando] = React.useState(false);

    function alterarCampo(event) {
      const { name, value } = event.target;

      setFormulario((atual) => ({
        ...atual,
        [name]: value,
      }));
    }

    async function calcular(event) {
      event.preventDefault();
      setCarregando(true);
      setErro('');
      setSucesso('');

      try {
        const resposta = await fetch(apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(montarPayload(formulario)),
        });
        const json = await resposta.json();

        if (!resposta.ok || !json.success) {
          throw new Error(json.error || 'Nao foi possivel calcular.');
        }

        setResultado(json.data);
        setSucesso('Calculo realizado com sucesso.');
      } catch (err) {
        setResultado(null);
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }

    return e('div', { className: 'burgcalc-layout' },
      e('section', { className: 'painel' },
        e('h2', null, 'Calculo de custo'),
        e('form', { onSubmit: calcular },
          e('div', { className: 'grid-campos' },
            campos.map((campo) => e(CampoNumero, {
              key: campo.name,
              campo,
              valor: formulario[campo.name],
              onChange: alterarCampo,
            }))
          ),
          e('button', { type: 'submit', disabled: carregando },
            carregando ? 'Calculando...' : 'Calcular BURGCALC'
          )
        ),
        erro ? e('div', { className: 'mensagem erro', role: 'alert' }, erro) : null,
        sucesso ? e('div', { className: 'mensagem sucesso', role: 'status' }, sucesso) : null
      ),
      e('aside', { className: 'painel', 'aria-live': 'polite' },
        e('h2', null, 'Resultado'),
        e(Resultado, { resultado })
      )
    );
  }

  ReactDOM.createRoot(document.getElementById('burgcalc-root')).render(e(BurgcalcApp));
})();
