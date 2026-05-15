/* =========================================================================
   LarCare — provider & institutional views
   ========================================================================= */
(function (global) {
  'use strict';
  const UI = global.LarCareUI;
  const D  = global.LarCareData;
  const V  = global.LarCareViews;
  const { formatDate, escapeHtml } = V._helpers;
  function escapeAttr(s) { return escapeHtml(String(s)).replace(/'/g, '&#39;'); }

  // ====================================================================
  // VIEW 15 — Cadastro do prestador (6 etapas)
  // ====================================================================
  function providerSignup(params) {
    const step = parseInt(params && params.step, 10) || 1;
    const total = 6;
    const progress = Math.round((step / total) * 100);
    const labels = ['Conta', 'Documentos', 'Endereço', 'Atuação', 'Disponibilidade', 'Verificação'];

    let body = '';

    if (step === 1) {
      body = `
        <h1>Crie sua conta de prestador</h1>
        <p class="lead mt-2">Em cerca de 8 minutos. Aprovação em 24-72 horas.</p>
        <form class="stack mt-6" data-form="provider-signup-step" data-next="#/cadastro/prestador?step=2">
          ${UI.field({ label: 'Nome completo', name: 'name', value: 'Carlos Henrique S.', required: true, autocomplete: 'name' })}
          ${UI.field({ label: 'E-mail', name: 'email', type: 'email', value: 'carlos.h@example.com', required: true, autocomplete: 'email' })}
          ${UI.field({ label: 'WhatsApp', name: 'phone', type: 'tel', value: '(11) 9 8205-7711', required: true, autocomplete: 'tel' })}
          ${UI.field({ label: 'Senha', name: 'password', type: 'password', placeholder: 'Mínimo 8 caracteres', required: true, autocomplete: 'new-password' })}
          <button class="btn btn--primary btn--block btn--lg" type="submit">Continuar</button>
        </form>
      `;
    } else if (step === 2) {
      body = `
        <h1>Documentos pessoais</h1>
        <p class="lead mt-2">Confidencial. Usados apenas para verificação.</p>
        <form class="stack mt-6" data-form="provider-signup-step" data-next="#/cadastro/prestador?step=3">
          ${UI.field({ label: 'CPF', name: 'cpf', value: '184.620.339-58', required: true, mask: 'cpf' })}
          ${UI.field({ label: 'Data de nascimento', name: 'birth', type: 'date', value: '1988-04-22', required: true })}
          <div>
            <span class="field__label">RG ou CNH (frente e verso)</span>
            <button class="upload-tile mt-2" type="button">${UI.icon('upload', 28, 'class="upload-tile__icon"')}<strong>Enviar documento</strong><span class="t-dim fs-13">JPG ou PDF até 10 MB</span></button>
          </div>
          <div>
            <span class="field__label">Selfie segurando o documento</span>
            <button class="upload-tile mt-2" type="button">${UI.icon('camera', 28, 'class="upload-tile__icon"')}<strong>Tirar selfie</strong><span class="t-dim fs-13">Câmera frontal · rosto e documento visíveis</span></button>
          </div>
          <div class="row" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="#/cadastro/prestador?step=1">Voltar</a>
            <button class="btn btn--primary" type="submit">Continuar</button>
          </div>
        </form>
      `;
    } else if (step === 3) {
      body = `
        <h1>Onde você mora?</h1>
        <p class="lead mt-2">Usaremos para definir sua área de atendimento.</p>
        <form class="stack mt-6" data-form="provider-signup-step" data-next="#/cadastro/prestador?step=4">
          <div class="grid grid-2">
            ${UI.field({ label: 'CEP', name: 'cep', value: '05433-000', mask: 'cep', required: true })}
            ${UI.field({ label: 'Estado', name: 'uf', value: 'SP', required: true })}
          </div>
          ${UI.field({ label: 'Logradouro', name: 'street', value: 'Rua Aspicuelta', required: true })}
          <div class="grid grid-2">
            ${UI.field({ label: 'Número', name: 'number', value: '722', required: true })}
            ${UI.field({ label: 'Complemento', name: 'complement', placeholder: 'Apto, bloco' })}
          </div>
          <div class="grid grid-2">
            ${UI.field({ label: 'Bairro', name: 'district', value: 'Vila Madalena', required: true })}
            ${UI.field({ label: 'Cidade', name: 'city', value: 'São Paulo', required: true })}
          </div>
          <div class="row" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="#/cadastro/prestador?step=2">Voltar</a>
            <button class="btn btn--primary" type="submit">Continuar</button>
          </div>
        </form>
      `;
    } else if (step === 4) {
      body = `
        <h1>Em que você atua?</h1>
        <p class="lead mt-2">Selecione todas as suas especialidades. Você pode editar depois.</p>
        <form class="stack mt-6" data-form="provider-signup-step" data-next="#/cadastro/prestador?step=5">
          <div>
            <span class="field__label">Especialidades</span>
            <div class="row mt-2" style="gap:6px; flex-wrap:wrap;">
              ${D.CATEGORIES.map((c, i) => `<label class="chip ${i < 2 ? 'is-active' : ''}"><input type="checkbox" hidden ${i < 2 ? 'checked' : ''} value="${c.id}" />${c.name}</label>`).join('')}
            </div>
          </div>
          ${UI.field({ label: 'Anos de experiência (especialidade principal)', name: 'years', type: 'number', value: '15', required: true })}
          ${UI.field({ label: 'Apresentação livre (até 500 palavras)', name: 'bio', type: 'textarea', value: 'Eletricista há 15 anos, atendo Vila Madalena, Pinheiros e Sumaré. Levo ferramenta completa, oriento sobre material antes de comprar e deixo tudo limpo no fim.' })}
          <div class="grid grid-2">
            <label class="field">
              <span class="field__label">Leva material próprio?</span>
              <select class="select" name="material">
                <option>Depende do serviço</option>
                <option>Sim, sempre</option>
                <option>Não, só ferramenta</option>
              </select>
            </label>
            <label class="field">
              <span class="field__label">Veículo próprio?</span>
              <select class="select" name="vehicle">
                <option>Sim</option>
                <option>Não</option>
              </select>
            </label>
          </div>
          <div>
            <div class="row row--between"><span class="field__label">Raio de atendimento</span><strong id="radius-out" style="color: var(--primary);">12 km</strong></div>
            <input type="range" class="slider mt-2" min="2" max="40" value="12" step="1" id="radius-slider" />
          </div>
          <div class="row" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="#/cadastro/prestador?step=3">Voltar</a>
            <button class="btn btn--primary" type="submit">Continuar</button>
          </div>
        </form>
      `;
    } else if (step === 5) {
      const days = [['mon', 'Segunda'], ['tue', 'Terça'], ['wed', 'Quarta'], ['thu', 'Quinta'], ['fri', 'Sexta'], ['sat', 'Sábado'], ['sun', 'Domingo']];
      const seed = { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,1], fri: [1,1,1], sat: [1,0,0], sun: [0,0,0] };
      body = `
        <h1>Quando você atende?</h1>
        <p class="lead mt-2">Marque os períodos em que costuma estar disponível.</p>
        <form class="stack mt-6" data-form="provider-signup-step" data-next="#/cadastro/prestador?step=6">
          <div class="card">
            <div class="avail-grid" data-avail>
              <span></span>
              <span class="avail-grid__head">Manhã</span>
              <span class="avail-grid__head">Tarde</span>
              <span class="avail-grid__head">Noite</span>
              ${days.map(([k, label]) => `
                <span class="avail-grid__day">${label}</span>
                ${[0,1,2].map((i) => `<button type="button" class="avail-grid__cell ${seed[k][i] ? 'is-on' : ''}" data-d="${k}" data-p="${i}" aria-pressed="${!!seed[k][i]}">${seed[k][i] ? '●' : '+'}</button>`).join('')}
              `).join('')}
            </div>
          </div>
          <div class="row" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="#/cadastro/prestador?step=4">Voltar</a>
            <button class="btn btn--primary" type="submit">Continuar</button>
          </div>
        </form>
      `;
    } else {
      body = `
        <h1>Verificação final</h1>
        <p class="lead mt-2">Documentos para análise. Mantenha-os atualizados.</p>
        <form class="stack mt-6" data-form="provider-signup-step" data-next="#/prestador/status">
          <div>
            <span class="field__label">Antecedente criminal</span>
            <p class="t-dim fs-14 mt-1">Você obtém em menos de 90 segundos no <a href="https://www.tjsp.jus.br" target="_blank" rel="noopener">portal do TJ</a>. PDF aceito.</p>
            <button class="upload-tile mt-2" type="button">${UI.icon('upload', 28, 'class="upload-tile__icon"')}<strong>Enviar antecedente</strong><span class="t-dim fs-13">PDF até 5 MB</span></button>
          </div>
          <div>
            <span class="field__label">Comprovante de residência</span>
            <button class="upload-tile mt-2" type="button">${UI.icon('upload', 28, 'class="upload-tile__icon"')}<strong>Enviar comprovante</strong><span class="t-dim fs-13">Conta de luz, água ou similar dos últimos 90 dias</span></button>
          </div>
          <label class="check">
            <input type="checkbox" required />
            <span class="check__text">Li e aceito os <a href="#/termos">Termos do Prestador</a> e a <a href="#/privacidade">Política de Privacidade</a>.</span>
          </label>
          <label class="check">
            <input type="checkbox" required />
            <span class="check__text">Confirmo que as informações fornecidas são verdadeiras. Entendo que documentos falsos resultam em desligamento imediato.</span>
          </label>
          <div class="row" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="#/cadastro/prestador?step=5">Voltar</a>
            <button class="btn btn--primary btn--lg" type="submit">Enviar para análise</button>
          </div>
        </form>
      `;
    }

    return `
      <section class="page">
        <div class="container container--narrow">
          <div class="row row--between mb-4">
            <span class="eyebrow">Cadastro de prestador</span>
            <span class="t-dim fs-14">Etapa ${step} de ${total}</span>
          </div>
          <div class="progress mb-3"><div class="progress__bar" style="width:${progress}%;"></div></div>
          <div class="row mb-6" style="gap: 4px; flex-wrap: nowrap; overflow-x: auto;">
            ${labels.map((l, i) => `<span class="chip ${i + 1 === step ? 'is-active' : ''} chip--static">${i + 1}. ${l}</span>`).join('')}
          </div>
          ${body}
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 16 — Status do cadastro
  // ====================================================================
  function providerStatus() {
    return `
      <section class="page">
        <div class="container container--narrow">
          <span class="eyebrow">Cadastro enviado</span>
          <h1 class="mt-3">Em análise</h1>
          <p class="lead mt-2">Recebemos sua documentação. Costumamos finalizar a análise em 24-72 horas.</p>

          <div class="card card--soft mt-6">
            <div class="row" style="gap:12px;">
              <span style="width:40px; height:40px; border-radius:50%; background:#fff; color: var(--primary); display:inline-flex; align-items:center; justify-content:center;">${UI.icon('clock', 20)}</span>
              <div><strong>Tempo estimado</strong><div class="t-dim fs-14">Resposta esperada até ${formatDate(addDays(2))}</div></div>
            </div>
          </div>

          <div class="card mt-5">
            <h3 class="mb-3">Linha do tempo</h3>
            <div class="timeline">
              <div class="timeline__item is-done">Conta criada</div>
              <div class="timeline__item is-done">Documentos enviados</div>
              <div class="timeline__item is-active">Análise da equipe LarCare</div>
              <div class="timeline__item">Aprovação e ativação</div>
              <div class="timeline__item">Acesso ao feed de demandas</div>
            </div>
          </div>

          <div class="card mt-5">
            <h3>Enquanto isso</h3>
            <p class="t-dim mt-2">Aproveite para revisar seu perfil e adicionar fotos de trabalhos anteriores. Prestadores com perfil completo recebem em média 2x mais propostas aceitas.</p>
            <div class="row mt-4" style="gap:8px;">
              <a class="btn btn--outline btn--sm" href="#/prestador/perfil">Editar perfil</a>
              <a class="btn btn--ghost btn--sm" href="#/contato">Falar com suporte</a>
            </div>
          </div>

          <div class="t-center mt-7">
            <a class="btn btn--primary" href="#/prestador">Pular análise (modo demonstração)</a>
            <p class="t-dim fs-13 mt-2">Para ver o feed do prestador agora.</p>
          </div>
        </div>
      </section>
    `;
  }

  function addDays(d) {
    const t = new Date('2026-04-25');
    t.setDate(t.getDate() + d);
    return t.toISOString().slice(0, 10);
  }

  // ====================================================================
  // VIEW 17 — Dashboard do prestador (feed)
  // ====================================================================
  function providerDashboard() {
    const pro = D.findProvider('pro-001');
    const open = D.DEMANDS.filter((d) => d.status !== 'hired');
    const myProposals = D.proposalsByProvider(pro.id);
    const pending = myProposals.filter((p) => p.status === 'pending').length;
    const accepted = myProposals.filter((p) => p.status === 'accepted').length;

    return `
      <section class="page page--app">
        <div class="container">
          <div class="row row--between mb-5">
            <div>
              <span class="eyebrow">${V._helpers.greeting()}</span>
              <h1 class="mt-2">Olá, ${pro.first_name.split(' ')[0]}</h1>
              <p class="t-dim">${pro.neighborhood}, ${pro.city} · raio de ${pro.radius_km} km</p>
            </div>
            <label class="row" style="gap:8px; cursor:pointer;">
              <span class="t-dim fs-14">Online</span>
              <span style="width: 44px; height: 24px; background: var(--success); border-radius: 999px; position: relative;">
                <span style="position:absolute; top:2px; right:2px; width:20px; height:20px; background:#fff; border-radius:50%;"></span>
              </span>
            </label>
          </div>

          <div class="grid grid-3 mb-7">
            <div class="card">
              <span class="t-dim fs-13">Em análise pelo cliente</span>
              <div style="font-family: var(--font-serif); font-size: 32px; color: var(--primary); margin-top:4px;">${pending}</div>
              <a href="#/prestador/propostas" class="t-dim fs-13">Ver minhas propostas →</a>
            </div>
            <div class="card">
              <span class="t-dim fs-13">Propostas aceitas</span>
              <div style="font-family: var(--font-serif); font-size: 32px; color: var(--success); margin-top:4px;">${accepted}</div>
              <a href="#/prestador/propostas" class="t-dim fs-13">Acompanhar →</a>
            </div>
            <div class="card">
              <span class="t-dim fs-13">Avaliação média</span>
              <div style="font-family: var(--font-serif); font-size: 32px; color: var(--accent); margin-top:4px;">${pro.rating_avg.toFixed(1)}</div>
              <span class="t-dim fs-13">${pro.rating_count} avaliações</span>
            </div>
          </div>

          <div class="row row--between mb-3">
            <h2>Demandas próximas</h2>
            <span class="t-dim fs-14">${open.length} disponíveis</span>
          </div>
          <div class="row mb-5" style="gap:6px; flex-wrap:wrap;">
            <span class="chip is-active chip--static">Todas</span>
            ${pro.specialties.map((s) => UI.chip(D.findCategory(s.cat).name, { static: true })).join('')}
            <span class="chip chip--static">Hoje</span>
            <span class="chip chip--static">Até 5 km</span>
          </div>

          <div class="stack-lg">
            ${open.map((d) => providerDemandTile(d, pro)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function providerDemandTile(d, pro) {
    const cat = D.findCategory(d.cat);
    // Distância da demanda até o prestador demo pro-001 (Centro de Ribeirão Preto)
    const dist = ({
      'Centro': 0.5, 'Jardim Califórnia': 4.6, 'Jardim Botânico': 5.0,
      'Iguatemi': 6.8, 'Ribeirânia': 1.8, 'Castelo': 4.2, 'Sumarezinho': 3.6,
      'Vila Tibério': 1.9, 'Alto da Boa Vista': 4.7, 'Nova Aliança': 7.4,
      'Ipiranga': 2.4, 'Jardim Paulista': 1.6
    })[d.neighborhood] || 5.0;
    return `
      <article class="demand" data-link="#/prestador/demanda/${d.id}">
        <div class="demand__head">
          <div>
            <div class="row" style="gap:8px; align-items:center;">
              ${UI.chip(cat.name, { icon: cat.icon, static: true })}
              ${V._helpers.urgencyChip(d.urgency)}
            </div>
            <h3 class="demand__title mt-2">${d.title}</h3>
          </div>
        </div>
        <div class="demand__meta">
          <span>${UI.icon('map_pin', 14)} ${d.neighborhood}</span>
          <span>${UI.icon('car', 14)} ${dist.toFixed(1)} km</span>
          <span>${UI.icon('money', 14)} ${D.formatRange(d.budget_min, d.budget_max)}</span>
          <span class="t-dim">· ${D.formatRelativeMinutes(d.published_minutes_ago)}</span>
        </div>
        <div class="demand__footer">
          <span class="t-dim fs-13">${d.proposal_count} ${d.proposal_count === 1 ? 'proposta enviada' : 'propostas enviadas'}</span>
          <div class="row" style="gap:8px;">
            <a class="btn btn--ghost btn--sm" href="#/prestador/demanda/${d.id}">Ver detalhes</a>
            <a class="btn btn--primary btn--sm" href="#/prestador/demanda/${d.id}">Enviar proposta</a>
          </div>
        </div>
      </article>
    `;
  }

  // ====================================================================
  // VIEW 18 — Detalhe de demanda + envio de proposta
  // ====================================================================
  function demandDetail(params) {
    const id = params.id;
    const d = D.findDemand(id);
    if (!d) return V.notFound();
    const cat = D.findCategory(d.cat);
    const proposals = D.proposalsForDemand(d.id);
    const values = proposals.map((p) => p.value);
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;
    const dist = 1.6;

    return `
      <section class="page">
        <div class="container container--narrow">
          <a class="btn btn--ghost btn--sm" href="#/prestador">${UI.icon('arrow_left', 14)} Voltar para demandas</a>

          <div class="card mt-4">
            <div class="row" style="gap:8px; align-items:center;">
              ${UI.chip(cat.name, { icon: cat.icon, static: true })}
              ${V._helpers.urgencyChip(d.urgency)}
              <span class="t-dim fs-13" style="margin-left:auto;">Publicada ${D.formatRelativeMinutes(d.published_minutes_ago)}</span>
            </div>
            <h1 class="mt-3">${d.title}</h1>
            <p class="t-dim mt-3" style="line-height:1.65;">${d.description}</p>

            ${d.photos > 0 ? `
              <div class="mt-4">
                <span class="field__label">Fotos enviadas pelo cliente</span>
                <div class="photo-grid mt-2">
                  ${Array.from({ length: d.photos }).map(() => UI.photoPlaceholder('Foto da demanda')).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="grid grid-2 mt-5">
            <div class="card">
              <span class="t-dim fs-13">Local</span>
              <div style="font-weight:600; margin-top:4px;">${d.address_summary}</div>
              <div class="t-dim fs-14 mt-1">${dist.toFixed(1)} km do seu endereço</div>
            </div>
            <div class="card">
              <span class="t-dim fs-13">Preferência de horário</span>
              <div style="font-weight:600; margin-top:4px;">${d.urgency_label} · ${capitalize(d.time_pref)}</div>
              <div class="t-dim fs-14 mt-1">Cliente confirma na conversa</div>
            </div>
            <div class="card">
              <span class="t-dim fs-13">Faixa de orçamento informada</span>
              <div style="font-family: var(--font-serif); font-size:22px; color: var(--primary); margin-top:4px;">${D.formatRange(d.budget_min, d.budget_max)}</div>
            </div>
            <div class="card">
              <span class="t-dim fs-13">Outras propostas neste serviço</span>
              <div style="font-weight:600; margin-top:4px;">${proposals.length} ${proposals.length === 1 ? 'proposta enviada' : 'propostas enviadas'}</div>
              <div class="t-dim fs-14 mt-1">${values.length ? 'Faixa: ' + D.formatBRL(min) + ' – ' + D.formatBRL(max) : 'Você pode ser o primeiro'}</div>
            </div>
          </div>

          <div class="card mt-7">
            <h2>Sua proposta</h2>
            <p class="t-dim mt-2">Seja claro sobre o que está incluído. Combine antes para evitar mal-entendidos.</p>

            <form class="stack mt-5" data-form="provider-send-proposal" data-demand-id="${d.id}">
              <div class="grid grid-2">
                ${UI.field({ label: 'Valor (R$)', name: 'value', type: 'number', placeholder: 'Ex: 180', required: true })}
                ${UI.field({ label: 'Tempo estimado', name: 'time', placeholder: 'Ex: 1 hora', required: true })}
              </div>
              ${UI.field({ label: 'Disponibilidade', name: 'availability', placeholder: 'Ex: Hoje à tarde, 14h-17h', required: true })}
              ${UI.field({ label: 'Mensagem para o cliente', name: 'message', type: 'textarea', placeholder: 'Pelo que descreveu, vou levar... Cobro... Garantia de...' , required: true })}
              <div class="t-dim fs-13">Sua proposta vai ao cliente identificado por nome e avaliação. Cliente não vê seus dados de contato até aceitar.</div>
              <div class="row" style="justify-content:space-between;">
                <a class="btn btn--ghost" href="#/prestador">Cancelar</a>
                <button class="btn btn--primary btn--lg" type="submit">Enviar proposta</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  // ====================================================================
  // VIEW 19 — Minhas propostas (prestador)
  // ====================================================================
  function myProposals() {
    const pro = D.findProvider('pro-001');
    const list = D.proposalsByProvider(pro.id);
    const groups = {
      pending: list.filter((p) => p.status === 'pending'),
      accepted: list.filter((p) => p.status === 'accepted'),
      rejected: list.filter((p) => p.status === 'rejected')
    };
    return `
      <section class="page page--app">
        <div class="container">
          <span class="eyebrow">Minhas propostas</span>
          <h1 class="mt-2">${list.length} propostas no total</h1>

          <div class="row mt-5 mb-5" style="gap:8px; flex-wrap:wrap;">
            <span class="chip is-active chip--static">Todas (${list.length})</span>
            <span class="chip chip--static">Aguardando (${groups.pending.length})</span>
            <span class="chip chip--static">Aceitas (${groups.accepted.length})</span>
            <span class="chip chip--static">Recusadas (${groups.rejected.length})</span>
          </div>

          <div class="stack-lg">
            ${list.map((p) => myProposalCard(p)).join('') || `<div class="empty">${UI.icon('list', 56, 'class="empty__icon"')}<p>Você ainda não enviou propostas.</p></div>`}
          </div>
        </div>
      </section>
    `;
  }

  function myProposalCard(p) {
    const d = D.findDemand(p.demand_id);
    const cat = D.findCategory(d.cat);
    let statusBadge = '';
    if (p.status === 'pending')  statusBadge = UI.badge('Aguardando resposta', 'warning');
    if (p.status === 'accepted') statusBadge = UI.badge('Aceita', 'success');
    if (p.status === 'rejected') statusBadge = UI.badge('Recusada', '');
    return `
      <article class="card">
        <div class="row row--between" style="gap: 12px; align-items:flex-start;">
          <div style="flex:1;">
            <div class="row" style="gap:8px;">
              ${UI.chip(cat.name, { icon: cat.icon, static: true })}
              ${statusBadge}
            </div>
            <h3 class="mt-3">${d.title}</h3>
            <div class="t-dim fs-13 mt-1">${d.neighborhood} · enviada ${D.formatRelativeMinutes(p.sent_minutes_ago)}</div>
            <div class="t-dim fs-14 mt-2" style="font-style:italic;">"${escapeHtml(p.message.slice(0, 120))}${p.message.length > 120 ? '…' : ''}"</div>
          </div>
          <div class="text-right">
            <div class="proposal__price" style="font-size:22px;">${D.formatBRL(p.value)}</div>
            <div class="t-dim fs-13 mt-1">${p.time_estimate}</div>
          </div>
        </div>
        <div class="row mt-4" style="gap:8px;">
          <a class="btn btn--ghost btn--sm" href="#/prestador/demanda/${d.id}">Ver demanda</a>
          ${p.status === 'accepted' ? `<a class="btn btn--primary btn--sm" href="#/prestador/proposta-aceita/${p.id}">Ver contato</a>` : ''}
        </div>
      </article>
    `;
  }

  // ====================================================================
  // VIEW 20 — Proposta aceita (prestador)
  // ====================================================================
  function proposalAccepted(params) {
    const propId = params.id;
    const prop = D.PROPOSALS.find((x) => x.id === propId) || D.PROPOSALS.find((p) => p.status === 'accepted');
    const dem = D.findDemand(prop.demand_id);
    const c = D.DEMO_CLIENT;
    const phoneDigits = c.phone.replace(/\D/g, '');

    return `
      <section class="page">
        <div class="container container--narrow t-center">
          <div style="width:96px; height:96px; margin:0 auto var(--space-5); border-radius:50%; background: var(--success-soft); color: var(--success); display:flex; align-items:center; justify-content:center;">
            ${UI.icon('check', 48)}
          </div>
          <h1>Sua proposta foi aceita!</h1>
          <p class="lead mt-2">Por <strong>${c.first_name.split(' ')[0]}</strong> · ${c.neighborhood}</p>
        </div>
        <div class="container container--narrow mt-7">
          <div class="card">
            <div class="row" style="gap:14px; align-items:center;">
              ${UI.avatar(c, 'lg')}
              <div style="flex:1;">
                <strong>${c.first_name}</strong>
                <div class="t-dim fs-14">${c.neighborhood}, ${c.city}</div>
              </div>
            </div>
            <div class="divider mt-4 mb-4"></div>
            <div class="stack">
              <div>
                <span class="t-dim fs-13">Demanda</span>
                <div style="font-weight:600; margin-top:2px;">${dem.title}</div>
              </div>
              <div>
                <span class="t-dim fs-13">Endereço</span>
                <div style="font-weight:600; margin-top:2px;">${c.address}, ${c.neighborhood}, ${c.city}</div>
              </div>
              <div>
                <span class="t-dim fs-13">Valor combinado</span>
                <div style="font-family: var(--font-serif); font-size:22px; color: var(--primary); margin-top:2px;">${D.formatBRL(prop.value)} · ${prop.time_estimate}</div>
              </div>
            </div>
            <div class="divider mt-4 mb-4"></div>
            <div class="stack">
              <a class="btn btn--primary btn--block btn--lg" href="https://wa.me/55${phoneDigits}?text=${encodeURIComponent('Oi ' + c.first_name.split(' ')[0] + ', tudo bem? Obrigado por aceitar minha proposta no LarCare. Quando posso passar?')}" target="_blank" rel="noopener">${UI.icon('whatsapp', 18)} Falar no WhatsApp</a>
              <a class="btn btn--outline btn--block" href="tel:+55${phoneDigits}">${UI.icon('phone', 16)} Ligar para ${c.phone}</a>
            </div>
          </div>
          <div class="card card--soft mt-5">
            <p class="t-dim" style="line-height:1.6;">Combine os detalhes diretamente com a cliente. Lembre-se que sua avaliação após o serviço impacta sua reputação na plataforma.</p>
          </div>
          <div class="row mt-6" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="#/prestador/propostas">Voltar</a>
            <a class="btn btn--outline" href="#/prestador/avaliar/${prop.id}">Avaliar (após serviço)</a>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 21 — Avaliação pós-serviço (prestador)
  // ====================================================================
  function providerReview(params) {
    const c = D.DEMO_CLIENT;
    const items = [
      { id: 'clarity',   label: 'Clareza da demanda' },
      { id: 'manner',    label: 'Cordialidade do cliente' },
      { id: 'payment',   label: 'Pagamento conforme combinado' },
      { id: 'access',    label: 'Acessibilidade do local' }
    ];
    return `
      <section class="page">
        <div class="container container--narrow">
          <div class="t-center mb-5">
            <div style="width:64px; height:64px; margin:0 auto var(--space-3); border-radius:50%; background: var(--primary-tint); display:flex; align-items:center; justify-content:center; color:var(--primary);">
              ${UI.icon('star', 30)}
            </div>
            <h1>Como foi atender ${c.first_name.split(' ')[0]}?</h1>
            <p class="lead mt-2">Sua avaliação ajuda outros prestadores e mantém a plataforma honesta.</p>
          </div>

          <form class="card" data-form="provider-review">
            <div class="stack-lg">
              ${items.map((it) => `
                <div>
                  <div class="row row--between">
                    <strong>${it.label}</strong>
                    <span class="stars-input" data-stars data-name="${it.id}">
                      ${[1,2,3,4,5].map((n) => `<button type="button" data-value="${n}" aria-label="${n} estrelas">${UI.icon('star', 26)}</button>`).join('')}
                    </span>
                  </div>
                </div>
              `).join('')}
              <div>
                <label class="field__label">Comentário <span class="t-dim">(opcional)</span></label>
                <textarea class="textarea mt-2" name="comment" placeholder="Conta como foi atender o cliente (opcional)"></textarea>
              </div>
            </div>
            <div class="row mt-6" style="justify-content:space-between;">
              <a class="btn btn--ghost" href="#/prestador">Avaliar depois</a>
              <button class="btn btn--primary" type="submit">Enviar avaliação</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 22 — Perfil do prestador (editável)
  // ====================================================================
  function providerProfile() {
    const pro = D.findProvider('pro-001');
    const myProposals = D.proposalsByProvider(pro.id);
    const accepted = myProposals.filter((p) => p.status === 'accepted').length;
    return `
      <section class="page page--app">
        <div class="container container--narrow">
          <div class="row row--between mb-5">
            <span class="eyebrow">Meu perfil</span>
            <button class="btn btn--ghost btn--sm">${UI.icon('edit', 14)} Editar</button>
          </div>

          <div class="card">
            <div class="row" style="gap:18px; align-items:center;">
              ${UI.avatar(pro, 'xl')}
              <div style="flex:1;">
                <h1 style="font-size:26px;">${pro.first_name}</h1>
                <div class="row mt-2" style="gap:6px; flex-wrap:wrap;">
                  ${pro.specialties.map((s) => UI.chip(D.findCategory(s.cat).name, { static: true })).join('')}
                </div>
                <div class="rating mt-3">${UI.ratingStars(pro.rating_avg)}<span class="rating__value" style="margin-left:6px;">${pro.rating_avg.toFixed(1)}</span><span class="t-dim">(${pro.rating_count})</span></div>
              </div>
            </div>
          </div>

          <div class="grid grid-3 mt-5">
            <div class="card t-center">
              <div style="font-family: var(--font-serif); font-size: 28px; color: var(--primary);">${pro.rating_count}</div>
              <div class="t-dim fs-13">serviços concluídos</div>
            </div>
            <div class="card t-center">
              <div style="font-family: var(--font-serif); font-size: 28px; color: var(--primary);">${pro.response_minutes} min</div>
              <div class="t-dim fs-13">tempo médio de resposta</div>
            </div>
            <div class="card t-center">
              <div style="font-family: var(--font-serif); font-size: 28px; color: var(--primary);">${Math.round(pro.acceptance_rate * 100)}%</div>
              <div class="t-dim fs-13">taxa de aceite</div>
            </div>
          </div>

          <div class="card mt-5">
            <div class="row row--between mb-2"><h3>Apresentação</h3><button class="btn btn--ghost btn--sm">${UI.icon('edit', 14)}</button></div>
            <p class="t-dim" style="line-height:1.65;">${pro.bio}</p>
          </div>

          <div class="card mt-5">
            <div class="row row--between mb-2"><h3>Especialidades e experiência</h3><button class="btn btn--ghost btn--sm">${UI.icon('edit', 14)}</button></div>
            <div class="stack mt-2">
              ${pro.specialties.map((s) => `
                <div class="row row--between">
                  <span>${D.findCategory(s.cat).name}</span>
                  <strong>${s.years} anos</strong>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card mt-5">
            <div class="row row--between mb-2"><h3>Atuação</h3><button class="btn btn--ghost btn--sm">${UI.icon('edit', 14)}</button></div>
            <div class="stack mt-2">
              <div class="row row--between"><span class="t-dim">Bairro</span><span>${pro.neighborhood}, ${pro.city}</span></div>
              <div class="row row--between"><span class="t-dim">Raio de atendimento</span><span>${pro.radius_km} km</span></div>
              <div class="row row--between"><span class="t-dim">Material próprio</span><span>${pro.brings_material === 'sim' ? 'Sempre' : pro.brings_material === 'nao' ? 'Não' : 'Depende do serviço'}</span></div>
              <div class="row row--between"><span class="t-dim">Veículo próprio</span><span>${pro.has_vehicle ? 'Sim' : 'Não'}</span></div>
            </div>
          </div>

          <div class="card mt-5">
            <h3 class="mb-3">Verificações</h3>
            <ul class="checklist">
              <li class="checklist__item"><span class="checklist__check">${UI.icon('check', 14)}</span><span>Identidade conferida</span></li>
              <li class="checklist__item"><span class="checklist__check">${UI.icon('check', 14)}</span><span>Antecedente verificado em ${formatDate(pro.verified.last_check)}</span></li>
              <li class="checklist__item"><span class="checklist__check">${UI.icon('check', 14)}</span><span>Endereço comprovado</span></li>
            </ul>
          </div>

          <div class="card mt-5">
            <h3>Versão do aplicativo</h3>
            <div class="row row--between mt-2" style="align-items:center;">
              <div>
                <div style="font-weight:600;">LarCare v${(window.LarCareConfig && window.LarCareConfig.VERSION) || '1.0'}</div>
                <div class="t-dim fs-13 mt-1">Se algo parecer estranho, busque atualizações.</div>
              </div>
              <button class="btn btn--outline btn--sm" type="button" data-action="check-update">Buscar atualização</button>
            </div>
          </div>

          <div class="card mt-5" style="background: var(--warning-soft); border-color: var(--warning);">
            <h3 style="color: #6f4f24;">Esta é uma demonstração</h3>
            <p class="t-dim mt-2">Dados simulados para o pitch. Toque em "Resetar demo" para zerar e começar de novo.</p>
            <button class="btn btn--outline mt-3" type="button" data-action="reset-demo">Resetar demo</button>
          </div>

          <p class="t-center t-dim fs-13 mt-7">LarCare v${(window.LarCareConfig && window.LarCareConfig.VERSION) || '1.0'} — feito em Ribeirão Preto-SP</p>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // forProviders — landing dedicada à captação de prestadores
  // ====================================================================
  function forProviders() {
    return `
      <section class="page">
        <div class="container container--narrow">
          <span class="eyebrow">Pra prestadores</span>
          <h1 class="mt-3">Trabalho sério, com cliente que respeita.</h1>
          <p class="lead mt-4">Você é eletricista, encanador, diarista, jardineiro, faz-tudo, técnico de ar, chaveiro? Receba pedidos qualificados em Ribeirão Preto, sem pagar mensalidade. Cliente que já descreveu o problema, tem endereço, sabe o que quer.</p>

          <div class="grid grid-2 mt-7">
            <div class="card">
              <div class="row" style="gap:8px; align-items:center; margin-bottom: 8px;">
                <span style="font-size:24px;">📲</span>
                <strong>Sem mensalidade</strong>
              </div>
              <p class="t-dim fs-14">Você só paga quando trabalha — 5% sobre o serviço resolvido. Sem custo fixo, sem cobrança escondida.</p>
            </div>
            <div class="card">
              <div class="row" style="gap:8px; align-items:center; margin-bottom: 8px;">
                <span style="font-size:24px;">🎯</span>
                <strong>Cliente já chega decidido</strong>
              </div>
              <p class="t-dim fs-14">Descreveu o problema, tem endereço, sabe o que quer. Você só envia proposta no que faz sentido pra sua agenda.</p>
            </div>
            <div class="card">
              <div class="row" style="gap:8px; align-items:center; margin-bottom: 8px;">
                <span style="font-size:24px;">💰</span>
                <strong>Pagamento direto</strong>
              </div>
              <p class="t-dim fs-14">Pix na hora ou cartão pelo app. Você combina a forma e recebe sem intermediação demorada.</p>
            </div>
            <div class="card">
              <div class="row" style="gap:8px; align-items:center; margin-bottom: 8px;">
                <span style="font-size:24px;">⭐</span>
                <strong>Reputação que fica</strong>
              </div>
              <p class="t-dim fs-14">Cada serviço bem feito vira avaliação pública. Cliente novo vê seu histórico antes de te contratar.</p>
            </div>
          </div>

          <h2 class="mt-8">Como começar</h2>
          <div class="steps-card mt-4">
            <div class="steps-card__item"><span class="steps-card__num">1</span><h3>Faça seu cadastro</h3><p class="t-dim mt-2">5 minutos no celular: dados, foto, o que você faz, onde atende em Ribeirão Preto.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">2</span><h3>Envie fotos do seu trabalho</h3><p class="t-dim mt-2">Antes/depois de serviços que você já fez. Cliente confia mais em quem mostra obra entregue.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">3</span><h3>Verificação em até 24h</h3><p class="t-dim mt-2">Conferimos RG, antecedente e endereço. Você recebe o selo "Verificado" e fica mais visível.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">4</span><h3>Receba os primeiros pedidos</h3><p class="t-dim mt-2">Notificação no celular quando aparece pedido compatível com sua categoria e raio.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">5</span><h3>Faça, receba, avalie</h3><p class="t-dim mt-2">Combinou e fez. Recebe pelo Pix ou cartão. Os dois se avaliam ao final.</p></div>
          </div>

          <h2 class="mt-8">Validação real</h2>
          <div class="card card--soft t-center mt-4" style="padding: var(--space-7) var(--space-5);">
            <p style="font-size: 17px; line-height: 1.55; max-width: 460px; margin: 0 auto;">
              <strong>Em breve: primeiros casos reais.</strong><br/>
              Estamos cadastrando os primeiros prestadores em Ribeirão Preto. Sem depoimentos forjados — quando tivermos histórias reais, elas aparecem aqui.
            </p>
            <a class="btn btn--primary mt-4" href="#/onboarding-prestador">Quero ser o primeiro prestador</a>
          </div>

          <h2 class="mt-8">Quanto se ganha</h2>
          <p class="t-dim mt-3">Valores de referência baseados em ticket médio praticado em Ribeirão Preto. Você define seu preço dentro da faixa de mercado.</p>
          <div class="card mt-4" style="padding: 0; overflow-x: auto; -webkit-overflow-scrolling: touch;">
            <table style="width:100%; min-width: 480px; border-collapse: collapse; font-size: 14px;">
              <thead style="background: var(--bg); color: var(--text-dim); font-weight: 600;">
                <tr>
                  <th style="text-align:left; padding: 12px 16px;">Categoria</th>
                  <th style="text-align:right; padding: 12px 16px;">Ticket médio</th>
                  <th style="text-align:right; padding: 12px 16px;">Comissão LarCare</th>
                  <th style="text-align:right; padding: 12px 16px;">Você recebe</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-top: 1px solid var(--border);"><td style="padding: 12px 16px;">Elétrica residencial</td><td style="text-align:right; padding: 12px 16px;">R$ 180</td><td style="text-align:right; padding: 12px 16px;">R$ 9</td><td style="text-align:right; padding: 12px 16px; font-weight:600;">R$ 171</td></tr>
                <tr style="border-top: 1px solid var(--border);"><td style="padding: 12px 16px;">Hidráulica</td><td style="text-align:right; padding: 12px 16px;">R$ 220</td><td style="text-align:right; padding: 12px 16px;">R$ 11</td><td style="text-align:right; padding: 12px 16px; font-weight:600;">R$ 209</td></tr>
                <tr style="border-top: 1px solid var(--border);"><td style="padding: 12px 16px;">Diarista (8h)</td><td style="text-align:right; padding: 12px 16px;">R$ 180</td><td style="text-align:right; padding: 12px 16px;">R$ 9</td><td style="text-align:right; padding: 12px 16px; font-weight:600;">R$ 171</td></tr>
                <tr style="border-top: 1px solid var(--border);"><td style="padding: 12px 16px;">Montagem de móveis</td><td style="text-align:right; padding: 12px 16px;">R$ 200</td><td style="text-align:right; padding: 12px 16px;">R$ 10</td><td style="text-align:right; padding: 12px 16px; font-weight:600;">R$ 190</td></tr>
                <tr style="border-top: 1px solid var(--border);"><td style="padding: 12px 16px;">Faz-tudo (dia)</td><td style="text-align:right; padding: 12px 16px;">R$ 250</td><td style="text-align:right; padding: 12px 16px;">R$ 12,50</td><td style="text-align:right; padding: 12px 16px; font-weight:600;">R$ 237,50</td></tr>
              </tbody>
            </table>
          </div>
          <p class="t-dim fs-13 mt-2">Valores de referência baseados em mercado de Ribeirão Preto. Você define o preço dentro da faixa.</p>

          <h2 class="mt-8">Suas dúvidas</h2>
          <div class="stack mt-4">
            <details class="faq-item">
              <summary>Quanto custa pra estar no LarCare?</summary>
              <p class="t-dim mt-2">Sem mensalidade. Você só paga 5% sobre o valor de cada serviço resolvido. Sem cobrança escondida, sem assinatura.</p>
            </details>
            <details class="faq-item">
              <summary>Como funciona a verificação?</summary>
              <p class="t-dim mt-2">Você envia foto de RG ou CNH, comprovante de residência e antecedente criminal (gratuito pela Polícia Civil). Conferimos em até 24h e seu perfil ganha o selo "Verificado".</p>
            </details>
            <details class="faq-item">
              <summary>E se o cliente não pagar?</summary>
              <p class="t-dim mt-2">O pagamento acontece pelo app (Pix ou cartão) ou direto entre vocês. Sempre combine antes. Em caso de calote, registre conosco — clientes com histórico de calote são banidos.</p>
            </details>
            <details class="faq-item">
              <summary>Quantas categorias posso cadastrar?</summary>
              <p class="t-dim mt-2">Até 5 no cadastro inicial. Mas escolha as que você faz bem, não tudo. Cliente percebe quem é especialista.</p>
            </details>
            <details class="faq-item">
              <summary>Posso atender só algumas regiões?</summary>
              <p class="t-dim mt-2">Sim. Você define seu bairro de partida e o raio máximo (1 a 30 km). Pedidos fora do raio não aparecem pra você.</p>
            </details>
            <details class="faq-item">
              <summary>Como saio da plataforma se quiser?</summary>
              <p class="t-dim mt-2">Em Perfil > Configurações > "Excluir minha conta". Seus dados são apagados em até 30 dias. Avaliações públicas anonimizadas permanecem pra preservar histórico de clientes.</p>
            </details>
          </div>

          <div class="card card--feature mt-8 t-center">
            <h2 style="color:#fff;">Pronto pra começar?</h2>
            <p style="color:rgba(255,255,255,0.85); margin: 12px auto 24px; max-width: 480px;">Cadastro em 5 minutos. Atende Ribeirão Preto.</p>
            <a class="btn btn--accent btn--lg" href="#/onboarding-prestador">Cadastrar agora — 5 minutos</a>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // forClients — landing dedicada à captação de clientes
  // ====================================================================
  function forClients() {
    return `
      <section class="page">
        <div class="container container--narrow">
          <span class="eyebrow">Pra clientes</span>
          <h1 class="mt-3">Sua casa pede atenção. A gente resolve.</h1>
          <p class="lead mt-4">Eletricista, encanador, diarista, faz-tudo — todos verificados, perto de você em Ribeirão Preto. Você descreve o que precisa, recebe propostas em minutos e escolhe quem topa o seu serviço.</p>

          <div class="t-center mt-6">
            <a class="btn btn--primary btn--lg" href="#/cliente/nova-demanda">Pedir um serviço agora</a>
          </div>

          <h2 class="mt-8">Como funciona em 3 passos</h2>
          <div class="steps-card mt-4">
            <div class="steps-card__item"><span class="steps-card__num">1</span><h3>Você descreve o que precisa</h3><p class="t-dim mt-2">Categoria, descrição, foto opcional, prazo. Em três minutos seu pedido tá publicado.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">2</span><h3>Prestadores próximos enviam orçamento</h3><p class="t-dim mt-2">Nossa meta é responder em até 30 minutos. Você compara valor, prazo, nota, distância.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">3</span><h3>Você escolhe, contrata, avalia</h3><p class="t-dim mt-2">Aceita a proposta que topou, combina no chat, paga pelo Pix ou cartão. No fim avalia.</p></div>
          </div>

          <h2 class="mt-8">Por que LarCare</h2>
          <div class="grid grid-2 mt-4">
            <div class="card">
              <div class="row" style="gap:8px; align-items:center; margin-bottom: 8px;">
                <span style="font-size:24px;">🛡️</span>
                <strong>Prestadores verificados</strong>
              </div>
              <p class="t-dim fs-14">RG, antecedente criminal e endereço conferidos antes de cada prestador aparecer no app.</p>
            </div>
            <div class="card">
              <div class="row" style="gap:8px; align-items:center; margin-bottom: 8px;">
                <span style="font-size:24px;">⚡</span>
                <strong>Meta: 30 minutos</strong>
              </div>
              <p class="t-dim fs-14">Trabalhamos pra ter a primeira proposta na sua tela em meia hora em horário comercial — dado real será publicado quando tivermos volume.</p>
            </div>
            <div class="card">
              <div class="row" style="gap:8px; align-items:center; margin-bottom: 8px;">
                <span style="font-size:24px;">💰</span>
                <strong>Sem cobrança escondida</strong>
              </div>
              <p class="t-dim fs-14">Você vê o preço antes de aceitar. Material à parte é informado na proposta. Sem surpresa na chegada.</p>
            </div>
            <div class="card">
              <div class="row" style="gap:8px; align-items:center; margin-bottom: 8px;">
                <span style="font-size:24px;">⭐</span>
                <strong>Avaliação dos dois lados</strong>
              </div>
              <p class="t-dim fs-14">Você avalia o prestador, ele te avalia. Quem trabalha bem fica bem visto. Quem não cumpre, perde espaço.</p>
            </div>
          </div>

          <h2 class="mt-8">Validação real</h2>
          <div class="card card--soft t-center mt-4" style="padding: var(--space-7) var(--space-5);">
            <p style="font-size: 17px; line-height: 1.55; max-width: 460px; margin: 0 auto;">
              <strong>Em breve: primeiros casos reais.</strong><br/>
              Estamos cadastrando os primeiros clientes em Ribeirão Preto. Sem depoimentos forjados — quando tivermos histórias reais, elas aparecem aqui.
            </p>
            <a class="btn btn--primary mt-4" href="#/cliente/nova-demanda">Quero ser o primeiro cliente</a>
          </div>

          <h2 class="mt-8">Categorias atendidas</h2>
          <p class="t-dim mt-3">18 tipos de serviço em 4 grupos. Toque na categoria pra ir direto pro pedido.</p>
          <div class="grid grid-4 mt-4">
            ${D.CATEGORIES.slice(0, 12).map((c) => `
              <a class="cat-tile" href="#/cliente/nova-demanda?cat=${c.id}">
                <span class="cat-tile__icon">${UI.icon(c.icon, 22)}</span>
                <span class="cat-tile__name">${c.name}</span>
              </a>
            `).join('')}
          </div>

          <h2 class="mt-8">Perguntas que a gente ouve sempre</h2>
          <div class="stack mt-4">
            <details class="faq-item">
              <summary>Quanto custa pra eu usar o LarCare?</summary>
              <p class="t-dim mt-2">Nada. Sem mensalidade, sem taxa por pedido, sem cobrança por aceitar proposta. A LarCare cobra 5% do prestador sobre cada serviço — ele já considera isso na proposta.</p>
            </details>
            <details class="faq-item">
              <summary>Como sei que o prestador é confiável?</summary>
              <p class="t-dim mt-2">Todo prestador passa por verificação (identidade, antecedente, endereço). Quem completa ganha o selo "Verificado". Cada serviço gera avaliação pública — você vê a nota antes de aceitar.</p>
            </details>
            <details class="faq-item">
              <summary>Posso não estar em casa quando o prestador chegar?</summary>
              <p class="t-dim mt-2">Pode. Combine no chat do app: quem abre a porta, onde fica a chave, como acompanhar pelo WhatsApp. Vários prestadores aceitam mandar foto antes/depois pra você acompanhar de longe.</p>
            </details>
            <details class="faq-item">
              <summary>Tem garantia se o serviço não ficar bom?</summary>
              <p class="t-dim mt-2">A maioria dos prestadores oferece 30 dias de garantia em serviços técnicos. Combine isso no chat antes de fechar. Se houver problema na garantia, registre conosco pelo app.</p>
            </details>
            <details class="faq-item">
              <summary>Como pago o prestador?</summary>
              <p class="t-dim mt-2">Pix pelo app (mais comum), cartão pelo app, ou direto com o prestador no fim do serviço. Você escolhe a forma na hora de aceitar a proposta.</p>
            </details>
            <details class="faq-item">
              <summary>Atende quais bairros de Ribeirão Preto?</summary>
              <p class="t-dim mt-2">Centro, Jardim Botânico, Iguatemi, Ribeirânia, Castelo, Sumarezinho, Vila Tibério, Jardim Califórnia, Alto da Boa Vista, Nova Aliança, Ipiranga, Jardim Paulista, e crescendo.</p>
            </details>
            <details class="faq-item">
              <summary>E se algo der errado durante o serviço?</summary>
              <p class="t-dim mt-2">Reporta pelo app. Suporte humano responde em até 48h. Pra urgências, canal direto pelo WhatsApp do suporte. Avaliação negativa afeta o ranking do prestador.</p>
            </details>
          </div>

          <div class="card card--feature mt-8 t-center">
            <h2 style="color:#fff;">Resolver agora.</h2>
            <p style="color:rgba(255,255,255,0.85); margin: 12px auto 24px; max-width: 480px;">Pedir um serviço leva três minutos. Sem cadastro pesado.</p>
            <a class="btn btn--accent btn--lg" href="#/cliente/nova-demanda">Pedir um serviço</a>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEWS 23-26 — Institucional
  // ====================================================================
  function privacy() {
    return `
      <section class="page legal-page">
        <div class="container container--narrow">
          <nav class="legal-breadcrumb" aria-label="Breadcrumb">
            <a href="#/">Início</a> <span aria-hidden="true">›</span> <a href="#/sobre">Sobre</a> <span aria-hidden="true">›</span> <span>Política de Privacidade</span>
          </nav>
          <header class="legal-header">
            <h1>Política de Privacidade</h1>
            <p class="legal-meta">Versão 1.0 · Última atualização: 15 de maio de 2026 · LarCare Tecnologia Ltda. — Ribeirão Preto, SP</p>
            <button class="btn btn--ghost btn--sm" type="button" onclick="window.print()">Imprimir</button>
          </header>

          <div class="legal-content">
            <section>
              <h2>1. Apresentação</h2>
              <p>O LarCare ("nós", "nossa Plataforma") é mantido pela LarCare Tecnologia Ltda., inscrita no CNPJ sob nº [a definir], com sede em Ribeirão Preto, São Paulo. Esta Política de Privacidade ("Política") explica como coletamos, usamos, compartilhamos e protegemos seus dados pessoais quando você usa a Plataforma LarCare, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, "LGPD").</p>
              <p>Nosso Encarregado de Proteção de Dados (DPO) pode ser contatado pelo e-mail <a href="mailto:privacidade@larcare.com.br">privacidade@larcare.com.br</a>.</p>
            </section>

            <section>
              <h2>2. Dados pessoais coletados</h2>
              <p><strong>2.1. Dados de cadastro (clientes):</strong> nome completo, CPF, data de nascimento, e-mail, telefone com WhatsApp, endereço de atendimento (CEP, logradouro, número, complemento, bairro, cidade, estado), foto de perfil opcional.</p>
              <p><strong>2.2. Dados de cadastro (prestadores):</strong> todos os dados acima, mais cópia de RG ou CNH (frente e verso), comprovante de residência recente, certidão de antecedentes criminais, foto profissional, especialidades, anos de experiência, faixa de preço, raio de atendimento, dados bancários (somente quando aplicável e mediante consentimento específico para repasses futuros).</p>
              <p><strong>2.3. Dados de uso da Plataforma:</strong> histórico de demandas, propostas enviadas e recebidas, avaliações dadas e recebidas, conversas via chat interno, localização aproximada (com seu consentimento explícito), preferências de notificação, configurações de privacidade.</p>
              <p><strong>2.4. Dados técnicos:</strong> endereço IP, identificador de dispositivo, sistema operacional, navegador, idioma, fuso horário, datas/horas de acesso, páginas visitadas, ações realizadas. Esses dados são coletados automaticamente para fins de segurança, análise de uso e melhoria contínua da Plataforma.</p>
              <p><strong>2.5. Dados de pagamento:</strong> nesta fase, o LarCare não processa pagamentos. Cliente e prestador combinam diretamente. Quando essa funcionalidade for incluída, esta Política será atualizada e você será notificado.</p>
            </section>

            <section>
              <h2>3. Finalidades do tratamento</h2>
              <p><strong>3.1.</strong> Permitir que clientes e prestadores se conectem por meio de demandas, propostas e mensagens.</p>
              <p><strong>3.2.</strong> Verificar a identidade e idoneidade dos prestadores antes da habilitação na Plataforma.</p>
              <p><strong>3.3.</strong> Operar o sistema de avaliações cruzadas, mantendo a reputação dos usuários.</p>
              <p><strong>3.4.</strong> Comunicar-se com você sobre o serviço (notificações, atualizações da Plataforma, respostas a contatos de suporte).</p>
              <p><strong>3.5.</strong> Detectar e prevenir fraudes, abusos, condutas inadequadas e violações destes Termos.</p>
              <p><strong>3.6.</strong> Cumprir obrigações legais, regulatórias, contratuais e atender requisições de autoridades competentes.</p>
              <p><strong>3.7.</strong> Realizar análises estatísticas agregadas (sempre anonimizadas) para melhoria da Plataforma.</p>
            </section>

            <section>
              <h2>4. Bases legais (Art. 7º da LGPD)</h2>
              <p><strong>4.1. Execução de contrato (Art. 7º, V):</strong> a maioria dos dados é tratada para viabilizar a prestação do serviço de intermediação que você contratou ao se cadastrar.</p>
              <p><strong>4.2. Cumprimento de obrigação legal (Art. 7º, II):</strong> dados de prestadores (verificação de antecedentes, registro de transações) são tratados para cumprir exigências legais.</p>
              <p><strong>4.3. Consentimento (Art. 7º, I):</strong> dados sensíveis (como certidão criminal) e usos não-essenciais (comunicações de marketing, geolocalização precisa) dependem de consentimento explícito, que você pode revogar a qualquer momento.</p>
              <p><strong>4.4. Legítimo interesse (Art. 7º, IX):</strong> análises agregadas, prevenção de fraude e segurança da Plataforma.</p>
            </section>

            <section>
              <h2>5. Compartilhamento de dados</h2>
              <p><strong>5.1. Com prestadores:</strong> quando você cria uma demanda, prestadores compatíveis recebem informações sobre o pedido (bairro, descrição, fotos, faixa de orçamento). Seus dados de contato (telefone, endereço completo) são compartilhados apenas após você aceitar uma proposta.</p>
              <p><strong>5.2. Com clientes (no caso de prestadores):</strong> nome, foto, avaliações, especialidades e bio ficam públicos para clientes interessados. Documentos de verificação não são compartilhados.</p>
              <p><strong>5.3. Com fornecedores técnicos:</strong> usamos serviços de terceiros para hospedagem, autenticação, envio de mensagens, processamento de pagamentos futuros — todos contratualmente obrigados a cumprir a LGPD.</p>
              <p><strong>5.4. Com autoridades:</strong> quando legalmente exigido (ordem judicial, requisição de Ministério Público ou autoridade policial competente).</p>
              <p><strong>5.5.</strong> Nunca vendemos seus dados pessoais identificados a terceiros para fins de publicidade ou outras finalidades comerciais não-autorizadas.</p>
            </section>

            <section>
              <h2>6. Armazenamento e segurança</h2>
              <p><strong>6.1. Onde armazenamos:</strong> servidores no Brasil, com criptografia em trânsito (TLS 1.3) e em repouso (AES-256).</p>
              <p><strong>6.2. Prazo de retenção:</strong> dados de conta ativa são mantidos enquanto sua conta existir. Após exclusão da conta, dados pessoais são apagados em até 30 dias, salvo registros mínimos exigidos por lei (transações, prevenção de fraude — até 5 anos).</p>
              <p><strong>6.3. Medidas técnicas:</strong> controle de acesso por papel, autenticação multifator para a equipe interna, monitoramento de incidentes, logs auditáveis, treinamento contínuo, programa de gestão de incidentes.</p>
              <p><strong>6.4. Incidentes:</strong> em caso de incidente de segurança que possa afetar seus direitos, notificaremos você e a ANPD nos prazos legais.</p>
            </section>

            <section>
              <h2>7. Seus direitos (Art. 18 da LGPD)</h2>
              <p>Como titular dos dados, você tem direito a:</p>
              <p><strong>7.1.</strong> Confirmar a existência de tratamento dos seus dados.</p>
              <p><strong>7.2.</strong> Acessar seus dados pessoais a qualquer momento.</p>
              <p><strong>7.3.</strong> Corrigir dados incompletos, inexatos ou desatualizados.</p>
              <p><strong>7.4.</strong> Solicitar anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.</p>
              <p><strong>7.5.</strong> Portabilidade dos seus dados a outro fornecedor de serviço.</p>
              <p><strong>7.6.</strong> Eliminação dos dados tratados com base no seu consentimento, exceto nas hipóteses de retenção legal.</p>
              <p><strong>7.7.</strong> Informação sobre com quem compartilhamos seus dados.</p>
              <p><strong>7.8.</strong> Revogar o consentimento a qualquer tempo.</p>
              <p><strong>7.9.</strong> Opor-se a tratamentos realizados com base em legítimo interesse.</p>
            </section>

            <section>
              <h2>8. Como exercer seus direitos</h2>
              <p>Para exercer qualquer direito acima, envie e-mail para <a href="mailto:privacidade@larcare.com.br">privacidade@larcare.com.br</a> com a descrição da solicitação. Responderemos em até 15 (quinze) dias corridos, conforme exigido pela LGPD. Pode ser necessária verificação adicional de identidade para garantir segurança.</p>
            </section>

            <section>
              <h2>9. Cookies e tecnologias similares</h2>
              <p>Usamos cookies essenciais para autenticação e funcionamento da Plataforma. Cookies analíticos e de preferência são opcionais — você pode controlá-los em Perfil &gt; Preferências.</p>
            </section>

            <section>
              <h2>10. Crianças e adolescentes</h2>
              <p>O LarCare destina-se a maiores de 18 anos. Não coletamos dados de crianças e adolescentes intencionalmente. Caso identifiquemos cadastro irregular, a conta será imediatamente excluída.</p>
            </section>

            <section>
              <h2>11. Transferência internacional</h2>
              <p>Nesta fase, todos os dados são armazenados no Brasil. Caso, no futuro, utilizemos fornecedores fora do Brasil, garantiremos as salvaguardas previstas no Art. 33 da LGPD.</p>
            </section>

            <section>
              <h2>12. Alterações desta Política</h2>
              <p>Podemos atualizar esta Política para refletir mudanças legais, técnicas ou operacionais. Você será notificado com pelo menos 30 dias de antecedência para alterações substanciais. A versão vigente está sempre disponível nesta página.</p>
            </section>

            <section>
              <h2>13. Contato</h2>
              <p><strong>Encarregado (DPO):</strong> Renato Cesar Rodrigues<br/>
              <strong>E-mail:</strong> <a href="mailto:privacidade@larcare.com.br">privacidade@larcare.com.br</a><br/>
              <strong>Endereço:</strong> Ribeirão Preto, SP — endereço completo disponibilizado em requisições formais.</p>
              <p>Em caso de não-resolução ou insatisfação, você pode contatar a Autoridade Nacional de Proteção de Dados (ANPD) em <a href="https://www.gov.br/anpd" target="_blank" rel="noopener">www.gov.br/anpd</a>.</p>
            </section>

            <p class="legal-footer">© 2026 LarCare Tecnologia Ltda. Documento em conformidade com a Lei nº 13.709/2018 (LGPD).</p>
          </div>
        </div>
      </section>
    `;
  }

  function terms() {
    return `
      <section class="page legal-page">
        <div class="container container--narrow">
          <nav class="legal-breadcrumb" aria-label="Breadcrumb">
            <a href="#/">Início</a> <span aria-hidden="true">›</span> <a href="#/sobre">Sobre</a> <span aria-hidden="true">›</span> <span>Termos de Uso</span>
          </nav>
          <header class="legal-header">
            <h1>Termos de Uso</h1>
            <p class="legal-meta">Versão 1.0 · Última atualização: 15 de maio de 2026 · LarCare Tecnologia Ltda. — Ribeirão Preto, SP</p>
            <button class="btn btn--ghost btn--sm" type="button" onclick="window.print()">Imprimir</button>
          </header>

          <div class="legal-content">
            <section>
              <h2>1. Aceitação dos Termos</h2>
              <p><strong>1.1.</strong> Estes Termos de Uso ("Termos") regulamentam a utilização da plataforma digital LarCare ("Plataforma"), de titularidade da LarCare Tecnologia Ltda., CNPJ [a definir], com sede em Ribeirão Preto-SP.</p>
              <p><strong>1.2.</strong> Ao criar conta, acessar ou utilizar qualquer funcionalidade da Plataforma, você ("Usuário") declara ter lido, compreendido e aceito integralmente estes Termos, bem como a Política de Privacidade.</p>
              <p><strong>1.3.</strong> Caso não concorde com qualquer disposição, encerre imediatamente o uso da Plataforma.</p>
            </section>

            <section>
              <h2>2. Definições</h2>
              <p><strong>Plataforma:</strong> aplicativo, site e demais serviços digitais oferecidos pela LarCare para conexão entre Clientes e Prestadores.</p>
              <p><strong>Usuário:</strong> pessoa física maior de 18 anos cadastrada na Plataforma, seja como Cliente ou Prestador.</p>
              <p><strong>Cliente:</strong> Usuário que utiliza a Plataforma para solicitar serviços domésticos.</p>
              <p><strong>Prestador:</strong> Usuário autônomo que oferece serviços por meio da Plataforma.</p>
              <p><strong>Demanda:</strong> solicitação de serviço criada pelo Cliente.</p>
              <p><strong>Proposta:</strong> oferta enviada por Prestador em resposta a uma Demanda.</p>
              <p><strong>Serviço:</strong> trabalho de reparo, manutenção, limpeza ou cuidado contratado entre Cliente e Prestador.</p>
            </section>

            <section>
              <h2>3. Cadastro e Conta</h2>
              <p><strong>3.1.</strong> O cadastro é gratuito e exige idade mínima de 18 anos, fornecimento de informações verdadeiras, completas e atualizadas.</p>
              <p><strong>3.2.</strong> Prestadores devem fornecer documentação adicional (RG/CNH, comprovante de residência, certidão de antecedentes criminais) para verificação.</p>
              <p><strong>3.3.</strong> O Usuário é único responsável pela segurança da sua conta. Compartilhamento de credenciais é vedado.</p>
              <p><strong>3.4.</strong> A LarCare reserva-se o direito de recusar cadastros, exigir comprovação adicional ou suspender contas em caso de suspeita de fraude ou descumprimento destes Termos.</p>
            </section>

            <section>
              <h2>4. Uso da Plataforma</h2>
              <p><strong>4.1.</strong> O Usuário compromete-se a utilizar a Plataforma exclusivamente para finalidades lícitas relacionadas à intermediação de serviços domésticos.</p>
              <p><strong>4.2.</strong> É vedado: (i) publicar conteúdo ofensivo, discriminatório, fraudulento ou ilegal; (ii) tentar burlar mecanismos de verificação ou segurança; (iii) usar a Plataforma para finalidade comercial diversa da prevista; (iv) coletar dados de outros Usuários sem autorização.</p>
              <p><strong>4.3.</strong> Violações destes Termos podem resultar em suspensão temporária ou definitiva da conta, sem prejuízo de medidas legais cabíveis.</p>
            </section>

            <section>
              <h2>5. Papel do LarCare</h2>
              <p><strong>5.1.</strong> O LarCare atua exclusivamente como <strong>intermediário tecnológico</strong> entre Clientes e Prestadores. Não somos empregadores dos Prestadores, não fornecemos serviços domésticos diretamente, e não respondemos solidariamente pela qualidade ou execução dos serviços contratados, salvo nos estritos limites da legislação aplicável.</p>
              <p><strong>5.2.</strong> A Plataforma oferece ferramentas (verificação de identidade, sistema de avaliação cruzada, canal de mediação) para aumentar a confiança e qualidade das interações, sem garantir resultados específicos.</p>
            </section>

            <section>
              <h2>6. Relação entre Cliente e Prestador</h2>
              <p><strong>6.1.</strong> A relação entre Cliente e Prestador é direta, autônoma e independente, regida pelo Código Civil e pelo Código de Defesa do Consumidor quando aplicável.</p>
              <p><strong>6.2.</strong> Não há vínculo trabalhista, societário ou de subordinação entre os Usuários e o LarCare.</p>
              <p><strong>6.3.</strong> Pagamentos, garantias, prazos e demais termos do serviço são negociados diretamente entre as partes, sob sua exclusiva responsabilidade.</p>
            </section>

            <section>
              <h2>7. Avaliações e Conteúdo do Usuário</h2>
              <p><strong>7.1.</strong> Avaliações devem refletir a experiência real, em linguagem respeitosa e sem dados pessoais de terceiros.</p>
              <p><strong>7.2.</strong> O Usuário concede ao LarCare licença não-exclusiva, gratuita, para exibir avaliações e conteúdo dentro da Plataforma.</p>
              <p><strong>7.3.</strong> Reservamo-nos o direito de moderar (ocultar ou remover) avaliações que violem estes Termos, sem prejuízo de notificação ao Usuário responsável.</p>
            </section>

            <section>
              <h2>8. Pagamento e Comissão</h2>
              <p><strong>8.1.</strong> Na fase atual, o uso da Plataforma é gratuito tanto para Clientes quanto para Prestadores.</p>
              <p><strong>8.2.</strong> Pagamentos pelos serviços ocorrem diretamente entre Cliente e Prestador, fora da Plataforma. O LarCare não intermedia financeiramente as transações nesta fase.</p>
              <p><strong>8.3.</strong> No futuro, poderá ser implementada comissão sobre transações concluídas. Você será notificado com pelo menos 60 dias de antecedência.</p>
            </section>

            <section>
              <h2>9. Suspensão e Encerramento</h2>
              <p><strong>9.1.</strong> O Usuário pode encerrar sua conta a qualquer momento, em Perfil &gt; Configurações &gt; "Excluir minha conta".</p>
              <p><strong>9.2.</strong> O LarCare pode suspender ou encerrar contas em caso de: (a) violação destes Termos; (b) fraude ou tentativa de fraude; (c) condutas que coloquem em risco outros Usuários; (d) decisão judicial.</p>
              <p><strong>9.3.</strong> O encerramento não exime o Usuário de obrigações pendentes (avaliações, contestações em andamento, obrigações legais).</p>
            </section>

            <section>
              <h2>10. Propriedade Intelectual</h2>
              <p><strong>10.1.</strong> Todos os direitos sobre a Plataforma, incluindo marca, logotipo, software, design e conteúdo editorial, pertencem ao LarCare ou seus licenciantes.</p>
              <p><strong>10.2.</strong> O acesso à Plataforma não confere ao Usuário qualquer direito de cópia, modificação, distribuição ou exploração comercial, salvo autorização expressa e por escrito.</p>
            </section>

            <section>
              <h2>11. Limitação de Responsabilidade</h2>
              <p><strong>11.1.</strong> O LarCare não se responsabiliza por: (a) qualidade, prazo ou execução de serviços contratados entre Usuários; (b) danos decorrentes de uso indevido da Plataforma; (c) interrupções programadas ou eventuais de funcionamento; (d) condutas dolosas de Usuários, ainda que verificados.</p>
              <p><strong>11.2.</strong> Em qualquer hipótese, a responsabilidade total do LarCare está limitada ao valor pago pelo Usuário à Plataforma nos últimos 12 meses (ou zero, na fase atual gratuita).</p>
            </section>

            <section>
              <h2>12. Modificações dos Termos</h2>
              <p>Estes Termos podem ser atualizados periodicamente. Mudanças substanciais serão notificadas com antecedência mínima de 30 dias. O uso continuado da Plataforma após mudanças significa aceitação dos novos Termos.</p>
            </section>

            <section>
              <h2>13. Lei Aplicável e Foro</h2>
              <p>Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de Ribeirão Preto, Estado de São Paulo, para dirimir quaisquer controvérsias, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
            </section>

            <section>
              <h2>14. Disposições Gerais</h2>
              <p><strong>14.1.</strong> A invalidade de qualquer cláusula não afeta as demais.</p>
              <p><strong>14.2.</strong> A tolerância eventual a violações não significa renúncia a direitos.</p>
              <p><strong>14.3.</strong> Estes Termos constituem o acordo integral entre as partes sobre o uso da Plataforma.</p>
            </section>

            <section>
              <h2>15. Contato</h2>
              <p>Para dúvidas sobre estes Termos, envie e-mail para <a href="mailto:juridico@larcare.com.br">juridico@larcare.com.br</a> ou acesse <a href="#/contato">a página de Contato</a>.</p>
            </section>

            <p class="legal-footer">© 2026 LarCare Tecnologia Ltda. Todos os direitos reservados.</p>
          </div>
        </div>
      </section>
    `;
  }
  function faq(params) {
    const FAQ_DATA = {
      cliente: {
        label: 'Pra clientes',
        items: [
          ['Como peço um serviço no LarCare?', 'Você descreve o que precisa em 3 minutos (categoria, foto opcional, prazo). Prestadores verificados da sua região recebem o pedido e mandam proposta com valor, prazo e mensagem. Você compara, escolhe, e o contato é liberado.'],
          ['Quanto custa pra eu usar?', 'Nada. Sem mensalidade, sem taxa por pedido, sem cobrança por aceitar proposta. A LarCare cobra 5% do prestador sobre cada serviço — ele já considera isso na proposta.'],
          ['Como sei que o prestador é confiável?', 'Todo prestador passa por verificação de identidade (RG/CNH), antecedente criminal e endereço antes de aparecer no app. Quem completa o processo recebe o selo "Verificado". Cada serviço gera avaliação pública.'],
          ['Em quanto tempo recebo a primeira proposta?', 'Nossa meta é responder em até 30 minutos em horário comercial. Estamos cadastrando os primeiros prestadores em Ribeirão Preto — o tempo real de resposta vai aparecer quando tivermos volume.'],
          ['Posso não estar em casa quando o prestador chegar?', 'Pode. Combine no chat do app: quem abre a porta, onde fica a chave, como acompanhar pelo WhatsApp. Vários prestadores aceitam fotos antes/depois pra você acompanhar de longe.'],
          ['Como faço se eu trabalho fora o dia todo?', 'Você pode marcar serviço pra horário noturno ou fim de semana. Filtra prestadores por disponibilidade. Combina pagamento pelo Pix antes do serviço. Recibo fica no chat.'],
          ['E se o serviço não ficar bom?', 'Você pode reportar pelo app. Nossa equipe entra em contato em até 48h. Pra urgências, canal direto pelo WhatsApp do suporte. Avaliação negativa afeta o ranking do prestador.'],
          ['Posso cancelar um pedido depois de criado?', 'Pode, sem custo, enquanto estiver aguardando propostas ou comparando. Depois de aceitar, cancele só em casos excepcionais — combine direto com o prestador.'],
          ['Posso pedir orçamento sem compromisso?', 'Pode. Receber propostas não te obriga a contratar. Você só se compromete quando aceita uma proposta — e mesmo assim, pode renegociar antes do serviço começar.'],
          ['Como acompanho o serviço se não estou em casa?', 'Pelo chat do app. Peça pro prestador mandar foto do antes e do depois. Pagamento pelo Pix dentro do app deixa registro. Notificações em tempo real do status (chegou, começou, terminou).'],
          ['Posso pedir o mesmo prestador de novo?', 'Pode. No histórico, toque em "Contratar de novo" — leva direto pra criar novo pedido com aquele prestador como prioridade.'],
          ['Tem garantia se o serviço não ficar bom?', 'A maioria dos prestadores oferece 30 dias de garantia em serviços técnicos (elétrica, hidráulica, eletrônica). Combine isso no chat antes de fechar. Se houver problema na garantia, registre conosco pelo app.']
        ]
      },
      prestador: {
        label: 'Pra prestadores',
        items: [
          ['Quanto eu pago pra estar no LarCare?', 'Sem mensalidade. Sem custo de cadastro. Você só paga 5% sobre o valor de cada serviço que aceitar e concluir. Sem cobrança escondida, sem assinatura.'],
          ['Como recebo os pedidos?', 'Pedidos compatíveis com suas categorias e dentro do seu raio aparecem no feed do app. Filtra por urgência, distância, faixa de orçamento. Notificação no celular quando aparecer pedido novo.'],
          ['Posso recusar um pedido?', 'Pode. Você só envia proposta no que faz sentido pra você. Sem penalidade por não responder. Mas responder rápido melhora seu ranking.'],
          ['E se o cliente não pagar?', 'O pagamento acontece pelo app (Pix ou cartão) ou direto entre vocês. Sempre combine antes. Em caso de calote, registre conosco — clientes com histórico de calote são banidos.'],
          ['Como funciona a verificação?', 'Você envia foto de RG ou CNH, comprovante de residência e antecedente criminal (gratuito pela Polícia Civil). Conferimos em até 24h e seu perfil ganha o selo "Verificado".'],
          ['Como aumento minha visibilidade?', 'Completando 100% do perfil (bio + foto + verificação), respondendo pedidos em menos de 30 minutos, mantendo nota acima de 4.5, e tendo alta taxa de aceite.'],
          ['Posso atender só algumas regiões?', 'Sim. Você define seu bairro de partida e o raio máximo (1 a 30 km). Pedidos fora do raio não aparecem pra você.'],
          ['Quantas categorias posso cadastrar?', 'Até 5 no cadastro. Mas escolha as que você faz bem, não tudo. Cliente percebe quem é especialista.'],
          ['Posso emitir nota fiscal pelo app?', 'Se você é MEI, pode emitir NF tradicional. O app gera comprovante de pagamento da plataforma, que serve pra você juntar com sua NF.'],
          ['Como saio da plataforma?', 'Em Perfil > Configurações > "Excluir minha conta". Seus dados pessoais são apagados em até 30 dias. Avaliações públicas anonimizadas permanecem.'],
          ['Quando eu recebo o pagamento?', 'Pagamento via Pix pelo app cai na sua conta em até 1 hora útil. Cartão demora 1 dia útil. Pix direto entre vocês cai na hora.']
        ]
      },
      pagamento: {
        label: 'Pagamento',
        items: [
          ['Como o cliente paga o prestador?', 'Pix pelo app (mais comum), cartão pelo app, ou direto com o prestador no fim do serviço. Você escolhe a forma na hora de aceitar a proposta.'],
          ['O LarCare cobra alguma comissão?', 'Sim, 5% sobre cada serviço resolvido, pago pelo prestador. Cliente não paga nada pra usar o app. O prestador já considera essa comissão na proposta.'],
          ['Posso pagar com cartão pelo app?', 'Pode. Cartão de crédito (parcelado em até 3x sem juros). Cartão de débito ou Pix são à vista. Combine a forma no chat antes de fechar.'],
          ['Quando o prestador recebe?', 'Pix pelo app: até 1 hora útil. Cartão: 1 dia útil. Pix direto entre vocês: na hora.'],
          ['Tem nota fiscal?', 'Prestadores MEI podem emitir NF. Combine isso antes de fechar se você precisa de NF pra reembolso ou imposto. Não-MEI emite recibo simples no chat.'],
          ['Tem garantia?', 'Varia por prestador. Maioria oferece 30 dias de garantia em serviços técnicos. Combine no chat antes de fechar. Em caso de problema, registre conosco.'],
          ['Posso negociar o preço com o prestador?', 'Pode. Depois de aceitar a proposta, vocês podem renegociar pelo chat. Sem interferência do app. Só lembre que mudança de valor depois do serviço começou é desaconselhada.'],
          ['Por que vocês cobram 5% e não mais?', 'Porque queremos que prestador e cliente fiquem na plataforma. Comissão alta empurra prestador pro fora do app no segundo serviço. 5% é sustentável e justo.']
        ]
      },
      seguranca: {
        label: 'Segurança',
        items: [
          ['Meus dados estão seguros?', 'Sim. Operamos em conformidade com a LGPD (Lei nº 13.709/2018). Seus dados são criptografados em trânsito e em repouso. Acesso restrito por papel na equipe interna.'],
          ['Vocês vendem meus dados?', 'Não. Nunca vendemos dados pessoais identificados. Insights agregados anonimizados podem ser compartilhados com parceiros (construtoras, seguradoras) — sempre opcional pra você, sempre com consentimento explícito.'],
          ['O prestador vai saber meu endereço completo?', 'Só depois de você aceitar a proposta dele. Antes disso, ele vê apenas seu bairro e a distância aproximada. Endereço completo só é liberado no momento da contratação.'],
          ['E se eu não me sentir seguro?', 'Você pode cancelar a contratação a qualquer momento antes do serviço começar. Se houver risco (ameaça, fraude, comportamento inadequado), use o botão "Reportar" no perfil do prestador — analisamos em 24h.'],
          ['Vocês fazem verificação de antecedentes?', 'Sim. Pra prestadores: identidade (foto de documento), antecedente criminal (consulta gratuita Polícia Civil), endereço (comprovante recente). Reverificamos a cada 6 meses.'],
          ['O que faço se for vítima de fraude?', 'Acione nosso suporte imediatamente pelo WhatsApp. Reúna evidências (prints, comprovante de pagamento, fotos). Auxiliamos com BO online e bloqueamos o prestador na plataforma.'],
          ['Como denuncio um prestador?', 'No perfil dele, toque em "Reportar". Descreva o que aconteceu, anexe evidências. Investigamos em até 48h. Denúncias graves levam a suspensão imediata.'],
          ['Posso pedir pra ver o documento do prestador antes do serviço?', 'O selo "Verificado" significa que a equipe LarCare já conferiu o documento. Você não precisa ver o original. Mas pode pedir pra confirmar nome no chat antes de abrir a porta.']
        ]
      },
      ribeirao: {
        label: 'Ribeirão Preto',
        items: [
          ['Vocês atendem só Ribeirão Preto?', 'Hoje, sim. Estamos operando exclusivamente em Ribeirão Preto pra testar o produto com profundidade antes de escalar.'],
          ['Quando vai pra outras cidades?', 'A próxima cidade no plano é Araraquara, ainda em 2026. Depois: outras capitais de estado e cidades médias com perfil parecido. Sem data fixa — primeiro queremos estar redondos aqui.'],
          ['Atende quais bairros?', 'Centro, Jardim Botânico, Iguatemi, Ribeirânia, Castelo, Sumarezinho, Vila Tibério, Jardim Califórnia, Alto da Boa Vista, Nova Aliança, Ipiranga, Jardim Paulista — e crescendo conforme cadastramos mais prestadores.'],
          ['Meu bairro não tá na lista. Não atendem?', 'Pode ser que ainda não tenha prestador no raio. Cadastra mesmo assim — quando entrar prestador na sua região, você é avisada.'],
          ['Por que começaram por Ribeirão Preto?', 'Porque o fundador é daqui. Conhece a cidade, tem rede local, sabe onde estão os prestadores bons. Cidade média (700k habitantes) é tamanho ideal pra testar produto antes de escalar.'],
          ['Posso indicar prestador de outra cidade?', 'Por enquanto só validamos prestadores que atendem Ribeirão Preto. Quando expandirmos pra cidade dele, abre a opção dele se cadastrar.']
        ]
      },
      app: {
        label: 'Sobre o app',
        items: [
          ['Preciso instalar pela Play Store ou App Store?', 'Não. O LarCare é um PWA — funciona direto no navegador, mas você pode "instalar" como um app no celular (atalho na tela inicial). Vá em Perfil > Aplicativo > Instalar.'],
          ['Funciona offline?', 'Sim, parcialmente. Você abre o app sem internet (depois da 1ª visita) e vê pedidos e propostas em cache. Pra novos pedidos e mensagens, precisa de conexão.'],
          ['Vai ter app na Play Store / App Store?', 'No futuro, sim. Por enquanto o PWA cobre as funcionalidades principais. Vantagem: não ocupa espaço, não tem aprovação demorada, atualiza instantaneamente.'],
          ['Como o LarCare ganha dinheiro?', 'Comissão de 5% por serviço resolvido, paga pelo prestador. No longo prazo: parcerias com construtoras, seguradoras e varejistas, sempre opcionais pro usuário.'],
          ['Quem está por trás do LarCare?', 'Renato Cesar Rodrigues, fundador e mantenedor, baseado em Ribeirão Preto. O projeto começou em 2025 e está em validação ativa com prestadores e clientes da praça.']
        ]
      }
    };

    const activeTab = (params && params.tab) || 'cliente';
    const searchQ = (params && params.q) || '';
    const tab = FAQ_DATA[activeTab] || FAQ_DATA.cliente;
    const lowerQ = searchQ.toLowerCase();
    const filtered = searchQ ? tab.items.filter(([q, a]) =>
      q.toLowerCase().includes(lowerQ) || a.toLowerCase().includes(lowerQ)
    ) : tab.items;

    return `
      <section class="page">
        <div class="container container--narrow">
          <span class="eyebrow">Perguntas frequentes</span>
          <h1 class="mt-3">Casa em dia, sem dor de cabeça.</h1>
          <p class="lead mt-3">Tudo o que você precisa saber sobre o LarCare em Ribeirão Preto.</p>

          <div class="faq-search mt-6">
            <span class="faq-search__icon" aria-hidden="true">${UI.icon('search', 16)}</span>
            <input type="search" class="faq-search__input" id="faq-search-input" placeholder="Buscar (ex: pagamento, garantia, Ribeirão Preto)" value="${escapeAttr(searchQ)}" autocomplete="off" />
          </div>

          <div class="faq-tabs mt-5" role="tablist">
            ${Object.entries(FAQ_DATA).map(([key, t]) => `
              <a class="faq-tab ${key === activeTab ? 'is-active' : ''}" href="#/faq?tab=${key}${searchQ ? '&q=' + encodeURIComponent(searchQ) : ''}" role="tab" aria-selected="${key === activeTab}">${t.label}</a>
            `).join('')}
          </div>

          <div class="stack mt-5" id="faq-list">
            ${filtered.length === 0 ? `
              <div class="search-empty t-center" style="padding: 32px 16px;">
                <div class="search-empty__art" aria-hidden="true">🤔</div>
                <h3 class="mt-3">Nada encontrado pra "${escapeHtml(searchQ)}"</h3>
                <p class="t-dim mt-2">Tente outra palavra ou navegue por categoria.</p>
              </div>
            ` : filtered.map(([q, a]) => `
              <details class="faq-item">
                <summary>${escapeHtml(q)}</summary>
                <p class="t-dim mt-2">${escapeHtml(a)}</p>
              </details>
            `).join('')}
          </div>

          <div class="card card--soft mt-7">
            <h3>Não achou o que procurava?</h3>
            <p class="t-dim mt-2">Nosso suporte humano responde em até um dia útil.</p>
            <a class="btn btn--primary mt-3" href="#/contato">Falar com suporte</a>
          </div>
        </div>
      </section>
    `;
  }
  function contact() {
    return institutionalPage('Contato e suporte', 'Como falar com a gente', `
      <p>Atendimento humano, em horário comercial, com retorno em até um dia útil. Casos com risco têm prioridade.</p>
      <div class="grid grid-2 mt-5">
        <div class="card">
          <h3>${UI.icon('whatsapp', 22, 'style="color: var(--success);"')} WhatsApp</h3>
          <p class="t-dim mt-2">Suporte rápido para dúvidas e impasses.</p>
          <a class="btn btn--primary btn--sm mt-3" href="https://wa.me/5511900000000" target="_blank">Abrir conversa</a>
        </div>
        <div class="card">
          <h3>${UI.icon('chat', 22, 'style="color: var(--primary);"')} E-mail</h3>
          <p class="t-dim mt-2">Para questões mais complexas ou denúncias.</p>
          <a class="btn btn--outline btn--sm mt-3" href="mailto:contato@larcare.app">contato@larcare.app</a>
        </div>
      </div>
      <div class="card card--soft mt-5">
        <h3>Denúncia</h3>
        <p class="t-dim mt-2">Comportamento inadequado de prestador, fraude ou suspeita de prática indevida — escreva para <a href="mailto:denuncia@larcare.app">denuncia@larcare.app</a>. Trataremos com sigilo absoluto.</p>
      </div>
    `);
  }

  function institutionalPage(eyebrow, title, body) {
    return `
      <section class="page">
        <div class="container container--narrow">
          <span class="eyebrow">${eyebrow}</span>
          <h1 class="mt-3">${title}</h1>
          <div class="t-dim mt-5" style="line-height:1.7; font-size:16px;">${body}</div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // Export
  // ====================================================================
  // Expor as duas landings novas
  global.LarCareViews = global.LarCareViews || {};
  global.LarCareViews.forProviders = forProviders;
  global.LarCareViews.forClients = forClients;

  Object.assign(global.LarCareViews, {
    providerSignup, providerStatus, providerDashboard,
    demandDetail, myProposals, proposalAccepted, providerReview, providerProfile,
    privacy, terms, faq, contact
  });
})(window);
