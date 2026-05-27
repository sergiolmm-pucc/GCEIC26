# GCEIC26
Repositorio do trabalho final
# Simulador de Imposto de Renda Progressivo

> Projeto desenvolvido para a disciplina de Gerência de Configuração, Entrega e Integração Contínua — Escola Politécnica, 1º Semestre de 2026.

## Equipe G02

| Nome | Responsabilidade |
|------|-----------------|
| Caio Peccinato | Frontend (React) |
| João Pedro Zangerolamo de Freitas | Frontend (React) |
| Vinicius Davi Zorzetto de Matos | Backend (Node.js / API) |

## Sobre o Projeto

Sistema web que simula o cálculo do Imposto de Renda com base em faixas progressivas de tributação. O usuário informa o salário bruto e o sistema retorna o imposto retido, o salário líquido e o detalhamento por faixa.

## Regras de Cálculo

| Faixa Salarial | Alíquota |
|----------------|----------|
| Até R$ 2.500,00 | Isento |
| R$ 2.500,00 até R$ 5.000,00 | 7,5% |
| Acima de R$ 5.000,00 | 15% |

**Exemplo:** Salário de R$ 6.000,00
- Faixa isenta: R$ 0,00
- Faixa 7,5% sobre R$ 2.500,00 = R$ 187,50
- Faixa 15% sobre R$ 1.000,00 = R$ 150,00
- **Imposto total: R$ 337,50 | Líquido: R$ 5.662,50**

## Tecnologias

- **Frontend:** React, JavaScript, CSS
- **Backend:** Node.js, Express
- **Testes:** Jest, Supertest
- **CI/CD:** GitHub Actions

## Estrutura do Projeto

```
GCEIC26/ (branch G02)
├── api/                        ← Backend Node.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── tests/
│   ├── app.js
│   └── server.js
├── app/                        ← Frontend React
│   └── src/
│       ├── pages/
│       ├── components/
│       └── services/
├── .github/
│   └── workflows/
│       └── ci.yml              ← Pipeline CI/CD
├── CRONOGRAMA.md
└── README.md
```

## Como Executar Localmente

### Backend (API)
```bash
cd api
npm install
npm start
# Disponível em http://localhost:3001
```

### Frontend
```bash
cd app
npm install
npm start
# Disponível em http://localhost:3000
```

### Testes Unitários
```bash
cd api
npm test
```

## 🔗 Endpoint da API

**POST** `/IRP/calcular`

```json
// Entrada
{ "salario": 6000 }

// Resposta
{
  "salario": 6000,
  "imposto": 337.5,
  "liquido": 5662.5,
  "detalhamento": [...]
}
```

## Entregas

| Data | Entrega | Peso |
|------|---------|------|
| 21/05/2026 | Parcial — API, app React, testes unitários | 30% |
| 28/05/2026 | Testes funcionais + apresentação do site | 40% |
