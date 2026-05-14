# LarCare — CHANGELOG

Registro cronológico de mudanças por versão. Mantido manualmente, alinhado com bumps de `LarCareConfig.VERSION` e `CACHE_VERSION` no Service Worker.

## v1.9.0 — 15 de maio de 2026 — Sprint consolidado final

**Foco**: adicionar 5 sistemas estruturais que faltavam para o produto parecer "Série A" — admin panel, pagamento, dark mode, push notifications, i18n. PNGs do logo via script Node + sharp.

### Added

#### Painel admin oculto (`#/admin`)
- Easter egg: **10 toques rápidos** no logo abre login (`sucata2026`). Persiste em sessionStorage.
- 5 tabs: **Métricas** (6 cards de KPI + gráfico SVG 30 dias), **Prestadores** (tabela com busca/filtro + export CSV), **Demandas** (tabela com status pills), **Avaliações** (lista das últimas 50 com moderação), **Configurações** (toggle Supabase runtime, backup/restore JSON do localStorage, toggle modo manutenção).
- Layout distinto do app: fundo cinza warm, header preto, tabelas densas tipo BI.

#### Sistema de pagamento mock (`#/pagamento`, `#/recibo`, `#/financeiro-prestador`, `#/dashboard-cliente`)
- Checkout com resumo + breakdown (valor + taxa LarCare 5% + total).
- **Tabs PIX / Cartão / Boleto**:
  - PIX: QR Code mock generated dinamicamente (25×25 grid com finder patterns + hash determinístico), código EMV BR Code copiável, spinner "aguardando".
  - Cartão: 4 campos com máscara, validação Luhn no front, detecção de bandeira por prefixo (Visa/Mastercard/Elo/Amex/Hipercard).
- Recibo printável (`@media print` ajustado).
- Financeiro do prestador: saldo disponível + pendente, histórico, "Sacar via PIX" mock.
- Dashboard cliente: serviços contratados + total investido + histórico.
- Persistência: `larcare:payments` e `larcare:provider_balance`.

#### Modo escuro (`js/theme.js` + tokens dark em styles.css)
- 3 modos: **claro / escuro / sistema** (default).
- Aplicação via `[data-theme="dark"]` no `<html>`.
- Auto via `prefers-color-scheme` quando preferência é "sistema".
- Tokens dark **repensados** (não invertidos): bg `#1A2E27`, surface `#243530`, primary `#5A9B82` mais claro, accent `#E0B689`.
- `<meta name="theme-color">` dinâmico para PWA status bar.
- `color-scheme: dark` para form controls nativos.
- Transição suave 200ms em background/color/border.

#### Internacionalização (`js/i18n.js`)
- 3 locales: **pt-BR** (default), **en-US**, **es-ES**.
- API `t(key, params?)` com interpolação `{var}`.
- 33 chaves cobrindo: common, home, nav, profile, payment, chat, time.
- Auto-detecção via `navigator.language` na 1ª visita.
- `formatCurrency` local-aware (BRL/USD/EUR), `formatDate` via `Intl`.
- `<html lang>` dinâmico.

#### Push notifications (`js/notifications.js` + sw.js)
- SW ganha listeners `push` (parse JSON + showNotification) e `notificationclick` (focus aba + navigate).
- 4 categorias toggleable: proposals, payments, reviews, demands.
- `maybeAskPermission` pede após 1ª proposta ou 1º pagamento (regra UX: valor antes da permissão).
- `wireSimulatorEvents` escuta `larcare:*` e dispara notificações com URL deeplink.
- Botão "Testar notificação" em Perfil.

#### Tools (`tools/generate-icons.js`)
- Script Node + sharp que lê `icons/favicon.svg` e gera:
  - Standard PNGs: 16, 32, 72, 96, 128, 144, 152, 192, 384, 512
  - Maskable: 192, 512 (80% safe zone, fundo sálvia)
  - Apple touch: 152, 167, 180 (sálvia sólido, sem transparência)
  - Splash iOS: 6 tamanhos (iPhone 15 Pro Max → SE, Android)
  - OG image 1200×630 + Twitter card 1200×600 com tagline
