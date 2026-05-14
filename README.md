# LarCare — protótipo navegável

> Cuidar do lar, sem depender de ninguém.

PWA estática, single-page, escrita em HTML + CSS + JavaScript vanilla. Pensada para ser apresentada a investidor anjo no celular do mantenedor: o investidor abre o link, percorre 26 telas em 3 minutos e fecha a sessão entendendo o tamanho do projeto.

Sem framework, sem build, sem backend. Tudo o que se vê é gerado em runtime a partir de dataset mockado realista.

---

## Como rodar localmente

```bash
cd larcare
python -m http.server 8000
```

Abra `http://localhost:8000/`. PWA instalável a partir do segundo carregamento (Chrome/Edge/Safari iOS via "Adicionar à tela de início").

---

## Estrutura

```
larcare/
├── index.html              # shell único da SPA
├── manifest.json           # manifest PWA
├── sw.js                   # service worker (cache-first/network-first)
├── 404.html / offline.html # fallbacks
├── css/styles.css          # design system completo
├── icons/                  # ícone PWA, favicon, og-image
└── js/
    ├── mock_data.js        # dataset (12 prestadores, 10 demandas, 40 propostas)
    ├── components.js       # header, footer, avatares, ícones SVG, toast, modal
    ├── views.js            # telas 1–14 (público + cliente)
    ├── views_provider.js   # telas 15–26 (prestador + institucional)
    ├── demo_tour.js        # tour guiado de 90s para o pitch
    └── app.js              # router hash-based, bootstrap, install banner
```

---

## Rotas principais

| Rota                                          | Tela                              |
|-----------------------------------------------|-----------------------------------|
| `#/`                                          | Landing pública                   |
| `#/sobre`, `#/seguranca`, `#/como-funciona/*` | Institucional                     |
| `#/cadastro/cliente?step=N`                   | Cadastro cliente em 4 etapas      |
| `#/cliente`                                   | Dashboard do cliente              |
| `#/cliente/nova-demanda?step=N`               | Nova solicitação em 5 etapas      |
| `#/cliente/demanda/dem-001/propostas`         | **Leilão** (4 propostas variadas) |
| `#/cliente/proposta/prop-001-a`               | Perfil completo do prestador      |
| `#/cliente/contratado/prop-001-a`             | Contato liberado (WhatsApp)       |
| `#/cliente/avaliar/prop-001-a`                | Avaliação cruzada                 |
| `#/cadastro/prestador?step=N`                 | Cadastro prestador em 6 etapas    |
| `#/prestador`                                 | Feed de demandas (lado prestador) |
| `#/prestador/demanda/dem-001`                 | Detalhe + envio de proposta       |
| `#/prestador/propostas` / `#/prestador/perfil`| Gestão                            |

Tour guiado: clique no FAB **"Ver demonstração rápida"** na landing. Encadeia 12 telas em ≈ 85s, com legenda institucional e barra de progresso.

---

## Demonstração para investidor

1. Renato abre o link no celular durante a conversa.
2. Aciona o FAB de demonstração.
3. Tour percorre, sem trava, das duas pontas: cliente publica demanda → recebe leilão de 4 propostas → contrata → libera contato → inversão para o lado do prestador → envio de proposta → avaliação cruzada.
4. A qualquer instante o investidor pode pausar e navegar manualmente.

A tela 10 (lista de propostas em `#/cliente/demanda/dem-001/propostas`) é o coração do produto: 4 propostas reais, com prestadores diferentes, valores entre R$ 95 e R$ 220, avaliações de 4.2 a 4.9, distâncias variadas.

---

## Design

- Paleta sage green premium (`#3E6B5C`) + dourado terroso (`#D4A574`) sobre off-white quente (`#FAF8F4`).
- Tipografia: Inter (corpo) + Fraunces (display).
- Mobile-first 375px → 1140px container.
- Componentes em CSS puro com tokens via custom properties.
- Animações cubic-bezier suaves, com `prefers-reduced-motion` honrado.

---

## Fase 2 — Backend Supabase (opt-in, default desligado)

A camada Supabase está plumbada mas desligada por padrão. Com `js/config.js → USE_SUPABASE=false` o app roda 100% sobre `js/mock_data.js`, idêntico ao protótipo no ar.

### Quando ligar

Quando houver projeto Supabase provisionado e dataset semeado.

### Como ligar (sequência de uma vez só)

