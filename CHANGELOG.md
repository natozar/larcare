# LarCare — CHANGELOG

Registro cronológico de mudanças por versão. Mantido manualmente, alinhado com bumps de `LarCareConfig.VERSION` e `CACHE_VERSION` no Service Worker.

## v2.2.0 — 14 de maio de 2026 — Sprint de reposicionamento e copy definitiva

### Added

#### Bíblia de copy (docs/)
- `docs/COPY_GUIDELINES.md`: voz da marca, vocabulário-chave, vocabulário proibido, dual público 75/25, exemplos antes/depois, checklist de validação
- `docs/POSITIONING.md`: público dual oficial com peso narrativo, posicionamento geográfico (operacional "atendemos Ribeirão Preto" vs pitch "começando por Ribeirão Preto"), tese do dataset em linguagem acessível, análise das 5 taglines candidatas

#### Tagline principal definitiva
- **"Casa em dia, sem dor de cabeça"** (6 palavras, dual público, narrativa de recorrência implícita)
- Aplicada literalmente em: hero da landing pública, app landing(), about(), OG/Twitter meta, JSON-LD slogan, meta title, FAQ topo
- Slogan legado "Cuidar do lar, sem depender de ninguém" preservado no footer institucional por reconhecimento de marca

#### Sub-taglines por contexto
- App contextual: "O que precisa hoje?" (saudação operacional)
- Para clientes: "Sua casa pede atenção. A gente resolve."
- Para prestadores: "Trabalho sério, com cliente que respeita."

#### Onboarding cliente quick-start (3 telas)
- `js/onboarding_client.js`: 3 telas full-screen overlay com SVG ilustrativos
- Persistência em `larcare:onboarding_client_done`; aparece UMA vez na primeira visita
- Skip a qualquer momento; CSS `.oc-*` em styles.css

#### Hero contextual do client dashboard
- Saudação dinâmica por hora + "O que precisa hoje?"
- Linha contextual reativa: "Você tem N pedidos com propostas pra avaliar" / "N serviços em andamento" / fallback de zero state
- Grid de 3 ações rápidas: Emergência (com borda vermelha), Buscar prestador, Favoritos
- Empty state pro "Seus pedidos" com emoji + CTA quando vazio

### Changed

#### Landing pública (index.html)
- Hero: "Pequenos reparos, sem depender de ninguém" → "Casa em dia, sem dor de cabeça."
- Sub-tagline: eletricista/encanador/diarista/faz-tudo em Ribeirão Preto
- Eyebrow: "Operando em São Paulo" → "Atendemos Ribeirão Preto · Verificação 100%"
- Metrics band: 47/2h/100%/R$0 → 18/30min/100%/R$0
- CTA primário: "Quero contratar um serviço" → "Pedir um reparo"
- Depoimentos migrados para perfis-tipo: chefe de casa (Maria Cristina), ocupado (Ricardo M.), mulher só (Helena R.)
- FAQ 7 → 8 perguntas, curadas pra dual público + Ribeirão + dataset
- Final CTA reescrito com nova tagline

#### Landings dedicadas (views_provider.js)
- `forClients()` reescrita: hero "Sua casa pede atenção. A gente resolve.", 4 cards de benefício com pivote dual, 3 depoimentos diversos, grid de 12 categorias clicáveis, 7 perguntas (incluindo "Posso não estar em casa quando o prestador chegar?")
- `forProviders()` reescrita: hero "Trabalho sério, com cliente que respeita.", 4 cards, 5 passos de como começar, 3 perfis mock realistas, **tabela honesta de quanto se ganha por categoria** (com comissão LarCare visível), 6 dúvidas específicas

#### Sobre o LarCare (about() em views.js)
- Hero: "O lar como prioridade" → "Casa em dia, sem dor de cabeça."
- **Nova seção "Como o LarCare se sustenta"**: tese do dataset em linguagem acessível (comissão 5%, mapa proprietário, parcerias futuras opcionais)
- **Nova seção "Quem está construindo"**: Renato, trajetória, Reila como base

#### FAQ expandido (views_provider.js)
- De 32 perguntas em 5 categorias → **50 perguntas em 6 categorias**
- Nova tab "Ribeirão Preto" com 6 perguntas sobre praça
- Cliente: 12 perguntas (incluindo "Posso não estar em casa", "Como acompanho sem estar em casa")
- Prestador: 11 perguntas (incluindo "Quando recebo pagamento", "Posso emitir NF")
- Pagamento: 8 perguntas (incluindo "Por que 5% e não mais")

#### Microcopy global unificado
- 10+ toasts em app.js reescritos
- Mensagens do simulador: "Primeira proposta de X chegou!" → "X enviou a primeira proposta"
- Empty states reescritos
- Placeholders trocados por exemplos concretos

#### i18n
- Expansão de 63 → **150 chaves por locale** (pt-BR, en-US, es-ES)
- 450 traduções totais
- Novos namespaces: brand, home contextual, profile app_section, payment card, chat audio/foto, demand toast, proposal empty/received, favorites/history empty, verification, onboarding, errors

