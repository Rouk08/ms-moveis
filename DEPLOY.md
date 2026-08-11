# Deploy — VPS Oracle + domínio Hostinger

Guia passo a passo para publicar o site em `msmoveissobmedida.com.br` numa
VPS Oracle Cloud rodando **Oracle Linux 9**, usando **Node.js + PM2 +
Nginx** com SSL grátis via Let's Encrypt.

IP da VPS: `146.235.36.119` · usuário SSH: `opc` · chave privada:
`~/.ssh/ms_moveis_vps_oracle` (Windows: `C:\Users\natal\.ssh\ms_moveis_vps_oracle`).

Oracle Linux é baseado em RHEL: usa `dnf` no lugar de `apt`, `firewalld`
no lugar de `ufw`, e vem com **SELinux** ativado por padrão — os passos
abaixo já levam isso em conta.

---

## 1. Apontar o domínio (Hostinger) para a VPS

No painel da Hostinger, na área de **DNS / Zona DNS** do domínio
`msmoveissobmedida.com.br`, crie/edite estes registros:

| Tipo | Nome | Aponta para      | TTL  |
|------|------|-------------------|------|
| A    | @    | `146.235.36.119` | 3600 |
| A    | www  | `146.235.36.119` | 3600 |

Remova qualquer registro A ou CNAME antigo apontando para o parking page da
Hostinger. A propagação costuma levar de alguns minutos até algumas horas.

Confirme quando propagar:

```bash
nslookup msmoveissobmedida.com.br
nslookup www.msmoveissobmedida.com.br
```

## 2. Liberar as portas na Oracle Cloud (passo que todo mundo esquece)

A Oracle Cloud bloqueia tráfego externo em **duas camadas**: o firewall do
próprio Oracle Linux (`firewalld`) e a **Security List / Network Security
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
ssh -i ~/.ssh/ms_moveis_vps_oracle opc@146.235.36.119
```

## 4. Preparar o servidor

```bash
# Atualizar pacotes
sudo dnf update -y

# Firewall (firewalld) — libera HTTP e HTTPS
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-all      # confirma que 80/tcp e 443/tcp aparecem

# Node.js 20 LTS (via NodeSource, repositório RPM)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

node -v   # deve mostrar v20.x
npm -v

# PM2 (gerenciador de processo Node)
sudo npm install -g pm2

# Nginx
sudo dnf install -y nginx
sudo systemctl enable --now nginx

# Git (para clonar/atualizar o projeto)
sudo dnf install -y git
```

### SELinux — passo específico do Oracle Linux

Por padrão o SELinux bloqueia o Nginx de fazer proxy para outra porta da
própria máquina (o app Next.js na porta 3000). Sem isso você recebe
`502 Bad Gateway` mesmo com tudo certo:

```bash
sudo setsebool -P httpd_can_network_connect 1
```

## 5. Enviar o projeto para a VPS

Duas opções — escolha uma.

### Opção A — Git (recomendado, facilita atualizações futuras)

Suba o projeto para um repositório privado no GitHub/GitLab e, na VPS:

```bash
sudo mkdir -p /var/www
sudo chown opc:opc /var/www
cd /var/www
git clone <URL_DO_SEU_REPOSITORIO> ms-moveis-sob-medida
cd ms-moveis-sob-medida
```

### Opção B — Enviar direto do seu PC (sem repositório)

No **seu computador Windows** (Git Bash), a partir da raiz do projeto:

```bash
rsync -avz -e "ssh -i ~/.ssh/ms_moveis_vps_oracle" \
  --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ opc@146.235.36.119:/var/www/ms-moveis-sob-medida/
```

Na primeira vez, crie a pasta de destino antes (via SSH):

```bash
ssh -i ~/.ssh/ms_moveis_vps_oracle opc@146.235.36.119 \
  "sudo mkdir -p /var/www/ms-moveis-sob-medida && sudo chown opc:opc /var/www/ms-moveis-sob-medida"
```

Se não tiver `rsync` disponível, use `scp -i ~/.ssh/ms_moveis_vps_oracle -r`
no lugar (mais lento, mas funciona igual).

## 6. Banco de dados e variáveis de ambiente

O site público (`/`, `/servicos`, `/contato`) é estático e não precisa de
banco. Mas o **painel admin** (`/admin`) e o **kiosk de ponto** (`/ponto`)
usam PostgreSQL via Prisma — sem isso o build até funciona, mas o app não
sobe em runtime.

### PostgreSQL

```bash
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql

sudo -u postgres psql -c "CREATE USER ms_moveis WITH PASSWORD 'ESCOLHA_UMA_SENHA_FORTE';"
sudo -u postgres psql -c "CREATE DATABASE ms_moveis_erp OWNER ms_moveis;"
```

Por padrão o PostgreSQL do Oracle Linux só aceita conexão local (`peer`/
`localhost`), o que é o suficiente aqui já que o app roda na mesma VPS.

### Arquivo `.env`

Na pasta do projeto, crie o `.env` (nunca commitado no git) com as
variáveis reais — copie a estrutura de
[`.env.example`](./.env.example) e preencha:

```bash
cd /var/www/ms-moveis-sob-medida
cp .env.example .env
nano .env   # ou: crie o arquivo com um heredoc, se preferir evitar o nano
```

Variáveis a preencher:

- `DATABASE_URL` — `postgresql://ms_moveis:SENHA@localhost:5432/ms_moveis_erp?schema=public`
- `AUTH_SECRET` — gere com `openssl rand -base64 32`
- `AUTH_URL` — `https://www.msmoveissobmedida.com.br` em produção
- `IMAP_*` / `SMTP_*` — credenciais da caixa `comercial@msmoveissobmedida.com.br`
  (hPanel da Hostinger > Emails > Mailboxes > Connect apps & devices)
