## App MKP — React

Cria o diretório `api` e `app` no diretório raiz.

No diretório `app` via terminal:
```
npm init -y
```

Instala o Vite + React:
```
npm install react react-dom react-router-dom
npm install -D vite @vitejs/plugin-react
```

Para rodar em desenvolvimento:
```
npm run dev
```

Para buildar:
```
npm run build
```

Para servir o build (produção local):
```
npm start
```

### Variáveis de ambiente

Crie um arquivo `.env` baseado em `.env.example`:
```
VITE_API_URL=http://localhost:3001
```

### Login
- Usuário: `admin`
- Senha: `admin`
