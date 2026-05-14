/* =========================================================================
   LarCare — onboarding de prestador (wizard 8 passos)
   =========================================================================
   Rota: #/onboarding-prestador?step=N
   Persistência: localStorage:larcare:onboarding_provider
   Ao finalizar: push de prestador novo em LarCareData.PROVIDERS com flag
   criado_via_onboarding=true e redirect para dashboard.
   ========================================================================= */
(function (global) {
  'use strict';

  const STORE = 'larcare:onboarding_provider';
  const TOTAL = 8;

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch (_) { return {}; }
  }
  function saveState(patch) {
    const cur = loadState();
    const next = Object.assign({}, cur, patch);
    try { localStorage.setItem(STORE, JSON.stringify(next)); } catch (_) {}
    return next;
  }
  function clearState() { try { localStorage.removeItem(STORE); } catch (_) {} }

  function progressBar(step) {
    const pct = Math.round((step / TOTAL) * 100);
    return `
      <div class="ob-progress">
        <div class="ob-progress__bar" style="width:${pct}%;"></div>
      </div>
      <div class="row row--between mt-2 mb-5">
        <span class="t-dim fs-13">Passo ${step} de ${TOTAL}</span>
        <a href="#/" class="t-dim fs-13" data-action="ob-leave">Sair e continuar depois</a>
      </div>
    `;
  }

  function onboardingProvider(params) {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const step = Math.max(1, Math.min(TOTAL, parseInt((params && params.step) || '1', 10)));
    const state = loadState();
    const next = (n) => `#/onboarding-prestador?step=${n}`;
    const prev = step > 1 ? `<a class="btn btn--ghost" href="${next(step - 1)}">Voltar</a>` : '<span></span>';

    let body = '';
    if (step === 1) {
      body = `
        <div class="t-center" style="padding: 16px 0;">
          <div class="ob-hero">${UI.brandMark(72)}</div>
          <h1 class="mt-4">Vamos te cadastrar em 5 minutos</h1>
          <p class="lead mt-3" style="max-width: 480px; margin: 0 auto;">
            Para receber demandas e fechar serviços, a gente precisa de algumas informações simples.
          </p>
          <ul class="ob-checklist mt-6">
            <li>${UI.icon('check', 14, 'style="color:var(--success);"')} Uma foto sua</li>
            <li>${UI.icon('check', 14, 'style="color:var(--success);"')} O que você faz e há quanto tempo</li>
            <li>${UI.icon('check', 14, 'style="color:var(--success);"')} Onde você atende em Ribeirão Preto</li>
            <li>${UI.icon('check', 14, 'style="color:var(--success);"')} Sua faixa de preço por serviço</li>
          </ul>
        </div>
        <div class="row mt-7" style="justify-content:flex-end;">
          <a class="btn btn--primary btn--lg" href="${next(2)}">Começar</a>
        </div>
      `;
    } else if (step === 2) {
      body = `
        <h1>Seus dados</h1>
        <p class="lead mt-2">Identificação básica. Só você vê estes dados.</p>
        <form class="stack mt-6" data-ob-step="2" data-ob-next="${next(3)}">
          ${UI.field({ label: 'Nome completo', name: 'nome', value: state.nome || '', required: true, autocomplete: 'name' })}
          ${UI.field({ label: 'CPF', name: 'cpf', value: state.cpf || '', placeholder: '000.000.000-00', required: true })}
          ${UI.field({ label: 'Data de nascimento', name: 'nascimento', type: 'date', value: state.nascimento || '', required: true })}
          ${UI.field({ label: 'WhatsApp', name: 'whatsapp', value: state.whatsapp || '', placeholder: '(16) 9 0000-0000', required: true, autocomplete: 'tel' })}
          ${UI.field({ label: 'E-mail (opcional)', name: 'email', type: 'email', value: state.email || '', autocomplete: 'email' })}
          <div class="row" style="justify-content:space-between;">${prev}<button class="btn btn--primary" type="submit">Continuar</button></div>
        </form>
      `;
    } else if (step === 3) {
      const photo = state.photo;
      body = `
        <h1>Sua foto</h1>
        <p class="lead mt-2">Uma foto sua sorrindo, fundo claro, sem boné. Aumenta sua taxa de aceite.</p>
        <form class="stack mt-6" data-ob-step="3" data-ob-next="${next(4)}">
          <div class="ob-photo">
            ${photo
              ? `<div class="ob-photo__preview"><img src="${photo}" alt="Sua foto" /></div>`
              : `<div class="ob-photo__placeholder">${UI.icon('camera', 36)}<span>Toque para selecionar</span></div>`}
            <label class="btn btn--outline mt-3" for="ob-photo-input">
              ${UI.icon('camera', 14)} ${photo ? 'Trocar foto' : 'Tirar foto / Galeria'}
            </label>
            <input id="ob-photo-input" type="file" accept="image/*" capture="user" hidden data-ob-photo />
          </div>
          <div class="row" style="justify-content:space-between;">${prev}<button class="btn btn--primary" type="submit" ${photo ? '' : 'disabled'}>Continuar</button></div>
        </form>
      `;
    } else if (step === 4) {
      const sel = state.categorias || [];
      body = `
        <h1>O que você faz?</h1>
        <p class="lead mt-2">Escolha até 5 categorias. Você pode mudar depois.</p>
        <form class="stack mt-6" data-ob-step="4" data-ob-next="${next(5)}">
          <div class="ob-cats">
            ${D.GROUPS.map((g) => {
              const cats = D.categoriesByGroup(g.id);
              return `
                <div class="ob-cats__group">
                  <div class="ob-cats__group-title">${g.emoji} ${g.name}</div>
                  <div class="ob-cats__grid">
                    ${cats.map((c) => {
                      const isSel = sel.indexOf(c.id) !== -1;
                      return `
                        <button type="button" class="ob-cat-tile ${isSel ? 'is-active' : ''}" data-ob-cat="${c.id}">
                          <span class="ob-cat-tile__emoji">${c.emoji || ''}</span>
                          <span>${c.name}</span>
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div class="t-dim fs-13 t-center mt-3" id="ob-cats-counter">${sel.length}/5 categorias selecionadas</div>
          <div class="row" style="justify-content:space-between;">${prev}<button class="btn btn--primary" type="submit" ${sel.length ? '' : 'disabled'}>Continuar</button></div>
        </form>
      `;
    } else if (step === 5) {
      body = `
        <h1>Onde você atende?</h1>
        <p class="lead mt-2">Defina sua região e o raio que está disposto a se deslocar.</p>
        <form class="stack mt-6" data-ob-step="5" data-ob-next="${next(6)}">
          ${UI.field({ label: 'Bairro de partida', name: 'bairro', value: state.bairro || '', placeholder: 'Ex: Centro, Vila Tibério', required: true })}
          <div class="card">
            <label class="row row--between">
              <strong>Raio de atendimento</strong>
              <strong id="ob-radius-out" style="color:var(--primary);">${state.raio_km || 8} km</strong>
            </label>
            <input type="range" min="1" max="30" value="${state.raio_km || 8}" id="ob-radius" class="slider mt-3" />
            <div class="row row--between mt-2 t-dim fs-13"><span>1 km</span><span>30 km</span></div>
          </div>
          <div class="card card--soft">
            <strong>Bairros aproximados cobertos</strong>
            <p class="t-dim mt-2 fs-14" id="ob-bairros-list">Centro, Jardim Botânico, Iguatemi, Ribeirânia, Vila Tibério (lista varia com o raio)</p>
          </div>
          <div class="row" style="justify-content:space-between;">${prev}<button class="btn btn--primary" type="submit">Continuar</button></div>
        </form>
      `;
    } else if (step === 6) {
      const cats = state.categorias || [];
      const precos = state.precos || {};
      body = `
        <h1>Sua faixa de preço</h1>
        <p class="lead mt-2">Esses valores ajudam o cliente a ter referência. Você sempre faz proposta específica por demanda.</p>
        <form class="stack mt-6" data-ob-step="6" data-ob-next="${next(7)}">
          ${cats.map((catId) => {
            const c = D.findCategory(catId);
            if (!c) return '';
            const p = precos[catId] || { min: 80, med: 150 };
            return `
              <div class="card">
                <div class="row" style="gap:8px; align-items:center;">
                  <span class="ob-cat-tile__emoji">${c.emoji}</span>
                  <strong>${c.name}</strong>
                </div>
                <div class="row mt-3" style="gap:10px;">
                  <label class="ob-price-input">
                    <span class="t-dim fs-13">Mínimo (R$)</span>
                    <input type="number" min="20" max="2000" value="${p.min}" data-ob-price-min="${catId}" />
                  </label>
                  <label class="ob-price-input">
                    <span class="t-dim fs-13">Médio (R$)</span>
                    <input type="number" min="20" max="3000" value="${p.med}" data-ob-price-med="${catId}" />
                  </label>
                </div>
              </div>
            `;
          }).join('')}
          <div class="row" style="justify-content:space-between;">${prev}<button class="btn btn--primary" type="submit">Continuar</button></div>
        </form>
      `;
    } else if (step === 7) {
      const v = state.verificacao || {};
      body = `
        <h1>Verificação</h1>
        <p class="lead mt-2">Verificação dá selo de <strong>Prestador Verificado</strong>, que aumenta sua visibilidade no app.</p>
        <form class="stack mt-6" data-ob-step="7" data-ob-next="${next(8)}">
          <div class="card">
            <div class="row" style="gap: 12px;">
              <span class="cat-tile__icon" style="background: var(--primary-tint); color: var(--primary);">${UI.icon('shield_check', 22)}</span>
              <div style="flex:1;">
                <strong>RG ou CNH</strong>
                <div class="t-dim fs-14">Foto frente e verso</div>
              </div>
              <label class="btn btn--outline btn--sm" for="ob-doc-input">
                ${v.docNome ? '✓ ' + v.docNome : 'Anexar'}
              </label>
              <input id="ob-doc-input" type="file" accept="image/*,application/pdf" hidden data-ob-doc="rg" />
            </div>
          </div>
          <div class="card">
            <div class="row" style="gap: 12px;">
              <span class="cat-tile__icon" style="background: var(--primary-tint); color: var(--primary);">${UI.icon('shield_check', 22)}</span>
              <div style="flex:1;">
                <strong>Comprovante de residência</strong>
                <div class="t-dim fs-14">Conta de água, luz ou correspondência</div>
              </div>
              <label class="btn btn--outline btn--sm" for="ob-doc2-input">
                ${v.compNome ? '✓ ' + v.compNome : 'Anexar'}
              </label>
              <input id="ob-doc2-input" type="file" accept="image/*,application/pdf" hidden data-ob-doc="comprovante" />
            </div>
          </div>
          <div class="row" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="${next(8)}">Pular por enquanto</a>
            <button class="btn btn--primary" type="submit">Continuar</button>
          </div>
        </form>
      `;
    } else if (step === 8) {
      const cats = (state.categorias || []).map((id) => D.findCategory(id)).filter(Boolean);
      body = `
        <h1>Quase lá!</h1>
        <p class="lead mt-2">Última etapa: escreva uma bio curta e revise seu perfil.</p>
        <form class="stack mt-6" data-ob-step="8" data-ob-next="finish">
          ${UI.field({
            label: 'Sua bio (até 200 caracteres)',
            name: 'bio',
            type: 'textarea',
            value: state.bio || '',
            placeholder: 'Conte em poucas palavras sua experiência e o que te diferencia.',
            required: true
          })}
          <div class="card card--soft">
            <h3>Revisão do seu perfil</h3>
            <ul class="ob-review">
              <li><strong>Nome:</strong> ${state.nome || '—'}</li>
              <li><strong>WhatsApp:</strong> ${state.whatsapp || '—'}</li>
              <li><strong>Bairro:</strong> ${state.bairro || '—'} · ${state.raio_km || 8} km de raio</li>
              <li><strong>Categorias:</strong> ${cats.map((c) => c.emoji + ' ' + c.name).join(', ') || '—'}</li>
              <li><strong>Verificação:</strong> ${(state.verificacao && state.verificacao.docNome) ? '✓ Documentos anexados' : 'Pendente'}</li>
            </ul>
          </div>
          <label class="row" style="gap: 10px; align-items: flex-start;">
            <input type="checkbox" name="aceite" required ${state.aceite ? 'checked' : ''} />
            <span class="t-dim fs-14">Aceito os <a href="#/termos">Termos de Uso</a> e a <a href="#/privacidade">Política de Privacidade</a> do LarCare.</span>
          </label>
          <div class="row" style="justify-content:space-between;">${prev}<button class="btn btn--primary btn--lg" type="submit">Finalizar cadastro</button></div>
        </form>
      `;
    }

    return `
      <section class="page">
        <div class="container container--narrow">
          ${progressBar(step)}
          ${body}
        </div>
      </section>
    `;
  }

  function bindOnboarding(root) {
    const D = global.LarCareData;
    const state = loadState();

    // Sair (limpa nada — só navega)
    root.querySelectorAll('[data-action="ob-leave"]').forEach((a) => {
      a.addEventListener('click', () => { /* link já navega */ });
    });

    // STEP 2: form básico
    root.querySelectorAll('[data-ob-step="2"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        saveState({
          nome: fd.get('nome'), cpf: fd.get('cpf'),
          nascimento: fd.get('nascimento'), whatsapp: fd.get('whatsapp'),
          email: fd.get('email') || ''
        });
        window.location.hash = form.dataset.obNext;
      });
    });

    // STEP 3: foto (FileReader)
    const photoInput = root.querySelector('[data-ob-photo]');
    if (photoInput) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          saveState({ photo: reader.result });
          if (global.LarCareApp && global.LarCareApp.rerender) global.LarCareApp.rerender();
        };
        reader.readAsDataURL(file);
      });
    }
    root.querySelectorAll('[data-ob-step="3"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!loadState().photo) return;
        window.location.hash = form.dataset.obNext;
      });
    });

    // STEP 4: categorias multi-select
    root.querySelectorAll('[data-ob-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.obCat;
        const cur = loadState().categorias || [];
        const idx = cur.indexOf(id);
        if (idx === -1) {
          if (cur.length >= 5) {
            if (global.LarCareUI) global.LarCareUI.toast('Máximo 5 categorias');
            return;
          }
          cur.push(id);
        } else {
          cur.splice(idx, 1);
        }
        saveState({ categorias: cur });
        btn.classList.toggle('is-active');
        const counter = root.querySelector('#ob-cats-counter');
        if (counter) counter.textContent = `${cur.length}/5 categorias selecionadas`;
        const submit = root.querySelector('[data-ob-step="4"] button[type="submit"]');
        if (submit) submit.disabled = !cur.length;
      });
    });
    root.querySelectorAll('[data-ob-step="4"]').forEach((form) => {
      form.addEventListener('submit', (e) => { e.preventDefault(); window.location.hash = form.dataset.obNext; });
    });

    // STEP 5: bairro + raio
    const radius = root.querySelector('#ob-radius');
    const radiusOut = root.querySelector('#ob-radius-out');
    if (radius) {
      radius.addEventListener('input', () => {
        const v = parseInt(radius.value, 10);
        if (radiusOut) radiusOut.textContent = v + ' km';
        saveState({ raio_km: v });
      });
    }
    root.querySelectorAll('[data-ob-step="5"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        saveState({ bairro: fd.get('bairro'), raio_km: parseInt(radius?.value || '8', 10) });
        window.location.hash = form.dataset.obNext;
      });
    });

    // STEP 6: preços
    root.querySelectorAll('[data-ob-step="6"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const precos = {};
        form.querySelectorAll('[data-ob-price-min]').forEach((inp) => {
          const id = inp.dataset.obPriceMin;
          precos[id] = precos[id] || {};
          precos[id].min = parseInt(inp.value, 10);
        });
        form.querySelectorAll('[data-ob-price-med]').forEach((inp) => {
          const id = inp.dataset.obPriceMed;
          precos[id] = precos[id] || {};
          precos[id].med = parseInt(inp.value, 10);
        });
        saveState({ precos });
        window.location.hash = form.dataset.obNext;
      });
    });

    // STEP 7: docs
    root.querySelectorAll('[data-ob-doc]').forEach((inp) => {
      inp.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const v = loadState().verificacao || {};
        if (inp.dataset.obDoc === 'rg') v.docNome = file.name;
        if (inp.dataset.obDoc === 'comprovante') v.compNome = file.name;
        saveState({ verificacao: v });
        if (global.LarCareUI) global.LarCareUI.toast('Documento anexado');
      });
    });
    root.querySelectorAll('[data-ob-step="7"]').forEach((form) => {
      form.addEventListener('submit', (e) => { e.preventDefault(); window.location.hash = form.dataset.obNext; });
    });

    // STEP 8: finalizar
    root.querySelectorAll('[data-ob-step="8"]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        if (!fd.get('aceite')) {
          if (global.LarCareUI) global.LarCareUI.toast('Aceite os termos para finalizar');
          return;
        }
        saveState({ bio: fd.get('bio'), aceite: true });
        const finalState = loadState();
        // Push prestador novo no mock
        try {
          const id = 'pro-' + String(Date.now()).slice(-6);
          const first = (finalState.nome || 'Novo').split(' ')[0];
          const initials = (finalState.nome || 'NN').split(' ').filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase();
          const specs = (finalState.categorias || []).map((cat) => ({ cat, years: 1 }));
          const newPro = {
            id, first_name: first + ' ' + (finalState.nome || '').split(' ').slice(1, 2).map((s) => s[0] + '.').join(''),
            full_name: finalState.nome || 'Sem nome', initials,
            age: 35, avatar_color: 'primary',
            neighborhood: finalState.bairro || 'Centro', city: 'Ribeirão Preto',
            radius_km: finalState.raio_km || 8,
            rating_avg: 0, rating_count: 0,
            response_minutes: 30, acceptance_rate: 0,
            brings_material: 'depende', has_vehicle: true,
            verified: { identity: !!(finalState.verificacao && finalState.verificacao.docNome), background: false, address: !!(finalState.verificacao && finalState.verificacao.compNome), last_check: new Date().toISOString().substring(0,10) },
            specialties: specs, bio: finalState.bio || '',
            reviews: [],
            availability: { mon:[1,1,0],tue:[1,1,0],wed:[1,1,0],thu:[1,1,0],fri:[1,1,0],sat:[1,0,0],sun:[0,0,0] },
            criado_via_onboarding: true,
            photo: finalState.photo
          };
          D.PROVIDERS.push(newPro);
        } catch (_) { /* não bloqueia o fluxo */ }
        // Celebra + redireciona
        if (global.LarCareUI) global.LarCareUI.toast('Bem-vindo ao LarCare!', 'success');
        if (global.LarCareAudio) global.LarCareAudio.reviewSubmitted();
        clearState();
        window.location.hash = '#/dashboard-prestador';
      });
    });
  }

  global.LarCareOnboarding = { onboardingProvider, bindOnboarding, loadState, clearState };
  global.LarCareViews = global.LarCareViews || {};
  global.LarCareViews.onboardingProvider = onboardingProvider;
})(window);
