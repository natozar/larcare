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
      if (len === 2 && s[1] === 'perfil')       return { view: 'clientProfile',   variant: 'client' };
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

    // Bottom nav fixa em client/provider (mobile)
    renderBottomNav(route);

    // close mobile drawer on navigation
    document.querySelectorAll('.mobile-drawer.is-open').forEach((d) => d.classList.remove('is-open'));

    // header scroll effect
    onScroll();
  }

  function renderBottomNav(route) {
    const navEl = document.getElementById('app-bottom-nav');
    if (!navEl) return;
    const variant = route.variant;
    if (variant !== 'client' && variant !== 'provider') {
      navEl.hidden = true;
      navEl.innerHTML = '';
      document.body.classList.remove('has-bottom-nav');
      return;
    }
    document.body.classList.add('has-bottom-nav');
    navEl.hidden = false;

    const current = '#' + window.location.hash.replace(/^#/, '');
    const isActive = (path) => current.startsWith(path);

    const items = variant === 'client' ? [
      { href: '#/cliente',                 icon: 'home',  label: 'Início' },
      { href: '#/cliente/nova-demanda',    icon: 'plus',  label: 'Solicitar' },
      { href: '#/cliente/historico',       icon: 'list',  label: 'Histórico' },
      { href: '#/cliente/perfil',          icon: 'user',  label: 'Perfil' }
    ] : [
      { href: '#/prestador',               icon: 'home',  label: 'Demandas' },
      { href: '#/prestador/propostas',     icon: 'list',  label: 'Propostas', badge: pendingProposalsBadge() },
      { href: '#/prestador/perfil',        icon: 'user',  label: 'Perfil' },
      { href: '#/',                        icon: 'arrow_left', label: 'Sair' }
    ];

    // 3-column layout when only 3 items
    navEl.innerHTML = `
      <div class="app-bottom-nav__inner" style="grid-template-columns: repeat(${items.length}, 1fr);">
        ${items.map((it) => `
          <a class="app-bottom-nav__item${isActive(it.href) ? ' is-active' : ''}" href="${it.href}">
            ${UI.icon(it.icon, 22)}
            <span>${it.label}</span>
            ${it.badge ? `<span class="app-bottom-nav__badge">${it.badge}</span>` : ''}
          </a>
        `).join('')}
      </div>
    `;
  }

  function pendingProposalsBadge() {
    // Conta propostas aceitas para o prestador demo pro-001 (ele recebeu propostas aceitas)
    const D = global.LarCareData;
    if (!D) return '';
    const accepted = D.proposalsByProvider('pro-001').filter((p) => p.status === 'accepted').length;
    return accepted > 0 ? String(accepted) : '';
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
      clientProfile: 'Meu perfil',
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
        const nd = state.newDemand;
        // Mapeia "period" textual ("Manhã"/"Tarde"/"Noite"/"Qualquer") para slug
        const periodMap = { 'Manhã': 'manha', 'Tarde': 'tarde', 'Noite': 'noite', 'Qualquer': 'qualquer' };
        const time_pref = periodMap[nd.period] || 'qualquer';
        const created = global.LarCareSim
          ? global.LarCareSim.createDemand({
              cat: nd.cat || 'faz_tudo',
              description: nd.description || '',
              urgency: nd.urgency || 'ate_3_dias',
              time_pref,
              budget_min: nd.budget_min || 100,
              budget_max: nd.budget_max || 280
            })
          : null;
        UI.toast('Demanda publicada', 'success');
        const targetId = created ? created.id : 'dem-001';
        window.location.hash = `#/cliente/demanda/${targetId}/aguardando`;
      });
    }

    // Interceptar aceitar proposta: avisa o simulator antes de seguir o link
    root.querySelectorAll('a[href^="#/cliente/contratado/"]').forEach((a) => {
      a.addEventListener('click', () => {
        const id = a.getAttribute('href').replace('#/cliente/contratado/', '');
        if (global.LarCareSim) global.LarCareSim.acceptProposal(id);
      });
    });

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
        // marca como concluída no simulator (se demanda ativa)
        if (global.LarCareSim) {
          const s = global.LarCareSim.state();
          if (s.activeDemand) global.LarCareSim.markCompleted(s.activeDemand, 5);
        }
        if (global.LarCareAudio) global.LarCareAudio.reviewSubmitted();
        UI.toast('Obrigado pela avaliação', 'success');
        window.location.hash = form.dataset.form === 'client-review' ? '#/cliente' : '#/prestador';
      });
    });

    // Preferências (toggles em Perfil): sons, vibração
    root.querySelectorAll('[data-toggle]').forEach((input) => {
      input.addEventListener('change', () => {
        const key = input.dataset.toggle;
        const on = input.checked;
        if (key === 'sounds' && global.LarCareAudio) global.LarCareAudio.setEnabled(on);
        if (key === 'vibration' && global.LarCareAudio) global.LarCareAudio.setVibEnabled(on);
        UI.toast(on ? 'Ativado' : 'Desativado');
      });
    });

    // Troca de papel (Cliente ⇄ Prestador) via toggle em Perfil
    root.querySelectorAll('[data-action="switch-role"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.role; // 'client' | 'provider'
        if (global.LarCareSim) global.LarCareSim.setRole(target);
        window.location.hash = target === 'provider' ? '#/prestador' : '#/cliente';
      });
    });

    // Fast-forward visível em Perfil > Demo controls
    root.querySelectorAll('[data-action="fast-forward"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (global.LarCareSim) global.LarCareSim.fastForward();
        UI.toast('Tempo avançado — propostas pendentes entregues');
      });
    });

    // Editar nome (cliente perfil)
    root.querySelectorAll('[data-action="edit-name"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const current = localStorage.getItem('larcare_display_name') || global.LarCareData.DEMO_CLIENT.first_name;
        const name = prompt('Como você quer ser chamada?', current);
        if (name && name.trim()) {
          localStorage.setItem('larcare_display_name', name.trim());
          UI.toast('Nome atualizado');
          render();
        }
      });
    });

    // provider send proposal
    root.querySelectorAll('[data-form="provider-send-proposal"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        UI.toast('Proposta enviada à cliente', 'success');
        // Simula resposta do cliente após 12-18s
        setTimeout(() => {
          if (global.LarCareUI) global.LarCareUI.toast('Sua proposta foi aceita!', 'success');
          try { navigator.vibrate && navigator.vibrate([60, 40, 80]); } catch (_) {}
        }, 12000 + Math.random() * 6000);
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

    // Reset demo (botão visível em clientProfile/providerProfile)
    root.querySelectorAll('[data-action="reset-demo"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (confirm('Resetar a demo? Toda demanda criada e propostas recebidas serão apagadas.')) {
          if (global.LarCareSim) global.LarCareSim.reset();
          else window.location.reload();
        }
      });
    });

    // Buscar atualização manual
    root.querySelectorAll('[data-action="check-update"]').forEach((btn) => {
      btn.addEventListener('click', () => checkForUpdates());
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

  function setupDemoBanner() {
    const banner = document.getElementById('demo-banner');
    if (!banner) return;
    // standalone? esconde (já tá instalado, banner polui)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const dismissed = sessionStorage.getItem('larcare_demo_banner_dismissed');
    if (isStandalone || dismissed) {
      banner.style.display = 'none';
      return;
    }
    banner.addEventListener('click', (e) => {
      if (!e.target.closest('[data-action="dismiss-demo-banner"]')) return;
      sessionStorage.setItem('larcare_demo_banner_dismissed', '1');
      banner.classList.add('is-dismissing');
      // Anima saída por 240ms (definido em CSS) antes de remover do fluxo
      const after = () => { banner.style.display = 'none'; };
      banner.addEventListener('animationend', after, { once: true });
      // Fallback caso animation não dispare (prefers-reduced-motion etc)
      setTimeout(after, 320);
    });
  }

  // ------------------------------------------------------------------
  // Service worker
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // PWA: registro do SW + detecção de nova versão + botão "Atualizar"
  // ------------------------------------------------------------------
  let swRegistration = null;
  let waitingWorker = null;
  let isApplyingUpdate = false;

  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') return;
    // updateViaCache:'none' garante que o próprio sw.js nunca é servido
    // do cache HTTP do browser. Importante para detectar versão nova.
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
      swRegistration = reg;
      // Se já há um SW em waiting na hora do registro, é update pendente
      if (reg.waiting && navigator.serviceWorker.controller) {
        waitingWorker = reg.waiting;
        showUpdateBanner();
      }
      reg.addEventListener('updatefound', () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            // Há controller anterior → este é um UPDATE real, não primeiro install
            waitingWorker = installing;
            showUpdateBanner();
          }
        });
      });
      // Verifica atualizações a cada visibilitychange (volta da background)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
      // E uma vez a cada 30 min em foreground
      setInterval(() => { reg.update().catch(() => {}); }, 30 * 60 * 1000);
    }).catch(() => { /* offline-first is best-effort */ });
  }

  function showUpdateBanner() {
    const banner = document.getElementById('update-banner');
    if (banner) banner.hidden = false;
  }
  function hideUpdateBanner() {
    const banner = document.getElementById('update-banner');
    if (banner) banner.hidden = true;
  }

  function applyUpdate() {
    if (isApplyingUpdate) return;
    isApplyingUpdate = true;
    const banner = document.getElementById('update-banner');
    if (banner) {
      const cta = banner.querySelector('.update-banner__cta');
      if (cta) { cta.disabled = true; cta.textContent = 'Atualizando…'; }
    }
    // Manda o SW em waiting pular a fila
    if (waitingWorker) waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    // Reload com pequeno delay para o SW reivindicar o controller
    setTimeout(() => window.location.reload(), 600);
  }

  function checkForUpdates() {
    if (!('serviceWorker' in navigator)) {
      UI.toast('Atualizações automáticas não disponíveis neste navegador');
      return;
    }
    UI.toast('Verificando…');
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) {
        UI.toast('Service Worker não registrado. Recarregue a página.');
        return;
      }
      // Snapshot do estado antes do update()
      const hadWaiting = !!reg.waiting;
      reg.update().then(() => {
        // Espera ~1.6s para o updatefound listener disparar caso haja versão nova
        setTimeout(() => {
          const newWaiting = !!reg.waiting && reg.waiting !== (hadWaiting ? reg.waiting : null);
          if (waitingWorker || newWaiting) {
            // banner já foi mostrado pelo updatefound listener
            UI.toast('Nova versão pronta — toque em "Atualizar agora".', 'success');
          } else {
            UI.toast('Você já está na versão mais recente.', 'success');
          }
        }, 1600);
      }).catch(() => {
        UI.toast('Não foi possível verificar atualizações agora.');
      });
    });
  }

  // ------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------
  async function boot() {
    global.LarCareApp = { state };
    // Hot-swap: se USE_SUPABASE=true em js/config.js, bootstrap troca
    // window.LarCareData por dados reais do Supabase. Senão, no-op imediato.
    try {
      if (global.LarCareData && typeof global.LarCareData.bootstrap === 'function') {
        await global.LarCareData.bootstrap();
      }
    } catch (_) { /* fallback já tratado dentro do data_layer */ }
    // Re-bind D após possível swap do namespace
    Object.assign(D, global.LarCareData);

    // Inicia o simulador de vida (timers, persistência, debug tap)
    if (global.LarCareSim) global.LarCareSim.start();

    // Banner Modo Demonstração — dismiss + esconde se já fechado nesta sessão
    setupDemoBanner();

    // Wire global do botão "Atualizar agora" no banner de update
    document.getElementById('update-banner').addEventListener('click', (e) => {
      if (e.target.closest('[data-action="apply-update"]')) applyUpdate();
    });

    // Re-render quando o simulador muta os dados (proposta nova, status muda etc.)
    const liveEvents = ['larcare:proposal-received', 'larcare:demand-status', 'larcare:proposal-accepted', 'larcare:demand-created'];
    liveEvents.forEach((evt) => document.addEventListener(evt, (e) => {
      // Toast e re-render só se relevante para a rota atual
      const route = resolveRoute();
      const liveRoutes = ['proposalsList', 'demandPublished', 'clientDashboard', 'providerDashboard', 'demandDetail'];
      if (evt === 'larcare:proposal-received' && e.detail) {
        const pro = e.detail.provider;
        const dem = e.detail.demand;
        const msg = e.detail.isFirst
          ? `Primeira proposta de ${pro.first_name} chegou!`
          : `Nova proposta de ${pro.first_name} para "${dem.title.slice(0, 40)}"`;
        UI.toast(msg, 'success');
      }
      if (evt === 'larcare:demand-status' && e.detail) {
        const labels = {
          em_atendimento: 'O prestador está a caminho',
          aguardando_avaliacao: 'Serviço concluído — sua avaliação importa',
          completed: 'Serviço marcado como concluído'
        };
        const t = labels[e.detail.status];
        if (t) UI.toast(t);
      }
      if (liveRoutes.indexOf(route.view) !== -1) render();
    }));

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
