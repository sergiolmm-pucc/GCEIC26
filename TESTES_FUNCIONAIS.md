# Documento de Testes Funcionais - Calculadora de MarkUp

Este documento descreve os cenários de testes funcionais realizados na aplicação do Grupo 24, integrada à API Node.js do projeto da disciplina.

## Cenário 1: Acesso à Página da Equipe 24

* **Ação:** Acessar a rota da aplicação:

```text
/equipe-24
```

* **Resultado Esperado:** Exibição da tela inicial da Calculadora de MarkUp, contendo o nome da Equipe 24, o título do sistema e o botão "Entrar".
* **Status:** APROVADO.

---

## Cenário 2: Splash Screen e Navegação para Login

* **Ação:** Na tela inicial, clicar no botão "Entrar".
* **Resultado Esperado:** O sistema deve ocultar a tela inicial e exibir a tela de login.
* **Status:** APROVADO.

---

## Cenário 3: Login com Usuário Incorreto

* **Ação:** Informar usuário ou senha inválidos na tela de login.
* **Resultado Esperado:** O sistema deve exibir a mensagem de erro "Usuário ou senha inválidos.".
* **Status:** APROVADO.

---

## Cenário 4: Login com Usuário e Senha Fixos

* **Ação:** Informar os dados corretos de login:

```text
Usuário: admin
Senha: 123456
```

* **Resultado Esperado:** O sistema deve liberar o acesso à tela principal da Calculadora de MarkUp.
* **Status:** APROVADO.

---

## Cenário 5: Cálculo de MarkUp com Dados Válidos

* **Ação:** Na tela principal da calculadora, preencher os campos com os seguintes valores:

```text
Custo do produto: 50
Despesas: 20
Lucro desejado: 30
```

Em seguida, clicar no botão "Calcular".

* **Resultado Esperado:** A aplicação deve enviar os dados para a rota intermediária do app:

```text
POST /equipe-24/calcular
```

Essa rota consome a API:

```text
POST /api/markup/calcular
```

A tela deve exibir os seguintes resultados:

```text
Índice de MarkUp: 2
Preço de venda: R$ 100.00
Valor das despesas: R$ 20.00
Valor do lucro: R$ 30.00
```

* **Status:** APROVADO.

---

## Cenário 6: Validação de Dados Inválidos

* **Ação:** Informar valores inválidos, como despesas e lucro cuja soma seja maior ou igual a 100%.

Exemplo:

```text
Custo do produto: 50
Despesas: 70
Lucro desejado: 40
```

* **Resultado Esperado:** A API deve retornar erro e a tela deve exibir uma mensagem informando que os valores são inválidos.
* **Status:** APROVADO.

---

## Cenário 7: Botão Limpar

* **Ação:** Preencher os campos da calculadora e clicar no botão "Limpar".
* **Resultado Esperado:** Todos os campos devem ser apagados, a mensagem de erro deve ser removida e o resultado anterior deve ser ocultado.
* **Status:** APROVADO.

---

## Cenário 8: Tela Sobre

* **Ação:** Na tela principal, clicar no botão "Sobre".
* **Resultado Esperado:** O sistema deve exibir a tela Sobre, contendo a descrição do projeto e a foto da equipe.
* **Status:** APROVADO.

---

## Cenário 9: Tela Help

* **Ação:** Na tela principal, clicar no botão "Help".
* **Resultado Esperado:** O sistema deve exibir instruções de uso da Calculadora de MarkUp, informando que o usuário deve preencher custo, despesas e lucro desejado.
* **Status:** APROVADO.

---

## Cenário 10: Retorno para a Página Inicial

* **Ação:** Clicar no botão "Início".
* **Resultado Esperado:** O sistema deve retornar para a página inicial do projeto da disciplina, onde aparecem as equipes cadastradas.
* **Status:** APROVADO.