```bash
# 1) provisione um projeto Supabase no painel ou via CLI
supabase projects create larcare --org <org-id> --region sa-east-1

# 2) link, apply migrations
supabase link --project-ref <ref>
supabase db push                                # roda supabase/migrations/

# 3) seed (idempotente — pode re-rodar)
supabase db execute --linked --file supabase/seed.sql

# 4) edite js/config.js
#    USE_SUPABASE      = true
#    SUPABASE_URL      = 'https://<ref>.supabase.co'
#    SUPABASE_ANON_KEY = '<anon key — pública por design>'

# 5) keep-alive contra o pause do free tier
#    GitHub Settings → Secrets → SUPABASE_URL, SUPABASE_ANON_KEY
#    Workflow .github/workflows/keepalive.yml pinga a cada 6h
```

### Arquitetura do hot-swap

```
js/config.js          flag USE_SUPABASE + URL + anon key
js/mock_data.js       dataset embutido (default seguro)
js/data_layer.js      bootstrap() async, troca window.LarCareData se USE_SUPABASE
js/app.js             await bootstrap antes do primeiro render
```

As 22 views **não foram refatoradas** — continuam consumindo `LarCareData.PROVIDERS/DEMANDS/PROPOSALS` síncrono. O custo é uma round-trip Supabase na primeira carga; o ganho é zero risco de regressão no pitch.

### Schema

7 tabelas + 1 admins:

```
profiles              identidade base (cliente | prestador | admin)
prestadores 1:1       extensão técnica (bio, rating, raio, disponibilidade)
prestador_categorias  m:n especialidades × anos
categorias            lookup público
demandas              pedido cliente, status open→proposals→hired→completed
propostas             leilão (cascata ao cancelar demanda)
avaliacoes            cruzada cliente↔prestador, imutável, recalcula rating via trigger
admins                privilégio administrativo
```

Decisões registradas:

- **Lat/lng + função `distance_km()` haversine.** PostGIS deferido até virar gargalo real.
- **CHECK constraints, não ENUM types.** Evita ALTER TYPE doloroso.
- **Soft delete** em `profiles`, `prestadores`, `demandas` (preserva dataset, o ativo de longo prazo). **Hard delete** em propostas.
- **IDs textuais** em entidades que viram URL (`dem-001`, `pro-001`, `eletrica`). Profiles UUID via `user_id` quando há sign-up auth.

### RLS

Habilitada em **todas** as tabelas, incluindo lookups. Função `is_admin()` SECURITY DEFINER encapsula a checagem de `admins`. Política em uma frase por tabela:

- **categorias**: leitura pública; write só admin.
- **profiles**: ver próprio + perfis de prestador ativos públicos; update só dono.
- **prestadores**: leitura pública dos `active=true`; write pelo dono via `profiles.user_id = auth.uid()`.
- **prestador_categorias**: leitura pública; write pelo prestador dono.
- **demandas**: ver as suas (cliente) OU as abertas em sua categoria (prestador); insert só cliente com `client_id` correspondente; update só dono enquanto status in (open, proposals).
- **propostas**: cliente vê tudo da sua demanda; prestador vê o que ele mandou; insert só prestador em categoria compatível; client_id de quem decide aceitar/rejeitar.
- **avaliacoes**: leitura pública; insert só envolvidos na demanda concluída, sem auto-avaliação (CHECK constraint).
- **admins**: opaca a não-admins.

### Como adicionar nova tabela

```bash
supabase migration new <nome_curto>
# edite supabase/migrations/<timestamp>_<nome_curto>.sql:
#   create table, comments, indices, trigger updated_at
# em seguida nova migration:
supabase migration new rls_<nome_curto>
#   alter table enable row level security
#   policies
supabase db push
# atualize js/data_layer.js (fetchAll + transform) se a tabela for consumida no front
```

### Anti-pause guard

`.github/workflows/keepalive.yml` faz `GET /rest/v1/categorias` a cada 6h. Free tier do Supabase pausa após ~7 dias de inatividade; com cron de 6h, distância confortável. Requer secrets `SUPABASE_URL` e `SUPABASE_ANON_KEY` no GitHub.

---

## Deploy

Funciona em qualquer host estático. Para GitHub Pages:

```bash
# a partir de larcare/
git init
git add -A
git commit -m "LarCare: protótipo inicial"
git branch -M main
git remote add origin git@github.com:<usuario>/<repo>.git
git push -u origin main
# em Settings → Pages: Source = main branch, root
```

O `sw.js` está com paths relativos (`./`), então funciona tanto em `usuario.github.io/repo/` quanto em domínio raiz.
