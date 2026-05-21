# 📊 Calculadora Acadêmica ETEC (Calculo_ETEC_64)

Uma aplicação web moderna e robusta desenvolvida para facilitar o controle de médias, controle de faltas/frequência e a simulação de aprovação acadêmica de acordo com as diretrizes e critérios oficiais das **ETECs (Centro Paula Souza)**.

Este projeto adota uma arquitetura full-stack com um backend em Node.js/Express e um frontend altamente interativo em React e Vite.

---

## 🚀 Funcionalidades Principais

O sistema é dividido em três módulos principais, cobrindo todas as necessidades acadêmicas do estudante:

### 1. 📝 Mapeamento e Cálculo de Médias (Módulo Aluno A)
* Permite calcular médias aritméticas a partir de notas numéricas clássicas (de `0.0` a `10.0`).
* Suporta e converte menções oficiais da ETEC (`I`, `R`, `B`, `MB`) para valores equivalentes, deduzindo a menção final correspondente:
  - **MB** (Muito Bom): Equivalente a `10.0` (Nota final $\ge 9.0$)
  - **B** (Bom): Equivalente a `8.0` (Nota final $\ge 7.0$ e $< 9.0$)
  - **R** (Regular): Equivalente a `6.0` (Nota final $\ge 6.0$ e $< 7.0$)
  - **I** (Insuficiente): Equivalente a `4.0` (Nota final $< 6.0$)

### 2. 📅 Controle de Frequência e Faltas (Módulo Aluno B)
* Calcula o percentual exato de frequência do aluno.
* Informa o limite máximo de faltas permitido com base na carga horária total da disciplina.
* Alerta de forma dinâmica se o aluno está abaixo dos **75% de frequência mínima exigida** pelas ETECs.

### 3. 🎯 Simulador de Aprovação Completo (Módulo Aluno C)
* Integra a análise de notas e frequência simultaneamente.
* Determina o status final do aluno (Aprovado, Retido por Falta, Retido por Nota ou em Recuperação).
* Oferece uma interface unificada e simplificada em formato de Dashboard para monitoramento.

---

## 🛠️ Tecnologias Utilizadas

### **Backend (`/api`)**
* **Node.js** com sintaxe moderna de módulos ES (`import`/`export`).
* **Express.js** para estruturação dos endpoints da API RESTful.
* **CORS** habilitado para integração segura com o frontend.
* **Jest** & **Supertest** para testes de integração e unitários automatizados dos controladores.

### **Frontend (`/web`)**
* **React 19** para construção de uma interface de usuário rica, dinâmica e componente-orientada.
* **Vite** como ferramenta de build ultrarrápida.
* **Lucide React** para um conjunto de ícones modernos e elegantes.
* **Vanilla CSS** para estilização personalizada, responsiva e com efeitos visuais premium (glassmorphism e transições suaves).

---

## 📂 Estrutura do Projeto

O repositório está organizado no formato mono-repo:
```bash
Calculo_Etec/
├── api/             # Servidor Backend (Express) e Regras de Negócio
│   ├── controllers/ # Lógica de cálculo (média, frequência, aprovação)
│   ├── routes/      # Definição das rotas da API REST
│   └── tests/       # Testes automatizados (Jest)
├── web/             # Aplicação SPA Frontend (React + Vite)
│   ├── src/
│   │   ├── components/ # Componentes da UI (Dashboard, Tabelas, Formulários)
│   │   └── assets/     # Recursos estáticos (imagens, svgs)
│   └── index.html
└── README.md        # Documentação principal
```

---

## 🏃 Como Rodar a Aplicação Localmente

Siga o passo a passo abaixo para rodar ambos os serviços (API e Web App) em sua máquina:

### **Pré-requisitos**
* Ter o **Node.js** (versão 18 ou superior recomendada) e o **npm** instalados.

---

### **1. Executando o Servidor API (Backend)**

1. Abra um terminal e navegue até a pasta `api/`:
   ```bash
   cd api
   ```
2. Instale todas as dependências necessárias:
   ```bash
   npm install
   ```
3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   * *O servidor iniciará com sucesso na porta **3001** (`http://localhost:3001`).*

---

### **2. Executando o Web App (Frontend)**

1. Abra um **segundo terminal** (mantendo o da API rodando) e navegue até a pasta `web/`:
   ```bash
   cd web
   ```
2. Instale as dependências do frontend:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
   * *O Vite disponibilizará o link no console, geralmente em `http://localhost:5173`.*
4. Abra o endereço no seu navegador e comece a utilizar a plataforma!

---

## 🧪 Como Executar os Testes da API

O projeto contém testes automatizados robustos para garantir que os cálculos matemáticos e de aprovação permaneçam íntegros.

1. No terminal da pasta `api/`, execute:
   ```bash
   npm run test
   ```
2. O Jest processará todos os testes unitários e exibirá o relatório detalhado no console.

---

## 📝 Licença
Desenvolvido como parte do projeto de apoio acadêmico para turmas de ETEC. Sinta-se livre para contribuir! 🚀