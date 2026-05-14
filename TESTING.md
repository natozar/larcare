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