- Comando: `npm run icons`
- Adicionado em `devDependencies`: `sharp: ^0.33.0`

### Changed
- `CACHE_VERSION` → `larcare-v1.9.0`
- `LarCareConfig.VERSION` → `1.9.0`
- sw.js precache estendido com novos JS modules
- Profile (clientProfile) ganha 4 controles em Preferências: testar push, select tema, select idioma, testar notificação

### Deferred (documentado)
- Refator completo de tokens das 22 telas antigas (alto risco vs ganho médio)
- Geração efetiva dos PNGs neste ambiente (sharp não pré-instalado; owner roda `npm install && npm run icons` em máquina dele)
- Lighthouse re-medição (sem chrome-launcher confiável)
- i18n refactor das 22 views: stub-only com 33 chaves; expansão fica para owner

---

## v1.8.0 — 15 de maio de 2026 — Sprint de fechamento

**Foco**: encerrar débitos técnicos visuais e estruturais antes do pitch, transformando o app em "produção real com tração".

### Added
- **FAQ global** (`#/faq`) com 32 perguntas reais em PT-BR, 5 tabs (cliente / prestador / pagamento / segurança / app), search bar com filtragem em tempo real e empty state amigável.
- **Termos de Uso** (`#/termos`) com 15 cláusulas numeradas (CDC-compliant), incluindo Foro de Ribeirão Preto-SP. Layout documento estreito (760px), breadcrumb, versão+data, botão Imprimir, `@media print` decente.
- **Política de Privacidade** (`#/privacidade`) com 13 seções estruturadas conforme Art. 7º e Art. 18 da LGPD. Inclui DPO, bases legais, prazo de resposta de 15 dias, referência à ANPD.
- **Reactions no chat**: long-press 500ms abre menu flutuante com 5 emojis (👍 ❤️ 😂 😮 🙏 + ⋯), reactions persistidas em `msg.reactions`, pill abaixo da bolha com contador, animação bounce `cubic-bezier(0.34,1.56,0.64,1)`. Reação contextual do interlocutor mock quando usuário envia keyword positiva ou reage com ❤️.
- **Toast variants semânticos**: 4 estilos (success/info/warning/danger) com border-left colorido + ícone unicode na esquerda. Função `LarCareUI.toast(msg, variant)` já existia, agora visualmente diferenciada.

### Changed
- **`escapeAttr` helper** adicionado em `views_provider.js` para escapar valores de atributo HTML (necessário para input de FAQ search).
- **`CACHE_VERSION`** do Service Worker bumpado para `larcare-v1.8.0`.
- **`LarCareConfig.VERSION`** atualizado para `1.8.0`.

### Deferred (não implementado, documentado)
- Refator de tokens nas 22 telas antigas: alto risco/médio ganho, mantidas com valores hardcoded.
- Pull-to-refresh em listas: complexo de implementar bem em vanilla, baixo pitch impact.
- Scroll restoration entre navegações: marginal pra demo.
- Modo escuro latente: latente nas tokens mas não ativado.
- Onboarding contextual primeira visita (tooltip discreto): defer.
- SVG illustrations dedicadas para empty states: emojis 🔍/🤔/💬 já cobrem com qualidade visual aceitável.
- Lighthouse re-medição: pendente, sem chrome-launcher confiável no ambiente Windows.

---

## v1.7.0 — 14 de maio de 2026 — Sprint total

