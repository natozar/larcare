# TESTING — checklist manual para o owner

> Esta página tem o objetivo único de te dar **uma passagem rápida** pelo demo, na pele do investidor, antes de mostrar ao vivo. Não há automação aqui — é teste em dispositivo real.

URL pública: <https://natozar.github.io/larcare/app.html>

Tempo total para rodar a checklist inteira: ~15 minutos.

---

## 0. Pré-flight (1 min)

- [ ] Abra o link no **celular** (Android Chrome **e** iPhone Safari, em ordem).
- [ ] Confira que o protótipo carrega em **menos de 3s** em rede 4G normal.
- [ ] O banner dourado de **"Modo demonstração"** aparece no topo? Feche e veja que não volta na mesma sessão.

---

## 1. PWA — instalação no Home Screen (3 min)

### Android (Chrome)
- [ ] Após ~30s, aparece o **banner customizado** "Instale o LarCare no seu celular".
- [ ] Toque em **Instalar**: o navegador mostra o prompt nativo.
- [ ] Confirme: ícone aparece na home com **fundo sálvia + casa estilizada**.
- [ ] Abra pelo ícone: roda como app standalone (sem barra de navegador).
- [ ] Long-press no ícone Android: aparecem os atalhos **"Nova solicitação"** e **"Sou prestador"**.

### iOS (Safari)
- [ ] Após ~30s, aparece o banner com instruções "Compartilhar → Adicionar à Tela de Início".
- [ ] Toque em **Compartilhar (□↑)** na barra do Safari → role → **Adicionar à Tela de Início**.
- [ ] Ícone aparece com **rótulo "LarCare"** (não a URL longa).
- [ ] Abra pelo ícone: roda standalone. Notch é respeitado (conteúdo não fica atrás dele). Status bar está **black-translucent**.

---

## 2. Modo offline (1 min)

- [ ] Carregue a página inicial **uma vez** com internet.
- [ ] Ative modo avião / desligue Wi-Fi e dados.
- [ ] Recarregue: o app **abre** (cache do service worker funciona).
- [ ] Navegue entre telas: tudo responde (dados são mock).

---

## 3. Fluxo cliente completo (3 min)

- [ ] Na landing, toque em **"Quero contratar um serviço"** → cadastro do cliente.
- [ ] Conclua o cadastro em 4 etapas (campos podem ser fakes).
- [ ] Cai no **Dashboard do cliente** com saudação personalizada.
- [ ] Toque em **"Nova solicitação"**.
- [ ] **Etapa 1**: escolha **Hidráulica** (categoria).
- [ ] **Etapa 2**: descreva ("torneira pingando há 2 dias").
- [ ] **Etapa 3**: confirme endereço cadastrado (Jardim Califórnia).
- [ ] **Etapa 4**: selecione "Até 3 dias / Tarde".
- [ ] **Etapa 5**: ajuste o slider de orçamento → toque em **Publicar demanda**.
- [ ] Tela "Demanda publicada" aparece com checkmark animado e timeline.
- [ ] Toque em **"Ver propostas"** → tela de propostas (provavelmente **vazia inicialmente**, mostrando "Aguardando primeira proposta").
- [ ] **Aguarde 10 segundos** sem fazer nada: o celular deve **vibrar** levemente e um toast aparece "Primeira proposta de [Nome] chegou!". A lista popula automaticamente.
- [ ] Em 20-30s, chega a 2ª proposta. Em ~1min15s, a 3ª. Em ~3min, a 4ª.
- [ ] (Atalho para acelerar: toque 5 vezes no logo LarCare no header. Abre um painel "Modo desenvolvedor" com **Avançar timers (1h)** que entrega todas as propostas instantaneamente.)
- [ ] Compare as propostas: valores diferentes, prestadores variados, distâncias, avaliações.
- [ ] Toque em **"Aceitar proposta"** numa proposta.
- [ ] Tela "Contato liberado" mostra dados do prestador + botão WhatsApp.
- [ ] **Aguarde ~3s**: toast "O prestador está a caminho" (status muda para Em atendimento).
- [ ] **Aguarde ~25s**: toast "Serviço concluído — sua avaliação importa".
- [ ] Navegue de volta → dashboard → veja a demanda no histórico.

