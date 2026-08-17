#!/usr/bin/env bash
# Roda na VPS, dentro da pasta do projeto (/var/www/ms-moveis-sob-medida),
# para publicar uma atualização: git pull + build + restart do PM2.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Atualizando código (git pull)"
git pull

echo "==> Instalando dependências"
npm ci

echo "==> Aplicando migrations do banco de dados"
npx prisma migrate deploy

echo "==> Gerando Prisma Client"
npx prisma generate

echo "==> Limpando cache de otimização de imagens"
# Sem isso, trocar um arquivo estático (ex: public/logo.jpg) mantendo o
# mesmo nome não atualiza o que é servido em /_next/image — o Next.js
# cacheia a versão otimizada em disco por URL, sem detectar que o
# arquivo de origem mudou.
rm -rf .next/cache/images

echo "==> Build de produção"
npm run build

echo "==> Reiniciando processo no PM2"
pm2 restart ms-moveis-sob-medida

echo "==> Deploy concluído"
pm2 status ms-moveis-sob-medida
