/* =========================================================================
   LarCare — sistema de pagamento mock
   =========================================================================
   Rotas:
     #/pagamento?proposta=X     — checkout PIX/Cartão
     #/recibo?pagamento=X       — comprovante printável
     #/financeiro-prestador     — saldo + saque + histórico
   Persistência: localStorage:larcare:payments, larcare:provider_balance
   ========================================================================= */
(function (global) {
  'use strict';

  const STORE_PAYMENTS = 'larcare:payments';
  const STORE_BALANCE = 'larcare:provider_balance';
  const COMMISSION_RATE = 0.05; // 5%

  function readPayments() {
    try { return JSON.parse(localStorage.getItem(STORE_PAYMENTS) || '[]'); } catch (_) { return []; }
  }
  function savePayment(p) {
    const all = readPayments();
    all.unshift(p);
    try { localStorage.setItem(STORE_PAYMENTS, JSON.stringify(all)); } catch (_) {}
  }
  function findPayment(id) { return readPayments().find((p) => p.id === id); }

  function readBalance(prestadorId) {
    try {
      const all = JSON.parse(localStorage.getItem(STORE_BALANCE) || '{}');
      return all[prestadorId] || { available: 0, pending: 0, history: [] };
    } catch (_) { return { available: 0, pending: 0, history: [] }; }
  }
  function saveBalance(prestadorId, balance) {
    try {
      const all = JSON.parse(localStorage.getItem(STORE_BALANCE) || '{}');
      all[prestadorId] = balance;
      localStorage.setItem(STORE_BALANCE, JSON.stringify(all));
    } catch (_) {}
  }

  // ----- Algoritmo Luhn (validação de cartão) -----
  function luhnCheck(num) {
    const digits = (num || '').replace(/\D/g, '');
    if (digits.length < 13) return false;
    let sum = 0, alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  function detectBrand(num) {
    const d = (num || '').replace(/\D/g, '');
    if (/^4/.test(d)) return 'Visa';
    if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'Mastercard';
    if (/^3[47]/.test(d)) return 'Amex';
    if (/^(636368|438935|504175|451416|509048|627780)/.test(d)) return 'Elo';
    if (/^(606282|3841)/.test(d)) return 'Hipercard';
    return null;
  }

  // ----- Geração de "QR Code" mock visual (não EMV real) -----
  function renderMockQR(pixCode) {
    // Padrão visual de QR — 25x25 grid pseudo-aleatório baseado em hash do código
    const size = 25;
    let seed = 0;
    for (let i = 0; i < pixCode.length; i++) seed = (seed * 31 + pixCode.charCodeAt(i)) % 0x7fffffff;
    function rand() { seed = (seed * 1103515245 + 12345) % 0x7fffffff; return seed / 0x7fffffff; }
    const cells = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Cantos de finder pattern (estilo QR real)
        const inFinder =
          (x < 7 && y < 7) ||
          (x >= size - 7 && y < 7) ||
          (x < 7 && y >= size - 7);
        const finderFill = inFinder && (
          (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) ||
          (x === size - 1 || x === size - 7 || (x >= size - 5 && x <= size - 3 && y >= 2 && y <= 4))
        );
        const fill = inFinder ? (
          (x === 0 || x === 6 || y === 0 || y === 6 ||
           x === size - 1 || x === size - 7 ||
           (x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
           (x >= size - 5 && x <= size - 3 && y >= 2 && y <= 4) ||
           (x >= 2 && x <= 4 && y >= size - 5 && y <= size - 3))
        ) : rand() > 0.5;
        if (fill) cells.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="#1A2E27"/>`);
      }
    }
    return `
      <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" width="240" height="240" role="img" aria-label="QR Code PIX">
        <rect width="${size}" height="${size}" fill="#fff"/>
        ${cells.join('')}
      </svg>
    `;
  }

  // ========================================================================
  // VIEW: #/pagamento?proposta=XXX
  // ========================================================================
  function pagamento(params) {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const propId = params.proposta || 'prop-001-a';
    const prop = D.PROPOSALS.find((p) => p.id === propId);
    if (!prop) return notFoundView();
    const pro = D.findProvider(prop.provider_id);
    const dem = D.findDemand(prop.demand_id);
    const cat = D.findCategory(dem ? dem.cat : 'eletrica');
    const valor = prop.value || 100;
    const taxa = Math.round(valor * COMMISSION_RATE);
    const total = valor + taxa;
    const params_q = parseQuery();
    const tab = params_q.metodo || 'pix';

    return `
      <section class="page payment-page">
        <div class="container container--narrow">
          <a class="btn btn--ghost btn--sm" href="#/cliente" data-action="back">${UI.icon('arrow_left', 14)} Voltar</a>

          <h1 class="mt-4">Pagamento</h1>
          <p class="lead mt-2">Pague o serviço diretamente pelo app.</p>

          <!-- Resumo -->
          <div class="payment-summary mt-5">
            <div class="row" style="gap: 12px; align-items: center;">
              <span class="cat-tile__icon" style="width:44px; height:44px; background: var(--primary-tint); color: var(--primary);">${UI.icon(cat ? cat.icon : 'wrench', 22)}</span>
              <div style="flex:1;">
                <div style="font-weight:600;">${dem ? dem.title : 'Serviço'}</div>
                <div class="t-dim fs-13">${pro ? pro.first_name : ''} · ${dem ? dem.neighborhood : ''}</div>
              </div>
            </div>
            <div class="payment-breakdown mt-4">
              <div class="row row--between"><span>Valor do serviço</span><strong>R$ ${valor}</strong></div>
              <div class="row row--between mt-2"><span class="t-dim">Taxa LarCare (5%)</span><span class="t-dim">R$ ${taxa}</span></div>
              <div class="payment-breakdown__divider"></div>
              <div class="row row--between"><strong style="font-size: 18px;">Total</strong><strong style="font-size: 22px; color: var(--primary);">R$ ${total}</strong></div>
            </div>
          </div>

          <!-- Tabs de método -->
          <div class="payment-method-tabs mt-5">
            <a class="payment-method-tab ${tab === 'pix' ? 'is-active' : ''}" href="#/pagamento?proposta=${propId}&metodo=pix">
              <span aria-hidden="true">⚡</span> PIX
            </a>
            <a class="payment-method-tab ${tab === 'cartao' ? 'is-active' : ''}" href="#/pagamento?proposta=${propId}&metodo=cartao">
              <span aria-hidden="true">💳</span> Cartão
            </a>
            <button class="payment-method-tab" type="button" data-action="boleto-soon">
              <span aria-hidden="true">📄</span> Boleto
            </button>
          </div>

          ${tab === 'pix' ? renderPixFlow(total, propId) : renderCardFlow(total, propId)}

          <p class="t-faint fs-12 t-center mt-6">Transação criptografada. LarCare em conformidade com Bacen + LGPD.</p>
        </div>
      </section>
    `;
  }

  function renderPixFlow(total, propId) {
    const pixCode = `00020126360014BR.GOV.BCB.PIX0114${propId}5204000053039865802BR5912LARCARE LTDA6010RIBEIRAO PR62${('07' + propId.length.toString(16).padStart(2, '0') + propId)}6304ABCD`;
    return `
      <div class="payment-pix mt-4" data-flow="pix" data-prop-id="${propId}" data-total="${total}">
        <div class="payment-pix__qr">${renderMockQR(pixCode)}</div>
        <p class="t-center fs-14 mt-3">Escaneie o QR Code com o app do seu banco</p>

        <div class="payment-pix__divider"><span>ou</span></div>

        <label class="field">
          <span class="field__label">Copie o código PIX</span>
          <div class="payment-pix__copy">
            <input type="text" class="input" value="${pixCode.substring(0, 80)}..." readonly id="pix-code" />
            <button class="btn btn--primary btn--sm" type="button" data-action="copy-pix" data-code="${pixCode}">Copiar</button>
          </div>
        </label>

        <div class="payment-pix__waiting mt-5" id="pix-waiting">
          <div class="payment-pix__spinner" aria-hidden="true"></div>
          <p class="t-dim t-center mt-3">Aguardando confirmação do pagamento...</p>
          <p class="t-faint fs-13 t-center mt-1">Após o pagamento, esta tela atualiza automaticamente.</p>
          <button class="btn btn--outline btn--sm mt-4" type="button" data-action="simulate-pix-paid" style="display:block; margin: 16px auto 0;">
            Simular pagamento confirmado
          </button>
        </div>
      </div>
    `;
  }

  function renderCardFlow(total, propId) {
    return `
      <form class="payment-card mt-4" data-flow="card" data-prop-id="${propId}" data-total="${total}">
        <label class="field">
          <span class="field__label">Número do cartão</span>
          <input type="text" class="input" id="card-num" placeholder="0000 0000 0000 0000" maxlength="19" inputmode="numeric" autocomplete="cc-number" />
          <span class="field__hint" id="card-brand-hint">Aceitamos Visa, Mastercard, Elo, Amex, Hipercard</span>
        </label>
        <div class="grid grid-2 mt-3">
          <label class="field">
            <span class="field__label">Validade</span>
            <input type="text" class="input" id="card-exp" placeholder="MM/AA" maxlength="5" inputmode="numeric" autocomplete="cc-exp" />
          </label>
          <label class="field">
            <span class="field__label">CVV</span>
            <input type="text" class="input" id="card-cvv" placeholder="000" maxlength="4" inputmode="numeric" autocomplete="cc-csc" />
          </label>
        </div>
        <label class="field mt-3">
          <span class="field__label">Nome impresso no cartão</span>
          <input type="text" class="input" id="card-name" placeholder="Como aparece no cartão" autocomplete="cc-name" />
        </label>
        <button class="btn btn--primary btn--lg mt-5" type="submit" id="card-submit" style="width:100%;">
          Pagar R$ ${total}
        </button>
        <p class="t-faint fs-12 mt-3 t-center">Seus dados de cartão não são armazenados.</p>
      </form>
    `;
  }

  // ========================================================================
  // VIEW: #/recibo?pagamento=XXX
  // ========================================================================
  function recibo(params) {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const id = params.pagamento || '';
    const pay = findPayment(id);
    if (!pay) return notFoundView();
    const prop = D.PROPOSALS.find((p) => p.id === pay.proposta_id);
    const pro = prop ? D.findProvider(prop.provider_id) : null;
    const dem = prop ? D.findDemand(prop.demand_id) : null;

    return `
      <section class="page receipt-page">
        <div class="container container--narrow">
          <div class="receipt-actions print-hide">
            <a class="btn btn--ghost btn--sm" href="#/cliente">${UI.icon('arrow_left', 14)} Voltar</a>
            <div class="row" style="gap: 8px;">
              <button class="btn btn--outline btn--sm" type="button" data-action="print-receipt">Imprimir</button>
              <button class="btn btn--outline btn--sm" type="button" data-action="share-receipt" data-id="${id}">Compartilhar</button>
            </div>
          </div>

          <div class="receipt-card">
            <div class="receipt-card__header">
              ${UI.brandMark(36)}
              <div>
                <div class="receipt-card__brand">LarCare</div>
                <div class="receipt-card__sub">Comprovante de pagamento</div>
              </div>
            </div>

            <div class="receipt-card__status">✓ Aprovado</div>

            <dl class="receipt-card__list">
              <div><dt>ID da transação</dt><dd>${pay.id}</dd></div>
              <div><dt>Data</dt><dd>${new Date(pay.data).toLocaleString('pt-BR')}</dd></div>
              <div><dt>Cliente</dt><dd>${D.DEMO_CLIENT.first_name}</dd></div>
              <div><dt>Prestador</dt><dd>${pro ? pro.full_name : '—'}</dd></div>
              <div><dt>Serviço</dt><dd>${dem ? dem.title : '—'}</dd></div>
              <div><dt>Categoria</dt><dd>${dem ? (D.findCategory(dem.cat)?.name || '—') : '—'}</dd></div>
              <div><dt>Forma de pagamento</dt><dd>${pay.metodo === 'pix' ? 'PIX' : 'Cartão de crédito'}</dd></div>
            </dl>

            <div class="receipt-card__breakdown">
              <div class="row row--between"><span>Valor do serviço</span><span>R$ ${pay.valor}</span></div>
              <div class="row row--between mt-2"><span class="t-dim">Taxa LarCare (5%)</span><span class="t-dim">R$ ${pay.comissao}</span></div>
              <div class="receipt-card__divider"></div>
              <div class="row row--between"><strong>Total pago</strong><strong style="font-size:20px;">R$ ${pay.total}</strong></div>
            </div>

            <p class="receipt-card__footer">
              LarCare Tecnologia Ltda. · CNPJ a definir<br/>
              Ribeirão Preto · SP<br/>
              <a href="mailto:contato@larcare.com.br">contato@larcare.com.br</a>
            </p>
          </div>
        </div>
      </section>
    `;
  }

  function notFoundView() {
    return `
      <section class="page">
        <div class="container container--narrow t-center mt-7">
          <h1>Pagamento não encontrado</h1>
          <p class="t-dim mt-3">Volte e tente novamente.</p>
          <a class="btn btn--primary mt-5" href="#/cliente">Voltar</a>
        </div>
      </section>
    `;
  }

  // ========================================================================
  // VIEW: #/financeiro-prestador
  // ========================================================================
  function financeiroPrestador() {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const proId = 'pro-001';
    const balance = readBalance(proId);
    const allPays = readPayments().filter((p) => p.prestador_id === proId);
    return `
      <section class="page page--app">
        <div class="container container--narrow">
          <a class="btn btn--ghost btn--sm" href="#/dashboard-prestador">${UI.icon('arrow_left', 14)} Voltar ao dashboard</a>
          <h1 class="mt-4">Financeiro</h1>

          <div class="grid grid-2 mt-5">
            <div class="card card--feature" style="padding: var(--space-5);">
              <span class="eyebrow" style="background: rgba(255,255,255,0.18); color: #fff;">Saldo disponível</span>
              <div style="font-family: var(--font-serif); font-size: 36px; color: #fff; margin-top: 6px;">R$ ${balance.available || 0}</div>
              <button class="btn btn--accent btn--sm mt-3" type="button" data-action="withdraw" ${balance.available <= 0 ? 'disabled' : ''}>Sacar via PIX</button>
            </div>
            <div class="card">
              <span class="t-dim fs-13">A receber</span>
              <div style="font-family: var(--font-serif); font-size: 26px; color: var(--accent); margin-top: 4px;">R$ ${balance.pending || 0}</div>
              <span class="t-faint fs-12">Liberado em 2 dias úteis</span>
            </div>
          </div>

          <div class="card mt-5">
            <h3>Histórico de recebimentos</h3>
            ${allPays.length === 0 ? `
              <p class="t-dim mt-3 t-center">Nenhum recebimento ainda.</p>
            ` : `
              <div class="stack mt-3">
                ${allPays.map((pay) => {
                  const prop = D.PROPOSALS.find((p) => p.id === pay.proposta_id);
                  const dem = prop ? D.findDemand(prop.demand_id) : null;
                  return `
                    <a class="dash-history-item" href="#/recibo?pagamento=${pay.id}">
                      <div style="flex:1; min-width:0;">
                        <div style="font-weight:500;">${dem ? dem.title : 'Serviço'}</div>
                        <div class="t-dim fs-13 mt-1">${new Date(pay.data).toLocaleDateString('pt-BR')} · ${pay.metodo === 'pix' ? 'PIX' : 'Cartão'}</div>
                      </div>
                      <strong style="color: var(--success);">+ R$ ${pay.valor - pay.comissao}</strong>
                    </a>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <div class="card mt-5">
            <h3>Saques</h3>
            ${(balance.history || []).length === 0 ? `
              <p class="t-dim mt-3 t-center">Nenhum saque feito ainda.</p>
            ` : `
              <div class="stack mt-3">
                ${(balance.history || []).map((s) => `
                  <div class="row row--between" style="padding: 10px 0; border-bottom: 1px solid var(--border);">
                    <div>
                      <strong>R$ ${s.amount}</strong>
                      <div class="t-dim fs-13">${new Date(s.t).toLocaleDateString('pt-BR')}</div>
                    </div>
                    <span class="status status--done" style="font-size:11px;">Processado</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </section>
    `;
  }

  // ========================================================================
  // VIEW: #/dashboard-cliente
  // ========================================================================
  function dashboardCliente() {
    const UI = global.LarCareUI;
    const D = global.LarCareData;
    const c = D.DEMO_CLIENT;
    const allPays = readPayments();
    const totalSpent = allPays.reduce((s, p) => s + p.total, 0);
    const totalServices = allPays.length;
    return `
      <section class="page page--app">
        <div class="container container--narrow">
          <span class="eyebrow">Meu painel</span>
          <h1 class="mt-2">Olá, ${c.first_name}</h1>

          <div class="grid grid-3 mt-5">
            <div class="card">
              <span class="t-dim fs-13">Serviços contratados</span>
              <div style="font-family: var(--font-serif); font-size: 28px; color: var(--primary); margin-top:4px;">${totalServices}</div>
            </div>
            <div class="card">
              <span class="t-dim fs-13">Total investido</span>
              <div style="font-family: var(--font-serif); font-size: 28px; color: var(--accent); margin-top:4px;">R$ ${totalSpent}</div>
            </div>
            <div class="card">
              <span class="t-dim fs-13">Avaliação média</span>
              <div style="font-family: var(--font-serif); font-size: 28px; color: var(--accent); margin-top:4px;">4.8</div>
            </div>
          </div>

          <div class="card mt-5">
            <h3>Histórico de serviços</h3>
            ${allPays.length === 0 ? `
              <p class="t-dim mt-3 t-center">Nenhum serviço contratado ainda. Crie sua primeira demanda no botão "Solicitar".</p>
            ` : `
              <div class="stack mt-3">
                ${allPays.map((pay) => {
                  const prop = D.PROPOSALS.find((p) => p.id === pay.proposta_id);
                  const dem = prop ? D.findDemand(prop.demand_id) : null;
                  const pro = prop ? D.findProvider(prop.provider_id) : null;
                  return `
                    <a class="dash-history-item" href="#/recibo?pagamento=${pay.id}">
                      <span class="avatar avatar--sm ${pro && pro.avatar_color === 'accent' ? 'avatar--accent' : ''}">${pro ? pro.initials : '??'}</span>
                      <div style="flex:1; min-width:0;">
                        <div style="font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${dem ? dem.title : 'Serviço'}</div>
                        <div class="t-dim fs-13 mt-1">${pro ? pro.first_name : ''} · ${new Date(pay.data).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <strong>R$ ${pay.total}</strong>
                    </a>
                  `;
                }).join('')}
              </div>
            `}
          </div>
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

  // ========================================================================
  // Bindings
  // ========================================================================
  function bindPayment(root) {
    // Copiar PIX
    root.querySelectorAll('[data-action="copy-pix"]').forEach((b) => {
      b.addEventListener('click', () => {
        const code = b.dataset.code;
        if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
        if (global.LarCareUI) global.LarCareUI.toast('Código PIX copiado', 'success');
      });
    });

    // Simular PIX pago
    root.querySelectorAll('[data-action="simulate-pix-paid"]').forEach((b) => {
      b.addEventListener('click', () => {
        const flow = root.querySelector('[data-flow="pix"]');
        if (!flow) return;
        completePayment(flow.dataset.propId, 'pix', parseFloat(flow.dataset.total));
      });
    });

    // Submit cartão
    root.querySelectorAll('[data-flow="card"]').forEach((form) => {
      const numIn = form.querySelector('#card-num');
      const expIn = form.querySelector('#card-exp');
      const cvvIn = form.querySelector('#card-cvv');
      const nameIn = form.querySelector('#card-name');
      const hint = form.querySelector('#card-brand-hint');
      const submit = form.querySelector('#card-submit');

      function fmtNum() {
        const v = numIn.value.replace(/\D/g, '').slice(0, 16);
        numIn.value = v.replace(/(\d{4})/g, '$1 ').trim();
        const brand = detectBrand(v);
        hint.textContent = brand ? `Detectado: ${brand}` : 'Aceitamos Visa, Mastercard, Elo, Amex, Hipercard';
      }
      function fmtExp() {
        let v = expIn.value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
        expIn.value = v;
      }
      function fmtCvv() {
        cvvIn.value = cvvIn.value.replace(/\D/g, '').slice(0, 4);
      }
      numIn?.addEventListener('input', fmtNum);
      expIn?.addEventListener('input', fmtExp);
      cvvIn?.addEventListener('input', fmtCvv);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const digits = numIn.value.replace(/\D/g, '');
        if (!luhnCheck(digits)) {
          if (global.LarCareUI) global.LarCareUI.toast('Número de cartão inválido', 'danger');
          return;
        }
        if (!expIn.value.match(/^\d{2}\/\d{2}$/)) {
          if (global.LarCareUI) global.LarCareUI.toast('Validade inválida', 'danger');
          return;
        }
        if (cvvIn.value.length < 3) {
          if (global.LarCareUI) global.LarCareUI.toast('CVV inválido', 'danger');
          return;
        }
        if (!nameIn.value.trim()) {
          if (global.LarCareUI) global.LarCareUI.toast('Informe o nome no cartão', 'danger');
          return;
        }
        submit.disabled = true;
        submit.textContent = 'Processando...';
        setTimeout(() => completePayment(form.dataset.propId, 'cartao', parseFloat(form.dataset.total)), 2000);
      });
    });

    // Boleto soon
    root.querySelectorAll('[data-action="boleto-soon"]').forEach((b) => {
      b.addEventListener('click', () => {
        if (global.LarCareUI) global.LarCareUI.toast('Boleto em breve', 'info');
      });
    });

    // Imprimir recibo
    root.querySelectorAll('[data-action="print-receipt"]').forEach((b) => {
      b.addEventListener('click', () => window.print());
    });

    // Compartilhar recibo
    root.querySelectorAll('[data-action="share-receipt"]').forEach((b) => {
      b.addEventListener('click', async () => {
        const url = window.location.href;
        try {
          if (navigator.share) {
            await navigator.share({ title: 'Comprovante LarCare', url });
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(url);
            if (global.LarCareUI) global.LarCareUI.toast('Link copiado', 'success');
          }
        } catch (_) {}
      });
    });

    // Sacar (financeiro)
    root.querySelectorAll('[data-action="withdraw"]').forEach((b) => {
      b.addEventListener('click', () => {
        const proId = 'pro-001';
        const bal = readBalance(proId);
        if (bal.available <= 0) return;
        bal.history = bal.history || [];
        bal.history.unshift({ amount: bal.available, t: Date.now() });
        bal.available = 0;
        saveBalance(proId, bal);
        if (global.LarCareUI) global.LarCareUI.toast('Saque processado, recebe em 1h', 'success');
        if (global.LarCareApp && global.LarCareApp.rerender) global.LarCareApp.rerender();
      });
    });
  }

  function completePayment(propId, metodo, total) {
    const D = global.LarCareData;
    const prop = D.PROPOSALS.find((p) => p.id === propId);
    if (!prop) return;
    const valor = prop.value || 100;
    const comissao = Math.round(valor * COMMISSION_RATE);
    const pay = {
      id: 'pay-' + Date.now().toString(36),
      proposta_id: propId,
      cliente_id: D.DEMO_CLIENT.id,
      prestador_id: prop.provider_id,
      valor, comissao, total,
      metodo, status: 'aprovado',
      data: Date.now()
    };
    savePayment(pay);
    // Atualiza saldo do prestador
    const bal = readBalance(prop.provider_id);
    bal.available = (bal.available || 0) + (valor - comissao);
    saveBalance(prop.provider_id, bal);
    if (global.LarCareAudio) global.LarCareAudio.reviewSubmitted();
    if (global.LarCareUI) global.LarCareUI.toast('Pagamento confirmado!', 'success');
    // Dispara push event simulado
    document.dispatchEvent(new CustomEvent('larcare:payment-confirmed', { detail: pay }));
    setTimeout(() => { window.location.hash = '#/recibo?pagamento=' + pay.id; }, 1200);
  }

  global.LarCarePayment = {
    pagamento, recibo, financeiroPrestador, dashboardCliente,
    bindPayment, readPayments, readBalance, COMMISSION_RATE
  };
  global.LarCareViews = global.LarCareViews || {};
  global.LarCareViews.pagamento = pagamento;
  global.LarCareViews.recibo = recibo;
  global.LarCareViews.financeiroPrestador = financeiroPrestador;
  global.LarCareViews.dashboardCliente = dashboardCliente;
})(window);
