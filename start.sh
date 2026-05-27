#!/bin/bash

# Script de inicializacao rapida para o projeto GCEIC26 (API + App)

# Cores para o terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sem cor

echo -e "${BLUE}==================================================${NC}"
echo -e "${GREEN}      HourlyCost - Inicializacao Rapida           ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Funcao para parar os processos em background ao sair (Ctrl+C)
cleanup() {
  echo -e "\n${YELLOW}Parando os servicos...${NC}"
  if [ ! -z "$API_PID" ]; then
    kill $API_PID 2>/dev/null
    echo -e "${GREEN}API (PID $API_PID) finalizada.${NC}"
  fi
  exit 0
}

# Associa o sinal SIGINT (Ctrl+C) e SIGTERM a funcao de limpeza
trap cleanup SIGINT SIGTERM

# 1. Verificar e instalar dependencias da API
echo -e "${YELLOW}Verificando dependencias do Backend (API)...${NC}"
if [ ! -d "api/node_modules" ]; then
  echo -e "${BLUE}Instalando dependencias na pasta /api...${NC}"
  cd api && npm install && cd ..
else
  echo -e "${GREEN}Dependencias do Backend ja instaladas.${NC}"
fi

# 2. Verificar e instalar dependencias do App
echo -e "${YELLOW}Verificando dependencias do Frontend (App)...${NC}"
if [ ! -d "app/node_modules" ]; then
  echo -e "${BLUE}Instalando dependencias na pasta /app...${NC}"
  cd app && npm install && cd ..
else
  echo -e "${GREEN}Dependencias do Frontend ja instaladas.${NC}"
fi

# 3. Iniciar a API em background
echo -e "${YELLOW}Iniciando a API (Backend) na porta 3001...${NC}"
cd api
npm start > /dev/null 2>&1 &
API_PID=$!
cd ..

# Aguarda a API responder saudavel
echo -e "${YELLOW}Aguardando a API inicializar...${NC}"
for i in {1..10}; do
  if curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}API esta online e saudavel! (PID: $API_PID)${NC}"
    break
  fi
  if [ $i -eq 10 ]; then
    echo -e "${RED}Erro: A API demorou muito para responder. Verifique os logs.${NC}"
    kill $API_PID 2>/dev/null
    exit 1
  fi
  sleep 1
done

# 4. Iniciar o App Frontend em desenvolvimento
echo -e "${GREEN}Iniciando o Frontend (App)...${NC}"
echo -e "${BLUE}Pressione Ctrl+C para encerrar ambos os servicos simultaneamente.${NC}"
echo -e "${BLUE}--------------------------------------------------${NC}"

cd app
npm run dev
