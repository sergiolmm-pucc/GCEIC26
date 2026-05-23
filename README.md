# AguaCalc — Calculadora de Consumo de Água

Projeto da disciplina **GCEIC26 — Gerência de Configuração, Entrega e Integração Contínua**  
Escola Politécnica PUCCAMP — 1º Semestre 2026

## Tema
Cálculo de consumo de água residencial: consumo diário/mensal em litros e m³, com estimativa do valor da conta de acordo com faixas de tarifação.

---

## Estrutura do projeto

```
.
├── api/                    # Backend Node.js + Express
│   ├── src/
│   │   ├── app.js          # Express + rotas
│   │   └── funcoes.js      # Lógica de cálculo
│   ├── tests/
│   │   ├── api.test.js     # Testes de integração (supertest)
│   │   └── funcoes.test.js # Testes unitários
│   ├── index.js
│   └── package.json
├── app/                    # Frontend Node.js + EJS
│   ├── views/
│   │   ├── splash.ejs      # Tela inicial
│   │   ├── login.ejs       # Tela de login
│   │   ├── calculo.ejs     # Tela principal
│   │   ├── sobre.ejs       # Sobre a equipe
│   │   └── help.ejs        # Ajuda
│   ├── index.js
│   └── package.json
├── e2e-tests/
│   ├── tests/base.test.js  # Testes funcionais Selenium
│   └── package.json
└── .github/workflows/deploy.yml
```

---

## Como rodar localmente

### API
```bash
cd api
npm install
npm start          # roda na porta 3001
npm run test       # roda os testes unitários
```

### App
```bash
cd app
npm install
API_URL=http://localhost:3001 npm start   # roda na porta 3000
```

Acesse: http://localhost:3000  
Login: **admin / admin**

---

## Endpoints da API

| Método | Rota           | Descrição                        |
|--------|----------------|----------------------------------|
| GET    | /health        | Status da API                    |
| GET    | /api/tabelas   | Faixas de tarifação e constantes |
| POST   | /api/calcular  | Calcula consumo e valor da conta |

### Exemplo POST /api/calcular
```json
{
  "pessoas": 4,
  "litrosPorPessoa": 150,
  "dias": 30
}
```

### Resposta
```json
{
  "success": true,
  "data": {
    "pessoas": 4,
    "litrosDia": 600,
    "litrosMes": 18000,
    "m3Mes": 18,
    "tarifaM3": 12.50,
    "valorBase": 225.00,
    "margemSeguranca": 67.50,
    "valorTotal": 292.50
  }
}
```

---

## Equipe
- Aluno Hugo Daniel Bosada Rodrigues — API & Backend
- Aluno Letícia Lima da Silva — Frontend & App
- Aluno Ana Júlia Matozo Rodrigues — Testes & CI/CD