---

## 4. Fluxo prestador completo (3 min)

- [ ] Toque 5x no logo → painel debug → **Modo prestador**.
- [ ] Cai no dashboard do prestador (Carlos H. do Centro de Ribeirão Preto).
- [ ] Lista de **demandas próximas** mostra todas as 10 + a que você criou no fluxo cliente.
- [ ] Toque em uma demanda compatível com a especialidade dele.
- [ ] Veja descrição, fotos, faixa de orçamento, outras propostas já feitas.
- [ ] Preencha valor, prazo, mensagem → **Enviar proposta**.
- [ ] Tela "Minhas propostas" mostra a nova proposta como **Aguardando**.
- [ ] **Aguarde 12-18s**: toast simulado "Sua proposta foi aceita!" (vibração).
- [ ] Navegue para perfil do prestador → veja botão **"Resetar demo"** no card amarelo.

---

## 5. Resetar demo (1 min)

- [ ] No perfil (cliente ou prestador), toque em **"Resetar demo"** → confirme.
- [ ] A página recarrega; o localStorage foi limpo.
- [ ] Volte ao Dashboard do cliente: **dem-user-* sumiu**, demandas padrão (dem-001..dem-010) voltaram ao estado original.

---

## 5.5. Sistema de instalação PWA (3 min) — v1.6.0+

Para resetar o estado entre testes: **Perfil → Modo demonstração → "Resetar estado de instalação (dev)"** (botão pequeno no rodapé do card).

### Android Chrome (Pixel 7 ou similar)
- [ ] Abra a app em aba normal (não-incógnito). Após **60 segundos** de uso ativo, o bottom sheet aparece com variante **Android** (logo + título "Instalar LarCare" + checklist).
- [ ] Toque em **"Instalar agora"**. O prompt nativo do Chrome aparece. Aceite.
- [ ] Após instalação, ícone aparece no launcher. Abra pelo ícone.
- [ ] No app instalado, vá em Perfil → seção "Aplicativo" mostra **"✓ Instalado"** cinza não-clicável.
- [ ] O sheet **nunca mais aparece automaticamente** (porque `isStandalone()=true`).
- [ ] Crie uma demanda no navegador comum (não no app instalado): o sheet aparece pela 1ª demanda? Funciona.

### iOS Safari (iPhone 14 ou similar)
- [ ] Abra a app em Safari normal. Após **60 segundos**, sheet aparece com variante **iOS** (3 cards numerados em cascata).
- [ ] Os 3 passos têm ícones SVG inline (compartilhar / "+" / check) e copy claro?
- [ ] Microcopy fallback "Se a barra do Safari estiver no topo, o botão Compartilhar pode estar lá em cima." aparece embaixo dos passos?
- [ ] Toque em **Entendi** fecha o sheet com slide-down.
- [ ] Siga as instruções: Share → Adicionar à Tela de Início → Adicionar. O ícone LarCare aparece com fundo sálvia.
- [ ] Abra pelo ícone. Status bar é `black-translucent` (notch respeitado).
- [ ] Em Perfil → "Aplicativo" mostra "✓ Instalado".

### In-app browser (Instagram, WhatsApp, Telegram)
- [ ] Mande o link para si mesmo no WhatsApp e abra pelo preview.
- [ ] Após 60s, sheet aparece com **variante "Abra no navegador"** com alerta sálvia e 3 passos para "três pontinhos → Abrir no Safari/Chrome".
- [ ] Faça o que diz: abra no Safari fora do WhatsApp. Lá, a variante mudou para iOS.

### Heurística e persistência
- [ ] Dispense o sheet (clique no ×). Sheet desaparece.
- [ ] Recarregue a página. Sheet **não aparece** porque foi dispensado há <72h.
- [ ] Em Perfil → "Aplicativo" → "Instalar na tela inicial": **abre o sheet sob demanda** (bypass do timer/dismiss).
- [ ] Dispense 3x via Perfil. Sheet marca `never_again` — não aparece mais automaticamente.
- [ ] Botão "Resetar estado de instalação" em Modo demonstração limpa tudo e o ciclo recomeça.

