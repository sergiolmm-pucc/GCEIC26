# GCEIC26 - Cálculo de Impostos de Notas Fiscais

Repositório do trabalho final do grupo 18 para a disciplina **GCEIC26**. A aplicação consiste em um sistema completo de cálculo de impostos (ICMS, IPI e PIS/COFINS) para Notas Fiscais, contendo um backend robusto em Node.js com Fastify e um frontend moderno construído com Next.js.

---

## 🚀 Links da Aplicação (Deploy)

As aplicações estão hospedadas nos seguintes ambientes:

*   **💻 Frontend (Interface Web):** [https://main.d3nlgmw6nojw2c.amplifyapp.com/](https://main.d3nlgmw6nojw2c.amplifyapp.com/)
*   **⚙️ Backend (Docs do Swagger):** [https://d36mf6v2e37tzy.cloudfront.net/docs](https://d36mf6v2e37tzy.cloudfront.net/docs)

---

## 🛠️ Endpoints da API (Backend)

Abaixo estão listados os endpoints da API para consulta e simulação dos cálculos de impostos:

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | [`/health`](https://d36mf6v2e37tzy.cloudfront.net/health) | Verifica o status da aplicação (Health Check) |
| `POST` | `/impostos/ipi` | Realiza o cálculo do imposto **IPI** |
| `POST` | `/impostos/pis-cofins` | Realiza o cálculo do imposto **PIS/COFINS** |
| `POST` | `/impostos/icms` | Realiza o cálculo do imposto **ICMS** |
| `POST` | `/impostos/nf-completa` | Realiza o cálculo integrado de todos os impostos (**Nota Fiscal Completa**) |

> [!TIP]
> Você pode testar e simular as requisições para cada um dos endpoints diretamente pela interface do Swagger no link de produção do Backend.

---

## 💻 Como Rodar o Projeto Localmente

Siga as instruções abaixo para executar os serviços em sua máquina local. 

### Pré-requisitos
Certifique-se de possuir o **Node.js** (versão 20 ou superior) instalado em sua máquina. Opcionalmente, recomendamos o gerenciador de pacotes **pnpm** para a instalação ideal das dependências.

---

### ⚙️ Executando o Backend (`api/`)

A API foi desenvolvida em Node.js com Fastify e TypeScript.

1. Navegue até o diretório do backend:
   ```bash
   cd api
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Configure o arquivo `.env` com as variáveis necessárias.

4. Inicie o servidor em modo de desenvolvimento (com recarregamento automático):
   ```bash
   pnpm dev
   ```

5. O backend estará disponível por padrão em: `http://localhost:3333`
   * Acesse a documentação do Swagger local em: `http://localhost:3333/docs`

6. Para rodar a suíte de testes unitários e de integração:
   ```bash
   pnpm run test
   ```

---

### 💻 Executando o Frontend (`app/`)

A interface foi desenvolvida com React e Next.js utilizando TypeScript.

1. Navegue até o diretório do frontend:
   ```bash
   cd app
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```

4. O frontend estará disponível em: `http://localhost:3000`

---

## 👥 Equipe e Atribuições

*   **João Gabriel (JG):** Backend, DevOps (CI/CD, AWS) e Configuração Inicial.
*   **Pedro Daou (PD):** Backend (ICMS, IPI) e Frontend (telas de ICMS, IPI e Help).
*   **Gabriel Bonatto (GB):** Backend & Frontend (PIS/COFINS, tela "Sobre") e Documentação Técnica.
