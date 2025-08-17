FROM node:20-alpine AS build

COPY package*.json ./

COPY tsconfig*.json ./

COPY prisma ./prisma

COPY src ./src

RUN npm ci

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine AS production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /dist ./dist

COPY --from=build /prisma ./prisma

COPY --from=build /node_modules/.prisma ./node_modules/.prisma

COPY --from=build /node_modules/@prisma ./node_modules/@prisma

EXPOSE 3300

CMD npx prisma migrate deploy && node dist/server.js