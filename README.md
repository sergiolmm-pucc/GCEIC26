# Projeto GCEIC26 - Sistema de Cálculo de MarkUp

Este projeto foi desenvolvido para a disciplina **GCEIC26**, composto por uma **API REST em Node.js** (Backend) e uma **Aplicação Web em React** (Frontend). O objetivo principal é automatizar a gestão financeira de produtos através de três cálculos essenciais: **MarkUp**, **Lucro Real** e **Ponto de Equilíbrio**.

---

## Do que se trata o projeto?

O sistema realiza os seguintes cálculos financeiros:
1. **Preço de Venda via MarkUp (`/MKP/markup`):** Define o preço ideal de venda baseado no custo do produto, despesas operacionais e margem de lucro desejada.
2. **Lucro Real e Margem (`/MKP/lucro`):** Calcula o retorno financeiro real e o percentual de margem obtidos a partir de um preço de venda já praticado.
3. **Ponto de Equilíbrio (`/MKP/equilibrio`):** Calcula a quantidade mínima de unidades que precisam ser vendidas para cobrir todos os custos (fixos e variáveis), ou seja, onde o lucro é zero.

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* Gerenciador de pacotes `npm` (instalado junto com o Node)

---

## Como iniciar o Backend (API)

1. Abra o terminal e navegue até a pasta do backend:
bash
cd backend
   
Instale todas as dependências necessárias:

Bash
npm install

Inicie o servidor de desenvolvimento:

Bash
npm run dev

## Como iniciar o Frontend (Interface Web)

Abra um segundo terminal (mantenha o terminal do backend rodando) e navegue até a pasta do frontend:

Bash
cd frontend

Instale as dependências do ecossistema React:

Bash
npm install

Inicie a aplicação web com o Vite:

Bash
npm run dev
