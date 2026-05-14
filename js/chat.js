/* =========================================================================
   LarCare — chat mock estilo WhatsApp
   =========================================================================
   * Bolhas próprias (direita, sage) vs interlocutor (esquerda, branco)
   * Composer expansível, ticks de status, typing indicator
   * Pool de respostas contextuais (heurística por palavra-chave)
   * Persistência por conversa em localStorage:larcare:chat:{convo_id}
   * Lista de conversas em rota separada
   ========================================================================= */
(function (global) {
  'use strict';

  const STORE_PREFIX = 'larcare:chat:';
  const STORE_LIST = 'larcare:chats_meta';

  // ----------------------------------------------------------------
  // Pool de respostas (40+) — heurística por keyword
  // ----------------------------------------------------------------
  const RESPONSE_POOL = {
    saudacao: [
      'Oi! Tudo bem?',
      'Olá, tudo certo por aí?',
      'Bom dia! Como posso ajudar?',
      'Oi, obrigado pela mensagem!'
    ],
    preco: [
      'O valor que combinamos foi {VALOR}. Está confirmado.',
      'Como falei na proposta, fica em {VALOR}. Posso ir hoje à tarde se quiser.',
      'Valor combinado é {VALOR}, sem cobrança extra na chegada.',
      'Confirma o {VALOR}? Se sim, já marco a visita.'
    ],
    horario: [
      'Posso ir hoje à tarde entre 14h e 17h, te serve?',
      'Tenho horário livre amanhã de manhã. Que tal 9h?',
      'Posso passar hoje à noite, depois das 18h, ou amanhã pela manhã.',
      'Trabalho com horário flexível, me diz qual o melhor pra você.'
    ],
    obrigado: [
      'Eu que agradeço! Qualquer dúvida me chama.',
      'Por nada! Tô à disposição.',
      'Imagina! Combinado então.',
      'Que isso, fico feliz em ajudar.'
    ],
    confirmacao: [
      'Combinado! Vou chegar no horário.',
      'Pode contar comigo. Te aviso quando estiver chegando.',
      'Anotado. Levo o material todo, sem stress.',
      'Perfeito! Mando mensagem assim que sair.'
    ],
    sobre_servico: [
      'Levo ferramenta completa, não precisa preocupar.',
      'Posso te passar uma estimativa do tempo depois que avaliar pessoalmente.',
      'Costumo resolver esse tipo de serviço em 1-2 horas.',
      'Garantia de 30 dias do serviço, incluso no valor.'
    ],
    endereco: [
      'Pode me passar o endereço completo? Já anoto aqui.',
      'Vou usar o endereço que você cadastrou. Confirma?',
      'Algum ponto de referência? Pra eu achar mais fácil.',
      'Pode ser que o GPS me leve a um lugar estranho, me passa um ponto de referência.'
    ],
    default: [
      'Entendi.',
      'Anotado!',
      'Combinado.',
      'Sem problema. Qualquer coisa me avisa.',
      'Pode deixar comigo.',
      'Tranquilo. Vou organizar e te aviso.'
    ]
  };

  function pickResponse(text, context) {
    const t = (text || '').toLowerCase();
    if (/(oi|olá|ola|bom dia|boa tarde|boa noite)/i.test(t)) return rand(RESPONSE_POOL.saudacao);
    if (/(preço|preco|valor|cobrança|cobranca|custa|combinado)/i.test(t)) {
      return rand(RESPONSE_POOL.preco).replace('{VALOR}', context.valor || 'o que combinamos');
    }
    if (/(horário|horario|que hora|amanhã|amanha|hoje|tarde|noite|manhã|manha|domingo|sábado|sabado)/i.test(t)) return rand(RESPONSE_POOL.horario);
    if (/(obrigad|valeu|grata|gracias|thanks)/i.test(t)) return rand(RESPONSE_POOL.obrigado);
    if (/(confirmo|confirma|fechado|combinado|tá|ta bom|beleza|ok)/i.test(t)) return rand(RESPONSE_POOL.confirmacao);
    if (/(material|ferramenta|levar|trazer|tempo|demora|garantia)/i.test(t)) return rand(RESPONSE_POOL.sobre_servico);
    if (/(endereço|endereco|onde|local|gps|ponto|referência|referencia)/i.test(t)) return rand(RESPONSE_POOL.endereco);
    return rand(RESPONSE_POOL.default);
  }
  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ----------------------------------------------------------------
  // Persistência
  // ----------------------------------------------------------------
  function convoKey(demandaId, interlocutorId) {
    return STORE_PREFIX + demandaId + ':' + interlocutorId;
  }
  function loadConvo(demandaId, interlocutorId) {
    try {
      const raw = localStorage.getItem(convoKey(demandaId, interlocutorId));
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }
  function saveConvo(demandaId, interlocutorId, msgs) {
    try { localStorage.setItem(convoKey(demandaId, interlocutorId), JSON.stringify(msgs)); } catch (_) {}
    updateMeta(demandaId, interlocutorId, msgs);
  }
  function updateMeta(demandaId, interlocutorId, msgs) {
    try {
      const meta = JSON.parse(localStorage.getItem(STORE_LIST) || '[]');
      const key = demandaId + ':' + interlocutorId;
      const last = msgs[msgs.length - 1];
      const entry = {
        key, demandaId, interlocutorId,
        lastMsg: last ? (last.text || '').slice(0, 80) : '',
        lastAt: last ? last.t : Date.now(),
        unread: msgs.filter((m) => m.from === 'them' && !m.read).length
      };
      const idx = meta.findIndex((x) => x.key === key);
      if (idx >= 0) meta[idx] = entry; else meta.unshift(entry);
      localStorage.setItem(STORE_LIST, JSON.stringify(meta));
    } catch (_) {}
  }
  function getChatsMeta() {
    try { return JSON.parse(localStorage.getItem(STORE_LIST) || '[]'); } catch (_) { return []; }
  }
  function markAllRead(demandaId, interlocutorId) {
    const msgs = loadConvo(demandaId, interlocutorId);
    msgs.forEach((m) => { if (m.from === 'them') m.read = true; });
    saveConvo(demandaId, interlocutorId, msgs);
  }
  function totalUnread() {
    return getChatsMeta().reduce((s, m) => s + (m.unread || 0), 0);
  }

  // ----------------------------------------------------------------
  // View: chat individual
  // ----------------------------------------------------------------
  function chat(params) {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const demandaId = params.demanda || 'dem-001';
    const interlocutorId = params.com || 'pro-002';
    const isClientView = (params.role || 'client') !== 'provider';
    const prestador = D.findProvider(interlocutorId);
    const demanda = D.findDemand(demandaId);
    const otherName = isClientView && prestador ? prestador.first_name : (D.DEMO_CLIENT.first_name || 'Maria Cristina');
    const otherInitials = isClientView && prestador ? prestador.initials : 'MC';

    let msgs = loadConvo(demandaId, interlocutorId);
    if (!msgs.length) {
      msgs = [
        { from: 'system', text: 'Proposta aceita. Vocês podem combinar os detalhes aqui.', t: Date.now() - 60000 },
        { from: 'them', text: `Oi! Sou ${otherName}. Vi sua demanda "${demanda ? demanda.title : 'a solicitação'}". Posso te ajudar com isso.`, t: Date.now() - 50000, read: false }
      ];
      saveConvo(demandaId, interlocutorId, msgs);
    }
    markAllRead(demandaId, interlocutorId);

    return `
      <section class="chat-page" data-demanda="${demandaId}" data-interlocutor="${interlocutorId}">
        <header class="chat-header">
          <button class="chat-header__back" type="button" data-action="chat-back" aria-label="Voltar">${UI.icon('arrow_left', 18)}</button>
          <span class="avatar avatar--sm ${isClientView ? '' : 'avatar--accent'}">${otherInitials}</span>
          <div class="chat-header__info">
            <div class="chat-header__name">${otherName}</div>
            <div class="chat-header__status" id="chat-status">online</div>
          </div>
        </header>

        <div class="chat-body" id="chat-body">
          ${msgs.map((m) => renderMessage(m, isClientView)).join('')}
          <div class="chat-typing" id="chat-typing" hidden>
            <div class="chat-bubble chat-bubble--them chat-bubble--typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <form class="chat-composer" id="chat-composer">
          <button class="chat-composer__attach" type="button" data-action="chat-attach" aria-label="Anexar">${UI.icon('plus', 18)}</button>
          <textarea class="chat-composer__input" id="chat-input" placeholder="Mensagem" rows="1" autocomplete="off"></textarea>
          <button class="chat-composer__send" type="submit" id="chat-send" disabled aria-label="Enviar">${UI.icon('arrow_right', 18)}</button>
        </form>
      </section>
    `;
  }

  function renderMessage(m, isClientView) {
    if (m.from === 'system') {
      return `<div class="chat-system">${escapeHtml(m.text)}</div>`;
    }
    const mine = m.from === 'me';
    const time = formatTime(m.t);
    const tick = mine ? (m.read ? '✓✓' : '✓') : '';
    const tickClass = mine && m.read ? 'is-read' : '';
    return `
      <div class="chat-row ${mine ? 'chat-row--me' : 'chat-row--them'}">
        <div class="chat-bubble ${mine ? 'chat-bubble--me' : 'chat-bubble--them'}">
          <span class="chat-bubble__text">${escapeHtml(m.text)}</span>
          <span class="chat-bubble__time">${time}${mine ? ` <span class="chat-bubble__tick ${tickClass}">${tick}</span>` : ''}</span>
        </div>
      </div>
    `;
  }

  function formatTime(t) {
    const d = new Date(t);
    return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
  }

  function escapeHtml(s) { return String(s || '').replace(/[&<>"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }

  // ----------------------------------------------------------------
  // Lista de conversas
  // ----------------------------------------------------------------
  function conversas() {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const meta = getChatsMeta();
    if (!meta.length) {
      return `
        <section class="page page--app">
          <div class="container container--narrow">
            <h1 class="mt-5">Conversas</h1>
            <div class="search-empty t-center mt-7">
              <div class="search-empty__art" aria-hidden="true">💬</div>
              <h3 class="mt-3">Nenhuma conversa ainda</h3>
              <p class="t-dim mt-2">Quando aceitar uma proposta, a conversa com o prestador abre aqui.</p>
              <a class="btn btn--primary mt-4" href="#/cliente">Voltar para o início</a>
            </div>
          </div>
        </section>
      `;
    }
    return `
      <section class="page page--app">
        <div class="container container--narrow">
          <h1 class="mt-5 mb-4">Conversas</h1>
          <div class="stack">
            ${meta.map((m) => {
              const p = D.findProvider(m.interlocutorId);
              const name = p ? p.first_name : 'Prestador';
              const initials = p ? p.initials : '??';
              const hh = new Date(m.lastAt);
              const timeStr = hh.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
              return `
                <a class="chat-list-item" href="#/chat?demanda=${m.demandaId}&com=${m.interlocutorId}">
                  <span class="avatar ${p && p.avatar_color === 'accent' ? 'avatar--accent' : ''}">${initials}</span>
                  <div class="chat-list-item__body">
                    <div class="row row--between">
                      <strong>${escapeHtml(name)}</strong>
                      <span class="t-faint fs-12">${timeStr}</span>
                    </div>
                    <div class="row row--between mt-1">
                      <span class="chat-list-item__preview">${escapeHtml(m.lastMsg)}</span>
                      ${m.unread > 0 ? `<span class="chat-list-item__badge">${m.unread}</span>` : ''}
                    </div>
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ----------------------------------------------------------------
  // Binding (chamado após mountApp pra wires de composer e back)
  // ----------------------------------------------------------------
  function bindChat(root) {
    const page = root.querySelector('.chat-page');
    if (!page) return;
    const demandaId = page.dataset.demanda;
    const interlocutorId = page.dataset.interlocutor;
    const body = root.querySelector('#chat-body');
    const input = root.querySelector('#chat-input');
    const send = root.querySelector('#chat-send');
    const form = root.querySelector('#chat-composer');
    const typing = root.querySelector('#chat-typing');
    const D = global.LarCareData;

    if (body) body.scrollTop = body.scrollHeight;

    const isClientView = true;
    const prestador = D.findProvider(interlocutorId);
    const demanda = D.findDemand(demandaId);
    const context = { valor: (function () {
      const props = D.proposalsForDemand(demandaId);
      const accepted = props.find((p) => p.provider_id === interlocutorId);
      return accepted ? `R$ ${accepted.value}` : 'R$ ' + (props[0] ? props[0].value : 150);
    })() };

    input?.addEventListener('input', () => {
      // Auto-resize
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
      send.disabled = !input.value.trim();
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      sendMessage(text);
    });

    function sendMessage(text) {
      const msgs = loadConvo(demandaId, interlocutorId);
      msgs.push({ from: 'me', text, t: Date.now(), read: false });
      saveConvo(demandaId, interlocutorId, msgs);
      appendMessageToDom({ from: 'me', text, t: Date.now() }, false);
      input.value = '';
      input.style.height = 'auto';
      send.disabled = true;
      // Marca como entregue após 600ms (✓✓)
      setTimeout(() => { markLastMineRead(); }, 600);
      // Schedule typing + resposta
      setTimeout(() => showTyping(), 1500);
      setTimeout(() => {
        const reply = pickResponse(text, context);
        hideTyping();
        const replyMsg = { from: 'them', text: reply, t: Date.now(), read: false };
        const cur = loadConvo(demandaId, interlocutorId);
        cur.push(replyMsg);
        saveConvo(demandaId, interlocutorId, cur);
        appendMessageToDom(replyMsg, false);
        // Vibração + som
        if (global.LarCareAudio) global.LarCareAudio.proposalReceived();
        // Marca lida 1s depois (usuário leu)
        setTimeout(() => markAllRead(demandaId, interlocutorId), 1200);
      }, 3000 + Math.random() * 4000);
    }

    function appendMessageToDom(m, isClientView) {
      const div = document.createElement('div');
      div.innerHTML = renderMessage(m, isClientView);
      body.insertBefore(div.firstElementChild, typing);
      body.scrollTop = body.scrollHeight;
    }
    function markLastMineRead() {
      const ticks = body.querySelectorAll('.chat-bubble--me .chat-bubble__tick');
      if (ticks.length) {
        const last = ticks[ticks.length - 1];
        last.textContent = '✓✓';
      }
    }
    function showTyping() {
      typing.hidden = false;
      body.scrollTop = body.scrollHeight;
    }
    function hideTyping() { typing.hidden = true; }

    // Botão voltar
    root.querySelectorAll('[data-action="chat-back"]').forEach((b) => {
      b.addEventListener('click', () => { window.history.back(); });
    });
    root.querySelectorAll('[data-action="chat-attach"]').forEach((b) => {
      b.addEventListener('click', () => {
        if (global.LarCareUI) global.LarCareUI.toast('Anexos em breve');
      });
    });
  }

  global.LarCareChat = {
    chat, conversas, bindChat, getChatsMeta, totalUnread, markAllRead, loadConvo
  };

  global.LarCareViews = global.LarCareViews || {};
  global.LarCareViews.chat = chat;
  global.LarCareViews.conversas = conversas;
})(window);
