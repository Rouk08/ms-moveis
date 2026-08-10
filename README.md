# MS Móveis Sob Medida — Site Institucional

Site institucional estático (SSG) para a **MS Móveis Sob Medida**, marcenaria
especializada em móveis planejados em Gaspar/SC, atendendo Blumenau, Brusque
e o Vale do Itajaí.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, SSG)
- TypeScript
- Tailwind CSS v4
- Framer Motion (animações de entrada e scroll)
- Lucide Icons

## Como rodar o projeto

Pré-requisitos: Node.js 18.18+ (recomendado 20+) e npm.

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Outros comandos:

```bash
npm run build   # build de produção (gera páginas estáticas)
npm run start   # sobe o build de produção localmente
npm run lint    # checagem de lint
```

## Estrutura do projeto

```
app/
  layout.tsx          # layout raiz: fontes, metadata, JSON-LD, Navbar/Footer
  page.tsx             # Home (compõe as seções)
  servicos/page.tsx    # Página de serviços detalhada
  contato/page.tsx      # Página de contato (formulário + mapa)
  sitemap.ts           # sitemap.xml gerado automaticamente
  robots.ts            # robots.txt gerado automaticamente
  icon.tsx             # favicon gerado dinamicamente
components/
  sections/            # Seções da Home (Hero, About, Services, Gallery, ...)
  *.tsx                # Componentes reutilizáveis (Navbar, Footer, cards, etc.)
lib/
  data.ts              # TODOS os dados editáveis do site (textos, serviços,
                        # depoimentos, portfólio, contato)
```

## Como personalizar

A maior parte do conteúdo do site fica centralizada em
[`lib/data.ts`](./lib/data.ts). Para trocar textos, telefone, endereço,
serviços, depoimentos ou itens do portfólio, edite apenas esse arquivo — os
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
- `social`: links de Instagram e Facebook.

### Serviços

Edite o array `services` em `lib/data.ts`. Cada item gera automaticamente um
card na Home e uma seção detalhada em `/servicos#slug`.

### Depoimentos e portfólio

Edite os arrays `testimonials` e `portfolio` em `lib/data.ts`. As imagens do
portfólio e dos serviços usam URLs do Unsplash como placeholder — substitua
pelas fotos reais dos projetos assim que disponíveis (mesma proporção
recomendada: 4:3).

### Cores e tipografia

A paleta (madeira, cinza-escuro/charcoal e verde-musgo) está definida em
[`app/globals.css`](./app/globals.css), no bloco `@theme`. As fontes (Inter e
Poppins) são carregadas via `next/font` em `app/layout.tsx`.

### Número de WhatsApp

O número usado nos botões flutuantes, CTAs e no envio do formulário de
contato é `company.whatsapp.raw` em `lib/data.ts`. Substitua pelo número real
da empresa antes de publicar.

### Domínio

Antes de publicar, atualize a constante `siteUrl` em `app/layout.tsx`,
`app/sitemap.ts` e `app/robots.ts` para o domínio real do site.

## Formulário de contato

O formulário (`components/ContactForm.tsx`) valida nome, telefone, e-mail e
mensagem no cliente e, ao enviar, monta uma mensagem formatada e abre o
WhatsApp (`wa.me`) com os dados preenchidos — não é necessário backend ou
serviço de e-mail para receber os leads.

## SEO

- Metadados completos (title, description, Open Graph, Twitter Card) em cada
  página.
- Dados estruturados `JSON-LD` (schema `HomeAndConstructionBusiness`) no
  `app/layout.tsx`, com endereço, telefone e horário de funcionamento.
- `sitemap.xml` e `robots.txt` gerados automaticamente pelo App Router.
- Palavras-chave locais trabalhadas no conteúdo: "móveis planejados Gaspar",
  "móveis sob medida Vale do Itajaí", "marcenaria Gaspar SC".

## Deploy

O projeto pode ser publicado em qualquer plataforma que suporte Next.js
(Vercel, Netlify, etc.). Para o deploy em VPS própria (Oracle Cloud + Nginx
+ PM2 + domínio na Hostinger), siga o passo a passo em
[`DEPLOY.md`](./DEPLOY.md).
