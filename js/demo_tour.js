/* =========================================================================
   LarCare — guided demo tour (≈ 90s)
   Sequência narrada para o pitch ao investidor anjo. Roda sem trava,
   pode ser pausada e o usuário pode tomar controle a qualquer momento.
   ========================================================================= */
(function (global) {
  'use strict';

  const STEPS = [
    { route: '#/',                                 dwell: 5500, eyebrow: 'O começo',                     caption: 'Plataforma para pequenos reparos domésticos com prestadores verificados.' },
    { route: '#/cadastro/cliente?step=1',          dwell: 4500, eyebrow: 'Cliente',                      caption: 'Cadastro em três minutos. Nome, contato, senha.' },
    { route: '#/cliente',                           dwell: 5000, eyebrow: 'Visão consolidada',           caption: 'A cliente vê suas solicitações em andamento e o histórico recente.' },
    { route: '#/cliente/nova-demanda?step=1',      dwell: 4500, eyebrow: 'Nova solicitação',            caption: 'Etapa 1: a cliente escolhe a categoria do serviço.' },
    { route: '#/cliente/nova-demanda?step=2',      dwell: 4500, eyebrow: 'Descrição',                    caption: 'Etapa 2: descrição livre, fotos opcionais.' },
    { route: '#/cliente/demanda/dem-001/aguardando', dwell: 4000, eyebrow: 'Demanda publicada',         caption: 'Sistema notifica prestadores qualificados na região.' },
    { route: '#/cliente/demanda/dem-001/propostas', dwell: 12000, eyebrow: 'Leilão de propostas',       caption: 'Quatro propostas reais, variadas em valor, prazo e prestador. Esta é a tela-coração do produto.' },
    { route: '#/cliente/proposta/prop-001-a',      dwell: 9000, eyebrow: 'Perfil completo',             caption: 'Verificações, avaliações textuais, distribuição de notas, apresentação livre.' },
    { route: '#/cliente/contratado/prop-001-a',    dwell: 5000, eyebrow: 'Contato liberado',            caption: 'WhatsApp e telefone do prestador. A relação migra para fora da plataforma.' },
    { route: '#/prestador',                         dwell: 8000, eyebrow: 'Inversão · prestador',       caption: 'Mesmo leilão visto do outro lado: feed de demandas com distância, urgência e faixa de orçamento.' },
    { route: '#/prestador/demanda/dem-001',        dwell: 8500, eyebrow: 'Envio de proposta',           caption: 'O prestador analisa a demanda e envia valor, prazo e mensagem específica.' },
    { route: '#/cliente/avaliar/prop-001-a',       dwell: 5500, eyebrow: 'Avaliação cruzada',           caption: 'Os dois lados se avaliam após o serviço. Reputação acumula entre serviços.' }
  ];

  let timer = null;
  let currentStep = 0;
  let overlay = null;
  let progressBar = null;
  let playing = false;
  let progressTimer = null;

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    overlay.innerHTML = `
      <div class="tour-progress"><div class="tour-progress__bar"></div></div>
      <div class="tour-overlay__caption" role="status" aria-live="polite">
        <div>
          <span class="tour-step">Demonstração</span>
          <div class="tour-overlay__text">Iniciando...</div>
        </div>
        <div class="tour-overlay__actions">
          <button class="btn btn--ghost btn--sm" data-tour="prev" aria-label="Anterior">${'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>'}</button>
          <button class="btn btn--ghost btn--sm" data-tour="toggle" aria-label="Pausar/retomar">⏸</button>
          <button class="btn btn--ghost btn--sm" data-tour="next" aria-label="Próximo">${'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>'}</button>
          <button class="btn btn--ghost btn--sm" data-tour="close" aria-label="Encerrar">✕</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    progressBar = overlay.querySelector('.tour-progress__bar');
    overlay.addEventListener('click', (e) => {
      const a = e.target.closest('[data-tour]');
      if (!a) return;
      const action = a.dataset.tour;
      if (action === 'prev') goTo(Math.max(0, currentStep - 1));
      else if (action === 'next') goTo(Math.min(STEPS.length - 1, currentStep + 1));
      else if (action === 'toggle') {
        if (playing) pause(); else resume();
        a.textContent = playing ? '⏸' : '▶';
      } else if (action === 'close') stop();
    });
  }

  function setCaption(step, idx) {
    const eyebrow = overlay.querySelector('.tour-step');
    const text = overlay.querySelector('.tour-overlay__text');
    eyebrow.textContent = `${idx + 1}/${STEPS.length} · ${step.eyebrow}`;
    text.textContent = step.caption;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    requestAnimationFrame(() => {
      progressBar.style.transition = `width ${step.dwell}ms linear`;
      progressBar.style.width = '100%';
    });
  }

  function goTo(idx) {
    currentStep = idx;
    const step = STEPS[idx];
    if (!step) return stop();
    if (window.location.hash !== step.route) window.location.hash = step.route;
    ensureOverlay();
    setCaption(step, idx);

    clearTimeout(timer);
    timer = setTimeout(() => {
      if (idx + 1 >= STEPS.length) stop(true);
      else goTo(idx + 1);
    }, step.dwell);
    playing = true;
  }

  function pause() {
    if (!playing) return;
    clearTimeout(timer); timer = null;
    playing = false;
    if (progressBar) {
      const cs = getComputedStyle(progressBar);
      progressBar.style.width = cs.width;
    }
  }

  function resume() {
    if (playing) return;
    goTo(currentStep);
  }

  function start() {
    ensureOverlay();
    playing = true;
    goTo(0);
  }

  function stop(finished) {
    clearTimeout(timer);
    timer = null;
    playing = false;
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    if (finished && global.LarCareUI) global.LarCareUI.toast('Demonstração concluída', 'success');
  }

  // Public API
  global.LarCareTour = { start, stop };
})(window);