### Acessibilidade
- [ ] Com VoiceOver/TalkBack ligado: anunciam corretamente título e botões.
- [ ] Tab dentro do sheet: foco fica preso (não escapa pra trás).
- [ ] Tecla Esc fecha.

## 5.6. Sprint de fechamento — v1.8.0 (5 min)

Para versão v1.8.0+:

### FAQ global
- [ ] `#/faq` abre com tabs "Para clientes / Para prestadores / Pagamento / Segurança / Sobre o app" — clica em cada uma e vê perguntas diferentes
- [ ] Search bar acima das tabs filtra em tempo real (digita "pagar" → mostra apenas perguntas com a palavra)
- [ ] Search vazia mostra empty state amigável "Nada encontrado pra X"
- [ ] Accordion abre e fecha com animação suave do `<details>`
- [ ] CTA do fim "Não achou? Falar com suporte" leva pra #/contato

### Termos + Privacidade
- [ ] `#/termos` abre com layout documento, breadcrumb (Início › Sobre › Termos), versão e data no header
- [ ] 15 cláusulas numeradas, h2 sublinhado, tipografia confortável (Inter 15px line-height 1.7)
- [ ] Botão "Imprimir" abre dialog de impressão; preview do print esconde header/footer/bottom nav
- [ ] `#/privacidade` tem mesma estrutura com 13 seções, e-mail do DPO clicável

### Reactions no chat
- [ ] Em qualquer conversa, faça long-press (500ms+) numa bolha — menu de 5 emojis flutua acima com animação bounce
- [ ] Tap num emoji adiciona pill abaixo da bolha; tap novamente remove (toggle)
- [ ] Envie mensagem "valeu, perfeito!" → após 3-6s, interlocutor reage com 👍 ou 🙏 na sua mensagem
- [ ] Reaja com ❤️ numa mensagem do interlocutor → após 4-8s, ele reage 😊 na sua última mensagem
- [ ] Recarregue a página — reactions persistem (salvas em localStorage)
- [ ] Tap fora do menu de reações fecha
- [ ] Desktop: double-click numa bolha abre o menu (fallback de long-press)

### Polish
- [ ] Toast com `LarCareUI.toast('msg', 'success')` aparece com border-left verde-sálvia + ✓
- [ ] Toast com `'danger'` mostra border vermelho-terroso + ✕
- [ ] Múltiplos toasts empilham vertical sem sobrepor
- [ ] `LarCareConfig.VERSION` no Perfil mostra `1.8.0`

## 5.7. Sprint consolidado final — v1.9.0 (8 min)

### Admin oculto
- [ ] Faça **10 toques rápidos** no logo do header (em qualquer tela) — tela de login admin abre
- [ ] Senha: `sucata2026` — entra no painel
- [ ] Tab Métricas mostra 6 cards de KPI + gráfico de barras 30 dias
- [ ] Tab Prestadores tem tabela com 15 linhas + filtros funcionando + botão "Exportar CSV" baixa arquivo
- [ ] Tab Configurações: toggle Supabase muda o estado runtime; botão "Baixar backup" gera JSON

### Pagamento
- [ ] Em qualquer proposta aceita, navegue para `#/pagamento?proposta=prop-001-a` — checkout abre
- [ ] Tab PIX: QR Code aparece, código copia ao toque, botão "Simular pagamento confirmado" redireciona para recibo
- [ ] Tab Cartão: digite `4111 1111 1111 1111` (Visa Luhn-valid) + validade `12/30` + CVV `123` + nome — submit processa em 2s
- [ ] Recibo (`#/recibo?pagamento=pay-XXX`) mostra status verde "Aprovado", botão Imprimir abre dialog
- [ ] `#/financeiro-prestador` mostra saldo disponível incrementado; botão "Sacar via PIX" zera saldo

