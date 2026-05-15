/* =========================================================================
   LarCare — simulador de vida do app
   =========================================================================
   Objetivo: fazer o mock parecer um sistema real. Quando o cliente cria
   uma demanda, propostas chegam em tempo plausível. Quando aceita, o
   status evolui sozinho. Tudo persistido em localStorage para sobreviver
   a reloads.

   API pública (window.LarCareSim):
     start()                — inicializa, restaura estado, liga counters
     reset()                — limpa localStorage e dá reload
     fastForward()          — colapsa todos os timers pendentes
     createDemand(payload)  — insere uma demanda do usuário e agenda 4
                              propostas chegando em intervalos crescentes
     acceptProposal(propId) — marca aceita, agenda atendimento → avaliação
     setRole(role)          — 'client' | 'provider'
     on(name, fn)/off       — bus de eventos
     state()                — snapshot do estado persistido

   Eventos emitidos no document:
     larcare:demand-created     { id, demand }
     larcare:proposal-received  { proposal, demand }
     larcare:proposal-accepted  { proposal, demand }
     larcare:demand-status      { id, status }
     larcare:counters           { onlineProviders, openInRP, avgResponseMin }
     larcare:role-changed       { role }
     larcare:state-reset
   ========================================================================= */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'larcare_sim_v1';

  // Tempos em ms (ajustáveis para demo)
  const TIMING = {
    PROPOSAL_DELAYS: [10000, 22000, 75000, 180000],  // 10s, 22s, 1m15s, 3min
    HIRED_TO_ATENDIMENTO: 3000,                       // 3s
    ATENDIMENTO_TO_AVALIACAO: 25000,                  // 25s
    COUNTERS_TICK: 30000                              // 30s
  };

  const STATE_DEFAULT = {
    role: 'client',
    activeDemand: null,
    onlineProviders: 12,
    openInRP: 8,
    avgResponseMin: 8,
    completedThisMonth: 0
  };

  let state = { ...STATE_DEFAULT };
  const activeTimers = [];

  // ----------------------------------------------------------------
  // Persistência
  // ----------------------------------------------------------------
  function persist() {
    try {
      // Persistimos apenas o estado + as mutações que viraram dados
      // (demandas e propostas criadas pelo usuário). Ao restaurar,
      // reintroduzimos no LarCareData global.
      const D = global.LarCareData;
      const payload = {
        v: 1,
        state,
        userDemands: D.DEMANDS.filter((d) => d._user_created),
        userProposals: D.PROPOSALS.filter((p) => (p.id || '').startsWith('prop-dem-user-') || p._sim_generated),
        statusOverrides: {}
      };
      // status overrides: snapshot do status atual das demandas que mudaram
      D.DEMANDS.forEach((d) => {
        payload.statusOverrides[d.id] = d.status;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) { /* localStorage cheio ou bloqueado: ignora */ }
  }

  function restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const payload = JSON.parse(raw);
      if (!payload || payload.v !== 1) return;
      Object.assign(state, STATE_DEFAULT, payload.state || {});
      const D = global.LarCareData;

      // Reinsere demandas criadas pelo usuário
      (payload.userDemands || []).forEach((d) => {
        if (!D.findDemand(d.id)) D.DEMANDS.unshift(d);
      });
      // Reinsere propostas geradas
      (payload.userProposals || []).forEach((p) => {
        if (!D.PROPOSALS.find((x) => x.id === p.id)) D.PROPOSALS.push(p);
      });
      // Aplica overrides de status
      Object.entries(payload.statusOverrides || {}).forEach(([id, st]) => {
        const d = D.findDemand(id);
        if (d) d.status = st;
      });
    } catch (_) { /* corrompido: ignora */ }
  }

  // ----------------------------------------------------------------
  // Bus de eventos
  // ----------------------------------------------------------------
  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }
  function on(name, fn) { document.addEventListener(name, fn); }
  function off(name, fn) { document.removeEventListener(name, fn); }

  function vibrate(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (_) {}
  }

  // ----------------------------------------------------------------
  // Timers (com cleanup global)
  // ----------------------------------------------------------------
  function schedule(fn, ms) {
    const id = setTimeout(() => {
      const i = activeTimers.indexOf(id);
      if (i !== -1) activeTimers.splice(i, 1);
      try { fn(); } catch (e) { /* swallow */ }
    }, ms);
    activeTimers.push(id);
    return id;
  }
  function clearAllTimers() {
    activeTimers.forEach((id) => clearTimeout(id));
    activeTimers.length = 0;
  }

  // ----------------------------------------------------------------
  // Criar demanda do usuário
  // ----------------------------------------------------------------
  function createDemand(payload) {
    const D = global.LarCareData;
    const id = 'dem-user-' + Date.now().toString(36);
    const cat = D.findCategory(payload.cat) || D.CATEGORIES[0];
    const urgencyLabels = {
      hoje: 'Hoje', ate_3_dias: 'Até 3 dias',
      ate_7_dias: 'Até 7 dias', sem_pressa: 'Sem pressa'
    };
    const c = D.DEMO_CLIENT;
    const title = (payload.description || '').split(/[.\n]/)[0].trim().slice(0, 80)
      || ('Solicitação de ' + cat.name);

    const dem = {
      id,
      client_id: c.id,
      cat: cat.id,
      title,
      description: payload.description || '',
      neighborhood: payload.neighborhood || c.neighborhood,
      address_summary: (payload.neighborhood || c.neighborhood) + ' — ' + c.city,
      urgency: payload.urgency || 'ate_3_dias',
      urgency_label: urgencyLabels[payload.urgency] || 'Até 3 dias',
      time_pref: payload.time_pref || 'tarde',
      budget_min: payload.budget_min || 100,
      budget_max: payload.budget_max || 280,
      photos: payload.photos || 0,
      published_at_iso: new Date().toISOString(),
      published_minutes_ago: 0,
      status: 'open',
      proposal_count: 0,
      featured_for_demo: false,
      _user_created: true
    };
    D.DEMANDS.unshift(dem);
    state.activeDemand = id;
    state.openInRP++;
    persist();
    emit('larcare:demand-created', { id, demand: dem });

    scheduleIncomingProposals(id);
    return dem;
  }

  function candidatesFor(cat) {
    const D = global.LarCareData;
    return D.PROVIDERS.filter((p) => p.specialties.some((s) => s.cat === cat))
      .filter((p) => p.id !== 'pro-001'); // pro-001 é o prestador "demo do usuário"
  }

  function scheduleIncomingProposals(demandId) {
    const D = global.LarCareData;
    const dem = D.findDemand(demandId);
    if (!dem) return;

    let candidates = candidatesFor(dem.cat);
    if (candidates.length < 4) {
      // fallback: complementa com faz_tudo se categoria for nicho
      const generals = D.PROVIDERS.filter(
        (p) => p.specialties.some((s) => s.cat === 'faz_tudo') &&
               !candidates.find((c) => c.id === p.id)
      );
      candidates = candidates.concat(generals);
    }
    // shuffle leve para variar
    candidates.sort(() => Math.random() - 0.5);

    const limit = Math.min(4, candidates.length);
    for (let i = 0; i < limit; i++) {
      const pro = candidates[i];
      const delay = TIMING.PROPOSAL_DELAYS[i] || 240000;
      schedule(() => deliverProposal(dem, pro, i), delay);
    }
  }

  // ----------------------------------------------------------------
  // Gerar proposta sintética (calibrada por categoria)
  // ----------------------------------------------------------------
  const BASE_VALUE_BY_CAT = {
    eletrica: 130, hidraulica: 140, ar: 350, montagem: 290,
    pintura: 380, chaveiro: 180, gas: 200, faz_tudo: 110
  };
  const TIME_OPTIONS  = ['30 min', '40 min', '1 hora', '1h30', '2 horas'];
  const AVAIL_OPTIONS = [
    'Posso ir hoje à tarde',
    'Hoje à noite, após 19h',
    'Amanhã 9h ou 14h',
    'Amanhã à tarde, livre depois das 13h',
    'Próximos dias, combinamos'
  ];
  const MESSAGE_OPTIONS = [
    'Atendo a sua região há anos. Levo ferramenta completa e oriento sobre o material antes de comprar.',
    'Pelo que descreveu, resolvo na primeira visita. Garantia de 30 dias do serviço.',
    'Trabalho com cuidado, sem deixar sujeira. Combino preço fixo e cumpro.',
    'Tenho disponibilidade e levo material padrão da minha categoria. Sem cobrança extra na chegada.'
  ];

  function deliverProposal(dem, pro, idx) {
    const D = global.LarCareData;
    const id = 'prop-' + dem.id + '-' + String.fromCharCode(97 + idx);
    if (D.PROPOSALS.find((p) => p.id === id)) return;

    const base = BASE_VALUE_BY_CAT[dem.cat] || 150;
    const value = Math.round(base * (0.82 + Math.random() * 0.4));

    const prop = {
      id,
      demand_id: dem.id,
      provider_id: pro.id,
      value,
      time_estimate: TIME_OPTIONS[idx % TIME_OPTIONS.length],
      availability_text: AVAIL_OPTIONS[idx % AVAIL_OPTIONS.length],
      message: MESSAGE_OPTIONS[idx % MESSAGE_OPTIONS.length],
      sent_minutes_ago: 0.1,
      status: 'pending',
      _sim_generated: true
    };
    D.PROPOSALS.push(prop);
    dem.proposal_count = (dem.proposal_count || 0) + 1;
    if (dem.status === 'open') dem.status = 'proposals';
    persist();
    emit('larcare:proposal-received', { proposal: prop, demand: dem, provider: pro, isFirst: dem.proposal_count === 1 });
    // Som + vibração delegados ao módulo de áudio (toggle por usuário)
    if (global.LarCareAudio) global.LarCareAudio.proposalReceived();
    else vibrate(dem.proposal_count === 1 ? [40, 60, 40] : [30]);
  }

  // ----------------------------------------------------------------
  // Aceitar proposta + progressão de status
  // ----------------------------------------------------------------
  function acceptProposal(propId) {
    const D = global.LarCareData;
    const prop = D.PROPOSALS.find((p) => p.id === propId);
    if (!prop) return null;
    const dem = D.findDemand(prop.demand_id);
    if (!dem) return null;

    prop.status = 'accepted';
    D.PROPOSALS.filter((p) => p.demand_id === dem.id && p.id !== propId)
      .forEach((p) => { p.status = 'rejected'; });
    dem.status = 'hired';
    persist();
    emit('larcare:proposal-accepted', { proposal: prop, demand: dem });
    if (global.LarCareAudio) global.LarCareAudio.proposalAccepted();
    else vibrate([60, 40, 80]);

    schedule(() => {
      dem.status = 'em_atendimento';
      persist();
      emit('larcare:demand-status', { id: dem.id, status: 'em_atendimento' });
    }, TIMING.HIRED_TO_ATENDIMENTO);

    schedule(() => {
      dem.status = 'aguardando_avaliacao';
      persist();
      emit('larcare:demand-status', { id: dem.id, status: 'aguardando_avaliacao' });
    }, TIMING.HIRED_TO_ATENDIMENTO + TIMING.ATENDIMENTO_TO_AVALIACAO);

    return prop;
  }

  function markCompleted(demandId, rating) {
    const D = global.LarCareData;
    const dem = D.findDemand(demandId);
    if (!dem) return;
    dem.status = 'completed';
    state.completedThisMonth++;
    persist();
    emit('larcare:demand-status', { id: dem.id, status: 'completed', rating });
  }

  // ----------------------------------------------------------------
  // Fast-forward (debug)
  // ----------------------------------------------------------------
  function fastForward() {
    clearAllTimers();
    const D = global.LarCareData;
    if (state.activeDemand) {
      const dem = D.findDemand(state.activeDemand);
      if (dem) {
        // Preenche até 4 propostas
        const have = D.PROPOSALS.filter((p) => p.demand_id === dem.id).length;
        const need = Math.max(0, 4 - have);
        const candidates = candidatesFor(dem.cat);
        for (let i = 0; i < need; i++) {
          const pro = candidates[i % candidates.length];
          if (!pro) break;
          deliverProposal(dem, pro, have + i);
        }
        if (dem.status === 'hired') dem.status = 'em_atendimento';
        else if (dem.status === 'em_atendimento') dem.status = 'aguardando_avaliacao';
        persist();
        emit('larcare:demand-status', { id: dem.id, status: dem.status });
      }
    }
  }

  // ----------------------------------------------------------------
  // Reset
  // ----------------------------------------------------------------
  function reset() {
    clearAllTimers();
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    emit('larcare:state-reset');
    // recarrega — modo mais simples e seguro de restaurar arrays
    setTimeout(() => window.location.reload(), 50);
  }

  function setRole(role) {
    state.role = role;
    persist();
    emit('larcare:role-changed', { role });
  }

  // ----------------------------------------------------------------
  // Contadores ao vivo (oscilação pequena)
  // ----------------------------------------------------------------
  let countersTimer = null;
  function startCounters() {
    if (countersTimer) clearInterval(countersTimer);
    countersTimer = setInterval(() => {
      const delta = Math.round((Math.random() - 0.5) * 4);
      state.onlineProviders = Math.max(8, Math.min(18, state.onlineProviders + delta));
      emit('larcare:counters', {
        onlineProviders: state.onlineProviders,
        openInRP: state.openInRP,
        avgResponseMin: state.avgResponseMin
      });
    }, TIMING.COUNTERS_TICK);
  }

  // ----------------------------------------------------------------
  // 5 toques no logo → painel debug
  // ----------------------------------------------------------------
  function bindDebugTap() {
    let taps = 0;
    let tapTimer = null;
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.brand')) return;
      taps++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { taps = 0; }, 1800);
      if (taps >= 5) {
        taps = 0;
        e.preventDefault();
        e.stopPropagation();
        openDebugPanel();
      }
    }, true);
  }

  function openDebugPanel() {
    const root = document.getElementById('modal-root');
    if (!root) return;
    root.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3 style="margin-bottom: 12px;">Modo desenvolvedor</h3>
        <p class="t-dim" style="margin-bottom: 18px;">Atalhos invisíveis para acelerar a demo. Use durante o pitch.</p>
        <div style="display:grid; gap: 8px;">
          <button class="btn btn--primary" data-debug-action="ff">Avançar timers (1h)</button>
          <button class="btn btn--accent" data-debug-action="role-client">Modo cliente</button>
          <button class="btn btn--outline" data-debug-action="role-provider">Modo prestador</button>
          <button class="btn btn--primary" data-debug-action="admin">Painel admin</button>
          <button class="btn btn--ghost" data-debug-action="reset" style="color:#a83e3e;">Resetar demo</button>
        </div>
        <div style="text-align:right; margin-top:18px;">
          <button class="btn btn--ghost btn--sm" data-debug-action="close">Fechar</button>
        </div>
      </div>
    `;
    root.setAttribute('aria-hidden', 'false');
    const handler = (e) => {
      const a = e.target.closest('[data-debug-action]');
      const action = a && a.dataset.debugAction;
      if (e.target === root || action === 'close') {
        root.removeEventListener('click', handler);
        root.setAttribute('aria-hidden', 'true');
        root.innerHTML = '';
        return;
      }
      if (action === 'ff') { fastForward(); root.setAttribute('aria-hidden','true'); root.innerHTML=''; }
      if (action === 'role-client') { setRole('client'); window.location.hash = '#/cliente'; root.setAttribute('aria-hidden','true'); root.innerHTML=''; }
      if (action === 'role-provider') { setRole('provider'); window.location.hash = '#/prestador'; root.setAttribute('aria-hidden','true'); root.innerHTML=''; }
      if (action === 'admin') { window.location.hash = '#/admin'; root.setAttribute('aria-hidden','true'); root.innerHTML=''; }
      if (action === 'reset') reset();
    };
    root.addEventListener('click', handler);
  }

  // ----------------------------------------------------------------
  // Boot
  // ----------------------------------------------------------------
  function start() {
    restore();
    startCounters();
    bindDebugTap();
    // Se restaurou uma demanda ativa em status 'open' ou 'proposals'
    // SEM propostas suficientes, reagenda as restantes (timer perdido
    // no reload). Não tentamos preservar o offset exato — entregamos
    // as restantes em sequência rápida (mais agradável para demo).
    const D = global.LarCareData;
    if (state.activeDemand) {
      const dem = D.findDemand(state.activeDemand);
      if (dem && (dem.status === 'open' || dem.status === 'proposals')) {
        const have = D.PROPOSALS.filter((p) => p.demand_id === dem.id).length;
        if (have < 4) {
          const candidates = candidatesFor(dem.cat);
          for (let i = have; i < 4; i++) {
            const pro = candidates[i % candidates.length];
            if (!pro) break;
            schedule(() => deliverProposal(dem, pro, i), 4000 + (i - have) * 8000);
          }
        }
      }
    }
  }

  global.LarCareSim = {
    start, reset, fastForward,
    createDemand, acceptProposal, markCompleted, setRole,
    on, off, emit,
    state: () => state,
    openDebugPanel
  };
})(window);
