# MS Móveis Sob Medida

Projeto completo da **MS Móveis Sob Medida**, marcenaria especializada em
móveis planejados em Gaspar/SC, atendendo Blumenau, Brusque e o Vale do
Itajaí. O repositório contém dois produtos no mesmo app Next.js:

1. **Site institucional** (`/`, `/servicos`, `/servicos/[slug]`, `/contato`)
   — páginas públicas geradas estaticamente (SSG), com SEO, formulário de
   contato e captação de orçamentos.
2. **Painel administrativo / ERP interno** (`/admin`) — login, Orçamentos,
   Financeiro (contas a pagar/receber), caixa de e-mail integrada, RH
   (colaboradores, férias, afastamentos, ponto) e geração de Contratos em
   PDF a partir de orçamentos aprovados. Inclui também um kiosk público de
   ponto (`/ponto`), instalável como PWA, para os colaboradores baterem
   ponto por CPF+PIN.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion (animações)
- Prisma + PostgreSQL (dados do painel admin)
- Auth.js v5 (login do painel, credentials + JWT)
- `imapflow` / `nodemailer` / `mailparser` (caixa de e-mail integrada)
- `@react-pdf/renderer` (geração de PDF dos contratos)
- Lucide Icons

## Como rodar o projeto

Pré-requisitos: Node.js 18.18+ (recomendado 20+), npm e um PostgreSQL
acessível (local ou remoto) se for mexer no painel admin.

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL, AUTH_SECRET etc. — ver abaixo
npx prisma generate
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para o site público e
[http://localhost:3000/admin](http://localhost:3000/admin) para o painel
(precisa de um usuário criado com `scripts/create-admin.ts`, veja abaixo).

Outros comandos:

```bash
npm run build   # build de produção
npm run start   # sobe o build de produção localmente
npm run lint    # checagem de lint
```

> Só o site público (`/`, `/servicos`, `/contato`) é 100% estático e
> funciona sem banco de dados. O painel `/admin` e o kiosk `/ponto`
> precisam de `DATABASE_URL` configurado e das migrations do Prisma
> aplicadas.

## Variáveis de ambiente

Copie [`.env.example`](./.env.example) para `.env` e preencha:

| Variável | Para que serve |
|---|---|
| `DATABASE_URL` | conexão com o PostgreSQL do painel admin |
| `AUTH_SECRET` / `AUTH_URL` | sessão do login (`openssl rand -base64 32` para gerar o secret) |
| `IMAP_*` / `SMTP_*` | caixa `comercial@msmoveissobmedida.com.br` (Hostinger) usada no módulo de E-mail |
| `COMPANY_*` | dados fixos da contratada (CNPJ, endereço, representante legal) usados na geração do PDF de Contrato — enquanto vazios, o PDF mostra `[DADO NÃO CONFIGURADO]` no lugar |

Nunca commite o `.env` de verdade. Em produção (VPS), essas variáveis são
preenchidas diretamente no servidor — ver [`DEPLOY.md`](./DEPLOY.md).

## Criando o primeiro usuário do painel

Com o banco já migrado (`npx prisma migrate deploy`), rode:

```bash
npx tsx scripts/create-admin.ts
```

O script pede nome, e-mail e senha interativamente e cria o usuário com
papel `ADMIN`.

## Estrutura do projeto

```
app/
  layout.tsx                 # layout raiz do site: fontes, metadata, JSON-LD
  page.tsx                   # Home
  servicos/                  # índice de serviços + página dinâmica por slug
  contato/                   # página de contato (formulário + mapa)
  sitemap.ts / robots.ts     # SEO gerado automaticamente
  icon-192/, icon-512/       # ícones do PWA (gerados a partir de public/logo.jpg)
  ponto/                     # kiosk público de ponto (PWA, CPF+PIN)
  admin/
    login/                   # tela de login do painel
    (protected)/             # rotas autenticadas: orcamentos, financeiro,
                              # email, rh, usuarios
  api/                       # Route Handlers: auth, orcamentos, contas-pagar,
                              # contas-receber, email, rh, ponto, contratos
components/
  sections/                  # seções da Home (Hero, About, Stats, Services, ...)
  admin/                     # componentes do painel (badges, forms, tabelas)
  *.tsx                      # componentes públicos reutilizáveis
lib/
  data.ts                    # conteúdo editável do site público (textos,
                              # serviços, depoimentos, portfólio, FAQ, contato)
  company.ts                 # dados fixos da contratada (lidos do .env)
  mail.ts                    # cliente IMAP/SMTP do módulo de e-mail
  pdf/                       # template do PDF de contrato (@react-pdf/renderer)
prisma/
  schema.prisma              # modelos: User, Orcamento, ContaPagar,
                              # ContaReceber, Colaborador, Ferias, Afastamento,
                              # Ponto, Contrato
scripts/
  create-admin.ts            # cria o primeiro usuário ADMIN do painel
```

## Como personalizar o site público

A maior parte do conteúdo fica centralizada em
[`lib/data.ts`](./lib/data.ts). Para trocar textos, telefone, endereço,
serviços, depoimentos, portfólio ou FAQ, edite apenas esse arquivo — os
componentes já consomem esses dados automaticamente.

### Dados de contato e endereço

Edite o objeto `company` em `lib/data.ts`:

- `phone` / `whatsapp`: use `raw` no formato `55DDNÚMERO` (sem símbolos) para
  os links `tel:` e `wa.me`, e `display` para o texto formatado.
- `address`: endereço completo exibido no rodapé e na página de contato.
- `mapEmbedSrc`: URL do Google Maps embed (ajuste a busca ou substitua por um
  link gerado no [Google Maps](https://www.google.com/maps) > Compartilhar >
  Incorporar mapa).
- `hours`: horário de atendimento exibido no rodapé e na página de contato.
- `social`: links de Instagram e Facebook (usados no rodapé, na página de
  contato e na seção "Instagram" da Home).

### Serviços

Edite o array `services` em `lib/data.ts`. Cada item gera automaticamente um
card na Home e uma página dedicada em `/servicos/[slug]`, com portfólio
filtrado pela `portfolioCategory` correspondente.

### Depoimentos, portfólio e FAQ

Edite os arrays `testimonials`, `portfolio` e `faqs` em `lib/data.ts`. As
imagens do portfólio e dos serviços usam URLs do Unsplash como placeholder —
substitua pelas fotos reais dos projetos assim que disponíveis (mesma
proporção recomendada: 4:3). Cada item de `portfolio` precisa de uma
`category` que bata com a `portfolioCategory` de algum serviço para aparecer
na página dedicada dele.

### Instagram feed

A seção "Instagram" na Home (`components/sections/InstagramFeed.tsx`) hoje
usa fotos do portfólio como placeholder e só linka para o perfil. Para
puxar posts reais automaticamente, configure a Instagram Graph API (conta
comercial vinculada a uma Página do Facebook) e troque o `placeholderPosts`
pela chamada à API — há um comentário `TODO` no arquivo marcando o ponto
exato da troca.

### Newsletter

O formulário em `components/sections/Newsletter.tsx` hoje só confirma o
cadastro na tela (`TODO` no arquivo) — não envia para nenhum provedor.
Para ativar de verdade, integre com um provedor de e-mail marketing
(Mailchimp, Brevo, etc.) no `handleSubmit`.

### Cores e tipografia

A paleta (madeira, cinza-escuro/charcoal e verde-musgo) está definida em
[`app/globals.css`](./app/globals.css), no bloco `@theme`. As fontes (Inter e
Poppins) são carregadas via `next/font` em `app/layout.tsx`.

### Número de WhatsApp

O número usado nos botões flutuantes, CTAs e no envio do formulário de
contato é `company.whatsapp.raw` em `lib/data.ts`. Substitua pelo número real
da empresa antes de publicar.

### Logo

A logo usada no `Navbar`, no rodapé e nos ícones do PWA é
`public/logo.jpg`. Substitua o arquivo (mantendo o nome) para trocar a
logo em todos os lugares de uma vez.

### Domínio

Antes de publicar, atualize a constante `siteUrl` em `app/layout.tsx`,
`app/sitemap.ts` e `app/robots.ts` para o domínio real do site.

## Formulário de contato

O formulário (`components/ContactForm.tsx`) valida nome, telefone, e-mail e
mensagem no cliente (em tempo real, ao sair de cada campo) e, ao enviar,
monta uma mensagem formatada e abre o WhatsApp (`wa.me`) com os dados
preenchidos. Em paralelo, registra o lead como um `Orcamento` no painel
admin (best-effort — se o registro falhar, o fluxo de WhatsApp do cliente
não é afetado).

## Painel administrativo

Acesso em `/admin`, protegido por login (Auth.js). Módulos:

- **Orçamentos** — leads do site público e cadastrados manualmente, com
  status (Pendente, Aprovado, Recusado).
  Ao aprovar um orçamento é possível gerar Contas a Receber e um Contrato.
- **Financeiro** — Contas a Pagar e Contas a Receber, com parcelamento e
  status calculado (inclui "Atrasado", derivado da data de vencimento).
- **E-mail** — caixa `comercial@msmoveissobmedida.com.br` integrada via
  IMAP/SMTP (Hostinger): leitura de Entrada/Enviados com anexos, envio e
  resposta direto do painel.
- **RH** — Colaboradores, Férias, Afastamentos e Ponto/Presença. O
  colaborador registra o próprio ponto pelo kiosk público `/ponto`
  (CPF + PIN, instalável como PWA no celular/tablet da recepção); o admin
  acompanha o log e pode fazer lançamentos manuais.
- **Contratos** — a partir de um orçamento aprovado, formulário
  pré-preenchido com os dados do orçamento gera um Contrato (com split
  30/40/30 de sinal/fabricação/entrega, editável) e um PDF pronto para
  download. O status (Rascunho/Gerado/Assinado) é atualizado manualmente
  pelo admin depois que o cliente assina.

Usuários do painel são criados via `scripts/create-admin.ts` (ver acima) ou,
já logado como `ADMIN`, pela tela de Usuários.

## SEO

- Metadados completos (title, description, Open Graph, Twitter Card) em cada
  página pública, incluindo metadata dinâmica por serviço em
  `/servicos/[slug]`.
- Dados estruturados `JSON-LD`: `HomeAndConstructionBusiness` em
  `app/layout.tsx` e `FAQPage` em `components/FAQ.tsx`.
- `sitemap.xml` (inclui as páginas de serviço dinamicamente) e `robots.txt`
  gerados automaticamente pelo App Router — `/admin` e `/ponto` ficam fora
  do sitemap e desindexados.
- Palavras-chave locais trabalhadas no conteúdo: "móveis planejados Gaspar",
  "móveis sob medida Vale do Itajaí", "marcenaria Gaspar SC".

## Deploy

O projeto está publicado em VPS própria (Oracle Cloud + Nginx + PM2 +
PostgreSQL, domínio na Hostinger). Passo a passo completo — incluindo banco
de dados, variáveis de ambiente e deploys futuros — em
[`DEPLOY.md`](./DEPLOY.md).
