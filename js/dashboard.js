/* =========================================================================
   LarCare — dashboard do prestador (Etapa 6)
   =========================================================================
   Rota: #/dashboard-prestador
   Mostra: greeting, métricas da semana com delta, gráfico SVG 4 semanas,
   hoje, ranking, dicas dinâmicas, histórico recente.
   ========================================================================= */
(function (global) {
  'use strict';

  // Mock de dados das últimas 4 semanas baseado no estado atual
  function weeklyStats(prestadorId) {
    const D = global.LarCareData;
    const props = D.proposalsByProvider(prestadorId);
    // Distribui sintéticamente nas últimas 4 semanas
    const total = props.length;
    const semanas = [
      { label: 'Há 3 sem', enviadas: 4 + Math.floor(Math.random()*3), aceitas: 1 + Math.floor(Math.random()*2) },
      { label: 'Há 2 sem', enviadas: 5 + Math.floor(Math.random()*3), aceitas: 2 + Math.floor(Math.random()*2) },
      { label: 'Semana passada', enviadas: 6 + Math.floor(Math.random()*3), aceitas: 2 + Math.floor(Math.random()*2) },
      { label: 'Esta semana', enviadas: total, aceitas: props.filter((p) => p.status === 'accepted').length }
    ];
    return semanas;
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  function barChartSVG(weeks) {
    const max = Math.max(...weeks.map((w) => Math.max(w.enviadas, w.aceitas)), 8);
    const w = 320, h = 180, padL = 90, padR = 12, padT = 12, padB = 16;
    const innerW = w - padL - padR;
    const rowH = (h - padT - padB) / weeks.length;
    const barH = (rowH - 12) / 2;

    const bars = weeks.map((week, i) => {
      const y = padT + i * rowH + 4;
      const enviadasW = (week.enviadas / max) * innerW;
      const aceitasW = (week.aceitas / max) * innerW;
      return `
        <text x="${padL - 6}" y="${y + barH/2 + 3}" text-anchor="end" font-size="10" font-family="Inter" fill="#5C6661">${week.label}</text>
        <rect x="${padL}" y="${y}" width="${enviadasW}" height="${barH}" fill="#3E6B5C" rx="3"/>
        <text x="${padL + enviadasW + 6}" y="${y + barH/2 + 3}" font-size="10" font-weight="600" font-family="Inter" fill="#1F2A28">${week.enviadas}</text>
        <text x="${padL - 6}" y="${y + barH + 8 + barH/2 + 3}" text-anchor="end" font-size="10" font-family="Inter" fill="#5C6661" opacity="0"></text>
        <rect x="${padL}" y="${y + barH + 4}" width="${aceitasW}" height="${barH}" fill="#D4A574" rx="3"/>
        <text x="${padL + aceitasW + 6}" y="${y + barH + 4 + barH/2 + 3}" font-size="10" font-weight="600" font-family="Inter" fill="#1F2A28">${week.aceitas}</text>
      `;
    }).join('');

    return `
      <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Propostas enviadas vs aceitas nas últimas 4 semanas" style="width:100%; height:auto;">
        ${bars}
      </svg>
    `;
  }

  function dashboardProvider() {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const pro = D.findProvider('pro-001');
    const weeks = weeklyStats(pro.id);
    const cur = weeks[3], prev = weeks[2];
    const deltaPct = prev.enviadas > 0 ? Math.round(((cur.enviadas - prev.enviadas) / prev.enviadas) * 100) : 0;
    const aceitasPct = cur.enviadas > 0 ? Math.round((cur.aceitas / cur.enviadas) * 100) : 0;
    const faturamento = D.proposalsByProvider(pro.id).filter((p) => p.status === 'accepted').reduce((s, p) => s + (p.value || 0), 0);

    // Hoje
    const myProposals = D.proposalsByProvider(pro.id);
    const aguardando = myProposals.filter((p) => p.status === 'pending').length;
    const compativeis = D.demandsForProvider(pro.id).filter((d) => d.status !== 'hired').length;

    // Ranking sintético na categoria principal
    const primaryCat = pro.specialties[0].cat;
    const sameCat = D.PROVIDERS
      .filter((p) => p.specialties.some((s) => s.cat === primaryCat))
      .sort((a, b) => b.rating_avg - a.rating_avg);
    const myPos = sameCat.findIndex((p) => p.id === pro.id) + 1;
    const top3 = sameCat.slice(0, 3);
    const acimaDeMim = sameCat[myPos - 2];

    // Dicas dinâmicas
    const tips = [];
    if (!pro.bio || pro.bio.length < 60) tips.push({ icon: 'edit', text: 'Complete sua bio com mais detalhes do que diferencia seu trabalho.' });
    if (!pro.verified || !pro.verified.identity) tips.push({ icon: 'shield_check', text: 'Conclua a verificação de identidade para receber o selo Verificado.' });
    if ((pro.response_minutes || 999) > 30) tips.push({ icon: 'clock', text: 'Responda propostas em menos de 30min para aumentar sua taxa de aceite.' });
    if (pro.rating_avg < 4.5) tips.push({ icon: 'star', text: 'Mantenha nota acima de 4.5 para aparecer nos destaques da categoria.' });
    if (!tips.length) tips.push({ icon: 'check', text: 'Você está com perfil completo! Continue assim.' });

    return `
      <section class="page page--app">
        <div class="container container--narrow">

          <!-- Header personalizado -->
          <div class="dash-header">
            <div>
              <span class="eyebrow">${greeting()}</span>
              <h1 class="mt-2">Olá, ${pro.first_name.split(' ')[0]}</h1>
              <div class="row mt-2" style="gap: 8px; align-items: center;">
                ${UI.icon('star', 14, 'style="color:var(--accent); fill:var(--accent);"')}
                <strong>${pro.rating_avg.toFixed(1)}</strong>
                <span class="t-dim fs-13">(${pro.rating_count} avaliações)</span>
                ${pro.verified && pro.verified.identity ? '<span class="status status--proposals" style="font-size:11px;">Verificado</span>' : ''}
              </div>
            </div>
            <span class="avatar avatar--xl ${pro.avatar_color === 'accent' ? 'avatar--accent' : ''}">${pro.initials}</span>
          </div>

          <!-- Esta semana -->
          <div class="card card--feature mt-5" style="padding: var(--space-5);">
            <div class="row row--between mb-3">
              <span class="eyebrow" style="background: rgba(255,255,255,0.18); color: #fff;">Esta semana</span>
              <span class="t-mono-num" style="color: rgba(255,255,255,0.9); font-size: 13px;">
                ${deltaPct >= 0 ? '↑' : '↓'} ${Math.abs(deltaPct)}% vs semana passada
              </span>
            </div>
            <div class="grid grid-3">
              <div>
                <div class="dash-metric">${cur.enviadas}</div>
                <div class="dash-metric__label">propostas enviadas</div>
              </div>
              <div>
                <div class="dash-metric">${cur.aceitas}</div>
                <div class="dash-metric__label">aceitas (${aceitasPct}%)</div>
              </div>
              <div>
                <div class="dash-metric">R$ ${faturamento}</div>
                <div class="dash-metric__label">faturamento</div>
              </div>
            </div>
          </div>

          <!-- Gráfico -->
          <div class="card mt-5">
            <h3>Últimas 4 semanas</h3>
            <div class="row mt-2" style="gap: 14px; flex-wrap: wrap;">
              <span class="dash-legend"><span class="dash-legend__dot" style="background: var(--primary);"></span> Enviadas</span>
              <span class="dash-legend"><span class="dash-legend__dot" style="background: var(--accent);"></span> Aceitas</span>
            </div>
            <div class="mt-4">${barChartSVG(weeks)}</div>
          </div>

          <!-- Hoje -->
          <div class="card mt-5">
            <h3>Hoje</h3>
            <div class="stack mt-3">
              <a href="#/prestador" class="dash-today-item">
                <span><strong>${compativeis}</strong> demandas abertas compatíveis</span>
                ${UI.icon('arrow_right', 16)}
              </a>
              <a href="#/prestador/propostas" class="dash-today-item">
                <span><strong>${aguardando}</strong> propostas aguardando resposta</span>
                ${UI.icon('arrow_right', 16)}
              </a>
              <a href="#/conversas" class="dash-today-item">
                <span><strong>${(global.LarCareChat && global.LarCareChat.getChatsMeta().length) || 0}</strong> conversas ativas</span>
                ${UI.icon('arrow_right', 16)}
              </a>
            </div>
          </div>

          <!-- Ranking -->
          <div class="card mt-5">
            <h3>Ranking — ${D.findCategory(primaryCat).name}</h3>
            <p class="t-dim mt-2">Sua posição na categoria: <strong style="color: var(--primary);">#${myPos}</strong> de ${sameCat.length} prestadores.</p>
            ${acimaDeMim && myPos > 1 ? `<p class="t-dim fs-14 mt-2">Você está a 2 aceitações de superar <strong>${acimaDeMim.first_name}</strong> (${acimaDeMim.rating_avg.toFixed(1)}★).</p>` : ''}
            <div class="dash-top3 mt-4">
              ${top3.map((p, i) => `
                <div class="dash-top3-item ${p.id === pro.id ? 'is-me' : ''}">
                  <span class="dash-top3-pos">${i + 1}</span>
                  <span class="avatar avatar--sm ${p.avatar_color === 'accent' ? 'avatar--accent' : ''}">${p.initials}</span>
                  <span class="dash-top3-name">${p.first_name}</span>
                  <span class="dash-top3-rating">★ ${p.rating_avg.toFixed(1)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Dicas -->
          <div class="card mt-5">
            <h3>Dicas pra subir</h3>
            <div class="stack mt-3">
              ${tips.map((tip) => `
                <div class="dash-tip">
                  <span class="dash-tip__icon">${UI.icon(tip.icon, 16)}</span>
                  <span>${tip.text}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Histórico recente -->
          <div class="card mt-5">
            <h3>Últimas propostas</h3>
            <div class="stack mt-3">
              ${myProposals.slice(0, 5).map((p) => {
                const dem = D.findDemand(p.demand_id);
                if (!dem) return '';
                const statusLabel = { pending: 'Aguardando', accepted: 'Aceita', rejected: 'Recusada', withdrawn: 'Retirada' }[p.status] || p.status;
                const statusCls = { pending: 'status--analysis', accepted: 'status--hired', rejected: '', withdrawn: '' }[p.status] || '';
                return `
                  <a class="dash-history-item" href="#/prestador/demanda/${dem.id}">
                    <div style="flex:1; min-width:0;">
                      <div style="font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${dem.title}</div>
                      <div class="t-dim fs-13 mt-1">R$ ${p.value} · ${dem.neighborhood}</div>
                    </div>
                    <span class="status ${statusCls}" style="font-size: 11px;">${statusLabel}</span>
                  </a>
                `;
              }).filter(Boolean).join('')}
            </div>
          </div>

          <p class="t-center t-dim fs-13 mt-7">LarCare v${(global.LarCareConfig && global.LarCareConfig.VERSION) || '1.0'}</p>
        </div>
      </section>
    `;
  }

  global.LarCareDashboard = { dashboardProvider };
  global.LarCareViews = global.LarCareViews || {};
  global.LarCareViews.dashboardProvider = dashboardProvider;
})(window);
