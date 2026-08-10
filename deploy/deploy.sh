#!/usr/bin/env bash
# Roda na VPS, dentro da pasta do projeto (/var/www/ms-moveis-sob-medida),
# para publicar uma atualização: git pull + build + restart do PM2.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Atualizando código (git pull)"
git pull

echo "==> Instalando dependências"
npm ci

echo "==> Build de produção"
npm run build

echo "==> Reiniciando processo no PM2"
pm2 restart ms-moveis-sob-medida

echo "==> Deploy concluído"
pm2 status ms-moveis-sob-medida