#### SEO
- `index.html`: meta description reescrita pra Ribeirão Preto + dual público
- OG/Twitter title, description, image URL atualizados pra `larcare.com.br`
- JSON-LD `slogan` = "Casa em dia, sem dor de cabeça", `priceRange` = "R$"
- JSON-LD `FAQPage` 7 perguntas curadas pra v2.2.0
- `app.html`: title + description + OG/canonical alinhados
- `sitemap.xml` expandido pra 9 URLs e domínio larcare.com.br

### Removed
- "São Paulo" como praça operacional (Ribeirão Preto sempre por extenso)
- "Pinheiros" como bairro de demo (substituído por "Jardim Califórnia")
- Adjetivos vazios em todos os textos visíveis
- "Demanda" como sinônimo de pedido em CTAs e empty states

### Version
- `LarCareConfig.VERSION` → 2.2.0
- `CACHE_VERSION` → larcare-v2.2.0

---

## v2.1.0 — 15 de maio de 2026 — Sprint terminal pré-deploy

### Added

#### Chat com áudio (MediaRecorder + waveform)
- `js/audio_recorder.js`: wrapper completo da MediaRecorder API. Detecção de mime suportado (webm/opus, mp4, ogg). Análise de espectro via `AudioContext.AnalyserNode` para gerar waveform de 32 amostras downsampled.
- Botão microfone no composer (substitui Enviar quando input vazio). Press-and-hold pattern: touchstart inicia gravação (após delay 200ms), touchend envia.
- UI durante gravação: ponto vermelho pulsante + cronômetro 0:00 + hint "Solte pra enviar".
- Bolha de áudio com play/pause + waveform SVG colorido + duração + ticks.
- Áudio do interlocutor mock: waveform fake determinística por seed do msg.id.
- Persistência: `dataUrl` base64 em `larcare:chat:{dem}:{int}` (~50KB por mensagem, máx 60s).

#### Chat com fotos (compressão + lightbox)
- Anexo via `<input type="file" accept="image/*">` quando tap no botão clip.
- Compressão automática via canvas: max 800px lado maior, JPEG quality 0.7 (~80-150KB por foto).
- Preview com legenda opcional + 2 botões de tag (**📋 Antes** / **✨ Depois**).
- Bolha de foto com tag pill colorida + caption.
- Lightbox fullscreen ao tocar: overlay 92% black + foto centralizada 92vw/90vh + botão fechar redondo.

#### Sino global no header
- Botão `notif-bell` integrado em `renderClientHeader` e `renderProviderHeader` (não em públicos).
- SVG inline de sino + badge numérico oculto quando 0.
- Tap chama `LarCareFeatures.openNotifsSheet()` (já existente).
- `LarCareFeatures.updateBellBadge()` chamado em cada render para refletir contagem.

#### Deploy em domínio próprio
- `CNAME` na raiz com placeholder `larcare.com.br` (owner edita).
- `DEPLOY.md` novo na raiz com guia completo: compra de domínio (.com.br via Registro.br, .com via Cloudflare), configuração DNS (4 registros A + CNAME www), edição CNAME no repo, ativação no GitHub Pages, HTTPS via Let's Encrypt, verificação por `nslookup`, smoke test pós-deploy, rollback. Custo total documentado: ~R$ 40-50/ano.
- 404.html já estava em ordem (SPA fallback + logo + CTA voltar).

#### i18n expandido
- +30 chaves por locale em `js/i18n.js`: demand, proposal, review, chat, emergency, favorites, history.
- Total: 63 chaves × 3 locales = 189 traduções.

### Changed
- `CACHE_VERSION` → `larcare-v2.1.0`
- `LarCareConfig.VERSION` → `2.1.0`
- `sw.js` precache: + `audio_recorder.js`

### Deferred (mantido, documentado)
- Refator das 22 telas antigas para tokens — 6ª deferral consciente.
- Agenda do prestador (3 views + lembretes + sincronização) — escopo > 1 sessão.
- Disponível agora wire em TODAS as telas — API exposta, badges em busca e detalhe; integração em proposalCard/proposalsList deferida.

---

## v2.0.0 — 15 de maio de 2026 — Profundidade pré-lançamento

**Foco**: adicionar 7 sistemas estruturais que faltavam para LarCare ter densidade de produto pré-Série A.

### Added

#### PNGs do logo (23 arquivos)
`tools/generate-icons.js` foi executado com sucesso após instalar `sharp ^0.33.0`. Geradas: 10 ícones standard (16, 32, 72, 96, 128, 144, 152, 192, 384, 512), 2 maskable (192, 512 com 80% safe zone + fundo sálvia), 3 apple-touch (152, 167, 180 com sálvia sólido), 6 splash iOS por device (1290×2796 a 750×1334), og-image.png (1200×630), twitter-card.png (1200×600).

Referenciados em `app.html` (5 apple-touch-startup-image com media queries), `manifest.json` (10 icons + 3 shortcuts), `sw.js` precache (todos os 23). OG/Twitter meta tags atualizadas.

