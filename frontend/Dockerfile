# Etapa 1: build do React
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências apenas para build
COPY package*.json ./
RUN npm ci

# Copia o restante do projeto
COPY . .

# Argumentos para build
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_HOURS_CLOSE_TICKETS_AUTO

# Verificações
RUN if [ -z "$REACT_APP_BACKEND_URL" ]; then \
      echo "❌ ERRO: REACT_APP_BACKEND_URL não foi definido!"; exit 1; fi

# Define variáveis de ambiente para build do React
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_HOURS_CLOSE_TICKETS_AUTO=$REACT_APP_HOURS_CLOSE_TICKETS_AUTO

RUN echo "🚧 Buildando com: $REACT_APP_BACKEND_URL"
RUN npm run build

# Etapa 2: runner minimalista com apenas o build e server
FROM node:20-alpine AS runner

WORKDIR /app

# Copia apenas os arquivos essenciais
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Instala apenas runtime deps (como serve, se necessário)
RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "./server.js"]