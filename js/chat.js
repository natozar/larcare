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
          <input type="file" accept="image/*" id="chat-photo-input" hidden />
          <textarea class="chat-composer__input" id="chat-input" placeholder="Mensagem" rows="1" autocomplete="off"></textarea>
          <button class="chat-composer__mic" type="button" id="chat-mic" aria-label="Gravar áudio">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="22"/></svg>
          </button>
          <button class="chat-composer__send" type="submit" id="chat-send" disabled aria-label="Enviar" hidden>${UI.icon('arrow_right', 18)}</button>
        </form>

        <div class="chat-recorder" id="chat-recorder" hidden>
          <button class="chat-recorder__cancel" type="button" data-action="cancel-audio" aria-label="Cancelar">✕</button>
          <span class="chat-recorder__dot" aria-hidden="true"></span>
          <span class="chat-recorder__timer" id="chat-recorder-timer">0:00</span>
          <span class="chat-recorder__hint">Solte para enviar · arraste pra fora pra cancelar</span>
        </div>

        <div class="chat-photo-preview" id="chat-photo-preview" hidden>
          <img id="chat-photo-img" alt="Pré-visualização" />
          <input type="text" id="chat-photo-caption" class="input" placeholder="Adicionar legenda (opcional)" />
          <div class="row" style="gap: 8px; margin-top: 12px;">
            <button class="btn btn--ghost btn--sm" type="button" data-action="cancel-photo">Cancelar</button>
            <button class="btn btn--outline btn--sm" type="button" data-photo-tag="antes">📋 Antes</button>
            <button class="btn btn--outline btn--sm" type="button" data-photo-tag="depois">✨ Depois</button>
            <button class="btn btn--primary btn--sm" type="button" data-action="send-photo" style="margin-left: auto;">Enviar</button>
          </div>
        </div>
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
    const reactionsHtml = renderReactions(m.reactions);
    const id = m.id || m.t;
    let content = '';
    if (m.type === 'audio') {
      const wave = m.waveform || (global.LarCareRecorder ? global.LarCareRecorder.fakeWaveform(id) : []);
      content = `
        <button class="audio-bubble__play" type="button" data-audio-play="${id}" aria-label="Tocar áudio">▶</button>
        <span class="audio-bubble__wave">${global.LarCareRecorder ? global.LarCareRecorder.renderWaveformSVG(wave, { width: 130, height: 24, color: mine ? 'rgba(255,255,255,0.85)' : 'var(--primary)' }) : ''}</span>
        <span class="audio-bubble__dur">${formatDuration(m.duration || 0)}</span>
      `;
    } else if (m.type === 'photo') {
      content = `
        <div class="photo-bubble">
          ${m.tag ? `<span class="photo-bubble__tag photo-bubble__tag--${m.tag}">${m.tag === 'antes' ? '📋 Antes' : '✨ Depois'}</span>` : ''}
          <img src="${m.dataUrl}" alt="${escapeHtml(m.caption || 'Foto')}" data-photo-lightbox loading="lazy" />
        </div>
        ${m.caption ? `<span class="chat-bubble__text">${escapeHtml(m.caption)}</span>` : ''}
      `;
    } else {
      content = `<span class="chat-bubble__text">${escapeHtml(m.text)}</span>`;
    }
    return `
      <div class="chat-row ${mine ? 'chat-row--me' : 'chat-row--them'}">
        <div class="chat-bubble chat-bubble--${m.type || 'text'} ${mine ? 'chat-bubble--me' : 'chat-bubble--them'}" data-msg-id="${id}">
          ${content}
          <span class="chat-bubble__time">${time}${mine ? ` <span class="chat-bubble__tick ${tickClass}">${tick}</span>` : ''}</span>
          ${reactionsHtml}
        </div>
      </div>
    `;
  }
  function formatDuration(s) {
    const m = Math.floor(s / 60), r = s % 60;
    return `${m}:${String(r).padStart(2, '0')}`;
  }

  function renderReactions(reactions) {
    if (!reactions || Object.keys(reactions).length === 0) return '';
    return `
      <div class="chat-bubble__reactions">
        ${Object.entries(reactions).map(([emoji, who]) => {
          const count = Array.isArray(who) ? who.length : 1;
          return `<span class="chat-bubble__reaction" data-reaction="${emoji}" aria-label="Reagido com ${emoji}">${emoji}${count > 1 ? `<span class="chat-bubble__reaction-count">${count}</span>` : ''}</span>`;
        }).join('')}
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
    // ----- Anexo de foto -----
    const photoInput = root.querySelector('#chat-photo-input');
    const photoPreview = root.querySelector('#chat-photo-preview');
    const photoImg = root.querySelector('#chat-photo-img');
    const photoCaption = root.querySelector('#chat-photo-caption');
    let pendingPhotoTag = null;
    root.querySelectorAll('[data-action="chat-attach"]').forEach((b) => {
      b.addEventListener('click', () => { if (photoInput) photoInput.click(); });
    });
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          // Comprime via canvas (max 800px, quality 0.7) pra caber em localStorage
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 800;
            const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            photoImg.src = dataUrl;
            photoImg.dataset.dataUrl = dataUrl;
            photoPreview.hidden = false;
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
        photoInput.value = '';
      });
    }
    root.querySelectorAll('[data-photo-tag]').forEach((btn) => {
      btn.addEventListener('click', () => {
        pendingPhotoTag = btn.dataset.photoTag;
        root.querySelectorAll('[data-photo-tag]').forEach((b) => b.classList.toggle('is-active', b === btn));
      });
    });
    root.querySelectorAll('[data-action="cancel-photo"]').forEach((b) => {
      b.addEventListener('click', () => { photoPreview.hidden = true; pendingPhotoTag = null; photoCaption.value = ''; });
    });
    root.querySelectorAll('[data-action="send-photo"]').forEach((b) => {
      b.addEventListener('click', () => {
        const dataUrl = photoImg.dataset.dataUrl;
        if (!dataUrl) return;
        const msgs = loadConvo(demandaId, interlocutorId);
        msgs.push({
          from: 'me', type: 'photo', dataUrl, caption: photoCaption.value.trim() || '',
          tag: pendingPhotoTag, t: Date.now(), read: false
        });
        saveConvo(demandaId, interlocutorId, msgs);
        rerenderBody();
        photoPreview.hidden = true; pendingPhotoTag = null; photoCaption.value = '';
      });
    });

    // ----- Gravação de áudio -----
    const micBtn = root.querySelector('#chat-mic');
    const recorderEl = root.querySelector('#chat-recorder');
    const recorderTimer = root.querySelector('#chat-recorder-timer');
    let recordTimerId = null;
    let recordCancelled = false;

    function showRecorderUI() {
      if (recorderEl) recorderEl.hidden = false;
      if (recorderTimer) recorderTimer.textContent = '0:00';
      recordCancelled = false;
      recordTimerId = setInterval(() => {
        if (!global.LarCareRecorder) return;
        const s = global.LarCareRecorder.elapsed();
        const m = Math.floor(s / 60); const r = s % 60;
        if (recorderTimer) recorderTimer.textContent = `${m}:${String(r).padStart(2, '0')}`;
        if (s >= 60) finishRecording();
      }, 250);
    }
    function hideRecorderUI() {
      if (recorderEl) recorderEl.hidden = true;
      clearInterval(recordTimerId);
    }
    async function startRecording() {
      if (!global.LarCareRecorder) { UI.toast('Áudio não disponível neste navegador', 'warning'); return; }
      if (!global.LarCareRecorder.supported()) { UI.toast('Áudio não disponível neste navegador', 'warning'); return; }
      try {
        await global.LarCareRecorder.start();
        showRecorderUI();
        if (global.LarCareAudio) global.LarCareAudio.vibrate(40);
      } catch (e) {
        UI.toast('Permita acesso ao microfone', 'danger');
      }
    }
    async function finishRecording() {
      if (!global.LarCareRecorder || !global.LarCareRecorder.isRecording()) { hideRecorderUI(); return; }
      const result = await global.LarCareRecorder.stop();
      hideRecorderUI();
      if (recordCancelled) return;
      if (!result || result.duration < 1) { UI.toast('Áudio muito curto', 'warning'); return; }
      // Persiste em base64 (tamanho razoável para até 60s)
      const msgs = loadConvo(demandaId, interlocutorId);
      msgs.push({
        from: 'me', type: 'audio',
        dataUrl: result.dataUrl, duration: result.duration, waveform: result.waveform,
        t: Date.now(), read: false
      });
      saveConvo(demandaId, interlocutorId, msgs);
      rerenderBody();
      if (global.LarCareAudio) global.LarCareAudio.vibrate(40);
    }
    function cancelRecording() {
      if (global.LarCareRecorder) global.LarCareRecorder.cancel();
      recordCancelled = true;
      hideRecorderUI();
    }
    if (micBtn) {
      // press-and-hold pattern
      let pressTimer = null;
      const onDown = (e) => {
        e.preventDefault();
        pressTimer = setTimeout(startRecording, 200); // confirmação curta antes de gravar
      };
      const onUp = () => {
        clearTimeout(pressTimer);
        if (global.LarCareRecorder && global.LarCareRecorder.isRecording()) finishRecording();
      };
      micBtn.addEventListener('touchstart', onDown, { passive: false });
      micBtn.addEventListener('touchend', onUp);
      micBtn.addEventListener('mousedown', onDown);
      micBtn.addEventListener('mouseup', onUp);
      micBtn.addEventListener('mouseleave', onUp);
    }
    root.querySelectorAll('[data-action="cancel-audio"]').forEach((b) => b.addEventListener('click', cancelRecording));

    // ----- Toggle mic <-> send button -----
    if (input && micBtn && send) {
      const update = () => {
        const hasText = !!input.value.trim();
        send.hidden = !hasText;
        send.disabled = !hasText;
        micBtn.hidden = hasText;
      };
      input.addEventListener('input', update);
      update();
    }

    // ----- Play de áudio -----
    body.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-audio-play]');
      if (!btn) return;
      const id = btn.dataset.audioPlay;
      const all = loadConvo(demandaId, interlocutorId);
      const m = all.find((x) => String(x.id || x.t) === id);
      if (!m || !m.dataUrl) {
        UI.toast('Mock de áudio do prestador', 'info');
        return;
      }
      const audio = new Audio(m.dataUrl);
      audio.play().catch(() => UI.toast('Não foi possível tocar', 'danger'));
      btn.textContent = '❚❚';
      audio.addEventListener('ended', () => { btn.textContent = '▶'; });
    });

    // ----- Lightbox de foto -----
    body.addEventListener('click', (e) => {
      const img = e.target.closest('[data-photo-lightbox]');
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.className = 'photo-lightbox';
      overlay.innerHTML = `<img src="${img.src}" alt="" /><button class="photo-lightbox__close" aria-label="Fechar">✕</button>`;
      document.body.appendChild(overlay);
      const close = () => overlay.remove();
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay || ev.target.classList.contains('photo-lightbox__close')) close();
      });
    });

    // ---------- REACTIONS: long-press em bolha ----------
    const REACTIONS = ['👍', '❤️', '😂', '😮', '🙏'];
    let pressTimer = null;
    let pressBubble = null;
    let openMenu = null;

    function findMsgIndex(msgList, bubbleEl) {
      const id = bubbleEl.dataset.msgId;
      if (!id) return -1;
      return msgList.findIndex((m) => String(m.id || m.t) === String(id));
    }

    function openReactionMenu(bubbleEl) {
      closeReactionMenu();
      const menu = document.createElement('div');
      menu.className = 'chat-reactions-menu';
      menu.innerHTML = REACTIONS.map((emoji) => `
        <button class="chat-reaction-btn" type="button" data-emoji="${emoji}" aria-label="Reagir com ${emoji}">${emoji}</button>
      `).join('') + `<button class="chat-reaction-btn" type="button" data-emoji="more" aria-label="Mais reações">⋯</button>`;
      bubbleEl.appendChild(menu);
      openMenu = menu;
      // Vibração curta ao abrir
      if (global.LarCareAudio) global.LarCareAudio.vibrate(40);
      menu.addEventListener('click', (e) => {
        const btn = e.target.closest('.chat-reaction-btn');
        if (!btn) return;
        const emoji = btn.dataset.emoji;
        if (emoji === 'more') {
          if (global.LarCareUI) global.LarCareUI.toast('Mais reações em breve');
          closeReactionMenu();
          return;
        }
        toggleReaction(bubbleEl, emoji);
        closeReactionMenu();
      });
    }
    function closeReactionMenu() {
      if (openMenu && openMenu.parentNode) openMenu.parentNode.removeChild(openMenu);
      openMenu = null;
      if (pressBubble) pressBubble.classList.remove('is-pressing');
      pressBubble = null;
    }

    function toggleReaction(bubbleEl, emoji) {
      const msgs = loadConvo(demandaId, interlocutorId);
      const idx = findMsgIndex(msgs, bubbleEl);
      if (idx < 0) return;
      const msg = msgs[idx];
      msg.reactions = msg.reactions || {};
      const arr = msg.reactions[emoji] || [];
      const meIdx = arr.findIndex((r) => r.by === 'me');
      if (meIdx >= 0) {
        arr.splice(meIdx, 1);
        if (arr.length === 0) delete msg.reactions[emoji];
        else msg.reactions[emoji] = arr;
      } else {
        arr.push({ by: 'me', t: Date.now() });
        msg.reactions[emoji] = arr;
      }
      saveConvo(demandaId, interlocutorId, msgs);
      // Re-render apenas a bolha em questão
      const row = bubbleEl.closest('.chat-row');
      const wrapper = document.createElement('div');
      wrapper.innerHTML = renderMessage(msg, true);
      row.replaceWith(wrapper.firstElementChild);
      // Resposta contextual: se reagi com ❤️ em msg do interlocutor, ele reage 😊 de volta após 4-8s
      if (emoji === '❤️' && msg.from === 'them') {
        schedulePartnerReaction(msg, '😊');
      }
    }

    function schedulePartnerReaction(msg, emoji) {
      setTimeout(() => {
        const msgs = loadConvo(demandaId, interlocutorId);
        // Encontra última msg minha
        const lastMineIdx = msgs.map((m, i) => m.from === 'me' ? i : -1).filter((i) => i >= 0).pop();
        if (lastMineIdx == null) return;
        const target = msgs[lastMineIdx];
        target.reactions = target.reactions || {};
        target.reactions[emoji] = target.reactions[emoji] || [];
        target.reactions[emoji].push({ by: 'them', t: Date.now() });
        saveConvo(demandaId, interlocutorId, msgs);
        // Rerender body
        rerenderBody();
      }, 4000 + Math.random() * 4000);
    }

    function rerenderBody() {
      const msgs = loadConvo(demandaId, interlocutorId);
      const rows = body.querySelectorAll('.chat-row, .chat-system');
      // Remove tudo exceto typing
      rows.forEach((r) => r.remove());
      msgs.forEach((m) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = renderMessage(m, true);
        body.insertBefore(tmp.firstElementChild, typing);
      });
      body.scrollTop = body.scrollHeight;
    }

    body.addEventListener('touchstart', (e) => {
      const bubble = e.target.closest('.chat-bubble:not(.chat-bubble--typing)');
      if (!bubble) return;
      pressBubble = bubble;
      bubble.classList.add('is-pressing');
      pressTimer = setTimeout(() => {
        openReactionMenu(bubble);
        pressBubble = null;
      }, 500);
    }, { passive: true });
    body.addEventListener('touchend', () => {
      if (pressTimer) clearTimeout(pressTimer);
      pressTimer = null;
      if (pressBubble) { pressBubble.classList.remove('is-pressing'); pressBubble = null; }
    });
    body.addEventListener('touchmove', () => {
      if (pressTimer) clearTimeout(pressTimer);
      pressTimer = null;
      if (pressBubble) { pressBubble.classList.remove('is-pressing'); pressBubble = null; }
    }, { passive: true });
    // Desktop: dblclick também abre menu de reações
    body.addEventListener('dblclick', (e) => {
      const bubble = e.target.closest('.chat-bubble:not(.chat-bubble--typing)');
      if (!bubble) return;
      openReactionMenu(bubble);
    });
    // Tap em reaction existente: toggle
    body.addEventListener('click', (e) => {
      const reaction = e.target.closest('.chat-bubble__reaction');
      if (reaction) {
        const bubble = reaction.closest('.chat-bubble');
        toggleReaction(bubble, reaction.dataset.reaction);
        return;
      }
      // Click fora do menu fecha
      if (openMenu && !e.target.closest('.chat-reactions-menu')) {
        closeReactionMenu();
      }
    });

    // Contextual: se usuário enviou palavra-chave de impacto positivo,
    // interlocutor reage com 👍 ou 🙏 após 3-6s
    const originalForm = form;
    if (originalForm) {
      originalForm.addEventListener('submit', () => {
        setTimeout(() => {
          const msgs = loadConvo(demandaId, interlocutorId);
          const lastMine = msgs.filter((m) => m.from === 'me').pop();
          if (!lastMine) return;
          if (/(obrigad|ótim|otimo|perfeit|valeu|excelente|maravilh)/i.test(lastMine.text || '')) {
            const emoji = Math.random() > 0.5 ? '👍' : '🙏';
            lastMine.reactions = lastMine.reactions || {};
            lastMine.reactions[emoji] = lastMine.reactions[emoji] || [];
            lastMine.reactions[emoji].push({ by: 'them', t: Date.now() });
            saveConvo(demandaId, interlocutorId, msgs);
            rerenderBody();
          }
        }, 3000 + Math.random() * 3000);
      });
    }
  }

  global.LarCareChat = {
    chat, conversas, bindChat, getChatsMeta, totalUnread, markAllRead, loadConvo
  };

  global.LarCareViews = global.LarCareViews || {};
  global.LarCareViews.chat = chat;
  global.LarCareViews.conversas = conversas;
})(window);