- `COMPANY_*` — dados fixos da contratada usados no PDF de Contrato (CNPJ,
  endereço, representante legal); pode deixar em branco por enquanto, o
  PDF mostra `[DADO NÃO CONFIGURADO]` no lugar até serem preenchidos

**Nunca peça para uma IA preencher ou digitar essas senhas/segredos por
você** — edite o `.env` você mesmo via SSH.

### Migrations do Prisma

```bash
npx prisma migrate deploy
npx prisma generate
```

### Primeiro usuário do painel

```bash
npx tsx scripts/create-admin.ts
```

Responda nome, e-mail e senha quando o script pedir.

## 7. Instalar dependências e buildar

Na VPS, dentro da pasta do projeto:

```bash
cd /var/www/ms-moveis-sob-medida
npm ci
npm run build
```

## 8. Rodar com PM2

O arquivo `ecosystem.config.js` já está incluso no projeto — veja
[`ecosystem.config.js`](./ecosystem.config.js). Suba o processo:

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

## 9. Configurar o Nginx como proxy reverso

O Oracle Linux não usa a estrutura `sites-available`/`sites-enabled` do
Ubuntu — os arquivos de servidor vão direto em `/etc/nginx/conf.d/`.

Copie o arquivo de referência do projeto
[`deploy/nginx.conf`](./deploy/nginx.conf):

```bash
sudo cp /var/www/ms-moveis-sob-medida/deploy/nginx.conf \
  /etc/nginx/conf.d/msmoveissobmedida.com.br.conf

sudo nginx -t        # testa a configuração
sudo systemctl reload nginx
```

Nesse ponto, `http://msmoveissobmedida.com.br` já deve carregar o site
(sem SSL ainda). Se dermos de cara com `502 Bad Gateway`, confira o passo
do SELinux acima e se o PM2 está rodando (`pm2 status`).

## 10. Ativar HTTPS com Let's Encrypt (Certbot)

No Oracle Linux 9 o Certbot vem pelo repositório EPEL da própria Oracle:

```bash
sudo dnf install -y oracle-epel-release-el9
sudo dnf install -y certbot python3-certbot-nginx

sudo certbot --nginx \
  -d msmoveissobmedida.com.br \
  -d www.msmoveissobmedida.com.br
```

O Certbot edita o `nginx.conf` automaticamente para servir com HTTPS e
redirecionar HTTP → HTTPS. O certificado renova sozinho (o pacote já
instala um timer systemd); para conferir:

```bash
sudo systemctl status certbot-renew.timer
sudo certbot renew --dry-run   # simula a renovação
```

## 11. Atualizar o domínio real no código

Antes (ou logo depois) do primeiro deploy, confirme que a constante
`siteUrl` está correta em:

- [`app/layout.tsx`](./app/layout.tsx)
- [`app/sitemap.ts`](./app/sitemap.ts)
- [`app/robots.ts`](./app/robots.ts)

Já está configurada como `https://www.msmoveissobmedida.com.br` — só
revise se o site vai ficar em `www.` ou no domínio raiz como canônico.

## 12. Deploys futuros

Toda vez que atualizar o conteúdo (`lib/data.ts`, textos, etc.), o schema do
banco ou qualquer outro código e quiser publicar de novo:

```bash
cd /var/www/ms-moveis-sob-medida
git pull                 # ou reenvie via rsync (Opção B do passo 5)
npm ci
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 restart ms-moveis-sob-medida
```

Ou use o script pronto [`deploy/deploy.sh`](./deploy/deploy.sh), que faz
exatamente esses passos — rode `bash deploy/deploy.sh` na VPS, dentro da
pasta do projeto.

---

## Checklist rápido de problemas comuns

- **Site não abre**: confira as Security Lists da Oracle (passo 2) — é o
  motivo mais comum.
- **Erro 502 Bad Gateway no Nginx**: pode ser (a) o processo do PM2 não
  está rodando (`pm2 status`, `pm2 logs`) ou (b) o SELinux bloqueando o
  proxy — rode `sudo setsebool -P httpd_can_network_connect 1`.
- **Certbot falha**: confirme que o DNS já propagou (`nslookup`) e que a
  porta 80 está acessível de fora antes de tentar emitir o certificado.
- **Mudou o IP da VPS**: atualize os registros A na Hostinger (passo 1).
- **`Permission denied (publickey)` no SSH**: confirme o usuário (`opc`,
  não `ubuntu`, para Oracle Linux) e o caminho da chave com `-i`.
- **App sobe mas `/admin` dá erro 500 / painel não abre**: confira se o
  `.env` existe e está preenchido (passo 6) e se as migrations rodaram
  (`npx prisma migrate deploy`).
