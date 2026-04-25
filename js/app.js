/* =========================================================================
   LarCare — application bootstrap & router
   ========================================================================= */
(function (global) {
  'use strict';

  const UI = global.LarCareUI;
  const D  = global.LarCareData;
  const V  = global.LarCareViews;

  // ------------------------------------------------------------------
  // App state (mutable)
  // ------------------------------------------------------------------
  const state = {
    role: null, // 'client' | 'provider' | null (public)
    newDemand: { cat: null, description: '', urgency: 'ate_3_dias', period: 'Tarde', budget_min: 100, budget_max: 280 }
  };

  // ------------------------------------------------------------------
  // Router
  // ------------------------------------------------------------------
  function parseHash() {
    let raw = (window.location.hash || '#/').replace(/^#/, '');
    if (!raw.startsWith('/')) raw = '/' + raw;
    const [pathPart, queryPart] = raw.split('?');
    const segments = pathPart.split('/').filter(Boolean);
    const params = {};
    if (queryPart) queryPart.split('&').forEach((kv) => {
      const [k, v] = kv.split('=');
      params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return { path: '/' + segments.join('/'), segments, params };
  }

  function resolveRoute() {
    const { segments, params } = parseHash();
    const s = segments;
    const len = s.length;

    // public root
    if (len === 0) return { view: 'landing', variant: 'public' };
    if (len === 1 && s[0] === 'sobre')      return { view: 'about', variant: 'public' };
    if (len === 1 && s[0] === 'seguranca')  return { view: 'security', variant: 'public' };
    if (len === 1 && s[0] === 'privacidade') return { view: 'privacy', variant: 'public' };
    if (len === 1 && s[0] === 'termos')     return { view: 'terms', variant: 'public' };
    if (len === 1 && s[0] === 'faq')        return { view: 'faq', variant: 'public' };
    if (len === 1 && s[0] === 'contato')    return { view: 'contact', variant: 'public' };

    if (len === 2 && s[0] === 'como-funciona' && s[1] === 'cliente')   return { view: 'howItWorksClient', variant: 'public' };
    if (len === 2 && s[0] === 'como-funciona' && s[1] === 'prestador') return { view: 'howItWorksProvider', variant: 'public' };

    if (len === 2 && s[0] === 'cadastro' && s[1] === 'cliente')   return { view: 'clientSignup',   variant: 'public', params };
    if (len === 2 && s[0] === 'cadastro' && s[1] === 'prestador') return { view: 'providerSignup', variant: 'public', params };

    // cliente
    if (s[0] === 'cliente') {
      if (len === 1) return { view: 'clientDashboard', variant: 'client' };
      if (len === 2 && s[1] === 'nova-demanda') return { view: 'clientNewDemand', variant: 'client', params };
      if (len === 2 && s[1] === 'historico')    return { view: 'clientHistory',   variant: 'client' };
      if (len === 4 && s[1] === 'demanda' && s[3] === 'aguardando') return { view: 'demandPublished', variant: 'client', params: { id: s[2] } };
      if (len === 4 && s[1] === 'demanda' && s[3] === 'propostas')  return { view: 'proposalsList',   variant: 'client', params: { id: s[2] } };
      if (len === 3 && s[1] === 'proposta')   return { view: 'proposalDetail',   variant: 'client', params: { id: s[2] } };
      if (len === 3 && s[1] === 'contratado') return { view: 'contactUnlocked',  variant: 'client', params: { id: s[2] } };
      if (len === 3 && s[1] === 'avaliar')    return { view: 'clientReview',     variant: 'client', params: { id: s[2] } };
    }

    // prestador
    if (s[0] === 'prestador') {
      if (len === 1) return { view: 'providerDashboard', variant: 'provider' };
      if (len === 2 && s[1] === 'status')    return { view: 'providerStatus',  variant: 'public' };
      if (len === 2 && s[1] === 'propostas') return { view: 'myProposals',     variant: 'provider' };
      if (len === 2 && s[1] === 'perfil')    return { view: 'providerProfile', variant: 'provider' };
      if (len === 3 && s[1] === 'demanda')          return { view: 'demandDetail',     variant: 'provider', params: { id: s[2] } };
      if (len === 3 && s[1] === 'proposta-aceita')  return { view: 'proposalAccepted', variant: 'provider', params: { id: s[2] } };
      if (len === 3 && s[1] === 'avaliar')          return { view: 'providerReview',   variant: 'provider', params: { id: s[2] } };
    }

    return { view: 'notFound', variant: 'public' };
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  function render() {
    const { segments } = parseHash();
    const route = resolveRoute();

    // header / footer variant
    const headerHtml =
      route.variant === 'client'   ? UI.renderClientHeader(   '/' + segments.join('/')) :
      route.variant === 'provider' ? UI.renderProviderHeader( '/' + segments.join('/')) :
                                     UI.renderPublicHeader(   '/' + segments.join('/'));
    UI.setHeader(headerHtml, route.variant);
    UI.setFooter(UI.renderFooter());

    const fn = V[route.view];
    if (!fn) {
      UI.mountApp(V.notFound());
      return;
    }
    const html = fn(route.params || {});
    UI.mountApp(html, {
      title: titleFor(route.view),
      afterMount: (el) => attachRouteHandlers(el, route)
    });

    // Toggle FAB visibility — visible only on public routes
    const fab = document.getElementById('demo-fab');
    fab.hidden = !(route.variant === 'public');
    document.body.classList.toggle('has-bottom-nav', false);

    // close mobile drawer on navigation
    document.querySelectorAll('.mobile-drawer.is-open').forEach((d) => d.classList.remove('is-open'));

    // header scroll effect
    onScroll();
  }

  function titleFor(view) {
    const map = {
      landing: 'Cuidar do lar, sem depender de ninguém',
      about: 'Sobre',
      howItWorksClient: 'Como funciona — Cliente',
      howItWorksProvider: 'Como funciona — Prestador',
      security: 'Segurança e LGPD',
      clientSignup: 'Cadastro',
      clientDashboard: 'Início',
      clientNewDemand: 'Nova solicitação',
      demandPublished: 'Demanda publicada',
      proposalsList: 'Propostas recebidas',
      proposalDetail: 'Perfil do prestador',
      contactUnlocked: 'Contato liberado',
      clientReview: 'Avaliação',
      clientHistory: 'Histórico',
      providerSignup: 'Cadastro de prestador',
      providerStatus: 'Cadastro em análise',
      providerDashboard: 'Demandas próximas',
      demandDetail: 'Detalhes da demanda',
      myProposals: 'Minhas propostas',
      proposalAccepted: 'Proposta aceita',
      providerReview: 'Avaliação',
      providerProfile: 'Meu perfil',
      privacy: 'Privacidade',
      terms: 'Termos',
      faq: 'Perguntas frequentes',
      contact: 'Contato'
    };
    return map[view] || 'LarCare';
  }

  // ------------------------------------------------------------------
  // Per-route interaction wiring
  // ------------------------------------------------------------------
  function attachRouteHandlers(root, route) {
    // generic: data-link on cards
    root.querySelectorAll('[data-link]').forEach((el) => {
      el.addEventListener('click', (e) => {
        // ignore if click landed on a real <a> or button inside
        if (e.target.closest('a, button')) return;
        window.location.hash = el.dataset.link;
      });
    });

    // generic: signup-step (cliente)
    root.querySelectorAll('[data-form="signup-step"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.hash = form.dataset.next;
        if (form.dataset.next === '#/cliente') UI.toast('Cadastro concluído', 'success');
      });
    });

    // generic: provider-signup-step
    root.querySelectorAll('[data-form="provider-signup-step"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.hash = form.dataset.next;
        if (form.dataset.next === '#/prestador/status') UI.toast('Cadastro enviado para análise', 'success');
      });
    });

    // new-demand-step
    root.querySelectorAll('[data-form="new-demand-step"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const nd = state.newDemand;
        if (fd.has('description')) nd.description = fd.get('description');
        if (fd.has('urgency'))     nd.urgency     = fd.get('urgency');
        if (fd.has('period'))      nd.period      = fd.get('period');
        window.location.hash = form.dataset.next;
      });
    });

    // category grid
    const catGrid = root.querySelector('[data-cat-grid]');
    if (catGrid) {
      catGrid.querySelectorAll('[data-cat]').forEach((tile) => {
        tile.addEventListener('click', () => {
          catGrid.querySelectorAll('[data-cat]').forEach((t) => t.classList.remove('is-active'));
          tile.classList.add('is-active');
          state.newDemand.cat = tile.dataset.cat;
          const next = root.querySelector('#step-next');
          if (next) { next.disabled = false; next.removeAttribute('aria-disabled'); }
        });
      });
      const next = root.querySelector('#step-next');
      if (next) {
        next.addEventListener('click', () => {
          if (!state.newDemand.cat) return;
          window.location.hash = '#/cliente/nova-demanda?step=2';
        });
      }
    }

    // budget slider on step 5
    const slider = root.querySelector('#budget-slider');
    if (slider) {
      const out = root.querySelector('#budget-output');
      const update = () => {
        const max = parseInt(slider.value, 10);
        const min = Math.max(50, Math.round(max * 0.42));
        state.newDemand.budget_min = min;
        state.newDemand.budget_max = max;
        out.textContent = `${D.formatBRL(min)} – ${D.formatBRL(max)}`;
      };
      slider.addEventListener('input', update);
      update();
    }
    const finishForm = root.querySelector('[data-form="finish-new-demand"]');
    if (finishForm) {
      finishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        UI.toast('Demanda publicada', 'success');
        // Redirect to the demo featured demand to showcase the proposals UX
        window.location.hash = '#/cliente/demanda/dem-001/aguardando';
      });
    }

    // radius slider on provider signup step 4
    const radius = root.querySelector('#radius-slider');
    if (radius) {
      const out = root.querySelector('#radius-out');
      const update = () => { out.textContent = radius.value + ' km'; };
      radius.addEventListener('input', update);
    }

    // availability grid (provider step 5)
    const availGrid = root.querySelector('[data-avail]');
    if (availGrid) {
      availGrid.querySelectorAll('.avail-grid__cell').forEach((cell) => {
        cell.addEventListener('click', () => {
          cell.classList.toggle('is-on');
          cell.textContent = cell.classList.contains('is-on') ? '●' : '+';
          cell.setAttribute('aria-pressed', cell.classList.contains('is-on'));
        });
      });
    }

    // stars-input
    root.querySelectorAll('[data-stars]').forEach((box) => {
      box.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const v = parseInt(btn.dataset.value, 10);
          box.querySelectorAll('button').forEach((b) => {
            const bv = parseInt(b.dataset.value, 10);
            b.classList.toggle('is-on', bv <= v);
          });
          box.dataset.score = v;
        });
        btn.addEventListener('mouseenter', () => {
          const v = parseInt(btn.dataset.value, 10);
          box.querySelectorAll('button').forEach((b) => {
            const bv = parseInt(b.dataset.value, 10);
            b.classList.toggle('is-on', bv <= v);
          });
        });
      });
      box.addEventListener('mouseleave', () => {
        const v = parseInt(box.dataset.score, 10) || 0;
        box.querySelectorAll('button').forEach((b) => {
          const bv = parseInt(b.dataset.value, 10);
          b.classList.toggle('is-on', bv <= v);
        });
      });
      // pre-select 5 stars by default for demo "wow"
      box.querySelectorAll('button').forEach((b) => b.classList.add('is-on'));
      box.dataset.score = 5;
    });

    // review forms
    root.querySelectorAll('[data-form="client-review"], [data-form="provider-review"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        UI.toast('Obrigado pela avaliação', 'success');
        window.location.hash = form.dataset.form === 'client-review' ? '#/cliente' : '#/prestador';
      });
    });

    // provider send proposal
    root.querySelectorAll('[data-form="provider-send-proposal"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        UI.toast('Proposta enviada à cliente', 'success');
        window.location.hash = '#/prestador/propostas';
      });
    });

    // sort segmented for proposals
    const sortBar = root.querySelector('#sort-bar');
    if (sortBar) {
      sortBar.querySelectorAll('.segmented__item').forEach((item) => {
        item.addEventListener('click', () => {
          sortBar.querySelectorAll('.segmented__item').forEach((i) => i.classList.remove('is-active'));
          item.classList.add('is-active');
          sortProposals(item.dataset.sort, root);
        });
      });
    }

    // mobile drawer toggle (header)
    const headerEl = document.getElementById('site-header');
    headerEl.querySelectorAll('[data-action="toggle-mobile-nav"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const drawer = headerEl.querySelector('#mobile-drawer');
        if (drawer) drawer.classList.toggle('is-open');
      });
    });

    // chips that toggle (e.g., specialties in provider signup step 4)
    root.querySelectorAll('label.chip').forEach((label) => {
      const input = label.querySelector('input[type="checkbox"], input[type="radio"]');
      if (!input) return;
      label.addEventListener('click', (e) => {
        if (e.target === input) return;
        if (input.type === 'radio') {
          // group sync
          const group = root.querySelectorAll(`input[name="${input.name}"]`);
          group.forEach((i) => {
            i.checked = false;
            i.closest('label.chip')?.classList.remove('is-active');
          });
          input.checked = true;
          label.classList.add('is-active');
        } else {
          input.checked = !input.checked;
          label.classList.toggle('is-active', input.checked);
        }
      });
    });
  }

  function sortProposals(mode, root) {
    const list = root.querySelector('#proposal-list');
    if (!list) return;
    const items = Array.from(list.children);
    const order = items.map((el) => {
      const id = el.dataset.proposalId;
      const p = D.PROPOSALS.find((x) => x.id === id);
      const pro = D.findProvider(p.provider_id);
      let key = 0;
      if (mode === 'recent')   key = -p.sent_minutes_ago;
      if (mode === 'cheapest') key = -p.value;
      if (mode === 'rated')    key = pro.rating_avg * 100 + pro.rating_count * 0.05;
      if (mode === 'closest')  key = -D.distanceFromClient(pro);
      return { el, key };
    });
    order.sort((a, b) => b.key - a.key);
    order.forEach((o) => list.appendChild(o.el));
  }

  // ------------------------------------------------------------------
  // Header scroll shadow
  // ------------------------------------------------------------------
  function onScroll() {
    const h = document.getElementById('site-header');
    if (!h) return;
    h.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  // ------------------------------------------------------------------
  // PWA install banner
  // ------------------------------------------------------------------
  let deferredPrompt = null;
  function setupInstallBanner() {
    const banner = document.getElementById('install-banner');
    const accept = document.getElementById('install-accept');
    const dismiss = document.getElementById('install-dismiss');
    const hint = document.getElementById('install-banner-hint');

    const dismissed = localStorage.getItem('larcare_install_dismissed_at');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 1000 * 60 * 60 * 24 * 7) return;

    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      hint.textContent = 'Acesso rápido, sem entrar pelo navegador.';
      setTimeout(() => { banner.hidden = false; }, 30000);
    });

    if (isIOS) {
      hint.textContent = 'Toque no botão "Compartilhar" e depois em "Adicionar à tela de início".';
      accept.textContent = 'Ver como';
      setTimeout(() => { banner.hidden = false; }, 30000);
    } else if (isAndroid && !deferredPrompt) {
      hint.textContent = 'No menu do navegador, escolha "Instalar app".';
      setTimeout(() => { banner.hidden = false; }, 30000);
    }

    accept.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        banner.hidden = true;
      } else {
        UI.modal({
          title: 'Instalar no seu celular',
          body: isIOS
            ? '1. Toque no ícone de compartilhar (□↑) na barra do Safari.<br/>2. Role e escolha <strong>Adicionar à Tela de Início</strong>.<br/>3. Confirme com <strong>Adicionar</strong>.'
            : '1. Toque nos três pontinhos do navegador.<br/>2. Escolha <strong>Adicionar à tela inicial</strong> ou <strong>Instalar app</strong>.<br/>3. Confirme.',
          primary: 'Entendi'
        });
      }
    });
    dismiss.addEventListener('click', () => {
      localStorage.setItem('larcare_install_dismissed_at', Date.now().toString());
      banner.hidden = true;
    });
  }

  // ------------------------------------------------------------------
  // Demo FAB
  // ------------------------------------------------------------------
  function setupDemoFab() {
    const fab = document.getElementById('demo-fab');
    fab.addEventListener('click', () => {
      global.LarCareTour.start();
    });
  }

  // ------------------------------------------------------------------
  // Service worker
  // ------------------------------------------------------------------
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') return;
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline-first is best-effort */ });
  }

  // ------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------
  function boot() {
    global.LarCareApp = { state };
    if (!window.location.hash) window.location.hash = '#/';
    window.addEventListener('hashchange', render);
    window.addEventListener('scroll', onScroll, { passive: true });
    render();
    setupInstallBanner();
    setupDemoFab();
    registerSW();
    // Auto-start guided tour when arriving from LP via ?tour=1
    try {
      const search = new URLSearchParams(window.location.search);
      if (search.get('tour') === '1' && global.LarCareTour) {
        setTimeout(() => global.LarCareTour.start(), 600);
      }
    } catch (_) { /* noop */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
