/* =========================================================================
   LarCare — painel admin oculto
   =========================================================================
   Rota: #/admin
   Acesso: easter egg (10 toques rápidos no logo) OU URL direta
   Login: senha "sucata2026" persiste em sessionStorage
   5 tabs: métricas, prestadores, demandas, avaliações, configurações
   ========================================================================= */
(function (global) {
  'use strict';

  const SECRET = 'sucata2026';
  const AUTH_KEY = 'larcare:admin_authed';
  const TAP_COUNTER = { count: 0, lastTap: 0 };

  function isAuthed() {
    try { return sessionStorage.getItem(AUTH_KEY) === '1'; } catch (_) { return false; }
  }
  function setAuthed(on) {
    try { sessionStorage.setItem(AUTH_KEY, on ? '1' : '0'); } catch (_) {}
  }
  function logout() {
    try { sessionStorage.removeItem(AUTH_KEY); } catch (_) {}
  }

  // 10-tap easter egg — registrado no app.js após bind
  function registerEasterEgg() {
    document.addEventListener('click', (e) => {
      const brand = e.target.closest('.brand');
      if (!brand) return;
      const now = Date.now();
      if (now - TAP_COUNTER.lastTap > 700) TAP_COUNTER.count = 0;
      TAP_COUNTER.count++;
      TAP_COUNTER.lastTap = now;
      if (TAP_COUNTER.count >= 10) {
        TAP_COUNTER.count = 0;
        e.preventDefault();
        e.stopPropagation();
        window.location.hash = '#/admin';
      }
    }, true);
  }

  function admin() {
    if (!isAuthed()) return renderLogin();
    const params = parseQuery();
    const tab = params.tab || 'metricas';
    return `
      <section class="admin-page">
        <header class="admin-header">
          <div class="admin-header__inner">
            <span class="admin-header__logo">LarCare · Admin</span>
            <span class="admin-header__env">PROD · ${(global.LarCareConfig && global.LarCareConfig.VERSION) || '1.0'}</span>
            <button class="admin-header__logout" type="button" data-action="admin-logout">Sair</button>
          </div>
        </header>
        <div class="admin-tabs">
          ${renderTabs(tab)}
        </div>
        <div class="admin-content">
          ${tab === 'metricas' ? renderMetrics() : ''}
          ${tab === 'prestadores' ? renderProviders() : ''}
          ${tab === 'demandas' ? renderDemands() : ''}
          ${tab === 'avaliacoes' ? renderReviews() : ''}
          ${tab === 'config' ? renderConfig() : ''}
        </div>
      </section>
    `;
  }

  function parseQuery() {
    const hash = window.location.hash || '';
    const q = hash.split('?')[1] || '';
    const out = {};
    q.split('&').forEach((kv) => {
      const [k, v] = kv.split('=');
      if (k) out[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return out;
  }

  function renderLogin() {
    return `
      <section class="admin-login">
        <div class="admin-login__card">
          <h1 class="admin-login__title">LarCare · Admin</h1>
          <p class="admin-login__hint">Acesso restrito.</p>
          <form data-action="admin-login">
            <input type="password" class="admin-login__input" id="admin-pwd" placeholder="Senha" autocomplete="current-password" />
            <button class="admin-login__cta" type="submit">Entrar</button>
          </form>
          <a href="#/" class="admin-login__back">← Voltar para o app</a>
        </div>
      </section>
    `;
  }

  function renderTabs(active) {
    const tabs = [
      { id: 'metricas',    label: 'Métricas' },
      { id: 'prestadores', label: 'Prestadores' },
      { id: 'demandas',    label: 'Demandas' },
      { id: 'avaliacoes',  label: 'Avaliações' },
      { id: 'config',      label: 'Configurações' }
    ];
    return `
      <nav class="admin-tabs__nav">
        ${tabs.map((t) => `
          <a class="admin-tab ${t.id === active ? 'is-active' : ''}" href="#/admin?tab=${t.id}">${t.label}</a>
        `).join('')}
      </nav>
    `;
  }

  // ====== Tab Métricas ======
  function renderMetrics() {
    const D = global.LarCareData;
    const totalUsers = D.PROVIDERS.length + 1; // +1 cliente demo
    const totalDemands = D.DEMANDS.length;
    const open = D.DEMANDS.filter((d) => d.status === 'open' || d.status === 'proposals').length;
    const hired = D.DEMANDS.filter((d) => d.status === 'hired' || d.status === 'completed').length;
    const totalProposals = D.PROPOSALS.length;
    const accepted = D.PROPOSALS.filter((p) => p.status === 'accepted').length;
    const conversion = totalProposals > 0 ? Math.round((accepted / totalProposals) * 100) : 0;
    const faturamento = D.PROPOSALS.filter((p) => p.status === 'accepted').reduce((s, p) => s + (p.value || 0), 0);
    const comissao = Math.round(faturamento * 0.05);
    const ratingAvg = D.PROVIDERS.reduce((s, p) => s + (p.rating_avg || 0), 0) / D.PROVIDERS.length;

    // Gráfico mock de 30 dias
    const chart30 = generateChart30();

    return `
      <div class="admin-metrics">
        <div class="metric-grid">
          ${metricCard('👥', 'Usuários', totalUsers, '')}
          ${metricCard('📋', 'Demandas', totalDemands, `${open} abertas · ${hired} contratadas`)}
          ${metricCard('💬', 'Propostas', totalProposals, `${accepted} aceitas (${conversion}%)`)}
          ${metricCard('💰', 'Faturamento', 'R$ ' + faturamento, `Comissão 5%: R$ ${comissao}`)}
          ${metricCard('⭐', 'Avaliação média', ratingAvg.toFixed(2), 'global')}
          ${metricCard('🔥', 'Categorias ativas', D.CATEGORIES.length, '4 grupos')}
        </div>

        <div class="admin-card">
          <h3>Atividade dos últimos 30 dias</h3>
          ${chart30}
        </div>
      </div>
    `;
  }

  function metricCard(emoji, label, value, sub) {
    return `
      <div class="metric-card">
        <div class="metric-card__emoji" aria-hidden="true">${emoji}</div>
        <div class="metric-card__label">${label}</div>
        <div class="metric-card__value">${value}</div>
        ${sub ? `<div class="metric-card__sub">${sub}</div>` : ''}
      </div>
    `;
  }

  function generateChart30() {
    // Gera barras mock dos últimos 30 dias
    const days = 30;
    const data = Array.from({ length: days }, () => Math.floor(Math.random() * 14) + 2);
    const max = Math.max(...data);
    const w = 600, h = 160, padL = 8, padR = 8, padT = 12, padB = 24;
    const barW = (w - padL - padR) / days - 2;
    const bars = data.map((v, i) => {
      const x = padL + i * (barW + 2);
      const barH = ((v / max) * (h - padT - padB));
      const y = h - padB - barH;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="#3E6B5C" rx="2" opacity="${0.6 + (i / days) * 0.4}"/>`;
    }).join('');
    return `
      <svg viewBox="0 0 ${w} ${h}" style="width:100%; height:auto;" role="img" aria-label="Atividade dos últimos 30 dias">
        ${bars}
        <line x1="${padL}" y1="${h - padB}" x2="${w - padR}" y2="${h - padB}" stroke="#E8E2D5" stroke-width="1"/>
        <text x="${padL}" y="${h - 6}" font-size="10" fill="#5C6661" font-family="Inter">30 dias atrás</text>
        <text x="${w - padR}" y="${h - 6}" font-size="10" fill="#5C6661" font-family="Inter" text-anchor="end">Hoje</text>
      </svg>
    `;
  }

  // ====== Tab Prestadores ======
  function renderProviders() {
    const D = global.LarCareData;
    const list = D.PROVIDERS;
    return `
      <div class="admin-toolbar">
        <input type="search" class="admin-input" placeholder="Buscar por nome..." id="admin-prov-search" />
        <select class="admin-input" id="admin-prov-filter">
          <option value="">Todas categorias</option>
          ${D.CATEGORIES.map((c) => `<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('')}
        </select>
        <button class="btn btn--outline btn--sm" type="button" data-action="admin-export-providers">Exportar CSV</button>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table" id="admin-prov-table">
          <thead>
            <tr>
              <th>Avatar</th><th>Nome</th><th>Categorias</th><th>Nota</th><th>Avaliações</th><th>Aceite %</th><th>Verificado</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((p) => `
              <tr data-pid="${p.id}">
                <td><span class="avatar avatar--sm ${p.avatar_color === 'accent' ? 'avatar--accent' : ''}">${p.initials}</span></td>
                <td>${p.first_name}<br/><span class="t-faint fs-12">${p.neighborhood}</span></td>
                <td>${p.specialties.map((s) => global.LarCareData.findCategory(s.cat)?.emoji + ' ' + global.LarCareData.findCategory(s.cat)?.name).join(', ')}</td>
                <td>⭐ ${p.rating_avg.toFixed(1)}</td>
                <td>${p.rating_count}</td>
                <td>${Math.round((p.acceptance_rate || 0) * 100)}%</td>
                <td>${p.verified?.identity ? '<span class="admin-pill admin-pill--ok">✓</span>' : '<span class="admin-pill">—</span>'}</td>
                <td>
                  <button class="admin-action" type="button" data-prov-act="view" data-pid="${p.id}">Ver</button>
                  <button class="admin-action admin-action--danger" type="button" data-prov-act="suspend" data-pid="${p.id}">Suspender</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ====== Tab Demandas ======
  function renderDemands() {
    const D = global.LarCareData;
    return `
      <div class="admin-toolbar">
        <input type="search" class="admin-input" placeholder="Buscar por descrição..." id="admin-dem-search" />
        <select class="admin-input" id="admin-dem-status">
          <option value="">Todos os status</option>
          <option value="open">Aberta</option>
          <option value="proposals">Recebendo propostas</option>
          <option value="hired">Contratada</option>
          <option value="completed">Concluída</option>
        </select>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Categoria</th><th>Bairro</th><th>Urgência</th><th>Orçamento</th><th>Propostas</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${D.DEMANDS.map((d) => `
              <tr>
                <td>${d.id}</td>
                <td>${D.findCategory(d.cat)?.emoji || ''} ${D.findCategory(d.cat)?.name || d.cat}</td>
                <td>${d.neighborhood}</td>
                <td>${d.urgency_label || d.urgency}</td>
                <td>R$ ${d.budget_min}-${d.budget_max}</td>
                <td>${d.proposal_count}</td>
                <td><span class="admin-pill admin-pill--${d.status}">${labelStatus(d.status)}</span></td>
                <td>
                  <button class="admin-action" type="button">Ver</button>
                  <button class="admin-action admin-action--danger" type="button">Cancelar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function labelStatus(s) {
    return ({
      open: 'Aberta', proposals: 'Propostas',
      hired: 'Contratada', completed: 'Concluída',
      em_atendimento: 'Em atendimento', aguardando_avaliacao: 'Aguard. avaliação'
    })[s] || s;
  }

  // ====== Tab Avaliações ======
  function renderReviews() {
    const D = global.LarCareData;
    // Coletar todas as reviews dos prestadores
    const allReviews = [];
    D.PROVIDERS.forEach((p) => {
      (p.reviews || []).forEach((r) => {
        allReviews.push({
          ...r,
          prestador: p.first_name,
          prestadorId: p.id
        });
      });
    });
    // Ordenar mais recentes primeiro
    allReviews.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const list = allReviews.slice(0, 50);

    return `
      <div class="admin-toolbar">
        <select class="admin-input" id="admin-rev-rating">
          <option value="">Todas as notas</option>
          <option value="5">5 estrelas</option>
          <option value="4">4 estrelas</option>
          <option value="3">3 estrelas</option>
          <option value="2">2 estrelas</option>
          <option value="1">1 estrela</option>
        </select>
      </div>
      <div class="stack">
        ${list.map((r) => `
          <div class="admin-card">
            <div class="row row--between">
              <div>
                <strong>${r.author}</strong> avaliou
                <strong>${r.prestador}</strong>
                <span class="t-faint fs-12">· ${r.date}</span>
              </div>
              <span>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
            </div>
            <p class="t-dim mt-2">"${escapeHtml(r.text)}"</p>
            <div class="row mt-2" style="gap:6px;">
              <button class="admin-action" type="button">Marcar como visto</button>
              <button class="admin-action admin-action--danger" type="button">Remover</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ====== Tab Configurações ======
  function renderConfig() {
    const cfg = global.LarCareConfig || {};
    const supabaseOn = !!cfg.USE_SUPABASE;
    const localStorageItems = Object.keys(localStorage).filter((k) => k.startsWith('larcare')).length;
    return `
      <div class="admin-config-grid">
        <div class="admin-card">
          <h3>Backend</h3>
          <div class="row row--between mt-3">
            <div>
              <strong>Supabase</strong>
              <div class="t-dim fs-13">Modo atual: ${supabaseOn ? 'ATIVO' : 'MOCK'}</div>
              ${cfg.SUPABASE_URL ? `<div class="t-faint fs-12 mt-1">URL: ${cfg.SUPABASE_URL.substring(0, 40)}...</div>` : '<div class="t-faint fs-12 mt-1">URL não configurada</div>'}
            </div>
            <button class="btn btn--outline btn--sm" type="button" data-action="admin-toggle-supabase">${supabaseOn ? 'Desativar' : 'Ativar'}</button>
          </div>
        </div>

        <div class="admin-card">
          <h3>localStorage</h3>
          <div class="t-dim mt-2">${localStorageItems} chaves larcare:* armazenadas</div>
          <div class="row mt-3" style="gap:8px;">
            <button class="btn btn--outline btn--sm" type="button" data-action="admin-backup-ls">Baixar backup</button>
            <button class="btn btn--ghost btn--sm" type="button" data-action="admin-restore-ls">Restaurar</button>
            <button class="btn btn--ghost btn--sm" type="button" data-action="admin-clear-ls" style="color: var(--danger);">Limpar tudo</button>
          </div>
        </div>

        <div class="admin-card">
          <h3>Versão</h3>
          <div class="mt-2"><strong>v${cfg.VERSION || '?'}</strong></div>
          <div class="t-dim fs-13 mt-1">Service Worker: ativo</div>
          <div class="t-dim fs-13">Build: produção</div>
        </div>

        <div class="admin-card">
          <h3>Modo manutenção</h3>
          <div class="row row--between mt-3">
            <div><strong>Banner global</strong><div class="t-dim fs-13">Aparece em todas as telas com aviso</div></div>
            <label class="row" style="gap:6px;">
              <input type="checkbox" id="admin-maintenance" ${localStorage.getItem('larcare:maintenance') === '1' ? 'checked' : ''} />
            </label>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHtml(s) { return String(s || '').replace(/[&<>"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }

  function bindAdmin(root) {
    if (!root) return;
    // Login form
    const loginForm = root.querySelector('[data-action="admin-login"]');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = root.querySelector('#admin-pwd').value;
        if (v === SECRET) {
          setAuthed(true);
          if (global.LarCareUI) global.LarCareUI.toast('Acesso liberado', 'success');
          if (global.LarCareApp && global.LarCareApp.rerender) global.LarCareApp.rerender();
        } else {
          if (global.LarCareUI) global.LarCareUI.toast('Senha incorreta', 'danger');
        }
      });
    }

    // Logout
    root.querySelectorAll('[data-action="admin-logout"]').forEach((b) => {
      b.addEventListener('click', () => {
        logout();
        window.location.hash = '#/';
      });
    });

    // Toggle supabase
    root.querySelectorAll('[data-action="admin-toggle-supabase"]').forEach((b) => {
      b.addEventListener('click', () => {
        if (!global.LarCareConfig) return;
        global.LarCareConfig.USE_SUPABASE = !global.LarCareConfig.USE_SUPABASE;
        if (global.LarCareUI) global.LarCareUI.toast(`Supabase ${global.LarCareConfig.USE_SUPABASE ? 'ativado' : 'desativado'} (não persistido — reload reverte)`, 'info');
        if (global.LarCareApp && global.LarCareApp.rerender) global.LarCareApp.rerender();
      });
    });

    // Backup localStorage
    root.querySelectorAll('[data-action="admin-backup-ls"]').forEach((b) => {
      b.addEventListener('click', () => {
        const data = {};
        Object.keys(localStorage).filter((k) => k.startsWith('larcare')).forEach((k) => { data[k] = localStorage.getItem(k); });
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `larcare-backup-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        if (global.LarCareUI) global.LarCareUI.toast('Backup baixado', 'success');
      });
    });

    // Clear localStorage
    root.querySelectorAll('[data-action="admin-clear-ls"]').forEach((b) => {
      b.addEventListener('click', () => {
        if (!confirm('Limpar TODO o localStorage larcare:*? Não pode ser desfeito.')) return;
        if (!confirm('Tem certeza absoluta?')) return;
        Object.keys(localStorage).filter((k) => k.startsWith('larcare')).forEach((k) => localStorage.removeItem(k));
        if (global.LarCareUI) global.LarCareUI.toast('localStorage limpo', 'warning');
        setTimeout(() => window.location.reload(), 500);
      });
    });

    // Restore localStorage
    root.querySelectorAll('[data-action="admin-restore-ls"]').forEach((b) => {
      b.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const data = JSON.parse(reader.result);
              Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
              if (global.LarCareUI) global.LarCareUI.toast('Backup restaurado', 'success');
              setTimeout(() => window.location.reload(), 600);
            } catch (_) {
              if (global.LarCareUI) global.LarCareUI.toast('Arquivo inválido', 'danger');
            }
          };
          reader.readAsText(file);
        });
        input.click();
      });
    });

    // Maintenance toggle
    const m = root.querySelector('#admin-maintenance');
    if (m) {
      m.addEventListener('change', () => {
        localStorage.setItem('larcare:maintenance', m.checked ? '1' : '0');
        if (global.LarCareUI) global.LarCareUI.toast(m.checked ? 'Modo manutenção ativo' : 'Modo manutenção desativado', 'info');
      });
    }

    // Export providers CSV
    root.querySelectorAll('[data-action="admin-export-providers"]').forEach((b) => {
      b.addEventListener('click', () => {
        const D = global.LarCareData;
        const rows = [['id', 'nome', 'bairro', 'categorias', 'nota', 'avaliacoes', 'aceite', 'verificado']];
        D.PROVIDERS.forEach((p) => {
          rows.push([
            p.id, p.first_name, p.neighborhood,
            p.specialties.map((s) => s.cat).join('|'),
            p.rating_avg, p.rating_count,
            Math.round((p.acceptance_rate || 0) * 100) + '%',
            p.verified?.identity ? 'sim' : 'nao'
          ]);
        });
        const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `larcare-prestadores-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        if (global.LarCareUI) global.LarCareUI.toast('CSV gerado', 'success');
      });
    });
  }

  global.LarCareAdmin = { admin, bindAdmin, registerEasterEgg, isAuthed, logout };
  global.LarCareViews = global.LarCareViews || {};
  global.LarCareViews.admin = admin;
})(window);
