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
