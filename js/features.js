/* =========================================================================
   LarCare — features novas v2.0
   =========================================================================
   Agrupa numa única biblioteca:
   * Favoritos do cliente (#/favoritos)
   * Histórico de serviços (#/historico estende a view existente)
   * Central de notificações in-app (sino global + bottom sheet)
   * Toggle "Disponível agora" do prestador
   * Modo emergência (#/emergencia)
   * Detalhe do prestador com 5 tabs (#/prestador-detalhe?id=X)
   ========================================================================= */
(function (global) {
  'use strict';

  // ===== Favoritos =====
  const STORE_FAV = 'larcare:client_favorites';
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem(STORE_FAV) || '[]'); } catch (_) { return []; }
  }
  function isFavorite(prestadorId) {
    return getFavorites().some((f) => f.prestador_id === prestadorId);
  }
  function toggleFavorite(prestadorId) {
    const cur = getFavorites();
    const idx = cur.findIndex((f) => f.prestador_id === prestadorId);
    if (idx >= 0) cur.splice(idx, 1);
    else cur.unshift({ prestador_id: prestadorId, marcado_em: Date.now(), vezes_contratado: 0 });
    try { localStorage.setItem(STORE_FAV, JSON.stringify(cur)); } catch (_) {}
    return idx === -1;
  }

  function favoritos() {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const favs = getFavorites();
    const list = favs.map((f) => ({ fav: f, pro: D.findProvider(f.prestador_id) })).filter((x) => x.pro);

    return `
      <section class="page page--app">
        <div class="container container--narrow">
          <span class="eyebrow">Meus favoritos</span>
          <h1 class="mt-2">${list.length} ${list.length === 1 ? 'prestador favorito' : 'prestadores favoritos'}</h1>

          ${list.length === 0 ? `
            <div class="search-empty t-center mt-7">
              <div class="search-empty__art" aria-hidden="true">⭐</div>
              <h3 class="mt-3">Nenhum favorito ainda</h3>
              <p class="t-dim mt-2">Salve prestadores de confiança para encontrá-los rápido depois.</p>
              <a class="btn btn--primary mt-4" href="#/buscar">Buscar prestadores</a>
            </div>
          ` : `
            <div class="stack mt-5">
              ${list.map(({ pro, fav }) => `
                <article class="search-card" data-link="#/prestador-detalhe?id=${pro.id}">
                  <div class="search-card__avatar">
                    <span class="avatar avatar--lg ${pro.avatar_color === 'accent' ? 'avatar--accent' : ''}">${pro.initials}</span>
                  </div>
                  <div class="search-card__body">
                    <div class="row row--between">
                      <div>
                        <div class="search-card__name">${pro.first_name}</div>
                        <div class="search-card__meta">
                          ${pro.specialties.slice(0,2).map((s) => {
                            const c = D.findCategory(s.cat);
                            return c ? `<span class="search-card__chip">${c.emoji || ''} ${c.name}</span>` : '';
                          }).join('')}
                        </div>
                      </div>
                      <button class="favorite-btn is-active" type="button" data-toggle-fav="${pro.id}" aria-label="Remover dos favoritos">⭐</button>
                    </div>
                    <div class="row mt-2" style="gap:12px;">
                      <span class="t-dim fs-13">⭐ ${pro.rating_avg.toFixed(1)} · ${pro.rating_count} avaliações</span>
                    </div>
                    <div class="row mt-3" style="gap: 8px;">
                      <a class="btn btn--primary btn--sm" href="#/cliente/nova-demanda?prestador=${pro.id}">Pedir novo serviço</a>
                      <a class="btn btn--outline btn--sm" href="#/prestador-detalhe?id=${pro.id}">Ver perfil</a>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          `}
        </div>
      </section>
    `;
  }

  // ===== Histórico com timeline =====
  function historicoTimeline() {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const pays = global.LarCarePayment ? global.LarCarePayment.readPayments() : [];
    const totalSpent = pays.reduce((s, p) => s + p.total, 0);
    // Agrupa por mês
    const byMonth = {};
    pays.forEach((p) => {
      const d = new Date(p.data);
      const key = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      (byMonth[key] = byMonth[key] || []).push(p);
    });
    const months = Object.keys(byMonth);

    return `
      <section class="page page--app">
        <div class="container container--narrow">
          <span class="eyebrow">Histórico</span>
          <h1 class="mt-2">Seus serviços</h1>

          <div class="grid grid-3 mt-5">
            <div class="card">
              <span class="t-dim fs-13">Total</span>
              <div style="font-family: var(--font-serif); font-size: 26px; color: var(--primary); margin-top:4px;">${pays.length}</div>
              <span class="t-faint fs-12">serviços</span>
            </div>
            <div class="card">
              <span class="t-dim fs-13">Investido</span>
              <div style="font-family: var(--font-serif); font-size: 26px; color: var(--accent); margin-top:4px;">R$ ${totalSpent}</div>
              <span class="t-faint fs-12">total</span>
            </div>
            <div class="card">
              <span class="t-dim fs-13">Avaliação média</span>
              <div style="font-family: var(--font-serif); font-size: 26px; margin-top:4px;">4.8 ⭐</div>
              <span class="t-faint fs-12">dada por mim</span>
            </div>
          </div>

          ${pays.length === 0 ? `
            <div class="search-empty t-center mt-7">
              <div class="search-empty__art" aria-hidden="true">📋</div>
              <h3 class="mt-3">Nenhum serviço ainda</h3>
              <p class="t-dim mt-2">Quando você contratar e pagar um serviço, ele aparece aqui.</p>
              <a class="btn btn--primary mt-4" href="#/cliente/nova-demanda">Pedir um serviço</a>
            </div>
          ` : `
            <div class="timeline-stack mt-7">
              ${months.map((m) => `
                <div class="timeline-month">
                  <h3 class="timeline-month__title">${m}</h3>
                  <div class="stack mt-3">
                    ${byMonth[m].map((pay) => {
                      const prop = D.PROPOSALS.find((x) => x.id === pay.proposta_id);
                      const dem = prop ? D.findDemand(prop.demand_id) : null;
                      const pro = prop ? D.findProvider(prop.provider_id) : null;
                      return `
                        <div class="timeline-item">
                          <span class="avatar avatar--sm ${pro && pro.avatar_color === 'accent' ? 'avatar--accent' : ''}">${pro ? pro.initials : '??'}</span>
                          <div class="timeline-item__body">
                            <div style="font-weight:500;">${dem ? dem.title : 'Serviço'}</div>
                            <div class="t-dim fs-13">${pro ? pro.first_name : ''} · ${new Date(pay.data).toLocaleDateString('pt-BR')}</div>
                            <div class="row mt-1" style="gap: 6px; align-items: center;">
                              <span>⭐⭐⭐⭐⭐</span>
                              <strong style="color: var(--primary);">R$ ${pay.total}</strong>
                            </div>
                          </div>
                          <a class="btn-link" href="#/recibo?pagamento=${pay.id}">Ver →</a>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="row mt-7" style="gap: 8px; justify-content: center;">
              <button class="btn btn--outline" type="button" onclick="window.print()">Baixar PDF</button>
            </div>
          `}
        </div>
      </section>
    `;
  }

  // ===== Notificações in-app =====
  const STORE_NOTIFS = 'larcare:notifications_inapp';
  function getInappNotifs() {
    try { return JSON.parse(localStorage.getItem(STORE_NOTIFS) || '[]'); } catch (_) { return []; }
  }
  function saveNotifs(list) {
    try { localStorage.setItem(STORE_NOTIFS, JSON.stringify(list.slice(0, 200))); } catch (_) {}
  }
  function addInappNotif(notif) {
    const list = getInappNotifs();
    list.unshift({
      id: 'n-' + Date.now().toString(36),
      lida: false,
      criada_em: Date.now(),
      ...notif
    });
    saveNotifs(list);
    updateBellBadge();
  }
  function unreadCount() {
    return getInappNotifs().filter((n) => !n.lida).length;
  }
  function markAllRead() {
    const list = getInappNotifs();
    list.forEach((n) => { n.lida = true; });
    saveNotifs(list);
    updateBellBadge();
  }
  function markRead(id) {
    const list = getInappNotifs();
    const n = list.find((x) => x.id === id);
    if (n) { n.lida = true; saveNotifs(list); updateBellBadge(); }
  }
  function updateBellBadge() {
    document.querySelectorAll('[data-notif-bell]').forEach((bell) => {
      const c = unreadCount();
      const badge = bell.querySelector('.notif-bell__badge');
      if (badge) {
        badge.textContent = c > 0 ? String(c) : '';
        badge.style.display = c > 0 ? 'inline-flex' : 'none';
      }
    });
  }
  function wireSimulatorToInapp() {
    document.addEventListener('larcare:proposal-received', (e) => {
      if (!e.detail) return;
      addInappNotif({
        categoria: 'propostas',
        titulo: 'Nova proposta',
        descricao: `${e.detail.provider.first_name} enviou uma proposta`,
        rota: '#/cliente/demanda/' + e.detail.demand.id + '/propostas'
      });
    });
    document.addEventListener('larcare:payment-confirmed', (e) => {
      const p = e.detail || {};
      addInappNotif({
        categoria: 'pagamentos',
        titulo: 'Pagamento confirmado',
        descricao: `R$ ${p.valor || ''} aprovado`,
        rota: '#/recibo?pagamento=' + (p.id || '')
      });
    });
  }
  function openNotifsSheet() {
    const root = document.getElementById('modal-root');
    if (!root) return;
    const list = getInappNotifs();
    root.innerHTML = `
      <div class="bottom-sheet" role="dialog" aria-modal="true">
        <div class="bottom-sheet__backdrop" data-action="close-sheet"></div>
        <div class="bottom-sheet__card">
          <div class="bottom-sheet__handle" aria-hidden="true"></div>
          <div class="row row--between" style="margin-bottom: 12px;">
            <h3 class="bottom-sheet__title" style="margin: 0;">Notificações</h3>
            ${list.length > 0 ? '<button class="btn-link" type="button" data-action="notifs-mark-all">Marcar todas como lidas</button>' : ''}
          </div>
          <div class="bottom-sheet__body">
            ${list.length === 0 ? `
              <div class="search-empty t-center" style="padding: 32px 16px;">
                <div class="search-empty__art" aria-hidden="true">🔕</div>
                <h3 class="mt-3">Tudo em dia</h3>
                <p class="t-dim mt-2">Nenhuma notificação pendente.</p>
              </div>
            ` : `
              <div class="notif-list">
                ${list.map((n) => `
                  <a class="notif-item ${n.lida ? '' : 'is-unread'}" href="${n.rota || '#/'}" data-notif-id="${n.id}">
                    <span class="notif-item__cat">${
                      n.categoria === 'propostas' ? '💬' :
                      n.categoria === 'pagamentos' ? '💰' :
                      n.categoria === 'agenda' ? '📅' :
                      n.categoria === 'avaliacoes' ? '⭐' : '🔔'
                    }</span>
                    <div class="notif-item__body">
                      <strong>${n.titulo}</strong>
                      <div class="t-dim fs-13">${n.descricao}</div>
                      <div class="t-faint fs-12 mt-1">${relTime(n.criada_em)}</div>
                    </div>
                    ${!n.lida ? '<span class="notif-item__dot"></span>' : ''}
                  </a>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;
    root.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => { root.querySelector('.bottom-sheet').classList.add('is-open'); });
    root.addEventListener('click', (e) => {
      const close = () => {
        root.querySelector('.bottom-sheet')?.classList.remove('is-open');
        setTimeout(() => { root.innerHTML = ''; root.setAttribute('aria-hidden','true'); }, 240);
      };
      if (e.target.closest('[data-action="close-sheet"]')) return close();
      if (e.target.closest('[data-action="notifs-mark-all"]')) { markAllRead(); close(); return; }
      const item = e.target.closest('.notif-item');
      if (item) markRead(item.dataset.notifId);
    });
  }

  function relTime(t) {
    const diff = Date.now() - t;
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'agora mesmo';
    if (m < 60) return `há ${m}min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `há ${h}h`;
    const d = Math.floor(h / 24);
    return `há ${d}d`;
  }

  // ===== Disponível agora (toggle prestador) =====
  function getProviderStatus(prestadorId) {
    try { return localStorage.getItem('larcare:provider_status_' + prestadorId) || 'available'; } catch (_) { return 'available'; }
  }
  function setProviderStatus(prestadorId, status) {
    try { localStorage.setItem('larcare:provider_status_' + prestadorId, status); } catch (_) {}
  }
  function statusLabel(s) {
    return ({ available: '🟢 Disponível agora', busy: '🟡 Ocupado', offline: '🔴 Fora de horário' })[s] || s;
  }

  // ===== Modo emergência =====
  const EMERGENCY_MULTIPLIER = 1.5;

  function emergencia() {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const emergencyCats = [
      { id: 'hidraulica', name: 'Vazamento', emoji: '💧', avgPrice: 180 },
      { id: 'eletrica', name: 'Falta de luz / curto', emoji: '⚡', avgPrice: 150 },
      { id: 'chaveiro', name: 'Fechadura / chave', emoji: '🔑', avgPrice: 200 },
      { id: 'gas', name: 'Cheiro de gás', emoji: '🔥', avgPrice: 220 },
      { id: 'faz_tudo', name: 'Outro', emoji: '🛠️', avgPrice: 150 }
    ];
    return `
      <section class="page emergency-page">
        <div class="container container--narrow">
          <a class="btn btn--ghost btn--sm" href="#/cliente" style="margin-bottom: 16px;">${UI.icon('arrow_left', 14)} Voltar</a>

          <div class="emergency-header">
            <span class="emergency-icon" aria-hidden="true">🚨</span>
            <h1>Preciso de ajuda agora</h1>
            <p class="t-dim mt-2">Prestadores prioritários respondem em minutos. Valor aplicado: <strong>1.5x</strong> da tabela.</p>
          </div>

          <h2 class="mt-6 mb-3">O que está acontecendo?</h2>
          <div class="emergency-cats">
            ${emergencyCats.map((c) => `
              <button class="emergency-cat-btn" type="button" data-emergency-cat="${c.id}" data-emergency-price="${Math.round(c.avgPrice * EMERGENCY_MULTIPLIER)}">
                <span class="emergency-cat-btn__emoji">${c.emoji}</span>
                <span class="emergency-cat-btn__name">${c.name}</span>
                <span class="emergency-cat-btn__price">R$ ${Math.round(c.avgPrice * EMERGENCY_MULTIPLIER)}</span>
              </button>
            `).join('')}
          </div>

          <div class="emergency-foot">
            <label class="row" style="gap: 8px; align-items: center;">
              <input type="checkbox" id="emergency-auto-accept" />
              <span class="t-dim fs-14">Aceitar automaticamente o primeiro prestador que aparecer</span>
            </label>
          </div>
        </div>
      </section>
    `;
  }

  function emergenciaAguardando(params) {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const cat = params.cat || 'hidraulica';
    const catObj = D.findCategory(cat);
    return `
      <section class="page emergency-waiting-page" data-emergency-cat="${cat}">
        <div class="container container--narrow">
          <div class="emergency-pulse" aria-hidden="true">
            <span class="emergency-pulse__ring"></span>
            <span class="emergency-pulse__ring" style="animation-delay: 600ms;"></span>
            <span class="emergency-pulse__ring" style="animation-delay: 1200ms;"></span>
            <span class="emergency-pulse__center">🚨</span>
          </div>
          <h1 class="t-center mt-5">Buscando prestadores prioritários</h1>
          <p class="t-dim t-center mt-2">${catObj ? catObj.emoji + ' ' + catObj.name : 'Emergência'}</p>

          <div class="emergency-stats mt-7">
            <div class="card">
              <div class="row row--between">
                <span class="t-dim fs-13">Push enviado</span>
                <strong style="color: var(--primary);" id="emer-sent">12</strong>
              </div>
              <div class="row row--between mt-2">
                <span class="t-dim fs-13">Respondendo agora</span>
                <strong style="color: var(--accent);" id="emer-responding">3</strong>
              </div>
              <div class="row row--between mt-2">
                <span class="t-dim fs-13">SLA: primeira resposta em</span>
                <strong id="emer-sla">2:00</strong>
              </div>
            </div>
          </div>

          <p class="t-faint fs-13 t-center mt-7">Sua segurança vem primeiro. Em casos de risco imediato (incêndio, vazamento de gás severo), ligue <strong>193</strong> (Bombeiros).</p>
        </div>
      </section>
    `;
  }

  // ===== Detalhe do prestador com 5 tabs =====
  function prestadorDetalhe(params) {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const id = params.id || 'pro-001';
    const tab = params.tab || 'sobre';
    const pro = D.findProvider(id);
    if (!pro) return `<section class="page t-center mt-7"><h1>Prestador não encontrado</h1></section>`;
    const dist = D.distanceFromClient(pro);
    const status = getProviderStatus(id);
    const fav = isFavorite(id);

    return `
      <section class="page provider-detail-page">
        <div class="container container--narrow">
          <a class="btn btn--ghost btn--sm" href="#/buscar" style="margin-bottom: 16px;">${UI.icon('arrow_left', 14)} Voltar</a>

          <div class="provider-hero">
            <div class="provider-hero__avatar-wrap">
              <span class="avatar avatar--xl ${pro.avatar_color === 'accent' ? 'avatar--accent' : ''}" style="width: 120px; height: 120px; font-size: 32px;">${pro.initials}</span>
              ${pro.verified?.identity ? '<span class="provider-hero__verified" aria-label="Verificado">✓</span>' : ''}
            </div>
            <h1>${pro.first_name}</h1>
            <div class="row mt-2" style="gap: 8px; flex-wrap: wrap; justify-content: center;">
              <span class="provider-hero__tag">${statusLabel(status)}</span>
              ${pro.verified?.identity ? '<span class="provider-hero__tag">⭐ Verificado</span>' : ''}
              ${pro.verified?.background ? '<span class="provider-hero__tag">🛡️ Antecedente OK</span>' : ''}
            </div>
            <div class="row mt-3" style="gap: 6px; align-items: center; justify-content: center;">
              <span style="font-size: 18px;">⭐</span>
              <strong style="font-size: 20px;">${pro.rating_avg.toFixed(1)}</strong>
              <span class="t-dim">(${pro.rating_count} avaliações)</span>
            </div>
            <p class="t-dim mt-2 t-center">A ${dist.toFixed(1)}km de você · ${pro.neighborhood}</p>

            <div class="row mt-5" style="gap: 8px; justify-content: center;">
              <a class="btn btn--primary" href="#/cliente/nova-demanda?prestador=${id}">Pedir orçamento</a>
              <a class="btn btn--outline" href="#/chat?com=${id}">💬 Conversar</a>
              <button class="favorite-btn ${fav ? 'is-active' : ''}" type="button" data-toggle-fav="${id}" aria-label="${fav ? 'Remover dos favoritos' : 'Favoritar'}">${fav ? '⭐' : '☆'}</button>
            </div>
          </div>

          <nav class="provider-tabs" role="tablist">
            ${[
              ['sobre', 'Sobre'],
              ['trabalhos', 'Trabalhos'],
              ['avaliacoes', 'Avaliações'],
              ['precos', 'Categorias e preços'],
              ['verificacao', 'Verificação']
            ].map(([key, label]) => `
              <a class="provider-tab ${key === tab ? 'is-active' : ''}" href="#/prestador-detalhe?id=${id}&tab=${key}" role="tab">${label}</a>
            `).join('')}
          </nav>

          <div class="provider-tab-content mt-5">
            ${tab === 'sobre' ? renderSobre(pro) : ''}
            ${tab === 'trabalhos' ? renderTrabalhos(pro) : ''}
            ${tab === 'avaliacoes' ? renderAvaliacoes(pro) : ''}
            ${tab === 'precos' ? renderPrecos(pro) : ''}
            ${tab === 'verificacao' ? renderVerificacao(pro) : ''}
          </div>
        </div>
      </section>
    `;
  }

  function renderSobre(pro) {
    return `
      <div class="provider-section">
        <p class="t-dim" style="line-height: 1.65;">${pro.bio || 'Sem bio cadastrada.'}</p>
      </div>
      <div class="grid grid-2 mt-5">
        <div class="card"><span class="t-dim fs-13">Membro desde</span><div style="font-weight:600;">2025</div></div>
        <div class="card"><span class="t-dim fs-13">Serviços feitos</span><div style="font-weight:600;">${pro.rating_count}</div></div>
        <div class="card"><span class="t-dim fs-13">Responde em</span><div style="font-weight:600;">${pro.response_minutes || 30}min</div></div>
        <div class="card"><span class="t-dim fs-13">Taxa de aceite</span><div style="font-weight:600;">${Math.round((pro.acceptance_rate || 0) * 100)}%</div></div>
      </div>
    `;
  }
  function renderTrabalhos(pro) {
    // Mock: 6 placeholders SVG coloridos
    const colors = ['#3E6B5C', '#D4A574', '#5F8B6E', '#C68A4D', '#7AA294', '#EDDBC0'];
    return `
      <div class="provider-portfolio">
        ${colors.map((c, i) => `
          <div class="provider-portfolio__item" style="background: ${c};">
            <span>${i + 1}</span>
          </div>
        `).join('')}
      </div>
      <p class="t-faint fs-13 t-center mt-4">Mock — prestador adiciona fotos reais no perfil dele</p>
    `;
  }
  function renderAvaliacoes(pro) {
    const reviews = pro.reviews || [];
    // Distribuição
    const dist = [5,4,3,2,1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }));
    const max = Math.max(...dist.map((d) => d.count), 1);
    return `
      <div class="provider-rating-dist mb-5">
        ${dist.map((d) => `
          <div class="rating-dist-row">
            <span class="rating-dist-row__star">${d.n}★</span>
            <div class="rating-dist-row__bar"><div style="width: ${(d.count / max) * 100}%;"></div></div>
            <span class="t-dim fs-12">${d.count}</span>
          </div>
        `).join('')}
      </div>
      <div class="stack">
        ${reviews.map((r) => `
          <div class="card">
            <div class="row row--between">
              <strong>${r.author}</strong>
              <span class="t-faint fs-12">${r.date}</span>
            </div>
            <div class="mt-1">${'⭐'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            <p class="mt-2 t-dim" style="line-height: 1.5;">"${r.text}"</p>
          </div>
        `).join('')}
      </div>
    `;
  }
  function renderPrecos(pro) {
    const D = global.LarCareData;
    return `
      <div class="stack">
        ${pro.specialties.map((s) => {
          const cat = D.findCategory(s.cat);
          if (!cat) return '';
          return `
            <div class="card">
              <div class="row" style="gap: 10px; align-items: center;">
                <span style="font-size: 24px;">${cat.emoji}</span>
                <div style="flex: 1;">
                  <strong>${cat.name}</strong>
                  <div class="t-dim fs-13">${s.years} anos de experiência</div>
                </div>
                <div style="text-align: right;">
                  <div class="t-dim fs-12">A partir de</div>
                  <strong>R$ 80 - 250</strong>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <p class="t-faint fs-13 mt-4">Valores são referência. Sempre solicite orçamento específico.</p>
    `;
  }
  function renderVerificacao(pro) {
    const v = pro.verified || {};
    return `
      <ul class="provider-verif">
        <li class="provider-verif__item ${v.identity ? 'is-ok' : ''}">
          <span class="provider-verif__check">${v.identity ? '✓' : '○'}</span>
          <div><strong>Identidade</strong><div class="t-dim fs-13">RG/CNH conferidos</div></div>
        </li>
        <li class="provider-verif__item ${v.address ? 'is-ok' : ''}">
          <span class="provider-verif__check">${v.address ? '✓' : '○'}</span>
          <div><strong>Endereço</strong><div class="t-dim fs-13">Comprovante validado</div></div>
        </li>
        <li class="provider-verif__item ${v.background ? 'is-ok' : ''}">
          <span class="provider-verif__check">${v.background ? '✓' : '○'}</span>
          <div><strong>Antecedente criminal</strong><div class="t-dim fs-13">Sem ocorrências</div></div>
        </li>
        <li class="provider-verif__item is-ok">
          <span class="provider-verif__check">✓</span>
          <div><strong>Membro ativo</strong><div class="t-dim fs-13">Última atividade hoje</div></div>
        </li>
      </ul>
      <div class="card card--soft mt-5">
        <strong>Selo "Verificado LarCare"</strong>
        <p class="t-dim mt-2 fs-14">Última verificação em ${v.last_check || '—'}. Revisamos prestadores a cada 6 meses.</p>
      </div>
    `;
  }

  global.LarCareFeatures = {
    favoritos, historicoTimeline, openNotifsSheet, addInappNotif, unreadCount,
    markAllRead, updateBellBadge, wireSimulatorToInapp,
    isFavorite, toggleFavorite, getFavorites,
    getProviderStatus, setProviderStatus, statusLabel,
    emergencia, emergenciaAguardando, prestadorDetalhe
  };
  global.LarCareViews = global.LarCareViews || {};
  global.LarCareViews.favoritos = favoritos;
  global.LarCareViews.historicoTimeline = historicoTimeline;
  global.LarCareViews.emergencia = emergencia;
  global.LarCareViews.emergenciaAguardando = emergenciaAguardando;
  global.LarCareViews.prestadorDetalhe = prestadorDetalhe;
})(window);
