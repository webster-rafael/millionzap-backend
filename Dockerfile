FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm ci

RUN npx prisma generate


RUN npm run build

FROM node:18 AS production

WORKDIR /app

# Copiar apenas package.json e package-lock.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --omit=dev

# Copiar os arquivos compilados e o Prisma Client
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

# Expor a porta que o app usa
EXPOSE 3000

# Rodar o servidor
CMD ["node", "dist/server.js"]
