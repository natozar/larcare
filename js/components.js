/* =========================================================================
   LarCare — UI helpers & shared components
   Plain-DOM, framework-free. Functions return strings (HTML) where it
   helps composition, and DOM nodes when interaction matters.
   ========================================================================= */
(function (global) {
  'use strict';

  // ------------------------------------------------------------------
  // Icon library (inline SVG paths)
  // ------------------------------------------------------------------
  const ICONS = {
    bolt:    '<path d="M13 2L3 14h7l-1 8 11-13h-7l1-7z"/>',
    drop:    '<path d="M12 2.5s7 7.6 7 12.2A7 7 0 1 1 5 14.7C5 10.1 12 2.5 12 2.5z"/>',
    saw:     '<path d="M3 13h2l1-2h2l1-2h2l1-2h2l1-2h2l1-2h2v6L11 21H4l-1-2v-6z"/>',
    brush:   '<path d="M4 20l6-2 8-8-4-4-8 8-2 6zM14 6l4 4"/>',
    leaf:    '<path d="M5 19s2-12 14-14c0 12-7 16-14 14zM5 19c2-3 5-5 8-7"/>',
    box:     '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4M21 7v10l-9 4M12 11v10"/>',
    tv:      '<rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M9 21h6M12 17v4"/>',
    wrench:  '<path d="M14.7 6.3a4 4 0 1 0-5 5l-7 7 3 3 7-7a4 4 0 0 0 5-5l-2.3 2.3-1.4-1.4 2.3-2.3z"/>',
    sparkle: '<path d="M12 3l1.8 4.8L19 9.6l-4.8 1.8L12 16l-1.8-4.6L5 9.6l4.8-1.8z"/><path d="M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>',
    shield:  '<path d="M12 3l8 3v5c0 5-4 9-8 10-4-1-8-5-8-10V6l8-3z"/><path d="M9 12l2 2 4-4"/>',

    check:        '<path d="M5 12l5 5 9-11"/>',
    arrow_right:  '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrow_left:   '<path d="M19 12H5M11 6L5 12l6 6"/>',
    chevron_down: '<path d="M6 9l6 6 6-6"/>',
    plus:         '<path d="M12 5v14M5 12h14"/>',
    star:         '<path d="M12 3l2.7 6 6.3.6-4.8 4.4 1.5 6.4L12 17l-5.7 3.4 1.5-6.4L3 9.6l6.3-.6z" stroke-linejoin="round"/>',
    map_pin:      '<path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    clock:        '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chat:         '<path d="M21 12a8 8 0 1 1-3-6.2L21 5l-1 4a8 8 0 0 1 1 3z"/>',
    phone:        '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    whatsapp:     '<path d="M16.6 13.6c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1-.5-1.7-.9-2.4-2-.2-.4 0-.4.2-.6.2-.2.4-.5.5-.7l.2-.4c.1-.2 0-.3 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2.1 3.1 5 4.3.7.3 1.2.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4z"/><path d="M3 21l1.6-4.7A8.7 8.7 0 1 1 7.4 19L3 21z"/>',
    bell:         '<path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z"/><path d="M10 21h4"/>',
    user:         '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
    home:         '<path d="M3 11l9-8 9 8v10h-6v-7H9v7H3z"/>',
    list:         '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.5"/><circle cx="3.5" cy="12" r="1.5"/><circle cx="3.5" cy="18" r="1.5"/>',
    cog:          '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 4.7 1.6 1.6 0 0 0 10 3.2V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    upload:       '<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',
    camera:       '<path d="M5 7h3l2-2h4l2 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><circle cx="12" cy="13" r="3.5"/>',
    lock:         '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    play:         '<path d="M6 4l14 8-14 8z"/>',
    close:        '<path d="M6 6l12 12M6 18L18 6"/>',
    menu:         '<path d="M4 6h16M4 12h16M4 18h16"/>',
    search:       '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
    edit:         '<path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="M14 6l4 4"/>',
    shield_check: '<path d="M12 3l8 3v5c0 5-4 9-8 10-4-1-8-5-8-10V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
    cross:        '<path d="M6 6l12 12M6 18L18 6"/>',
    money:        '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M3 10h2M19 14h2"/>',
    calendar:     '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    info:         '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>',
    car:          '<path d="M3 12l2-5h14l2 5v5H3v-5z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>'
  };

  function icon(name, size = 20, attrs = '') {
    const path = ICONS[name] || ICONS.info;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${attrs}>${path}</svg>`;
  }

  // ------------------------------------------------------------------
  // Brand mark (SVG)
  // ------------------------------------------------------------------
  function brandMark(size = 28) {
    return `
      <svg class="brand__mark" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path d="M9 17 L9 23 L23 23 L23 17 L16 11 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M14.5 19.5 c-1.6-1.2 -1.4-3.2 0-3.6 c0.7-0.2 1.2 0.1 1.5 0.5 c0.3-0.4 0.8-0.7 1.5-0.5 c1.4 0.4 1.6 2.4 0 3.6 c-0.6 0.5 -1.2 0.9 -1.5 1.1 c-0.3-0.2 -0.9-0.6 -1.5-1.1 z" fill="#D4A574"/>
      </svg>
    `;
  }

  function brandLogo() {
    return `<a class="brand" href="#/" aria-label="LarCare — início">${brandMark()}<span class="brand__name">LarCare</span></a>`;
  }

  // ------------------------------------------------------------------
  // Header & footer
  // ------------------------------------------------------------------
  function renderPublicHeader(currentRoute) {
    const links = [
      { href: '#/como-funciona/cliente', label: 'Como funciona' },
      { href: '#/seguranca',             label: 'Segurança' },
      { href: '#/sobre',                 label: 'Sobre' }
    ];
    const isActive = (l) => currentRoute && currentRoute.indexOf(l.href.replace('#', '')) === 0;
    return `
      <div class="site-header__inner">
        ${brandLogo()}
        <nav class="nav" aria-label="Navegação principal">
          ${links.map((l) => `<a class="nav__link${isActive(l) ? ' is-active' : ''}" href="${l.href}">${l.label}</a>`).join('')}
        </nav>
        <div class="header-actions">
          <a class="btn btn--ghost btn--sm hide-mobile" href="#/cadastro/cliente">Sou cliente</a>
          <a class="btn btn--primary btn--sm" href="#/cadastro/prestador">Sou prestador</a>
          <button class="menu-toggle" type="button" aria-label="Menu" data-action="toggle-mobile-nav">
            ${icon('menu', 22)}
          </button>
        </div>
      </div>
      <div class="mobile-drawer" id="mobile-drawer">
        ${links.map((l) => `<a class="nav__link${isActive(l) ? ' is-active' : ''}" href="${l.href}">${l.label}</a>`).join('')}
        <a class="nav__link" href="#/cadastro/cliente">Sou cliente</a>
        <a class="nav__link" href="#/cadastro/prestador">Sou prestador</a>
      </div>
    `;
  }

  function renderClientHeader(currentRoute) {
    const c = LarCareData.DEMO_CLIENT;
    return `
      <div class="site-header__inner">
        ${brandLogo()}
        <nav class="nav" aria-label="Navegação cliente">
          <a class="nav__link${currentRoute === '/cliente' ? ' is-active' : ''}" href="#/cliente">Início</a>
          <a class="nav__link" href="#/cliente/nova-demanda">Nova solicitação</a>
          <a class="nav__link${currentRoute === '/cliente/historico' ? ' is-active' : ''}" href="#/cliente/historico">Histórico</a>
        </nav>
        <div class="header-actions">
          <span class="avatar avatar--sm avatar--accent" title="${c.first_name}">${c.initials}</span>
          <button class="menu-toggle" type="button" aria-label="Menu" data-action="toggle-mobile-nav">${icon('menu',22)}</button>
        </div>
      </div>
      <div class="mobile-drawer" id="mobile-drawer">
        <a class="nav__link" href="#/cliente">Início</a>
        <a class="nav__link" href="#/cliente/nova-demanda">Nova solicitação</a>
        <a class="nav__link" href="#/cliente/historico">Histórico</a>
        <a class="nav__link" href="#/">Sair</a>
      </div>
    `;
  }

  function renderProviderHeader(currentRoute) {
    const p = LarCareData.findProvider('pro-001');
    return `
      <div class="site-header__inner">
        ${brandLogo()}
        <nav class="nav" aria-label="Navegação prestador">
          <a class="nav__link${currentRoute === '/prestador' ? ' is-active' : ''}" href="#/prestador">Demandas</a>
          <a class="nav__link${currentRoute === '/prestador/propostas' ? ' is-active' : ''}" href="#/prestador/propostas">Minhas propostas</a>
          <a class="nav__link${currentRoute === '/prestador/perfil' ? ' is-active' : ''}" href="#/prestador/perfil">Perfil</a>
        </nav>
        <div class="header-actions">
          <span class="avatar avatar--sm" title="${p.first_name}">${p.initials}</span>
          <button class="menu-toggle" type="button" aria-label="Menu" data-action="toggle-mobile-nav">${icon('menu',22)}</button>
        </div>
      </div>
      <div class="mobile-drawer" id="mobile-drawer">
        <a class="nav__link" href="#/prestador">Demandas</a>
        <a class="nav__link" href="#/prestador/propostas">Minhas propostas</a>
        <a class="nav__link" href="#/prestador/perfil">Perfil</a>
        <a class="nav__link" href="#/">Sair</a>
      </div>
    `;
  }

  function renderFooter() {
    return `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            ${brandLogo()}
            <p class="t-dim mt-3" style="max-width: 320px;">Pequenos reparos domésticos com prestadores verificados.<br/>Cuidar do lar, sem depender de ninguém.</p>
          </div>
          <div>
            <h4>Para clientes</h4>
            <ul class="footer-list">
              <li><a href="#/como-funciona/cliente">Como funciona</a></li>
              <li><a href="#/cadastro/cliente">Criar conta</a></li>
              <li><a href="#/seguranca">Verificação de prestadores</a></li>
            </ul>
          </div>
          <div>
            <h4>Para prestadores</h4>
            <ul class="footer-list">
              <li><a href="#/como-funciona/prestador">Como funciona</a></li>
              <li><a href="#/cadastro/prestador">Cadastre-se</a></li>
              <li><a href="#/faq">Perguntas frequentes</a></li>
            </ul>
          </div>
          <div>
            <h4>Institucional</h4>
            <ul class="footer-list">
              <li><a href="#/sobre">Sobre o LarCare</a></li>
              <li><a href="#/contato">Suporte</a></li>
              <li><a href="#/termos">Termos de uso</a></li>
              <li><a href="#/privacidade">Privacidade & LGPD</a></li>
            </ul>
          </div>
        </div>
        <p class="footer-legal">
          LarCare é plataforma de conexão entre clientes e prestadores de serviço autônomos. Não somos empregadores dos prestadores e não respondemos solidariamente pelos serviços prestados, salvo nos limites previstos em contrato e legislação aplicável. Operamos em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Para mais informações, consulte nossos <a href="#/termos">Termos de Uso</a> e <a href="#/privacidade">Política de Privacidade</a>.
        </p>
      </div>
    `;
  }

  // ------------------------------------------------------------------
  // Reusable bits
  // ------------------------------------------------------------------
  function avatar(person, size = 'md') {
    const cls = size === 'lg' ? ' avatar--lg' : (size === 'xl' ? ' avatar--xl' : (size === 'sm' ? ' avatar--sm' : ''));
    const tone = person.avatar_color === 'accent' ? ' avatar--accent' : '';
    return `<span class="avatar${cls}${tone}" aria-hidden="true">${person.initials}</span>`;
  }

  function ratingStars(value) {
    const full = Math.round(value);
    const stars = Array.from({ length: 5 }, (_, i) =>
      `<svg viewBox="0 0 24 24" width="16" height="16" fill="${i < full ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.6">${ICONS.star}</svg>`
    ).join('');
    return `<span class="rating__stars" aria-hidden="true">${stars}</span>`;
  }

  function rating(person) {
    return `
      <span class="rating">
        ${ratingStars(person.rating_avg)}
        <span class="rating__value">${person.rating_avg.toFixed(1)}</span>
        <span class="t-dim">(${person.rating_count})</span>
      </span>
    `;
  }

  function chip(text, opts = {}) {
    const cls = ['chip'];
    if (opts.variant) cls.push(`chip--${opts.variant}`);
    if (opts.active) cls.push('is-active');
    if (opts.static) cls.push('chip--static');
    return `<span class="${cls.join(' ')}">${opts.icon ? icon(opts.icon, 14) : ''}${text}</span>`;
  }

  function badge(text, variant) {
    return `<span class="badge${variant ? ' badge--' + variant : ''}">${text}</span>`;
  }

  function statusPill(status) {
    const map = {
      open:      { cls: 'status--waiting',   label: 'Aguardando propostas' },
      proposals: { cls: 'status--proposals', label: 'Propostas recebidas' },
      hired:     { cls: 'status--hired',     label: 'Contratado' },
      done:      { cls: 'status--done',      label: 'Concluído' },
      analysis:  { cls: 'status--analysis',  label: 'Em análise' },
      approved:  { cls: 'status--approved',  label: 'Aprovado' }
    };
    const s = map[status] || { cls: '', label: status };
    return `<span class="status ${s.cls}">${s.label}</span>`;
  }

  // ------------------------------------------------------------------
  // Toast & modal
  // ------------------------------------------------------------------
  function toast(text, variant) {
    const root = document.getElementById('toast-root');
    const el = document.createElement('div');
    el.className = 'toast' + (variant ? ` toast--${variant}` : '');
    el.textContent = text;
    root.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'toast-out 220ms cubic-bezier(0.4,0,0.2,1) forwards';
      setTimeout(() => el.remove(), 220);
    }, 2600);
  }

  function modal({ title, body, primary, secondary, onPrimary, onSecondary }) {
    const root = document.getElementById('modal-root');
    root.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h3 id="modal-title" style="margin-bottom: 12px;">${title}</h3>
        <div style="color: var(--text-dim); margin-bottom: 24px;">${body}</div>
        <div class="row row--end">
          ${secondary ? `<button class="btn btn--ghost" data-modal-action="secondary">${secondary}</button>` : ''}
          ${primary ? `<button class="btn btn--primary" data-modal-action="primary">${primary}</button>` : ''}
        </div>
      </div>
    `;
    root.setAttribute('aria-hidden', 'false');
    const close = () => { root.setAttribute('aria-hidden', 'true'); root.innerHTML = ''; };
    root.addEventListener('click', (e) => {
      if (e.target === root) { close(); return; }
      const a = e.target.closest('[data-modal-action]');
      if (!a) return;
      if (a.dataset.modalAction === 'primary' && onPrimary) onPrimary();
      if (a.dataset.modalAction === 'secondary' && onSecondary) onSecondary();
      close();
    }, { once: true });
  }

  // ------------------------------------------------------------------
  // Photo placeholder card (used in client demand description)
  // ------------------------------------------------------------------
  function photoPlaceholder(label) {
    return `<div class="photo-grid__item">${icon('camera', 24)}<span class="sr-only">${label || 'Foto'}</span></div>`;
  }

  // ------------------------------------------------------------------
  // Hero illustration (SVG editorial of a calm interior)
  // ------------------------------------------------------------------
  function heroIllustration() {
    return `
      <svg viewBox="0 0 600 720" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ambiente residencial tranquilo, casa cuidada">
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#FAF3E2"/>
            <stop offset="1" stop-color="#F2E5C9"/>
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#D9C9A6"/>
            <stop offset="1" stop-color="#B69A6E"/>
          </linearGradient>
          <linearGradient id="couch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#7AA294"/>
            <stop offset="1" stop-color="#3E6B5C"/>
          </linearGradient>
        </defs>
        <rect width="600" height="720" fill="url(#wall)"/>
        <!-- ventana -->
        <rect x="60" y="80" width="220" height="280" rx="6" fill="#EAF1EC" stroke="#3E6B5C" stroke-width="3"/>
        <line x1="170" y1="80" x2="170" y2="360" stroke="#3E6B5C" stroke-width="3"/>
        <line x1="60" y1="220" x2="280" y2="220" stroke="#3E6B5C" stroke-width="3"/>
        <!-- sun -->
        <circle cx="220" cy="160" r="26" fill="#D4A574" opacity="0.9"/>
        <!-- planta vaso -->
        <ellipse cx="430" cy="430" rx="58" ry="14" fill="#5C4A2C" opacity="0.4"/>
        <path d="M430 380 q-30 -30 -45 -90 q40 30 45 90 z M430 380 q30 -30 45 -90 q-40 30 -45 90 z M430 390 q-15 -50 0 -100 q15 50 0 100 z" fill="#5F8B6E"/>
        <rect x="395" y="380" width="70" height="60" rx="6" fill="#D4A574"/>
        <!-- couch -->
        <rect x="40" y="500" width="350" height="120" rx="20" fill="url(#couch)"/>
        <rect x="60" y="470" width="60" height="40" rx="10" fill="#FAF3E2"/>
        <rect x="160" y="470" width="60" height="40" rx="10" fill="#EDDBC0"/>
        <rect x="260" y="470" width="60" height="40" rx="10" fill="#FAF3E2"/>
        <!-- mesa lateral -->
        <rect x="430" y="540" width="120" height="14" rx="2" fill="#8B6B3A"/>
        <rect x="445" y="554" width="6" height="80" fill="#8B6B3A"/>
        <rect x="529" y="554" width="6" height="80" fill="#8B6B3A"/>
        <!-- abajur -->
        <path d="M460 540 L500 540 L490 500 L470 500 Z" fill="#FAF3E2" stroke="#3E6B5C" stroke-width="2"/>
        <line x1="480" y1="500" x2="480" y2="490" stroke="#3E6B5C" stroke-width="2"/>
        <!-- piso -->
        <rect x="0" y="640" width="600" height="80" fill="url(#floor)"/>
      </svg>
    `;
  }

  // ------------------------------------------------------------------
  // Form helpers
  // ------------------------------------------------------------------
  function field({ label, name, type = 'text', placeholder = '', value = '', hint = '', required = false, mask = '', autocomplete = '' }) {
    const input = type === 'textarea'
      ? `<textarea class="textarea" name="${name}" id="f-${name}" placeholder="${placeholder}" ${required ? 'required' : ''}>${value}</textarea>`
      : `<input class="input" type="${type}" id="f-${name}" name="${name}" placeholder="${placeholder}" value="${value}" ${required ? 'required' : ''} ${autocomplete ? `autocomplete="${autocomplete}"` : ''} ${mask ? `data-mask="${mask}"` : ''} />`;
    return `
      <label class="field">
        <span class="field__label">${label}${required ? ' <span aria-hidden="true">·</span>' : ''}</span>
        ${input}
        ${hint ? `<span class="field__hint">${hint}</span>` : ''}
      </label>
    `;
  }

  // ------------------------------------------------------------------
  // Mount helpers
  // ------------------------------------------------------------------
  function setHeader(html, variant) {
    const h = document.getElementById('site-header');
    h.innerHTML = html;
    h.dataset.variant = variant;
  }
  function setFooter(html) {
    document.getElementById('site-footer').innerHTML = html;
  }

  function mountApp(html, opts = {}) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="app-route">${html}</div>`;
    if (opts.afterMount) opts.afterMount(app);
    if (opts.title) document.title = `${opts.title} — LarCare`;
    if (opts.scrollTop !== false) window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // ------------------------------------------------------------------
  // Public API
  // ------------------------------------------------------------------
  global.LarCareUI = {
    icon, brandMark, brandLogo,
    renderPublicHeader, renderClientHeader, renderProviderHeader, renderFooter,
    avatar, ratingStars, rating, chip, badge, statusPill,
    toast, modal, photoPlaceholder, heroIllustration, field,
    setHeader, setFooter, mountApp
  };
})(window);