### Modo escuro
- [ ] Em Perfil > Preferências, select **Tema** muda entre Sistema/Claro/Escuro
- [ ] Selecione "Escuro" — toda a paleta muda em <300ms (background sage profundo, texto claro)
- [ ] Status bar do PWA muda de #3E6B5C para #1A2E27 (modo escuro)
- [ ] Volte a "Sistema" e mude o tema do iOS/Android — app responde automaticamente

### Internacionalização
- [ ] Em Perfil > Preferências, select **Idioma** muda entre PT-BR / EN-US / ES-ES
- [ ] Após mudar, app re-renderiza com strings traduzidas (limitadas ao subset)
- [ ] `<html lang>` reflete o idioma escolhido (DevTools → Elements)

### Push notifications
- [ ] Em Perfil, toque "Testar" no item Notificações — browser pede permissão
- [ ] Aceite → notificação aparece (Android: native notification; iOS: requer PWA instalada em iOS 16.4+)
- [ ] Crie uma demanda nova — após chegada da 1ª proposta, modal pede permissão de push se ainda não foi pedida
- [ ] Aceite → próximas propostas disparam push real

### PNGs (apenas se owner rodou `npm run icons`)
- [ ] `icons/icon-192.png`, `icon-512.png`, `icon-maskable-192.png` existem
- [ ] `icons/apple-touch-icon.png` (180×180) com fundo sálvia sólido
- [ ] `icons/og-image.png` 1200×630 com logo + tagline
- [ ] `npm run icons` executa sem erro

## 6. Toques finais (2 min)

### Acessibilidade tátil
- [ ] Toque em qualquer botão: **sem realce cinza** ao redor (tap-highlight transparente).
- [ ] Tente fazer **zoom de duas digitadas** num input: o iOS **não dá zoom** ao focar (font-size 16px).
- [ ] Botões respondem em **menos de 100ms** ao toque (touch-action manipulation).

### Visual
- [ ] Header sticky com sombra ao rolar.
- [ ] Bottom nav fixa em **cliente** (4 ícones: Início / Solicitar / Histórico / Perfil) e **prestador** (4 ícones: Demandas / Propostas / Perfil / Sair). Ícone ativo destacado.
- [ ] Pulse animation no badge "X propostas" quando nova chega.
- [ ] Skeleton boxes (3 pontinhos animados) na tela de propostas vazia.

### Dados Ribeirão Preto
- [ ] Bairros visíveis: Centro, Jardim Botânico, Iguatemi, Ribeirânia, Castelo, Sumarezinho, Vila Tibério, Jardim Califórnia (cliente), Alto da Boa Vista, Nova Aliança, Ipiranga, Jardim Paulista.
- [ ] Categorias: Elétrica, Hidráulica, Ar-condicionado, Montagem, Pintura, Chaveiro, Gás, Faz-tudo.
- [ ] CEPs no formato 14000-XXX a 14110-XXX.

---

## Bugs conhecidos e limitações

| Tema | Status | Observação |
| --- | --- | --- |
| Confetti em avaliação 5★ | Não implementado | Baixo impacto no pitch; pula. |
| Pull-to-refresh nativo | Não implementado | Lista atualiza via eventos do simulator, sem necessidade. |
| Swipe horizontal pra aceitar/recusar | Não implementado | Botões claros bastam para a demo. |
| Splash screen iOS dedicada | Single splash via theme color | PNG dedicado por viewport pode ser gerado depois. |
| `seed.sql` Supabase | Ainda em SP | USE_SUPABASE=false; mock_data.js é a fonte de verdade no demo. |

Se algo travar durante a demo ao vivo, o atalho **5 toques no logo** abre o painel "Modo desenvolvedor" com **Resetar demo** — pode usar à frente do investidor sem constrangimento.

---

## Diagnóstico rápido

Se o tour não rodar ou propostas não chegarem:

```bash
# no DevTools mobile (Chrome remoto):
console.log(window.LarCareSim.state())   # estado persistido
window.LarCareSim.fastForward()          # força a chegada de todas as propostas
window.LarCareSim.reset()                # limpa localStorage + reload
```

Lighthouse target: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥95. Validar antes de cada pitch — última medição registrada no QA de 2026-05-14 (Performance 99, todos os demais ≥95).
