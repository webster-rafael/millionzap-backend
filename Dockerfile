# Etapa 1: Build
FROM node:18 AS build

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos necessários primeiro (cache de dependências)
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Instalar dependências
RUN npm ci

# Compilar para JavaScript
RUN npm run build

# Etapa 2: Produção
FROM node:18 AS production

WORKDIR /app

# Copiar apenas package.json e package-lock.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar arquivos compilados da etapa anterior
COPY --from=build /app/dist ./dist

# Porta que o app vai expor
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/server.js"]
