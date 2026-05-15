/* =========================================================================
   LarCare — onboarding do cliente (quick-start 3 telas)
   =========================================================================
   Aparece UMA VEZ na primeira visita do cliente, depois nunca mais.
   Skip a qualquer momento. Persistência em localStorage.

   API:
     LarCareClientOnboarding.shouldShow()   -> boolean
     LarCareClientOnboarding.mount(root)    -> renderiza no element passado
     LarCareClientOnboarding.markDone()     -> grava flag de visto
     LarCareClientOnboarding.reset()        -> apaga flag (debug)
   ========================================================================= */
(function (global) {
  'use strict';

  const STORE = 'larcare:onboarding_client_done';
  const STEP_STORE = 'larcare:onboarding_client_step';

  function getDone() {
    try { return localStorage.getItem(STORE) === '1'; }
    catch (_) { return false; }
  }
  function setDone() {
    try { localStorage.setItem(STORE, '1'); } catch (_) {}
    try { localStorage.removeItem(STEP_STORE); } catch (_) {}
  }
  function reset() {
    try { localStorage.removeItem(STORE); } catch (_) {}
    try { localStorage.removeItem(STEP_STORE); } catch (_) {}
  }
  function getStep() {
    try { return parseInt(localStorage.getItem(STEP_STORE) || '1', 10); }
    catch (_) { return 1; }
  }
  function setStep(n) {
    try { localStorage.setItem(STEP_STORE, String(n)); } catch (_) {}
  }

  function shouldShow() {
    return !getDone();
  }

  // --- ILUSTRAÇÕES SVG inline (casa + coração / passos / serviço pronto) -----
  function svgHomeHeart() {
    return `
      <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width: 180px; height: 130px;">
        <defs>
          <linearGradient id="ohSky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#FAF8F4"/>
            <stop offset="100%" stop-color="#E9F0EC"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="200" height="140" fill="url(#ohSky)" rx="14"/>
        <!-- house silhouette -->
        <path d="M40 85 L100 40 L160 85 L160 120 Q160 125 155 125 L125 125 L125 95 L75 95 L75 125 L45 125 Q40 125 40 120 Z" fill="#3E6B5C"/>
        <!-- door knob -->
        <circle cx="115" cy="115" r="2" fill="#D4A574"/>
        <!-- heart hovering -->
        <g transform="translate(100 30)">
          <path d="M0 5 C-4 -3 -14 -3 -14 6 C-14 14 0 22 0 22 C0 22 14 14 14 6 C14 -3 4 -3 0 5 Z" fill="#D4A574" opacity="0.92"/>
        </g>
      </svg>
    `;
  }

  function svgFlow3() {
    return `
      <svg viewBox="0 0 240 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width: 220px; height: 90px;">
        <!-- step 1: descreve -->
        <g transform="translate(20 45)">
          <circle r="22" fill="#7AA294" opacity="0.18"/>
          <rect x="-10" y="-7" width="20" height="14" rx="2" fill="#3E6B5C"/>
          <line x1="-5" y1="-3" x2="5" y2="-3" stroke="#FAF8F4" stroke-width="1.5"/>
          <line x1="-5" y1="0" x2="2" y2="0" stroke="#FAF8F4" stroke-width="1.5"/>
        </g>
        <line x1="46" y1="45" x2="94" y2="45" stroke="#3E6B5C" stroke-width="2" stroke-dasharray="3 3"/>
        <!-- step 2: propostas -->
        <g transform="translate(120 45)">
          <circle r="22" fill="#D4A574" opacity="0.18"/>
          <rect x="-10" y="-9" width="20" height="6" rx="1.5" fill="#D4A574"/>
          <rect x="-10" y="-1" width="20" height="6" rx="1.5" fill="#D4A574"/>
          <rect x="-10" y="7" width="20" height="6" rx="1.5" fill="#D4A574"/>
        </g>
        <line x1="146" y1="45" x2="194" y2="45" stroke="#3E6B5C" stroke-width="2" stroke-dasharray="3 3"/>
        <!-- step 3: escolhe -->
        <g transform="translate(220 45)">
          <circle r="22" fill="#5F8B6E" opacity="0.18"/>
          <path d="M-7 0 L-2 5 L7 -6" stroke="#5F8B6E" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </svg>
    `;
  }

  function svgServiceReady() {
    return `
      <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width: 180px; height: 130px;">
        <defs>
          <linearGradient id="srSky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#FAF8F4"/>
            <stop offset="100%" stop-color="#E9F0EC"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="200" height="140" fill="url(#srSky)" rx="14"/>
        <!-- check circle big -->
        <g transform="translate(100 70)">
          <circle r="36" fill="#5F8B6E" opacity="0.18"/>
          <circle r="24" fill="#5F8B6E"/>
          <path d="M-10 0 L-3 7 L11 -8" stroke="#FAF8F4" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <!-- sparkles -->
        <circle cx="50" cy="40" r="2" fill="#D4A574"/>
        <circle cx="155" cy="40" r="2" fill="#D4A574"/>
        <circle cx="40" cy="100" r="2" fill="#D4A574"/>
        <circle cx="165" cy="105" r="2" fill="#D4A574"/>
      </svg>
    `;
  }

  // --- RENDER ---------------------------------------------------------------
  function mount(root) {
    if (!root) return;
    const step = getStep();
    root.innerHTML = render(step);
    bind(root);
  }

  function render(step) {
    const total = 3;
    const dots = Array.from({ length: total }, (_, i) => `<span class="oc-dot${i + 1 === step ? ' is-active' : ''}"></span>`).join('');

    let content;
    if (step === 1) {
      content = `
        <div class="oc-art" aria-hidden="true">${svgHomeHeart()}</div>
        <h1 class="oc-title">Bem-vinda ao LarCare</h1>
        <p class="oc-body">A gente resolve o que tá quebrado, sujo ou bagunçado na sua casa. Em Ribeirão Preto.</p>
        <button class="btn btn--primary btn--lg oc-cta" type="button" data-oc-action="next">Próximo</button>
        <button class="btn btn--ghost btn--sm oc-skip" type="button" data-oc-action="skip">Pular</button>
      `;
    } else if (step === 2) {
      content = `
        <div class="oc-art" aria-hidden="true">${svgFlow3()}</div>
        <h1 class="oc-title">Como funciona</h1>
        <p class="oc-body">Você descreve o que precisa. Prestadores verificados respondem. Você escolhe quem topou.</p>
        <button class="btn btn--primary btn--lg oc-cta" type="button" data-oc-action="next">Próximo</button>
        <button class="btn btn--ghost btn--sm oc-skip" type="button" data-oc-action="skip">Pular</button>
      `;
    } else {
      content = `
        <div class="oc-art" aria-hidden="true">${svgServiceReady()}</div>
        <h1 class="oc-title">Pronto pra começar</h1>
        <p class="oc-body">Pode pedir o primeiro serviço agora ou explorar primeiro.</p>
        <button class="btn btn--primary btn--lg oc-cta" type="button" data-oc-action="start">Pedir um serviço</button>
        <button class="btn btn--ghost btn--sm oc-skip" type="button" data-oc-action="explore">Explorar primeiro</button>
      `;
    }

    return `
      <div class="oc-overlay" role="dialog" aria-modal="true" aria-labelledby="oc-title">
        <div class="oc-card">
          <div class="oc-progress">${dots}</div>
          ${content}
        </div>
      </div>
    `;
  }

  function bind(root) {
    const card = root.querySelector('.oc-overlay');
    if (!card) return;
    card.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-oc-action]');
      if (!btn) return;
      const action = btn.dataset.ocAction;
      if (action === 'next') {
        const step = getStep();
        if (step >= 3) {
          setDone();
          unmount(root);
          return;
        }
        setStep(step + 1);
        mount(root);
      } else if (action === 'skip' || action === 'explore') {
        setDone();
        unmount(root);
        if (action === 'explore') {
          window.location.hash = '#/cliente';
        }
      } else if (action === 'start') {
        setDone();
        unmount(root);
        window.location.hash = '#/cliente/nova-demanda';
      }
    });
  }

  function unmount(root) {
    if (root && root.parentNode) {
      root.parentNode.removeChild(root);
    }
  }

  // Auto-show: chamado pelo app.js após boot, somente se cliente novo e não viu ainda
  function autoShow() {
    if (!shouldShow()) return;
    // Não mostra em rotas que não são home do cliente / public landing
    const hash = window.location.hash || '#/';
    if (hash.indexOf('#/cliente') !== 0 && hash !== '#/' && hash !== '') return;
    const root = document.createElement('div');
    root.id = 'oc-root';
    document.body.appendChild(root);
    mount(root);
  }

  global.LarCareClientOnboarding = { shouldShow, mount, markDone: setDone, reset, autoShow };
})(window);
