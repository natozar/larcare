# PREFERÊNCIAS DO OWNER — LARCARE

Mantenedor: Renato Cesar Rodrigues
Última atualização: 2026-05-15
Status: arquivo vivo — atualizar sempre que houver nova preferência

Este arquivo é referência única para qualquer agente (Claude Code, Antigravity, outros) operando neste repositório. Vale junto com `CLAUDE.md`, `docs/COPY_GUIDELINES.md` e `docs/POSITIONING.md`. **Leia antes de tomar qualquer decisão.**

---

## 1. PROTOCOLO DE OPERAÇÃO AUTÔNOMA (inegociável)

- **Modo autônomo total.** ZERO perguntas em ambiguidade. Decidir sozinho com base nos arquivos do repo + este preferencias.md. Documentar a decisão no commit message.
- **ZERO checkpoints entre etapas.** Cadeia de tarefas inteira até o fim, sem pausa para confirmação.
- **ZERO oferecer opções "1/2/3".** Escolher tecnicamente melhor e seguir.
- **ZERO updates intermediários** no meio da execução. Relatório só ao terminar TUDO.
- **Ultrathink antes de cada decisão técnica.** Pensar profundo, executar rápido.
- **Working tree sempre limpo ao final.** Commits atômicos PT-BR.

**Única exceção** (só perguntar se):
- Decisão estratégica de negócio (pricing, posicionamento, feature do roadmap)
- Compra ou contratação de serviço pago
- Mudança que afete o domínio público já no ar
- Operação destrutiva irreversível (deletar branch remota, force push em main, apagar histórico)

---

## 2. COMMIT + PUSH + DEPLOY SEMPRE

**Regra permanente:** após cada bloco funcional, automaticamente:
1. `git add -A`
2. `git commit` com mensagem PT-BR convencional
3. `git push origin main`
4. (deploy auto via GitHub Pages a partir do main)

Nunca esperar o owner pedir push. Confirmar no final que está no ar.

**Prefixos de commit aceitos:**
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `chore:` manutenção, bump de versão
- `docs:` documentação
- `style:` formatação sem mudança de lógica
- `refactor:` reorganização sem mudança de comportamento
- `perf:` performance
- `a11y:` acessibilidade

---

## 3. PADRÃO VISUAL — VALE DO SILÍCIO A+++

**Inspiração canônica:**
- **Linear** — tipografia microcompacta, dark mode magistral, sombras quase invisíveis, border-radius 6-8px (técnico)
- **Stripe Dashboard** — surfaces brancas dominantes em fundo cinza claríssimo, sombras 0 1px 3px rgba(50,50,93,.05), focus rings precisos
- **Vercel** — preto/branco brutal, hover opacity 0.9, gradient mesh em heros
- **Arc** — border-radius generosos 16-20px, microinterações deliciosas
- **Superhuman** — keyboard-first, timing 100-150ms, animações que reforçam ação

**Aplicação no LarCare:**

| Princípio | Como aplicar |
|---|---|
| **Restraint** | Menos cores, menos pesos, menos tamanhos, menos sombras |
| **Espaçamento** | Múltiplos de 4. Generoso. Espaço em branco = luxo |
| **Tipografia** | Máximo 4 tamanhos por tela. Letter-spacing negativo (-0.02 a -0.03em) em títulos. Line-height 1.5 corpo, 1.1-1.2 títulos |
| **Cor** | Primary só em CTA primário e marca. Cinzas em 4 níveis. Borders rgba sutis nunca pretas |
| **Sombras** | 6 níveis físicos (xs/sm/md/lg/xl/2xl). Cor da marca diluída, nunca preto puro |
| **Border-radius** | 6/8/10/12/16/20/24px conforme contexto. Coerência absoluta |
| **Transições** | 100ms instant / 150ms fast / 200ms base / 300ms slow. Easing `cubic-bezier(0.4, 0, 0.2, 1)` |
| **Estados** | SEMPRE: hover sutil, active scale(0.97), focus-visible ring 4px |
| **Mobile-first** | Touch targets ≥44px, font 16px em inputs, safe-area-inset |
| **Loading/empty** | Skeleton shimmer + ilustração SVG + título + CTA. Aparecer após 200ms delay |

### 3.1. Tipografia — TAMANHOS PEQUENOS, MINIMALISTA

Owner reforçou múltiplas vezes: "**fontes não tão grandes**". Stripe Dashboard-grade.

