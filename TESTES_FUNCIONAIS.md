# Documento de Testes Funcionais - Calculadora de Piscina

Este documento descreve os cenários de testes funcionais realizados na aplicação React integrada à API Node.js. Ele deve ser entregue junto ao relatório do Canvas.

## Cenário 1: Splash Screen e Login
- **Ação:** Acessar a raiz da aplicação (`/`).
- **Resultado Esperado:** Exibição da Splash Screen (com logo) por 3 segundos e redirecionamento automático para a tela `/login`.
- **Status:** APROVADO.

- **Ação:** Tentar login com usuário incorreto.
- **Resultado Esperado:** Exibição da mensagem de erro "Usuário ou senha incorretos." na cor vermelha.
- **Status:** APROVADO.

- **Ação:** Tentar login com usuário "admin" e senha "1234".
- **Resultado Esperado:** Redirecionamento com sucesso para o painel principal (`/home`).
- **Status:** APROVADO.

## Cenário 2: Cálculo de Volume da Piscina
- **Ação:** Na Home, clicar em "Volume da Piscina". Inserir Largura = 4, Comprimento = 2, Profundidade = 2. Clicar em Calcular.
- **Resultado Esperado:** A API processa a requisição e retorna os dados JSON. A tela exibe `volumeMetrosCubicos: 16` e `volumeLitros: 16000` na caixa de sucesso verde.
- **Status:** APROVADO.

## Cenário 3: Cálculo de Custo de Materiais
- **Ação:** Na tela de Materiais, inserir Volume = 20 e escolher Acabamento = Vinil.
- **Resultado Esperado:** Retorno de sucesso com o cálculo aplicando o multiplicador de R$800 para vinil + 20% de elétrico/hidráulico. 
- **Status:** APROVADO.

## Cenário 4: Validação de Erros nas Calculadoras
- **Ação:** Em qualquer calculadora, deixar um campo em branco e tentar calcular.
- **Resultado Esperado:** O navegador previne o envio do formulário (validação nativa de campos `required`).
- **Ação Secundária:** Caso os dados sejam enviados vazios via API diretamente.
- **Resultado Esperado:** A API deve retornar status HTTP 400 alertando que campos são obrigatórios.
- **Status:** APROVADO.

## Cenário 5: Navegação entre Telas
- **Ação:** Navegar para "Sobre a Equipe" e "Ajuda" usando o menu superior.
- **Resultado Esperado:** Carregamento correto do conteúdo, sem perdas de estado ou quebra de roteamento do React Router.
- **Status:** APROVADO.
