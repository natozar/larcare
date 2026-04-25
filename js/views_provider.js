/* =========================================================================
   LarCare — provider & institutional views
   ========================================================================= */
(function (global) {
  'use strict';
  const UI = global.LarCareUI;
  const D  = global.LarCareData;
  const V  = global.LarCareViews;
  const { formatDate, escapeHtml } = V._helpers;

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
    const dist = ({
      'Pinheiros': 1.6, 'Vila Mariana': 8.1, 'Tatuapé': 14.2, 'Santana': 11.7,
      'Butantã': 5.8, 'Lapa': 4.1, 'Aclimação': 9.3, 'Ipiranga': 10.5, 'Vila Madalena': 0.4
    })[d.neighborhood] || 7.0;
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
                <textarea class="textarea mt-2" name="comment" placeholder="Conte rapidamente como foi o atendimento"></textarea>
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
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEWS 23-26 — Institucional
  // ====================================================================
  function privacy() {
    return institutionalPage('Privacidade & LGPD', 'Como tratamos seus dados', `
      <p>O LarCare opera em conformidade com a Lei nº 13.709/2018 (LGPD). Tratamos seus dados pessoais com finalidade específica e sob princípios de minimização, transparência e segurança.</p>
      <h3>Dados que coletamos</h3>
      <p>Dados de identificação (nome, CPF, e-mail, telefone), endereço para emparelhamento por proximidade, e dados de uso da plataforma. Para prestadores, também documentos para verificação de identidade e antecedente.</p>
      <h3>Para que usamos</h3>
      <p>Conectar clientes a prestadores qualificados, comunicar sobre serviços contratados, manter segurança da plataforma e cumprir obrigações legais. Para análises agregadas, sempre anonimizamos.</p>
      <h3>O que nunca fazemos</h3>
      <p>Não vendemos dados pessoais identificados. Não compartilhamos com terceiros sem base legal ou seu consentimento explícito. Não usamos seus dados para finalidades não declaradas.</p>
      <h3>Seus direitos</h3>
      <p>Você pode pedir acesso, correção, exclusão e portabilidade dos seus dados a qualquer momento. Basta escrever para <a href="mailto:privacidade@larcare.app">privacidade@larcare.app</a>.</p>
    `);
  }
  function terms() {
    return institutionalPage('Termos de uso', 'Regras claras para os dois lados', `
      <p>Estes Termos regem o uso da plataforma LarCare. Ao criar conta, você confirma que leu e aceita as condições abaixo.</p>
      <h3>Natureza do serviço</h3>
      <p>O LarCare é plataforma de conexão entre clientes e prestadores autônomos. Não somos empregadores dos prestadores, não fornecemos serviços diretamente e não respondemos solidariamente pela qualidade da execução, salvo nos limites previstos em legislação aplicável.</p>
      <h3>Compromissos do cliente</h3>
      <p>Descrever a demanda com honestidade, respeitar prestadores cadastrados, cumprir o pagamento combinado e avaliar com critério após o serviço.</p>
      <h3>Compromissos do prestador</h3>
      <p>Manter documentação atualizada, cumprir o valor e prazo propostos, atender com postura profissional e responder com clareza nas comunicações com o cliente.</p>
      <h3>Suspensão e desligamento</h3>
      <p>Reservamo-nos o direito de suspender ou desligar contas que violem estes Termos, com ou sem aviso prévio, conforme gravidade. Documentos falsos resultam em desligamento imediato.</p>
    `);
  }
  function faq() {
    const items = [
      ['O LarCare cobra pelo serviço?', 'Não cobramos do cliente para usar a plataforma. Para o prestador, a comissão é pequena e cobrada apenas em propostas aceitas. O pagamento do serviço acontece direto entre cliente e prestador.'],
      ['Em quanto tempo recebo a primeira proposta?', 'A média atual é de 2 horas em horário comercial. Em demandas urgentes, costuma ser bem mais rápido.'],
      ['Como sei que o prestador é confiável?', 'Todo prestador passa por verificação de identidade, antecedente criminal e endereço antes de receber qualquer demanda. As avaliações de outros clientes ficam visíveis no perfil.'],
      ['E se eu tiver um problema com o serviço?', 'Nosso suporte humano resolve casos com risco em até 48 horas. Acesse o canal de Contato.'],
      ['Sou prestador. Quanto tempo até ser aprovado?', 'Em geral, entre 24 e 72 horas após o envio dos documentos. Casos complexos podem levar mais.'],
      ['Posso cancelar uma proposta aceita?', 'Sim, com aviso prévio. Cancelamentos repetidos afetam sua reputação.']
    ];
    return institutionalPage('Perguntas frequentes', 'Respostas diretas para o que mais perguntam', `
      <div class="stack-lg">
        ${items.map(([q, a]) => `<details class="card"><summary style="cursor:pointer; font-weight:600; font-family: var(--font-serif); font-size: 18px;">${q}</summary><p class="t-dim mt-3" style="line-height:1.65;">${a}</p></details>`).join('')}
      </div>
    `);
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
  Object.assign(global.LarCareViews, {
    providerSignup, providerStatus, providerDashboard,
    demandDetail, myProposals, proposalAccepted, providerReview, providerProfile,
    privacy, terms, faq, contact
  });
})(window);