### Added
- **Busca + filtros** (`#/buscar`): search bar sticky, debounce 220ms, match textual com pontuação, filtros em bottom sheet (categoria, distância, nota, verificado, online), 5 modos de ordenação, histórico de 5 últimas buscas.
- **Chat WhatsApp-style** (`#/chat` e `#/conversas`): bolhas próprias (sage) vs interlocutor (surface) com ticks ✓/✓✓ azul, typing indicator, composer expansível, pool de 40+ respostas contextuais, persistência por conversa, badge de não lidas no bottom nav.
- **Dashboard do prestador** (`#/dashboard-prestador`): greeting personalizado, métricas com delta vs semana passada, gráfico SVG inline de 4 semanas, ranking na categoria, dicas dinâmicas, histórico das últimas 5 propostas.
- **Onboarding wizard** (`#/onboarding-prestador`): 8 passos com persistência completa, FileReader para foto, multi-select de até 5 categorias, slider de raio, faixa de preço, upload mock de docs. Cria prestador novo em `LarCareData.PROVIDERS` ao finalizar.
- **Landings para captação**: `#/para-prestadores` e `#/para-clientes` com benefícios, "como começar" em 4 passos, FAQ inline e CTA específico.

### Changed
- **Bottom nav**: adaptada por contexto (Cliente: Início/Buscar/Conversas/Perfil — Prestador: Dashboard/Demandas/Conversas/Perfil) com badge dinâmico.
- Bumped `CACHE_VERSION` para `larcare-v1.7.0`.

---

## v1.6.0 — 14 de maio de 2026 — Sistema de instalação PWA

### Added
- **Bottom sheet de instalação** com 3 variantes (Android Chromium / iOS Safari / In-app browser) renderizadas dinamicamente.
- **`js/install_detector.js`**: API `LarCareDetect.*` com detecção resiliente de iOS (cobre iPadOS-as-Mac), Android, standalone, in-app browser (10+ markers).
- **`js/install_prompt.js`**: captura `beforeinstallprompt`, heurística de exibição (60s ativo / 5 telas / 1ª demanda / 1ª proposta), dismiss persistido 72h, `never_again` após 3 dismisses.
- **Seção "Aplicativo" no Perfil**: "Instalar na tela inicial", "Verificar atualizações", link Sobre.

---

## v1.5.0 — 14 de maio de 2026 — Catálogo expandido + brand

### Added
- **Taxonomia em 2 níveis**: 4 grupos × 18 categorias (Reparos, Limpeza, Cuidado da casa, Família/Pet). 3 prestadores novos (Diana M., Helena R., Lúcia F.) cobrindo categorias novas. 5 demandas adicionais.
- **Logo redesenhado** (`brandMark` em components.js): casa de cantos arredondados sage com coração-folha dourado integrado. `icons/favicon.svg` novo.
- **`js/audio.js`**: 3 sons compostos via Web Audio API (proposalReceived, proposalAccepted, reviewSubmitted), toggle independente para sons e vibração.
- **Perfil refinado**: avatar + nome editável, toggle Cliente/Prestador, stats, preferências, demo controls.
- **Sobre o LarCare expandido**: seção "Onde estamos" com mapa SVG de Ribeirão Preto, contato.
- **SEO**: meta tags geo de RP, JSON-LD `areaServed=Ribeirão Preto`.

---

## v1.4.x — 13-14 de maio de 2026 — Modo demo completo

### Added
- **`js/simulator.js`**: propostas chegam em 10s/22s/1min15s/3min, status evolui sozinho, vibração + toast, persistência em localStorage.
- **Banner "Modo demonstração" identity-strip** com avatar + nome + bullet + lugar.
- **Banner "Atualizar agora"** automático quando SW detecta nova versão, com botão SKIP_WAITING.
- **Bottom nav fixa**, iOS hardening (notch, safe-area, tap-highlight, font-size 16px).

---

## v1.3.x — Maio 2026 — Base do protótipo

### Added
- 22 telas implementadas em HTML/CSS/JS vanilla.
- Mock data Ribeirão Preto (15 prestadores, 15 demandas, 50 propostas).
- Tour guiado de 90s.
- PWA básica com manifest e SW.

---

## v1.0 — Abril 2026 — Estrutura inicial

- Estrutura de arquivos, manifest, service worker, design system inicial (tokens em :root), router hash-based, mock data inicial de São Paulo (migrado para Ribeirão Preto em v1.5).
