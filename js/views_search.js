/* =========================================================================
   LarCare — busca + filtros + histórico
   =========================================================================
   Rota: #/buscar
   * Search bar sticky com debounce 200ms
   * Filtros em bottom sheet (categoria, distância, nota, preço, verificado)
   * Ordenação
   * Histórico de buscas em localStorage:larcare:search_history (últimas 5)
   * Filtros persistidos em localStorage:larcare:search_filters
   ========================================================================= */
(function (global) {
  'use strict';

  const UI = global.LarCareUI;
  const D = global.LarCareData;

  const STORE = {
    HISTORY: 'larcare:search_history',
    FILTERS: 'larcare:search_filters',
    SORT: 'larcare:search_sort'
  };

  const DEFAULT_FILTERS = {
    categorias: [],
    maxDistance: 30,
    minRating: 0,
    minPrice: 0,
    maxPrice: 1500,
    verifiedOnly: false,
    onlineOnly: false
  };

  const SORT_OPTIONS = [
    { id: 'relevance', label: 'Relevância' },
    { id: 'closest',   label: 'Mais próximo' },
    { id: 'rated',     label: 'Melhor avaliado' },
    { id: 'cheapest',  label: 'Menor preço médio' },
    { id: 'recent',    label: 'Mais recentes' }
  ];

  function readJSON(key, def) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (_) { return def; }
  }
  function writeJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (_) {} }

  function getFilters() { return Object.assign({}, DEFAULT_FILTERS, readJSON(STORE.FILTERS, {})); }
  function setFilters(f) { writeJSON(STORE.FILTERS, f); }
  function getSort() { return localStorage.getItem(STORE.SORT) || 'relevance'; }
  function setSort(s) { try { localStorage.setItem(STORE.SORT, s); } catch (_) {} }
  function getHistory() { return readJSON(STORE.HISTORY, []); }
  function pushHistory(q) {
    if (!q || !q.trim()) return;
    const h = getHistory().filter((x) => x !== q);
    h.unshift(q);
    writeJSON(STORE.HISTORY, h.slice(0, 5));
  }
  function clearHistory() { writeJSON(STORE.HISTORY, []); }

  // ----------------------------------------------------------------
  // Algoritmo de busca
  // ----------------------------------------------------------------
  function searchProviders(query, filters, sort) {
    const q = (query || '').trim().toLowerCase();
    const f = filters || DEFAULT_FILTERS;
    let list = D.PROVIDERS.slice();

    // Filtros básicos
    if (f.categorias && f.categorias.length) {
      list = list.filter((p) => p.specialties.some((s) => f.categorias.indexOf(s.cat) !== -1));
    }
    if (f.minRating > 0) list = list.filter((p) => p.rating_avg >= f.minRating);
    if (f.verifiedOnly) list = list.filter((p) => p.verified && p.verified.identity);
    if (typeof f.maxDistance === 'number') {
      list = list.filter((p) => D.distanceFromClient(p) <= f.maxDistance);
    }
    if (f.onlineOnly) list = list.filter((p) => (p.response_minutes || 999) <= 30);

    // Match textual
    let scored = list.map((p) => {
      let score = 0;
      if (!q) { score = 1; }
      else {
        const name = (p.full_name || p.first_name || '').toLowerCase();
        const bairro = (p.neighborhood || '').toLowerCase();
        const cats = p.specialties.map((s) => {
          const cat = D.findCategory(s.cat);
          return cat ? cat.name.toLowerCase() : s.cat;
        }).join(' ');
        const bio = (p.bio || '').toLowerCase();
        // Pontuação: match no início > match em qualquer lugar
        if (name.startsWith(q)) score += 100;
        else if (name.indexOf(q) !== -1) score += 50;
        if (bairro.indexOf(q) !== -1) score += 30;
        if (cats.indexOf(q) !== -1) score += 40;
        if (bio.indexOf(q) !== -1) score += 10;
      }
      return { p, score };
    }).filter((x) => x.score > 0);

    // Ordenação
    scored.sort((a, b) => {
      if (sort === 'closest') return D.distanceFromClient(a.p) - D.distanceFromClient(b.p);
      if (sort === 'rated')   return b.p.rating_avg - a.p.rating_avg;
      if (sort === 'cheapest') return (a.p.response_minutes || 999) - (b.p.response_minutes || 999);
      if (sort === 'recent')  return new Date(b.p.verified.last_check) - new Date(a.p.verified.last_check);
      // relevance: por score, depois rating, depois dist
      if (b.score !== a.score) return b.score - a.score;
      if (b.p.rating_avg !== a.p.rating_avg) return b.p.rating_avg - a.p.rating_avg;
      return D.distanceFromClient(a.p) - D.distanceFromClient(b.p);
    });

    return scored.map((x) => x.p);
  }

  // ----------------------------------------------------------------
  // View principal
  // ----------------------------------------------------------------
  function buscar(params) {
    const query = (params && params.q) || '';
    const filters = getFilters();
    const sort = getSort();
    const results = query || (filters.categorias && filters.categorias.length) || filters.verifiedOnly || filters.onlineOnly
      ? searchProviders(query, filters, sort)
      : D.PROVIDERS.slice(0, 8); // sem query nem filtro, mostra top 8
    const activeFiltersCount = countActiveFilters(filters);
    const history = getHistory();

    return `
      <section class="page page--app search-page">
        <div class="search-bar-wrap">
          <div class="container container--narrow">
            <div class="search-bar">
              <span class="search-bar__icon" aria-hidden="true">${UI.icon('search', 18)}</span>
              <input class="search-bar__input" type="search" id="search-input" placeholder="Ex: eletricista, Vila Tibério, diarista" value="${escapeAttr(query)}" autocomplete="off" />
              ${query ? `<button class="search-bar__clear" type="button" data-action="clear-search" aria-label="Limpar busca">${UI.icon('close', 16)}</button>` : ''}
            </div>
            <div class="search-actions">
              <button class="search-action" type="button" data-action="open-filters">
                ${UI.icon('list', 16)} Filtros ${activeFiltersCount > 0 ? `<span class="search-action__badge">${activeFiltersCount}</span>` : ''}
              </button>
              <button class="search-action" type="button" data-action="open-sort">
                ${UI.icon('chevron_down', 16)} ${labelForSort(sort)}
              </button>
            </div>
          </div>
        </div>

        <div class="container container--narrow mt-5">
          ${!query && !activeFiltersCount && history.length ? `
            <div class="search-history">
              <div class="row row--between mb-2">
                <span class="t-dim fs-13">Buscas recentes</span>
                <button class="btn-link" type="button" data-action="clear-history">Limpar</button>
              </div>
              <div class="search-history__list">
                ${history.map((h) => `
                  <button class="chip" type="button" data-action="use-history" data-query="${escapeAttr(h)}">${escapeHtml(h)}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="search-results-header mt-4 mb-3">
            <span class="t-dim fs-14">${results.length} ${results.length === 1 ? 'prestador encontrado' : 'prestadores encontrados'}</span>
          </div>

          ${results.length === 0 ? renderEmpty() : `
            <div class="stack" id="search-results">
              ${results.map((p) => renderResultCard(p)).join('')}
            </div>
          `}
        </div>
      </section>
    `;
  }

  function renderResultCard(p) {
    const dist = D.distanceFromClient(p);
    const primarySpec = p.specialties[0];
    const cat = primarySpec ? D.findCategory(primarySpec.cat) : null;
    const verified = p.verified && p.verified.identity;
    return `
      <article class="search-card" data-link="#/cliente/proposta/prop-001-a">
        <div class="search-card__avatar">
          <span class="avatar avatar--lg ${p.avatar_color === 'accent' ? 'avatar--accent' : ''}">${p.initials}</span>
          ${verified ? '<span class="search-card__verified" aria-label="Verificado">✓</span>' : ''}
        </div>
        <div class="search-card__body">
          <div class="row row--between" style="align-items:flex-start;">
            <div style="flex:1; min-width:0;">
              <div class="search-card__name">${p.first_name}</div>
              <div class="search-card__meta">
                ${p.specialties.slice(0, 2).map((s) => {
                  const c = D.findCategory(s.cat);
                  return c ? `<span class="search-card__chip">${c.emoji || ''} ${c.name}</span>` : '';
                }).join('')}
              </div>
            </div>
            <div class="search-card__rating">
              ${UI.icon('star', 12, 'style="color:var(--accent); fill:var(--accent);"')}
              <strong>${p.rating_avg.toFixed(1)}</strong>
              <span class="t-dim fs-12">(${p.rating_count})</span>
            </div>
          </div>
          <div class="row mt-2" style="gap:12px;">
            <span class="t-dim fs-13">${UI.icon('map_pin', 12)} ${dist.toFixed(1)} km · ${p.neighborhood}</span>
            ${p.response_minutes ? `<span class="t-dim fs-13">${UI.icon('clock', 12)} responde em ~${p.response_minutes}min</span>` : ''}
          </div>
        </div>
      </article>
    `;
  }

  function renderEmpty() {
    return `
      <div class="search-empty t-center">
        <div class="search-empty__art" aria-hidden="true">🔍</div>
        <h3 class="mt-3">Nenhum prestador encontrado</h3>
        <p class="t-dim mt-2">Tente ampliar a distância, remover filtros ou buscar outra categoria.</p>
        <button class="btn btn--outline mt-4" type="button" data-action="reset-filters">Limpar filtros</button>
      </div>
    `;
  }

  function countActiveFilters(f) {
    let n = 0;
    if (f.categorias && f.categorias.length) n++;
    if (f.maxDistance < 30) n++;
    if (f.minRating > 0) n++;
    if (f.minPrice > 0) n++;
    if (f.maxPrice < 1500) n++;
    if (f.verifiedOnly) n++;
    if (f.onlineOnly) n++;
    return n;
  }

  function labelForSort(s) {
    const o = SORT_OPTIONS.find((x) => x.id === s);
    return o ? o.label : 'Relevância';
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, '&#39;'); }

  // ----------------------------------------------------------------
  // Bottom sheets (filtros e ordenação) — renderizados no #modal-root
  // ----------------------------------------------------------------
  function openFilters() {
    const f = getFilters();
    const root = document.getElementById('modal-root');
    if (!root) return;
    root.innerHTML = `
      <div class="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="filters-title">
        <div class="bottom-sheet__backdrop" data-action="close-sheet"></div>
        <div class="bottom-sheet__card">
          <div class="bottom-sheet__handle" aria-hidden="true"></div>
          <h3 id="filters-title" class="bottom-sheet__title">Filtros</h3>
          <button class="bottom-sheet__close" type="button" data-action="close-sheet" aria-label="Fechar">${UI.icon('close', 16)}</button>

          <div class="bottom-sheet__body">
            <div class="filter-section">
              <label class="filter-section__label">Categoria</label>
              <div class="filter-chips">
                ${D.CATEGORIES.map((c) => `
                  <button class="chip ${(f.categorias || []).indexOf(c.id) !== -1 ? 'is-active' : ''}" type="button" data-toggle-cat="${c.id}">
                    ${c.emoji || ''} ${c.name}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="filter-section">
              <label class="filter-section__label">Distância: <span id="filter-dist-out">${f.maxDistance} km</span></label>
              <input type="range" min="1" max="30" value="${f.maxDistance}" id="filter-dist" class="slider" />
            </div>

            <div class="filter-section">
              <label class="filter-section__label">Nota mínima</label>
              <div class="filter-stars" id="filter-stars" data-rating="${f.minRating}">
                ${[1,2,3,4,5].map((n) => `
                  <button class="filter-star ${n <= f.minRating ? 'is-on' : ''}" type="button" data-star="${n}" aria-label="${n} estrelas">★</button>
                `).join('')}
                ${f.minRating > 0 ? '<button class="btn-link btn-link--sm" type="button" data-star="0">limpar</button>' : ''}
              </div>
            </div>

            <div class="filter-section">
              <label class="row row--between">
                <span class="filter-section__label">Apenas verificados</span>
                <input type="checkbox" id="filter-verified" ${f.verifiedOnly ? 'checked' : ''} />
              </label>
            </div>
            <div class="filter-section">
              <label class="row row--between">
                <span class="filter-section__label">Disponível agora</span>
                <input type="checkbox" id="filter-online" ${f.onlineOnly ? 'checked' : ''} />
              </label>
            </div>
          </div>

          <div class="bottom-sheet__footer">
            <button class="btn btn--ghost" type="button" data-action="reset-filters-sheet">Limpar</button>
            <button class="btn btn--primary" type="button" data-action="apply-filters">Aplicar filtros</button>
          </div>
        </div>
      </div>
    `;
    root.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => { root.querySelector('.bottom-sheet').classList.add('is-open'); });
    bindFiltersSheet(root, f);
  }

  function bindFiltersSheet(root, fInitial) {
    const f = Object.assign({}, fInitial);
    const close = () => {
      root.querySelector('.bottom-sheet')?.classList.remove('is-open');
      setTimeout(() => { root.innerHTML = ''; root.setAttribute('aria-hidden', 'true'); }, 240);
    };
    root.addEventListener('click', (e) => {
      const target = e.target;
      if (target.closest('[data-action="close-sheet"]')) return close();
      const catBtn = target.closest('[data-toggle-cat]');
      if (catBtn) {
        const id = catBtn.dataset.toggleCat;
        const idx = f.categorias.indexOf(id);
        if (idx === -1) f.categorias.push(id); else f.categorias.splice(idx, 1);
        catBtn.classList.toggle('is-active');
        return;
      }
      const star = target.closest('[data-star]');
      if (star) {
        const v = parseInt(star.dataset.star, 10);
        f.minRating = v;
        root.querySelectorAll('.filter-star').forEach((s, i) => s.classList.toggle('is-on', i + 1 <= v));
        return;
      }
      if (target.closest('[data-action="reset-filters-sheet"]')) {
        Object.assign(f, DEFAULT_FILTERS, { categorias: [] });
        setFilters(f);
        close();
        if (global.LarCareApp && global.LarCareApp.rerender) global.LarCareApp.rerender();
        return;
      }
      if (target.closest('[data-action="apply-filters"]')) {
        setFilters(f);
        close();
        if (global.LarCareApp && global.LarCareApp.rerender) global.LarCareApp.rerender();
      }
    });
    const distInput = root.querySelector('#filter-dist');
    const distOut = root.querySelector('#filter-dist-out');
    distInput?.addEventListener('input', () => { f.maxDistance = parseInt(distInput.value, 10); distOut.textContent = `${f.maxDistance} km`; });
    root.querySelector('#filter-verified')?.addEventListener('change', (e) => { f.verifiedOnly = e.target.checked; });
    root.querySelector('#filter-online')?.addEventListener('change', (e) => { f.onlineOnly = e.target.checked; });
  }

  function openSort() {
    const root = document.getElementById('modal-root');
    if (!root) return;
    const cur = getSort();
    root.innerHTML = `
      <div class="bottom-sheet" role="dialog" aria-modal="true">
        <div class="bottom-sheet__backdrop" data-action="close-sheet"></div>
        <div class="bottom-sheet__card bottom-sheet__card--short">
          <div class="bottom-sheet__handle" aria-hidden="true"></div>
          <h3 class="bottom-sheet__title">Ordenar por</h3>
          <div class="bottom-sheet__body">
            ${SORT_OPTIONS.map((o) => `
              <button class="sort-option ${o.id === cur ? 'is-active' : ''}" type="button" data-sort="${o.id}">
                <span>${o.label}</span>
                ${o.id === cur ? UI.icon('check', 16) : ''}
              </button>
            `).join('')}
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
      const opt = e.target.closest('[data-sort]');
      if (opt) {
        setSort(opt.dataset.sort);
        close();
        if (global.LarCareApp && global.LarCareApp.rerender) global.LarCareApp.rerender();
      }
    });
  }

  global.LarCareSearch = {
    buscar, pushHistory, clearHistory, getFilters, setFilters, openFilters, openSort,
    DEFAULT_FILTERS
  };

  // Expor view no namespace LarCareViews
  global.LarCareViews = global.LarCareViews || {};
  global.LarCareViews.buscar = buscar;
})(window);