**App (styles.css):**
- h1: clamp(22px, 3.5vw, 30px)
- h2: clamp(18px, 2.6vw, 22px)
- h3: clamp(15px, 1.8vw, 17px)
- h4: 14px
- body: 14px
- .lead: 14px
- .eyebrow: 10px (pill discreta)

**Landing pública (landing.css):**
- h1: clamp(26px, 4.2vw, 40px)
- h2: clamp(20px, 2.8vw, 28px)
- h3: clamp(16px, 1.8vw, 18px)
- Final CTA h2: clamp(22px, 3.5vw, 32px)

**Limite absoluto:** nunca passar disso pra cima sem evidência de pitch deck precisar.

### 3.2. Paleta — IDENTIDADE INEGOCIÁVEL

Sálvia + dourado terroso. NUNCA mudar:

| Token | Light | Dark |
|---|---|---|
| `--color-bg` | `#FAF8F4` (cream quente) | `#0E1411` (Linear-dark) |
| `--color-surface` | `#FFFFFF` | `#1A2620` |
| `--color-primary` | `#3E6B5C` (sálvia) | `#5DAB8E` (sálvia luminoso) |
| `--color-accent` | `#D4A574` (dourado terroso) | `#E2BB90` |
| `--color-text-primary` | `#1A2E27` | `#ECF0EE` |
| `--color-border` | `rgba(26, 46, 39, 0.08)` | `rgba(236, 240, 238, 0.08)` |

