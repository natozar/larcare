/* =========================================================================
   LarCare — sistema de instalação PWA (bottom sheet customizado)
   =========================================================================
   * Captura beforeinstallprompt (Android Chromium) e guarda o evento.
   * Mostra bottom sheet com 3 variantes (android/ios/in_app) por demanda
     OU automaticamente quando heurística de engajamento bate.
   * Engajamento que dispara o sheet:
       - 1ª demanda criada (larcare:demand-created do simulator)
       - 1ª proposta enviada como prestador (larcare:provider-proposed)
       - 60s acumulados ativos no app (Visibility API, conta só foreground)
       - 5 telas distintas navegadas (hashchange unique)
   * Dismiss persiste 72h. Após 3 dismisses seguidos, marca never_again.
   * Reset dev limpa todas as chaves larcare:install*.
   ========================================================================= */
(function (global) {
  'use strict';

  const STORE = {
    DISMISSED_AT:  'larcare:install_dismissed_at',
    DISMISS_COUNT: 'larcare:install_dismiss_count',
    NEVER_AGAIN:   'larcare:install_never_again',
    INSTALLED_AT:  'larcare:installed_at',
    SEEN_LOG:      'larcare:install_seen_at',
    ACTIVE_SEC:    'larcare:active_seconds',
    SCREENS:       'larcare:screens_visited',
    FIRST_DEMAND:  'larcare:first_demand_done',
    FIRST_PROP:    'larcare:first_provider_proposal_done'
  };

  const THRESHOLDS = {
    ACTIVE_SECONDS: 60,
    DISTINCT_SCREENS: 5,
    DISMISS_TTL_MS: 72 * 60 * 60 * 1000, // 72h
    MAX_DISMISSES_BEFORE_NEVER: 3
  };

  let deferredPrompt = null;       // evento beforeinstallprompt capturado
  let sheetEl = null;              // referência ao DOM do sheet
  let lastFocusedBeforeOpen = null;
  let activeTimerId = null;
  let activeStartedAt = 0;

  // ----------------------------------------------------------------
  // Storage helpers
  // ----------------------------------------------------------------
  function readNum(key, def = 0) {
    try { const v = localStorage.getItem(key); return v == null ? def : Number(v); } catch (_) { return def; }
  }
  function readStr(key, def = null) {
    try { return localStorage.getItem(key) || def; } catch (_) { return def; }
  }
  function writeStr(key, v) { try { localStorage.setItem(key, String(v)); } catch (_) {} }
  function remove(key) { try { localStorage.removeItem(key); } catch (_) {} }

  // ----------------------------------------------------------------
  // beforeinstallprompt capture (Android Chromium)
  // ----------------------------------------------------------------
  global.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.debug('[install] beforeinstallprompt captured');
  });

  global.addEventListener('appinstalled', () => {
    writeStr(STORE.INSTALLED_AT, Date.now());
    deferredPrompt = null;
    closeSheet(); // remove o sheet se aberto
    document.dispatchEvent(new CustomEvent('larcare:installed'));
    console.debug('[install] appinstalled fired');
  });

  // ----------------------------------------------------------------
  // Engajamento — tracker de tempo ativo
  // ----------------------------------------------------------------
  function startActiveTracker() {
    if (document.visibilityState === 'visible') resumeActive();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') resumeActive();
      else pauseActive();
    });
    // Flush a cada 5s pra persistir mesmo se a aba for fechada abruptamente
    setInterval(() => flushActive(), 5000);
  }

  function resumeActive() { activeStartedAt = Date.now(); }
  function pauseActive() { flushActive(); activeStartedAt = 0; }
  function flushActive() {
    if (!activeStartedAt) return;
    const now = Date.now();
    const delta = Math.floor((now - activeStartedAt) / 1000);
    if (delta <= 0) return;
    activeStartedAt = now;
    const total = readNum(STORE.ACTIVE_SEC, 0) + delta;
    writeStr(STORE.ACTIVE_SEC, total);
    checkAutoTrigger('active_seconds', { total });
  }

  // ----------------------------------------------------------------
  // Engajamento — tracker de telas distintas
  // ----------------------------------------------------------------
  function trackHashChange() {
    const hash = (location.hash || '#/').replace(/\?.*$/, ''); // ignora query
    let raw = readStr(STORE.SCREENS, '');
    const set = new Set(raw ? raw.split('|') : []);
    if (!set.has(hash)) {
      set.add(hash);
      writeStr(STORE.SCREENS, Array.from(set).join('|'));
      checkAutoTrigger('screens', { count: set.size });
    }
  }

  // ----------------------------------------------------------------
  // Engajamento — eventos do simulator
  // ----------------------------------------------------------------
  function wireSimulatorEvents() {
    document.addEventListener('larcare:demand-created', () => {
      if (readStr(STORE.FIRST_DEMAND) === '1') return;
      writeStr(STORE.FIRST_DEMAND, '1');
      checkAutoTrigger('first_demand');
    });
    document.addEventListener('larcare:provider-proposed', () => {
      if (readStr(STORE.FIRST_PROP) === '1') return;
      writeStr(STORE.FIRST_PROP, '1');
      checkAutoTrigger('first_provider_proposal');
    });
  }

  // ----------------------------------------------------------------
  // Lógica de exibição automática
  // ----------------------------------------------------------------
  function shouldShowAuto() {
    const D = global.LarCareDetect;
    if (!D) return false;
    const ctx = D.getContext();
    if (ctx.isInstalled) return false;
    if (readStr(STORE.NEVER_AGAIN) === '1') return false;
    const lastDismiss = readNum(STORE.DISMISSED_AT, 0);
    if (lastDismiss && Date.now() - lastDismiss < THRESHOLDS.DISMISS_TTL_MS) return false;
    // Em in_app_browser, só aparece via ação manual; auto não acontece
    if (ctx.inAppBrowser) return false;
    return true;
  }

  function checkAutoTrigger(reason, payload) {
    if (!shouldShowAuto()) return;
    // Cada trigger precisa de seu critério
    if (reason === 'active_seconds') {
      if (payload && payload.total >= THRESHOLDS.ACTIVE_SECONDS) showSheet({ reason });
    } else if (reason === 'screens') {
      if (payload && payload.count >= THRESHOLDS.DISTINCT_SCREENS) showSheet({ reason });
    } else if (reason === 'first_demand' || reason === 'first_provider_proposal') {
      // Eventos one-shot: sempre disparam (se shouldShowAuto)
      showSheet({ reason });
    }
  }

  // ----------------------------------------------------------------
  // Bottom sheet — abrir/fechar
  // ----------------------------------------------------------------
  function getSheetEl() {
    if (!sheetEl) sheetEl = document.getElementById('install-sheet');
    return sheetEl;
  }

  function showSheet(opts = {}) {
    const el = getSheetEl();
    if (!el) return;
    if (el.classList.contains('is-open')) return;
    const D = global.LarCareDetect;
    const ctx = D ? D.getContext() : { platform: 'desktop', inAppBrowser: false, isInstalled: false };

    // Renderiza variante por plataforma
    renderVariant(el, ctx);

    // Loga exibição
    const log = readStr(STORE.SEEN_LOG, '');
    const entry = JSON.stringify({ t: Date.now(), reason: opts.reason || 'manual', platform: ctx.platform });
    writeStr(STORE.SEEN_LOG, log ? log + '\n' + entry : entry);

    // Foco
    lastFocusedBeforeOpen = document.activeElement;
    el.hidden = false;
    // Próximo frame: classes pra animação
    requestAnimationFrame(() => {
      el.classList.add('is-open');
      const primary = el.querySelector('[data-install-action="primary"]');
      if (primary) primary.focus();
    });
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', onKeyDown);
  }

  function closeSheet() {
    const el = getSheetEl();
    if (!el || !el.classList.contains('is-open')) return;
    el.classList.add('is-closing');
    el.classList.remove('is-open');
    const after = () => {
      el.hidden = true;
      el.classList.remove('is-closing');
      el.removeEventListener('animationend', after);
      el.removeEventListener('transitionend', after);
    };
    el.addEventListener('animationend', after, { once: true });
    setTimeout(after, 360);
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKeyDown);
    if (lastFocusedBeforeOpen && lastFocusedBeforeOpen.focus) lastFocusedBeforeOpen.focus();
  }

  function dismissSheet() {
    writeStr(STORE.DISMISSED_AT, Date.now());
    const c = readNum(STORE.DISMISS_COUNT, 0) + 1;
    writeStr(STORE.DISMISS_COUNT, c);
    if (c >= THRESHOLDS.MAX_DISMISSES_BEFORE_NEVER) writeStr(STORE.NEVER_AGAIN, '1');
    closeSheet();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') dismissSheet();
    if (e.key === 'Tab') trapFocus(e);
  }

  function trapFocus(e) {
    const el = getSheetEl();
    if (!el) return;
    const focusables = el.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ----------------------------------------------------------------
  // Renderização do conteúdo (3 variantes)
  // ----------------------------------------------------------------
  function brandLogoSVG() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64" aria-hidden="true">
        <path d="M16 4.2 L27.6 14.4 Q28.5 15.2 28.5 16.4 L28.5 26.2 Q28.5 27.8 26.9 27.8 L5.1 27.8 Q3.5 27.8 3.5 26.2 L3.5 16.4 Q3.5 15.2 4.4 14.4 Z" fill="#3E6B5C"/>
        <path d="M16 13.2 C 17.5 11.6, 20.1 12.0, 20.3 14.4 C 20.5 16.9, 18.8 18.6, 16 20.6 C 13.2 18.6, 11.5 16.9, 11.7 14.4 C 11.9 12.0, 14.5 11.6, 16 13.2 Z" fill="#D4A574"/>
      </svg>`;
  }

  function renderVariant(host, ctx) {
    const body = host.querySelector('.install-sheet__body');
    if (!body) return;
    if (ctx.inAppBrowser) body.innerHTML = renderInAppBrowserVariant();
    else if (ctx.platform === 'ios') body.innerHTML = renderIosVariant();
    else body.innerHTML = renderAndroidVariant();
  }

  function renderAndroidVariant() {
    return `
      <div class="install-sheet__art">${brandLogoSVG()}</div>
      <h2 id="install-sheet-title" class="install-sheet__title">Instalar LarCare</h2>
      <p class="install-sheet__hint">Acesse rápido pela tela inicial, funciona offline e abre como app — sem o navegador no caminho.</p>
      <ul class="install-sheet__feature-list">
        <li><span class="install-sheet__check" aria-hidden="true">✓</span>Atalho na tela inicial</li>
        <li><span class="install-sheet__check" aria-hidden="true">✓</span>Funciona offline</li>
        <li><span class="install-sheet__check" aria-hidden="true">✓</span>Sem cara de site, cara de app</li>
      </ul>
      <button class="install-sheet__cta" type="button" data-install-action="primary">Instalar agora</button>
      <button class="install-sheet__secondary" type="button" data-install-action="dismiss">Agora não</button>
    `;
  }

  function renderIosVariant() {
    // Ícone iOS share (square com arrow up) inline
    const shareIcon = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
        <path d="M12 3v13"/>
        <path d="M7 8l5-5 5 5"/>
        <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>
      </svg>`;
    const plusIcon = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="3"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>`;
    const checkIcon = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
        <path d="M5 12l5 5 9-11"/>
      </svg>`;
    return `
      <div class="install-sheet__art">${brandLogoSVG()}</div>
      <h2 id="install-sheet-title" class="install-sheet__title">Adicione à Tela de Início</h2>
      <p class="install-sheet__hint">Em 3 passos rápidos, o LarCare fica como um app no seu iPhone.</p>
      <ol class="install-sheet__steps">
        <li class="install-sheet__step" style="--delay: 0ms;">
          <span class="install-sheet__step-num" aria-hidden="true">1</span>
          <span class="install-sheet__step-icon" aria-hidden="true">${shareIcon}</span>
          <span class="install-sheet__step-text">Toque em <strong>Compartilhar</strong> na barra do Safari</span>
        </li>
        <li class="install-sheet__step" style="--delay: 80ms;">
          <span class="install-sheet__step-num" aria-hidden="true">2</span>
          <span class="install-sheet__step-icon" aria-hidden="true">${plusIcon}</span>
          <span class="install-sheet__step-text">Escolha <strong>Adicionar à Tela de Início</strong></span>
        </li>
        <li class="install-sheet__step" style="--delay: 160ms;">
          <span class="install-sheet__step-num" aria-hidden="true">3</span>
          <span class="install-sheet__step-icon" aria-hidden="true">${checkIcon}</span>
          <span class="install-sheet__step-text">Toque em <strong>Adicionar</strong> no canto superior direito</span>
        </li>
      </ol>
      <p class="install-sheet__fallback">Se a barra do Safari estiver no topo, o botão Compartilhar pode estar lá em cima.</p>
      <button class="install-sheet__cta" type="button" data-install-action="primary">Entendi</button>
    `;
  }

  function renderInAppBrowserVariant() {
    return `
      <div class="install-sheet__art install-sheet__art--alert">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="#E9F0EC"/>
          <path d="M22 32 L30 40 L42 26" stroke="#3E6B5C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </div>
      <h2 id="install-sheet-title" class="install-sheet__title">Abra no navegador para instalar</h2>
      <p class="install-sheet__hint">Você está em um navegador interno (Instagram, WhatsApp, Telegram...). Aqui não dá pra instalar como app, mas é fácil:</p>
      <ol class="install-sheet__steps">
        <li class="install-sheet__step" style="--delay: 0ms;">
          <span class="install-sheet__step-num" aria-hidden="true">1</span>
          <span class="install-sheet__step-text">Toque nos <strong>três pontinhos (⋯)</strong> no canto superior direito</span>
        </li>
        <li class="install-sheet__step" style="--delay: 80ms;">
          <span class="install-sheet__step-num" aria-hidden="true">2</span>
          <span class="install-sheet__step-text">Escolha <strong>Abrir no Safari</strong> ou <strong>Abrir no Chrome</strong></span>
        </li>
        <li class="install-sheet__step" style="--delay: 160ms;">
          <span class="install-sheet__step-num" aria-hidden="true">3</span>
          <span class="install-sheet__step-text">Lá fora, abra este menu de novo para instalar como app</span>
        </li>
      </ol>
      <button class="install-sheet__cta" type="button" data-install-action="primary">Entendi</button>
    `;
  }

  // ----------------------------------------------------------------
  // Trigger nativo Android via deferredPrompt
  // ----------------------------------------------------------------
  async function triggerNative() {
    if (!deferredPrompt) return { outcome: 'unavailable' };
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      return choice; // { outcome: 'accepted' | 'dismissed' }
    } catch (err) {
      console.error('[install] prompt error', err);
      return { outcome: 'error', error: err };
    }
  }

  // ----------------------------------------------------------------
  // Bind global do sheet (clicks)
  // ----------------------------------------------------------------
  function bindSheet() {
    const el = getSheetEl();
    if (!el) return;
    el.addEventListener('click', async (e) => {
      // click no backdrop fora do card
      if (e.target === el || e.target.classList.contains('install-sheet__backdrop')) {
        dismissSheet();
        return;
      }
      const action = e.target.closest('[data-install-action]');
      if (!action) return;
      const a = action.dataset.installAction;
      if (a === 'dismiss') dismissSheet();
      else if (a === 'primary') {
        const D = global.LarCareDetect;
        const ctx = D ? D.getContext() : {};
        if (ctx.hasNativePrompt && deferredPrompt) {
          action.disabled = true;
          action.textContent = 'Aguardando…';
          const result = await triggerNative();
          if (result && result.outcome === 'accepted') {
            // appinstalled vai fechar o sheet
          } else {
            // Usuário recusou: trata como dismiss
            dismissSheet();
          }
        } else {
          // iOS / in-app / desktop: o botão é só "Entendi"
          closeSheet();
        }
      }
    });

    // Swipe-down para fechar (mobile)
    let startY = 0;
    let isDragging = false;
    const card = el.querySelector('.install-sheet__card');
    if (card) {
      card.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        startY = e.touches[0].clientY;
        isDragging = true;
      }, { passive: true });
      card.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 0) {
          card.style.transform = `translateY(${deltaY}px)`;
        }
      }, { passive: true });
      card.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const computed = getComputedStyle(card).transform;
        // se arrastou >100px pra baixo, dismiss
        if (computed !== 'none' && card.style.transform) {
          const match = card.style.transform.match(/translateY\((\d+)px\)/);
          if (match && parseInt(match[1], 10) > 100) {
            card.style.transform = '';
            dismissSheet();
            return;
          }
        }
        card.style.transition = 'transform 220ms cubic-bezier(0.4,0,0.2,1)';
        card.style.transform = '';
        setTimeout(() => { card.style.transition = ''; }, 240);
      });
    }
  }

  // ----------------------------------------------------------------
  // API pública
  // ----------------------------------------------------------------
  function open(opts) { showSheet(opts || { reason: 'manual' }); }
  function close() { closeSheet(); }
  function isInstalled() {
    if (!global.LarCareDetect) return false;
    return global.LarCareDetect.isStandalone() || !!readStr(STORE.INSTALLED_AT);
  }
  function resetState() {
    Object.values(STORE).forEach(remove);
  }
  function stats() {
    return {
      activeSeconds: readNum(STORE.ACTIVE_SEC),
      screensVisited: (readStr(STORE.SCREENS, '') || '').split('|').filter(Boolean).length,
      dismissCount: readNum(STORE.DISMISS_COUNT),
      lastDismissed: readNum(STORE.DISMISSED_AT) || null,
      neverAgain: readStr(STORE.NEVER_AGAIN) === '1',
      installed: isInstalled()
    };
  }

  // ----------------------------------------------------------------
  // Boot
  // ----------------------------------------------------------------
  function start() {
    bindSheet();
    startActiveTracker();
    wireSimulatorEvents();
    // Track screens via hashchange
    global.addEventListener('hashchange', trackHashChange);
    trackHashChange();
  }

  global.LarCareInstall = { open, close, isInstalled, resetState, stats, start, triggerNative };
})(window);
