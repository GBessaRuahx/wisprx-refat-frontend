#!/bin/bash

TENANT="$1"
TAG="${2:-latest}"
ENV_FILE="../../wisprx-deploy/tenants/${TENANT}/.env.frontend.${TENANT}"

if [[ -z "$TENANT" ]]; then
  echo "❌ Informe o nome do tenant como argumento."
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Arquivo de env não encontrado: $ENV_FILE"
  exit 1
fi

# Exporta as variáveis do .env
export $(grep -v '^#' "$ENV_FILE" | xargs)

# Build da imagem com os args do .env
docker build \
  --build-arg REACT_APP_BACKEND_URL="$REACT_APP_BACKEND_URL" \
  --build-arg REACT_APP_HOURS_CLOSE_TICKETS_AUTO="$REACT_APP_HOURS_CLOSE_TICKETS_AUTO" \
  -t "gbessaruahx/wisprx-frontend:${TENANT}-${TAG}" .
