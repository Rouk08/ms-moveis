# Deploy — VPS Oracle + domínio Hostinger

Guia passo a passo para publicar o site em `msmoveissobmedida.com.br` numa
VPS Oracle Cloud (Ubuntu), usando **Node.js + PM2 + Nginx** com SSL grátis
via Let's Encrypt.

IP da VPS: `163.176.167.166` · usuário SSH: `oracle`.

---

## 1. Apontar o domínio (Hostinger) para a VPS

No painel da Hostinger, na área de **DNS / Zona DNS** do domínio
`msmoveissobmedida.com.br`, crie/edite estes registros:

| Tipo | Nome | Aponta para      | TTL  |
|------|------|-------------------|------|
| A    | @    | `163.176.167.166` | 3600 |
| A    | www  | `163.176.167.166` | 3600 |

Remova qualquer registro A ou CNAME antigo apontando para o parking page da
Hostinger. A propagação costuma levar de alguns minutos até algumas horas.

Confirme quando propagar:

```bash
nslookup msmoveissobmedida.com.br
nslookup www.msmoveissobmedida.com.br
```

## 2. Liberar as portas na Oracle Cloud (passo que todo mundo esquece)

A Oracle Cloud bloqueia tráfego externo em **duas camadas**: o firewall do
próprio Ubuntu (`ufw`/`iptables`) e a **Security List / Network Security
Group** do painel da Oracle. As duas precisam liberar as portas 80 e 443,
senão o site não abre mesmo com tudo certo na VPS.

No painel da Oracle Cloud:

1. Vá em **Networking → Virtual Cloud Networks** → sua VCN → sua **Subnet**.
2. Abra a **Security List** associada (ou o **Network Security Group**, se a
   instância usar um).
3. Adicione **Ingress Rules**:
   - Source: `0.0.0.0/0`, Protocolo: TCP, Porta destino: `80`
   - Source: `0.0.0.0/0`, Protocolo: TCP, Porta destino: `443`

## 3. Acessar a VPS via SSH

```bash
ssh oracle@163.176.167.166
```

Se a chave privada não estiver no local padrão (`~/.ssh/id_rsa`), aponte
para o arquivo `.pem`/`.key` que a Oracle gerou na criação da instância:

```bash
ssh -i /caminho/para/sua-chave.key oracle@163.176.167.166
```

## 4. Preparar o servidor

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Firewall do próprio Ubuntu
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Node.js 20 LTS (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

node -v   # deve mostrar v20.x
npm -v

# PM2 (gerenciador de processo Node)
sudo npm install -g pm2

# Nginx
sudo apt install -y nginx
sudo systemctl enable nginx

# Git (para clonar/atualizar o projeto)
sudo apt install -y git
```

## 5. Enviar o projeto para a VPS

Duas opções — escolha uma.

### Opção A — Git (recomendado, facilita atualizações futuras)

Suba o projeto para um repositório privado no GitHub/GitLab e, na VPS:

```bash
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www
git clone <URL_DO_SEU_REPOSITORIO> ms-moveis-sob-medida
cd ms-moveis-sob-medida
```

### Opção B — Enviar direto do seu PC (sem repositório)

No **seu computador Windows** (Git Bash), a partir da raiz do projeto:

```bash
rsync -avz --exclude 'node_modules' --exclude '.next' \
  ./ oracle@163.176.167.166:/var/www/ms-moveis-sob-medida/
```

Se não tiver `rsync` disponível, use `scp -r` no lugar (mais lento, mas
funciona igual).

## 6. Instalar dependências e buildar

Na VPS, dentro da pasta do projeto:

```bash
cd /var/www/ms-moveis-sob-medida
npm ci
npm run build
```

## 7. Rodar com PM2

Crie o arquivo `ecosystem.config.js` (já incluso no projeto — veja
[`ecosystem.config.js`](./ecosystem.config.js)) e suba o processo:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # siga a instrução impressa (comando com sudo) para iniciar
              # o PM2 automaticamente no boot da VPS
```

Comandos úteis do dia a dia:

```bash
pm2 status                          # ver se está rodando
pm2 logs ms-moveis-sob-medida       # ver logs em tempo real
pm2 restart ms-moveis-sob-medida    # reiniciar após um novo deploy
```

## 8. Configurar o Nginx como proxy reverso

Copie o arquivo de referência do projeto
[`deploy/nginx.conf`](./deploy/nginx.conf) para o Nginx:

```bash
sudo cp /var/www/ms-moveis-sob-medida/deploy/nginx.conf \
  /etc/nginx/sites-available/msmoveissobmedida.com.br

sudo ln -s /etc/nginx/sites-available/msmoveissobmedida.com.br \
  /etc/nginx/sites-enabled/

# remove o site padrão de exemplo do Nginx, se existir
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t        # testa a configuração
sudo systemctl reload nginx
```

Nesse ponto, `http://msmoveissobmedida.com.br` já deve carregar o site
(sem SSL ainda).

## 9. Ativar HTTPS com Let's Encrypt (Certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx \
  -d msmoveissobmedida.com.br \
  -d www.msmoveissobmedida.com.br
```

O Certbot edita o `nginx.conf` automaticamente para servir com HTTPS e
redirecionar HTTP → HTTPS. O certificado renova sozinho (o pacote já
instala um timer systemd); para conferir:

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run   # simula a renovação
```

## 10. Atualizar o domínio real no código

Antes (ou logo depois) do primeiro deploy, confirme que a constante
`siteUrl` está correta em:

- [`app/layout.tsx`](./app/layout.tsx)
- [`app/sitemap.ts`](./app/sitemap.ts)
- [`app/robots.ts`](./app/robots.ts)

Já está configurada como `https://www.msmoveissobmedida.com.br` — só
revise se o site vai ficar em `www.` ou no domínio raiz como canônico.

## 11. Deploys futuros

Toda vez que atualizar o conteúdo (`lib/data.ts`, textos, etc.) e quiser
publicar de novo:

```bash
cd /var/www/ms-moveis-sob-medida
git pull                 # ou reenvie via rsync (Opção B do passo 5)
npm ci
npm run build
pm2 restart ms-moveis-sob-medida
```

Ou use o script pronto [`deploy/deploy.sh`](./deploy/deploy.sh) (rode
`bash deploy/deploy.sh` na VPS, dentro da pasta do projeto).

---

## Checklist rápido de problemas comuns

- **Site não abre**: confira as Security Lists da Oracle (passo 2) — é o
  motivo mais comum.
- **Erro 502 Bad Gateway no Nginx**: o processo do PM2 não está rodando.
  Rode `pm2 status` e `pm2 logs`.
- **Certbot falha**: confirme que o DNS já propagou (`nslookup`) e que a
  porta 80 está acessível de fora antes de tentar emitir o certificado.
- **Mudou o IP da VPS**: atualize os registros A na Hostinger (passo 1).