**NUNCA usar:**
- Amarelo saturado
- Vermelho-tijolo / marrom-obra / marrom-pedreiro
- Preto puro (#000)
- Branco puro como border
- Cores saturadas de obra/construção

### 3.3. Tema padrão — LIGHT

Owner declarou: "**claro está mais luxuoso e bonito**".

- Default de novos usuários: `light` (NÃO `system`)
- Identidade da marca = cream + sálvia = light é a primeira impressão
- Toggle sun/moon no header global pra usuário trocar explícito quando quiser
- Persiste em `localStorage:larcare:theme_preference`

### 3.4. Fontes

- **Inter** — corpo, UI, números
- **Fraunces** — títulos display, marca

Via Google Fonts. `font-feature-settings: 'ss01', 'cv11'` (Inter premium features).

---

## 4. STACK TÉCNICA — NÃO-NEGOCIÁVEL

- **Vanilla HTML/CSS/JS.** Sem build step. Sem framework.
- **PROIBIDO**: React, Vue, Svelte, Vite, Next, Webpack, Rollup, esbuild, Tailwind compilado, qualquer transpilação
- **PWA** mobile-first, instalável
- **Hospedagem**: GitHub Pages (branch `main`)
- **Domínio**: `larcare.com.br`
- **Backend**: Supabase plumbado mas `USE_SUPABASE=false` por padrão. Mock data em `js/mock_data.js` é a fonte de verdade enquanto não escalar
- **Fontes**: Google Fonts (Inter + Fraunces). Sem outras.
- **Bibliotecas externas**: Apenas Leaflet (mapa) via CDN. Sem mais.

---

## 5. PRAÇA OPERACIONAL — RIBEIRÃO PRETO

- **Cidade:** sempre **"Ribeirão Preto"** por extenso. Nunca "RP", nunca só "Ribeirão"
- **No app (operacional):** "Atendemos Ribeirão Preto"
- **No material institucional/pitch (sobre):** "Começando por Ribeirão Preto"
- **Próxima cidade planejada:** Araraquara
- **Bairros atendidos:** Centro, Jardim Botânico, Iguatemi, Ribeirânia, Castelo, Sumarezinho, Vila Tibério, Jardim Califórnia, Alto da Boa Vista, Nova Aliança, Ipiranga, Jardim Paulista

NUNCA mais usar bairros de São Paulo (Pinheiros, Vila Madalena, etc.) — migração já feita.

---

## 6. PÚBLICO DUAL 75/25

**PRIMÁRIO (75% peso narrativo):**
- Mulher 30-60, classe B/C
- Chefe de casa em Ribeirão Preto
- Sem homem de referência OU com homem indisponível
- Renda familiar R$ 4-15k

**SECUNDÁRIO (25% peso narrativo):**
- Profissional ocupado (homem ou mulher, 25-70)
- Trabalha o dia todo, viaja, terceiriza manutenção doméstica
- Mesma renda, mesmo perfil de consumo

**REGRA SAGRADA:** NUNCA criar "modo A" vs "modo B" / "feminino" vs "masculino". A copy é **UMA SÓ**, escrita pra ambos. 75% das linhas falam pra chefe de casa em pé de igualdade, 25% têm pivote universal pra "tempo".

Detalhes completos: `docs/POSITIONING.md`.

---

## 7. COPY & TOM DE VOZ

**Referência única:** `docs/COPY_GUIDELINES.md` (bíblia da copy).

**Resumo dos não-negociáveis:**

- **Tagline principal:** "Casa em dia, sem dor de cabeça."
- **Slogan legado** (mantido no footer): "Cuidar do lar, sem depender de ninguém"
- **Português brasileiro coloquial.** Não traduzido.
- **Voz ativa.** Imperativo nos CTAs.
- **Específico Ribeirão Preto** (cita bairros).

**Vocabulário-chave (USAR):**
- "Cuidar da casa" (não "manutenção doméstica")
- "Prestador" (não "profissional")
- "Pedir um serviço" (não "criar uma demanda")
- "Combinar com o prestador" (não "negociar")
- "Resolver" (âncora primária)
- "Sem dor de cabeça" (relief framing)

**Vocabulário PROIBIDO:**
- marketplace, plataforma, ecossistema, solução
- conectamos, intermediamos, viabilizamos
- empoderar, transformar, revolucionar
- inovador, disruptivo, único, exclusivo
- profissionais qualificados (sem qualificar o quê)
- excelência, qualidade (adjetivos vazios)
- querida, amiga, fofinho (infantilização)
- dataset proprietário, B2B vertical, endereçável (jargão startup)

---

## 8. HONESTY MENTONIA-STYLE

Owner pediu explicitamente antes da reunião com Ricardo: **"validação declarada, sem fake testimonial"**.

**Regras de honestidade:**

1. **ZERO depoimentos fictícios.** Se não há cliente/prestador real, usar placeholder honesto:
   - "Em breve: primeiros casos reais. Quer ser nosso primeiro cliente em Ribeirão Preto?" + CTA

2. **ZERO stats inventadas.** Se não há dado real:
   - "30min **meta** pra primeira proposta" (não "tempo médio")
   - "Nossa meta é responder em até 30 min" (não "A média é")
   - "Dado real será publicado quando tivermos volume"

3. **Stats com baseline real só:**
   - "100% prestadores verificados" só usar se já houver prestador real
   - "18 categorias cobertas" pode usar (cobertura é compromisso, não estatística)
   - "R$ 0 taxa pra cliente" pode usar (verdade contratual)

4. **Tese do dataset em linguagem acessível:**
   - "A gente cobra 5% sobre cada serviço resolvido"
   - "Um mapa completo dos prestadores autônomos confiáveis"
   - "Parcerias com construtoras, seguradoras, varejistas — sempre opcionais"
   - NÃO: "dataset proprietário", "monetização B2B", "ativo de longo prazo"

---

## 9. MOBILE-FIRST ABSOLUTO

**Viewport alvo primário:** 360x800 (Android Chrome médio).
**Owner usa Android Chrome no celular.**

**Regras inegociáveis:**
- Touch targets ≥44px (Apple 44pt, Material 48dp — usar 44px como floor)
- `font-size: 16px` em inputs (sem auto-zoom Android no focus)
- `touch-action: manipulation` em buttons (sem 300ms tap delay)
- `-webkit-tap-highlight-color: transparent` (sem flash azul no toque)
- `env(safe-area-inset-*)` em headers/footers/bottom-navs
- `min-height: 100dvh` (não 100vh, que quebra mobile)
- Inputs com `-webkit-appearance: none` (Chrome Android)
- Sem hover-only interactions
- Bottom nav respeita home indicator (calc + env)

**Breakpoints:**
- 360 / 480 / 768 / 1024 / 1280

---

## 10. FORCE-UPDATE MECHANISM

PWAs instalados ficam presos em cache antigo. Owner precisa forçar update.

**Opção 1 (URL):** `https://larcare.com.br/?fresh=1`
- Inline script no `<head>` de app.html e index.html
- Nuka caches + unregister todos os service workers
- Recarrega limpo

**Opção 2 (botão):** Perfil → "Forçar atualização total" (texto vermelho)
- Confirm dialog → redirect com ?fresh=1

**A cada bump de versão:** atualizar AMBOS:
- `LarCareConfig.VERSION` em `js/config.js`
- `CACHE_VERSION` em `sw.js`
(Devem ser idênticos sempre, ex: `2.3.4` ↔ `larcare-v2.3.4`)

---

## 11. COMPORTAMENTOS A EVITAR

- **Refator amplo sem evidência de bug** — só corrigir quando há prova concreta no código ou screenshot do owner
- **Tokens orphan fora de `:root`** — bug crítico que destruiu metade do design v2.2.0 em runtime
- **Hardcoded colors em vez de tokens** — exceção: pins Leaflet (renderizam fora do DOM normal)
- **Cores tematicamente claras como background em footer** — em dark mode vira invisível
- **Stats inventadas** — owner detectou "30min tempo médio" e exigiu "meta" em vez de "média"
- **Depoimentos fictícios** — substituir por placeholder honesto antes de reuniões
- **Refator de inline styles em massa** — alto risco de regressão sem QA visual. Db técnico aceito.
- **Mudar paleta da marca** — sálvia + dourado terroso são identidade
- **Usar palavras proibidas** (lista em `docs/COPY_GUIDELINES.md` §3)
- **Pedir confirmação ao owner** — protocolo autônomo

---

## 12. COMPORTAMENTOS A REPETIR

- **Análise estática rigorosa** quando QA visual não disponível
- **Commits atômicos por correção** — não bundling de 20 fixes em 1 commit
- **Mensagem de commit detalhada** explicando o porquê + decisão sob ambiguidade
- **Documentar deferrals conscientes** (db técnico aceito) no commit + CHANGELOG
- **CHANGELOG.md detalhado por versão** estilo Keep a Changelog
- **CLAUDE.md com Anexo por sprint** documentando metodologia + decisões
- **TESTING.md com smoke test por versão** (~15 itens, mobile Android Chrome)
- **Bump version + CACHE_VERSION juntos**
- **Push origin main após cada bloco lógico**
- **Relatório final por sprint** com: commits agrupados, telas afetadas, decisões sob ambiguidade, limitações, versão, checklist pro owner, veredito em UMA frase

---

## 13. VERSIONAMENTO

Semver MAJOR.MINOR.PATCH:
- **MAJOR** — quebra retrocompat (raro)
- **MINOR** — nova funcionalidade, sprint significativo
- **PATCH** — fixes, refinamentos, copy adjustments

**Sempre bumpar AMBOS:**
- `LarCareConfig.VERSION` em `js/config.js`
- `CACHE_VERSION = 'larcare-v{X.Y.Z}'` em `sw.js`

---

## 14. STAKEHOLDERS RELEVANTES

- **Renato Cesar Rodrigues** — owner, fundador, mantenedor solo. Baseado em Ribeirão Preto.
- **Reila** — base do owner (núcleo familiar).
- **Ricardo** — stakeholder externo importante. Reuniões pré-Ricardo exigem honesty máxima (sem fakes).
- **Investidor anjo** (genérico) — pode abrir o app no celular durante pitch. Cada tela é juízo silencioso sobre qualidade do executor.

---

## 15. ESTRUTURA DE ARQUIVOS DE REFERÊNCIA

| Arquivo | Função |
|---|---|
| `CLAUDE.md` | Protocolo + spec completo + Anexos por sprint (A-L+) |
| `preferencias.md` | **Este arquivo** — preferências consolidadas |
| `docs/COPY_GUIDELINES.md` | Bíblia da copy (voz, vocabulário, exemplos) |
| `docs/POSITIONING.md` | Público dual oficial, tagline rationale, tese dataset |
| `CHANGELOG.md` | Mudanças por versão |
| `TESTING.md` | Smoke test manual por versão (mobile Android) |
| `DEPLOY.md` | Guia passo-a-passo do go-live em domínio próprio |
| `README.md` | Estado atual do projeto |

**Ordem de leitura ao entrar no projeto:**
1. `CLAUDE.md` (protocolo no topo)
2. `preferencias.md` (este — preferências consolidadas)
3. `docs/POSITIONING.md` (público + tagline)
4. `docs/COPY_GUIDELINES.md` (voz)
5. `CHANGELOG.md` (estado atual)

---

## 16. ATUALIZAÇÃO DESTE ARQUIVO

Este arquivo é vivo. **Atualizar imediatamente** quando:
- Owner declarar nova preferência ("a partir de agora, sempre...")
- Owner corrigir comportamento ("não faz X, faz Y")
- Owner aprovar abordagem não-óbvia ("foi isso mesmo, continue assim")
- Sprint terminar com decisão importante sob ambiguidade

Toda atualização aqui deve ser refletida também na pasta de memória persistente do Claude Code (em `~/.claude/projects/.../memory/`) pra valer entre sessões.

---

**Fim do preferencias.md.**