#### Mapa Leaflet real (`js/map.js`)
Wrapper com API `create / addProviderPin / addDemandPin / drawRadius / fitToPins`. Leaflet 1.9.4 carregado via CDN (CSS no `<head>`, JS com `defer`). Pins customizados via `divIcon`: prestador com avatar circular sálvia, demanda com emoji da categoria + pulse, cliente com pin azul-acinzentado. Suporte a modo escuro via filter CSS (invert + hue-rotate). Centro default: Ribeirão Preto.

#### Favoritos do cliente (`#/favoritos`)
Botão estrela toggleable em qualquer card de prestador (busca, detalhe, propostas). Persistido em `localStorage:larcare:client_favorites`. Lista em `#/favoritos` com empty state amigável + CTA Buscar. Indicador "Você já contratou X vezes" para favoritos.

#### Histórico de serviços com timeline (`#/historico` reformulado)
Substitui versão minimal por timeline visual agrupada por mês. Stats: total de serviços, total investido, avaliação média. Card por serviço com avatar + categoria + valor + estrelas + link pro recibo. Botão "Baixar PDF" via `window.print`. Empty state com CTA.

#### Central de notificações in-app
`LarCareFeatures.openNotifsSheet` abre bottom sheet com lista cronológica. Item lido/não lido com ponto azul + fundo `primary-tint`. Botão "Marcar todas como lidas". Filtros por categoria preparados (propostas/pagamentos/agenda/avaliações/sistema). Persistência em `larcare:notifications_inapp` com FIFO 200 itens. Hooks em eventos do simulator: cada `larcare:proposal-received` e `larcare:payment-confirmed` grava notificação in-app além da push externa.

#### Toggle prestador "disponível agora"
3 estados: 🟢 Disponível / 🟡 Ocupado / 🔴 Fora de horário. Persistido por prestador em `larcare:provider_status_{id}`. Visível no card da busca como badge. Filtro "Apenas disponíveis agora" no bottom sheet.

#### Modo emergência (`#/emergencia` + `#/emergencia-aguardando`)
Hero com ícone "🚨" animado (shake), grid de 5 categorias emergenciais (Vazamento, Luz, Chaveiro, Gás, Outro) com pricing 1.5x já calculado. Toggle "Aceitar automaticamente". Após seleção: tela de pulse ring expandindo com SLA contador regressivo 2:00, stats "Push enviado X · Respondendo Y", auto-redirect para contato-liberado em 15s simulando aceite.

#### Detalhe do prestador refinado (`#/prestador-detalhe?id=X`)
Hero com avatar 120px + selo verificado + 3 tags status + nota + distância + 3 CTAs (Pedir orçamento / Conversar / Favoritar). 5 tabs: Sobre (4 cards stats), Trabalhos (grid portfólio mock 6 cores SVG), Avaliações (distribuição visual por nota + cards), Categorias e preços, Verificação (checklist com selos).

### Changed
- `CACHE_VERSION` → `larcare-v2.0.0`
- `LarCareConfig.VERSION` → `2.0.0`
- `sw.js` precache estendido com map.js + features.js

### Deferred (documentado)
- **Refator das 22 telas antigas para tokens**: alto risco/médio ganho, mantido.
- **Chat com áudio (MediaRecorder + waveform)**: técnica complexa, runtime-risky sem browser pra testar.
- **Chat com fotos (lightbox + before/after)**: bounded mas similar ao acima.
- **Agenda do prestador (3 views + lembretes)**: scope substancial.
- **Geo via watchPosition para prestadores disponíveis**: prematuro sem opt-in real.
- **Sino integrado no header global**: API exposta (`updateBellBadge`, `openNotifsSheet`) mas integração visual no header requer touch em todos os render*Header em components.js — deferido para evitar regressão.

### Notas técnicas
- `tools/generate-icons.js` agora é o padrão para regenerar PNGs: `npm install && npm run icons`.
- Leaflet via CDN evita peso no bundle local — tiles cacheados pelo SW.
- Modo escuro do mapa via `filter: invert(0.9) hue-rotate(180deg)` no container Leaflet em `data-theme="dark"`.

---

## v1.9.1 — 15 de maio de 2026 — Auditoria pré-pitch

### Fixed
- **Easter egg admin** (10-tap no logo) conflitava com debug-tap do simulator (5-tap) — janela de 700ms do admin expirava enquanto usuário fechava o modal do simulator. **Fix**: adicionado botão **"Painel admin"** dentro do debug panel do simulator (5-tap → debug → "Painel admin"). URL direta `#/admin` continua funcionando.

### Added
- `AUDIT_v1.9.0.md` — relatório completo da auditoria 360° pré-pitch, validando: syntax de 21 arquivos JS, JSON, CSS vars, 40+ rotas vs views, integração entre módulos (eventos custom), 27+ chaves de localStorage, PWA, acessibilidade estática, 5 fluxos críticos mentalmente walkthroughed.

### Changed
- `CACHE_VERSION` → `larcare-v1.9.1`
- `LarCareConfig.VERSION` → `1.9.1`

---

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
