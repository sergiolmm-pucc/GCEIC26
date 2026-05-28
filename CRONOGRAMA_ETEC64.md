# Cronograma de Implantação - Grupo 24 (Cálculo de MarkUp)

Linha do tempo detalhando o desenvolvimento, marcos de entrega e fases de testes do projeto Cálculo de MarkUp - Preço de venda de um produto.

* **24/04/2026** - Concepção do Projeto (Concluída)
  Divulgação da atividade de Gerência de Configuração, Entrega e Integração Contínua. Definição inicial do tema do Grupo 24: Cálculo de MarkUp para formação do preço de venda de um produto.

* **12/05/2026** - Estruturação do Repositório Git (Concluída)
  Organização do repositório da disciplina, criação da branch `grupo24/markup` e preparação do ambiente de desenvolvimento para integração com o projeto base.

* **20/05/2026** - Desenvolvimento do Backend & API (Concluída)
  Desenvolvimento da API em Node.js para cálculo de MarkUp. Implementação da função `calcularMarkup` e criação do endpoint:

```text
POST /api/markup/calcular
```

Também foram implementados testes unitários e testes de API utilizando Jest e Supertest.

* **21/05/2026** - Entrega Parcial (30%) (Concluída)
  Entrega da API funcional, integração inicial com o app e testes unitários. A aplicação contempla a tela de uso do cálculo de MarkUp e a comunicação com a API.

* **25/05/2026** - Integração com App e CI/CD (Concluída)
  Integração da página do Grupo 24 ao app base da disciplina por meio da rota:

```text
GET /equipe-24
```

Criação da rota intermediária para comunicação entre o app e a API:

```text
POST /equipe-24/calcular
```

O projeto foi integrado ao fluxo de GitHub Actions e CI/CD existente no repositório da disciplina.

* **26/05/2026** - Documentação e Ajustes Visuais (Concluída)
  Criação da tela Splash Screen, tela de Login com usuário e senha fixos, tela Sobre com foto da equipe, tela Help e tela principal de cálculo. Também foram preparados os documentos de relatório, testes unitários, testes funcionais e cronograma.

* **28/05/2026** - Entrega Final e Apresentação (Pendente)
  Execução dos testes funcionais finais, validação do projeto no Render disponibilizado pelo professor e apresentação oficial do sistema para o professor e a turma.
