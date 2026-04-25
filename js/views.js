/* =========================================================================
   LarCare — views
   Cada view é uma função que recebe (params, ctx) e renderiza no #app
   via LarCareUI.mountApp. Não há build step: tudo é template literal.
   ========================================================================= */
(function (global) {
  'use strict';

  const UI = global.LarCareUI;
  const D  = global.LarCareData;

  // ------------------------------------------------------------------
  // Helpers locais
  // ------------------------------------------------------------------
  function nav(href) { window.location.hash = href; }

  function urgencyChip(level) {
    const map = {
      hoje:        { variant: 'warning', text: 'Hoje' },
      ate_3_dias:  { variant: 'accent',  text: 'Até 3 dias' },
      ate_7_dias:  { variant: '',        text: 'Até 7 dias' },
      sem_pressa:  { variant: 'success', text: 'Sem pressa' }
    };
    const c = map[level] || { variant: '', text: level };
    return `<span class="chip chip--${c.variant} chip--static">${c.text}</span>`;
  }

  function categoryChip(catId) {
    const cat = D.findCategory(catId);
    if (!cat) return '';
    return UI.chip(cat.name, { icon: cat.icon, static: true });
  }

  // ====================================================================
  // VIEW 1 — Landing pública
  // ====================================================================
  function landing() {
    const cats = D.CATEGORIES.slice(0, 8);
    const categoryGrid = cats.map((c) => `
      <a class="cat-tile" href="#/cadastro/cliente">
        <span class="cat-tile__icon">${UI.icon(c.icon, 22)}</span>
        <span class="cat-tile__name">${c.name}</span>
      </a>
    `).join('');

    const testimonials = [
      { name: 'Beatriz M.', city: 'Pinheiros, SP', text: 'Resolvi em uma manhã o que estava arrastando há semanas. O eletricista chegou no horário, levou o material certo e ainda revisou outros pontos da casa.', initials: 'BM' },
      { name: 'Patrícia D.', city: 'Vila Mariana, SP', text: 'Cheguei em casa com banheiro alagado. Em duas horas tinha um profissional verificado dentro de casa. Salvou meu fim de semana.', initials: 'PD' },
      { name: 'Cristina A.', city: 'Lapa, SP', text: 'Saí de uma reforma que parecia não terminar e a Marcia entregou casa pronta para morar. Cada azulejo, cada vidro.', initials: 'CA' }
    ];

    return `
      <section class="hero">
        <div class="container">
          <div class="hero__grid">
            <div>
              <span class="eyebrow">Cuidado verificado para seu lar</span>
              <h1 class="hero__title mt-4">Pequenos reparos,<br/>sem depender de <em>ninguém</em>.</h1>
              <p class="hero__subtitle">Encontre quem resolve o que precisa em casa. Prestadores verificados, propostas transparentes, contato direto. Sem caçar profissional em rede social, sem aceitar quem você não conhece.</p>
              <div class="hero__cta">
                <a class="btn btn--primary btn--lg" href="#/cadastro/cliente">Quero contratar um serviço</a>
                <a class="btn btn--outline btn--lg" href="#/cadastro/prestador">Quero oferecer meus serviços</a>
              </div>
              <div class="row mt-6" style="gap: 18px; color: var(--text-dim); font-size: 13px;">
                <span class="row" style="gap: 6px;">${UI.icon('shield_check', 16, 'style="color: var(--success);"')} Antecedente verificado</span>
                <span class="row" style="gap: 6px;">${UI.icon('check', 16, 'style="color: var(--success);"')} Sem cobrança extra na chegada</span>
                <span class="row" style="gap: 6px;">${UI.icon('check', 16, 'style="color: var(--success);"')} Avaliação cruzada</span>
              </div>
            </div>
            <div class="hero__media">
              ${UI.heroIllustration()}
              <div class="hero__floating hero__floating--top-right">
                <span class="avatar avatar--sm avatar--accent">RF</span>
                <div>
                  <div style="font-weight:600;">Roberto F.</div>
                  <div style="font-size:11px; color: var(--text-dim);">Encanador · 4.9 ★ · 4 km</div>
                </div>
              </div>
              <div class="hero__floating hero__floating--bottom-left">
                ${UI.icon('check', 18, 'style="color: var(--success);"')}
                <div style="font-weight:600;">Proposta aceita</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section--tight">
        <div class="container">
          <div class="metric-bar">
            <div class="metric"><div class="metric__value">+50</div><div class="metric__label">categorias de serviço cobertas</div></div>
            <div class="metric"><div class="metric__value">100%</div><div class="metric__label">prestadores com antecedente verificado</div></div>
            <div class="metric"><div class="metric__value">2 lados</div><div class="metric__label">avaliação cruzada após cada serviço</div></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="t-center" style="max-width:640px; margin: 0 auto var(--space-7);">
            <span class="eyebrow">Como funciona</span>
            <h2 class="mt-3">Resolva em três passos. Sem voltas.</h2>
            <p class="lead mt-3">Você não precisa entender de obra, conhecer prestador na rua ou explicar a mesma coisa cinco vezes.</p>
          </div>
          <div class="steps-card">
            <div class="steps-card__item"><span class="steps-card__num">1</span><h3>Você descreve o que precisa</h3><p class="t-dim mt-2">Categoria, descrição, fotos opcionais e prazo. Em três minutos.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">2</span><h3>Prestadores verificados respondem</h3><p class="t-dim mt-2">Você recebe propostas com valor, prazo e mensagem. Pode comparar.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">3</span><h3>Você escolhe e fala direto</h3><p class="t-dim mt-2">Liberamos o contato. Vocês combinam e o serviço acontece.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">4</span><h3>Avaliação cruzada</h3><p class="t-dim mt-2">Cliente avalia prestador, prestador avalia cliente. Reputação real.</p></div>
          </div>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          <div class="t-center mb-5">
            <span class="eyebrow">Categorias mais pedidas</span>
            <h2 class="mt-3">O que costumamos resolver</h2>
          </div>
          <div class="grid grid-4">${categoryGrid}</div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="t-center" style="max-width:640px; margin: 0 auto var(--space-7);">
            <span class="eyebrow">Por que confiar</span>
            <h2 class="mt-3">Três compromissos não negociáveis</h2>
          </div>
          <div class="grid grid-3">
            <div class="card">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary-tint); color: var(--primary); display: inline-flex; align-items: center; justify-content: center;">${UI.icon('shield_check', 22)}</div>
              <h3 class="mt-3">Verificação rigorosa</h3>
              <p class="t-dim mt-2">Identidade, antecedente criminal e endereço conferidos antes de cada prestador entrar na plataforma.</p>
            </div>
            <div class="card">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent-soft); color: #6f4f24; display: inline-flex; align-items: center; justify-content: center;">${UI.icon('star', 22)}</div>
              <h3 class="mt-3">Avaliação cruzada</h3>
              <p class="t-dim mt-2">Os dois lados avaliam após cada serviço. Reputação se acumula, não some entre apps.</p>
            </div>
            <div class="card">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--success-soft); color: var(--success); display: inline-flex; align-items: center; justify-content: center;">${UI.icon('chat', 22)}</div>
              <h3 class="mt-3">Suporte humano</h3>
              <p class="t-dim mt-2">Se algo der errado, atendimento real em até 48h. Sem chatbot infinito, sem ticket sem resposta.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          <div class="t-center mb-5">
            <span class="eyebrow">O que dizem</span>
            <h2 class="mt-3">Quem já usou</h2>
          </div>
          <div class="grid grid-3">
            ${testimonials.map((t) => `
              <article class="card">
                <div class="row" style="gap: 12px;">
                  <span class="avatar avatar--accent">${t.initials}</span>
                  <div>
                    <div style="font-weight:600;">${t.name}</div>
                    <div class="t-dim fs-13">${t.city}</div>
                  </div>
                </div>
                <div class="rating mt-3">${UI.ratingStars(5)}</div>
                <p class="mt-3" style="line-height:1.6;">"${t.text}"</p>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="card card--feature t-center">
            <h2 style="color:#fff;">Comece agora</h2>
            <p style="color:rgba(255,255,255,0.85); margin: 12px auto 24px; max-width: 520px;">Cadastre-se em três minutos. Sem cartão de crédito.</p>
            <div class="btn-group" style="justify-content:center;">
              <a class="btn btn--accent btn--lg" href="#/cadastro/cliente">Sou cliente</a>
              <a class="btn btn--outline btn--lg" href="#/cadastro/prestador" style="color:#fff; border-color: rgba(255,255,255,0.6);">Sou prestador</a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 2 — Sobre
  // ====================================================================
  function about() {
    return `
      <section class="page">
        <div class="container container--narrow">
          <span class="eyebrow">Sobre o LarCare</span>
          <h1 class="mt-3">O lar como prioridade</h1>
          <p class="lead mt-4">O LarCare existe para um problema simples e nada simples de resolver: o que se faz quando algo precisa ser consertado em casa, e pedir favor não é mais opção?</p>
          <div class="stack-lg mt-7">
            <article>
              <h2>Por que existimos</h2>
              <p class="t-dim mt-3">Em mais de 35 milhões de domicílios brasileiros, o cuidado cotidiano da casa hoje recai sobre quem mora lá — frequentemente uma mulher, frequentemente sem alguém para chamar. O LarCare nasce da observação de que essa pessoa merece um caminho direto, sem favor, sem caçada na rede social, sem prestador que cobra a mais ao chegar.</p>
            </article>
            <article>
              <h2>Para quem trabalhamos</h2>
              <p class="t-dim mt-3">Trabalhamos para dois lados ao mesmo tempo: a pessoa que tem casa para cuidar, e o profissional autônomo que tem técnica para entregar. Acreditamos que conectar essas duas pontas com seriedade — verificação, transparência, avaliação cruzada — eleva a qualidade do serviço para todo mundo.</p>
            </article>
            <article>
              <h2>O que defendemos</h2>
              <p class="t-dim mt-3">Verificação rigorosa de quem entra na plataforma. Transparência total nas propostas. Respeito mútuo entre cliente e prestador. Proteção integral dos dados pessoais. Sem fórmulas mágicas, sem promessas além do que entregamos.</p>
            </article>
          </div>

          <div class="card card--soft mt-8">
            <h3>Compromisso com integridade</h3>
            <p class="mt-3 t-dim">Os dados que circulam aqui são tratados com critério. Nada é vendido em formato pessoal. Tudo é protegido segundo a LGPD. Saiba mais em <a href="#/seguranca">Segurança e dataset</a>.</p>
          </div>

          <div class="row mt-7" style="gap: 12px;">
            <a class="btn btn--primary" href="#/cadastro/cliente">Sou cliente</a>
            <a class="btn btn--outline" href="#/cadastro/prestador">Sou prestador</a>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 3 — Como funciona (cliente)
  // ====================================================================
  function howItWorksClient() {
    const examples = [
      'Troca de torneira que pinga', 'Lâmpada queimada (pé direito alto)',
      'Suporte de TV', 'Montagem de guarda-roupa',
      'Pintura de quarto pequeno', 'Conserto de fechadura',
      'Furar parede para prateleira', 'Vazamento na pia'
    ];
    return `
      <section class="page">
        <div class="container container--narrow">
          <span class="eyebrow">Para clientes</span>
          <h1 class="mt-3">Resolva o que precisa em quatro passos</h1>
          <p class="lead mt-3">Tudo direto do celular. Em três minutos, sua demanda está visível para prestadores verificados na sua região.</p>

          <div class="steps-card mt-7">
            <div class="steps-card__item">
              <span class="steps-card__num">1</span>
              <h3>Descreva sua necessidade</h3>
              <p class="t-dim mt-2">Categoria, descrição, fotos opcionais. Quanto mais detalhe, melhor a proposta.</p>
            </div>
            <div class="steps-card__item">
              <span class="steps-card__num">2</span>
              <h3>Receba propostas verificadas</h3>
              <p class="t-dim mt-2">Prestadores qualificados próximos enviam valor, prazo e mensagem específica.</p>
            </div>
            <div class="steps-card__item">
              <span class="steps-card__num">3</span>
              <h3>Compare e escolha</h3>
              <p class="t-dim mt-2">Veja perfil completo, avaliações de outros clientes, verificações.</p>
            </div>
            <div class="steps-card__item">
              <span class="steps-card__num">4</span>
              <h3>Combine direto com quem topou</h3>
              <p class="t-dim mt-2">Liberamos o contato (WhatsApp e telefone). Vocês combinam o resto.</p>
            </div>
          </div>

          <div class="card mt-8">
            <h3>O que é considerado um pequeno reparo</h3>
            <p class="t-dim mt-2 mb-3">Não fazemos obra, reforma ou construção. Fazemos o cotidiano:</p>
            <div class="row" style="gap: 8px;">
              ${examples.map((e) => UI.chip(e, { static: true })).join('')}
            </div>
          </div>

          <div class="card mt-5">
            <h3>O que esperar de um prestador LarCare</h3>
            <ul class="footer-list mt-3" style="color: var(--text-dim);">
              <li>${UI.icon('check', 16)} Identidade, antecedente e endereço verificados</li>
              <li>${UI.icon('check', 16)} Postura profissional e comunicação clara</li>
              <li>${UI.icon('check', 16)} Valor combinado antes — sem surpresa na chegada</li>
              <li>${UI.icon('check', 16)} Pontualidade ou aviso prévio</li>
            </ul>
          </div>

          <div class="t-center mt-8">
            <a class="btn btn--primary btn--lg" href="#/cadastro/cliente">Quero contratar agora</a>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 4 — Como funciona (prestador)
  // ====================================================================
  function howItWorksProvider() {
    return `
      <section class="page">
        <div class="container container--narrow">
          <span class="eyebrow">Para prestadores</span>
          <h1 class="mt-3">Tenha agenda recorrente sem precisar caçar serviço</h1>
          <p class="lead mt-3">Receba demandas qualificadas perto de você, escolha as que cabem na sua agenda e construa reputação que fica.</p>

          <div class="steps-card mt-7">
            <div class="steps-card__item"><span class="steps-card__num">1</span><h3>Cadastre-se com seus dados completos</h3><p class="t-dim mt-2">Identidade, especialidades, raio de atendimento, disponibilidade. Cerca de 8 minutos.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">2</span><h3>Aguarde aprovação</h3><p class="t-dim mt-2">Conferimos seus documentos e antecedente em 24-72 horas.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">3</span><h3>Visualize demandas e proponha</h3><p class="t-dim mt-2">Demandas próximas com descrição clara. Você envia valor, prazo e mensagem.</p></div>
            <div class="steps-card__item"><span class="steps-card__num">4</span><h3>Atenda com excelência</h3><p class="t-dim mt-2">Sua nota acumula. Bons prestadores aparecem mais. Reputação vira receita.</p></div>
          </div>

          <div class="grid grid-2 mt-8">
            <div class="card">
              <h3>Por que vale a pena</h3>
              <ul class="footer-list mt-3" style="color: var(--text-dim);">
                <li>${UI.icon('check', 16, 'style="color:var(--success);"')} Tráfego qualificado, sem caça-cliente</li>
                <li>${UI.icon('check', 16, 'style="color:var(--success);"')} Cliente que já decidiu contratar</li>
                <li>${UI.icon('check', 16, 'style="color:var(--success);"')} Reputação que acumula entre serviços</li>
                <li>${UI.icon('check', 16, 'style="color:var(--success);"')} Pagamento direto entre você e o cliente</li>
                <li>${UI.icon('check', 16, 'style="color:var(--success);"')} Suporte humano em caso de impasse</li>
              </ul>
            </div>
            <div class="card">
              <h3>O que pedimos de você</h3>
              <ul class="footer-list mt-3" style="color: var(--text-dim);">
                <li>${UI.icon('shield_check', 16, 'style="color:var(--primary);"')} Verificação completa de documentos</li>
                <li>${UI.icon('shield_check', 16, 'style="color:var(--primary);"')} Antecedente criminal sem pendência</li>
                <li>${UI.icon('shield_check', 16, 'style="color:var(--primary);"')} Postura profissional e linguagem respeitosa</li>
                <li>${UI.icon('shield_check', 16, 'style="color:var(--primary);"')} Pontualidade ou aviso antes do horário</li>
                <li>${UI.icon('shield_check', 16, 'style="color:var(--primary);"')} Cumprimento do valor combinado</li>
              </ul>
            </div>
          </div>

          <div class="t-center mt-8">
            <a class="btn btn--primary btn--lg" href="#/cadastro/prestador">Quero me cadastrar como prestador</a>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 5 — Segurança e dataset
  // ====================================================================
  function security() {
    return `
      <section class="page">
        <div class="container container--narrow">
          <span class="eyebrow">Segurança e LGPD</span>
          <h1 class="mt-3">Seus dados, sua segurança, nosso compromisso</h1>
          <p class="lead mt-3">Tratamos cada informação que entra aqui como ativo sensível. Aqui está o que fazemos com ela, e o que nunca faremos.</p>

          <div class="grid grid-2 mt-7">
            <div class="card">
              <h3>${UI.icon('lock', 22, 'style="color:var(--primary);"')} Proteção técnica</h3>
              <p class="t-dim mt-3">Criptografia em trânsito e em repouso. Acesso baseado em função. Logs auditáveis. Equipe dedicada à segurança da informação.</p>
            </div>
            <div class="card">
              <h3>${UI.icon('shield_check', 22, 'style="color:var(--primary);"')} Conformidade LGPD</h3>
              <p class="t-dim mt-3">Operamos integralmente sob a Lei nº 13.709/2018. Você pode pedir, ver, corrigir e excluir seus dados a qualquer momento.</p>
            </div>
          </div>

          <div class="card card--soft mt-6">
            <h3>O que fazemos com a informação</h3>
            <ul class="checklist mt-4">
              <li class="checklist__item"><span class="checklist__check">${UI.icon('check', 14)}</span><span><strong>Usamos para conectar</strong> — emparelhamos demanda e prestador na sua região, com base em categoria, distância e disponibilidade.</span></li>
              <li class="checklist__item"><span class="checklist__check">${UI.icon('check', 14)}</span><span><strong>Anonimizamos para insights agregados</strong> — quando estudamos padrões de uso, removemos qualquer informação que identifique uma pessoa.</span></li>
              <li class="checklist__item"><span class="checklist__check">${UI.icon('check', 14)}</span><span><strong>Mantemos segurança contínua</strong> — auditorias periódicas e equipe interna dedicada.</span></li>
              <li class="checklist__item" style="color: var(--danger);"><span class="checklist__check" style="background: var(--danger-soft); color: var(--danger);">${UI.icon('cross', 14)}</span><span style="color: var(--text);"><strong>Não vendemos seus dados pessoais identificados.</strong> Em nenhuma circunstância.</span></li>
            </ul>
          </div>

          <h2 class="mt-8">Verificação de prestadores</h2>
          <p class="lead mt-3">Cada prestador passa por checklist rigoroso antes de receber qualquer demanda.</p>
          <div class="grid grid-2 mt-5">
            ${[
              ['Identidade conferida', 'Documento oficial e selfie segurando o documento'],
              ['Antecedente criminal', 'Validado no estado de residência'],
              ['Endereço comprovado', 'Comprovante recente com nome do prestador'],
              ['Avaliação contínua', 'Nota cruzada após cada serviço, monitorada pelo time']
            ].map(([t, d]) => `
              <div class="card">
                <div class="row" style="gap: 12px;">
                  <span style="width: 36px; height: 36px; border-radius: 50%; background: var(--success-soft); color: var(--success); display: inline-flex; align-items: center; justify-content: center;">${UI.icon('check', 18)}</span>
                  <div><strong>${t}</strong><div class="t-dim fs-14">${d}</div></div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="card mt-8">
            <h3>Em caso de problema</h3>
            <p class="t-dim mt-3">Canal de denúncia direto, suporte humano e resolução em até 48 horas para casos com risco. Disponível em <a href="#/contato">Contato e suporte</a>.</p>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 6 — Cadastro do cliente (4 etapas)
  // ====================================================================
  function clientSignup(params) {
    const step = parseInt(params && params.step, 10) || 1;
    const total = 4;
    const progress = Math.round(((step - 1) / total) * 100);
    const labels = ['Identificação', 'Dados pessoais', 'Endereço', 'Confirmação'];

    let body = '';
    if (step === 1) {
      body = `
        <h1>Crie sua conta</h1>
        <p class="lead mt-2">Em três minutos. Sem cartão de crédito.</p>
        <form class="stack mt-6" data-form="signup-step" data-next="#/cadastro/cliente?step=2">
          ${UI.field({ label: 'Nome completo', name: 'name', placeholder: 'Como aparece no seu RG', required: true, value: 'Maria Cristina Almeida', autocomplete: 'name' })}
          ${UI.field({ label: 'E-mail', name: 'email', type: 'email', placeholder: 'voce@email.com', required: true, value: 'maria.almeida@example.com', autocomplete: 'email' })}
          ${UI.field({ label: 'WhatsApp', name: 'phone', type: 'tel', placeholder: '(11) 9 0000-0000', required: true, value: '(11) 9 7421-3308', autocomplete: 'tel' })}
          ${UI.field({ label: 'Senha', name: 'password', type: 'password', placeholder: 'Mínimo 8 caracteres', required: true, hint: 'Use letras, números e ao menos um símbolo.', autocomplete: 'new-password' })}
          <button class="btn btn--primary btn--block btn--lg" type="submit">Continuar</button>
          <p class="t-dim fs-13 t-center">Já tem conta? <a href="#/cliente">Entrar</a></p>
        </form>
      `;
    } else if (step === 2) {
      body = `
        <h1>Dados pessoais</h1>
        <p class="lead mt-2">Precisamos para verificar identidade e atender melhor.</p>
        <form class="stack mt-6" data-form="signup-step" data-next="#/cadastro/cliente?step=3">
          ${UI.field({ label: 'CPF', name: 'cpf', placeholder: '000.000.000-00', required: true, value: '372.418.190-22', mask: 'cpf' })}
          ${UI.field({ label: 'Data de nascimento', name: 'birth', type: 'date', value: '1983-11-12', required: true })}
          <label class="field">
            <span class="field__label">Como prefere ser chamada</span>
            <select class="select" name="gender">
              <option>Feminino</option>
              <option>Masculino</option>
              <option>Prefiro não informar</option>
            </select>
          </label>
          <div class="row" style="justify-content: space-between;">
            <a class="btn btn--ghost" href="#/cadastro/cliente?step=1">Voltar</a>
            <button class="btn btn--primary" type="submit">Continuar</button>
          </div>
        </form>
      `;
    } else if (step === 3) {
      body = `
        <h1>Endereço</h1>
        <p class="lead mt-2">Para encontrar prestadores próximos.</p>
        <form class="stack mt-6" data-form="signup-step" data-next="#/cadastro/cliente?step=4">
          <div class="grid grid-2">
            ${UI.field({ label: 'CEP', name: 'cep', placeholder: '00000-000', value: '05408-002', mask: 'cep', required: true })}
            ${UI.field({ label: 'Estado', name: 'uf', value: 'SP', required: true })}
          </div>
          ${UI.field({ label: 'Logradouro', name: 'street', value: 'Rua Cardeal Arcoverde', required: true, autocomplete: 'address-line1' })}
          <div class="grid grid-2">
            ${UI.field({ label: 'Número', name: 'number', value: '1408', required: true })}
            ${UI.field({ label: 'Complemento', name: 'complement', value: 'Apto 92', placeholder: 'Apto, bloco, etc' })}
          </div>
          <div class="grid grid-2">
            ${UI.field({ label: 'Bairro', name: 'district', value: 'Pinheiros', required: true })}
            ${UI.field({ label: 'Cidade', name: 'city', value: 'São Paulo', required: true })}
          </div>
          <div class="row" style="justify-content: space-between;">
            <a class="btn btn--ghost" href="#/cadastro/cliente?step=2">Voltar</a>
            <button class="btn btn--primary" type="submit">Continuar</button>
          </div>
        </form>
      `;
    } else {
      const c = D.DEMO_CLIENT;
      body = `
        <h1>Conferência</h1>
        <p class="lead mt-2">Confira os dados e aceite os termos para concluir.</p>
        <div class="card mt-5">
          <div class="row row--between">
            <div>
              <div style="font-weight:600;">${c.first_name} ${c.last_name}</div>
              <div class="t-dim fs-13">${c.email} · ${c.phone}</div>
            </div>
            <a href="#/cadastro/cliente?step=1" class="btn btn--ghost btn--sm">Editar</a>
          </div>
          <div class="divider mt-4 mb-4"></div>
          <div class="t-dim fs-14">${c.address} · ${c.neighborhood} · ${c.city} – ${c.state} · ${c.cep}</div>
        </div>
        <form class="stack mt-5" data-form="signup-step" data-next="#/cliente">
          <label class="check">
            <input type="checkbox" required />
            <span class="check__text">Li e aceito os <a href="#/termos">Termos de Uso</a> e a <a href="#/privacidade">Política de Privacidade</a>.</span>
          </label>
          <label class="check">
            <input type="checkbox" />
            <span class="check__text">Quero receber comunicação sobre meus serviços por e-mail e WhatsApp (você pode desativar a qualquer momento).</span>
          </label>
          <div class="row" style="justify-content: space-between;">
            <a class="btn btn--ghost" href="#/cadastro/cliente?step=3">Voltar</a>
            <button class="btn btn--primary btn--lg" type="submit">Concluir cadastro</button>
          </div>
        </form>
      `;
    }

    return `
      <section class="page">
        <div class="container container--narrow">
          <div class="row row--between mb-4">
            <span class="eyebrow">Cadastro de cliente</span>
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
  // VIEW 7 — Dashboard do cliente
  // ====================================================================
  function clientDashboard() {
    const c = D.DEMO_CLIENT;
    const myDemands = D.DEMANDS.filter((d) => d.client_id === c.id);
    const history = D.CLIENT_HISTORY;

    return `
      <section class="page page--app">
        <div class="container">
          <div class="row row--between mb-5" style="gap: 12px;">
            <div>
              <span class="eyebrow">${greeting()}</span>
              <h1 class="mt-2">Olá, ${c.first_name.split(' ')[0]}</h1>
              <p class="t-dim">${c.neighborhood}, ${c.city}</p>
            </div>
            <a class="btn btn--primary" href="#/cliente/nova-demanda">${UI.icon('plus', 16)} Nova solicitação</a>
          </div>

          <div class="card card--feature mb-7">
            <div class="row row--between" style="align-items: center; gap: 24px;">
              <div style="flex:1; min-width: 240px;">
                <h2 style="color:#fff;">Precisa de ajuda em casa?</h2>
                <p style="color: rgba(255,255,255,0.85); margin-top: 8px;">Descreva o serviço, prestadores verificados respondem em até 2 horas em média.</p>
              </div>
              <a class="btn btn--accent btn--lg" href="#/cliente/nova-demanda">Começar agora</a>
            </div>
          </div>

          <div class="row row--between mb-3">
            <h2>Suas solicitações</h2>
            <a href="#/cliente/historico" class="t-dim fs-14">Ver histórico</a>
          </div>

          <div class="stack-lg">
            ${myDemands.map((d) => clientDemandCard(d)).join('')}
          </div>

          <div class="mt-8">
            <h2 class="mb-3">Recomendações para o seu bairro</h2>
            <div class="grid grid-4">
              ${D.CATEGORIES.slice(0, 4).map((cat) => `
                <a class="cat-tile" href="#/cliente/nova-demanda">
                  <span class="cat-tile__icon">${UI.icon(cat.icon, 22)}</span>
                  <span class="cat-tile__name">${cat.name}</span>
                </a>
              `).join('')}
            </div>
          </div>

          <div class="mt-8">
            <h2 class="mb-3">Histórico recente</h2>
            <div class="stack">
              ${history.map((h) => {
                const pro = D.findProvider(h.provider_id);
                return `
                  <div class="card">
                    <div class="row row--between">
                      <div class="row" style="gap: 12px;">
                        ${UI.avatar(pro)}
                        <div>
                          <div style="font-weight:600;">${h.title}</div>
                          <div class="t-dim fs-13">${pro.first_name} · ${formatDate(h.date)} · ${D.formatBRL(h.value)}</div>
                        </div>
                      </div>
                      <div class="rating">${UI.ratingStars(h.rating_given)}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function clientDemandCard(d) {
    const cat = D.findCategory(d.cat);
    return `
      <article class="card card--interactive" data-link="#/cliente/demanda/${d.id}/${d.status === 'open' ? 'aguardando' : 'propostas'}">
        <div class="row row--between mb-3" style="gap: 12px;">
          <div class="row" style="gap: 10px;">
            <span class="cat-tile__icon" style="width:36px; height:36px;">${UI.icon(cat.icon, 18)}</span>
            <div>
              <div class="card__title" style="font-size:17px;">${d.title}</div>
              <div class="t-dim fs-13">${cat.name} · ${d.urgency_label}</div>
            </div>
          </div>
          ${UI.statusPill(d.status)}
        </div>
        <div class="row row--between" style="gap: 10px;">
          <span class="t-dim fs-14">${d.proposal_count} ${d.proposal_count === 1 ? 'proposta' : 'propostas'} · publicada ${D.formatRelativeMinutes(d.published_minutes_ago)}</span>
          <a class="btn btn--outline btn--sm" href="#/cliente/demanda/${d.id}/${d.status === 'open' ? 'aguardando' : 'propostas'}">Ver detalhes ${UI.icon('arrow_right', 14)}</a>
        </div>
      </article>
    `;
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ====================================================================
  // VIEW 8 — Nova demanda (5 etapas)
  // ====================================================================
  function clientNewDemand(params) {
    const step = parseInt(params && params.step, 10) || 1;
    const total = 5;
    const progress = Math.round((step / total) * 100);
    const state = global.LarCareApp.state.newDemand;

    const labels = ['Categoria', 'Descrição', 'Local', 'Prazo', 'Orçamento'];
    let body = '';

    if (step === 1) {
      body = `
        <h1>O que precisa ser resolvido?</h1>
        <p class="lead mt-2">Escolha a categoria que melhor descreve.</p>
        <div class="grid grid-3 mt-6" data-cat-grid>
          ${D.CATEGORIES.map((c) => `
            <button class="cat-tile ${state.cat === c.id ? 'is-active' : ''}" data-cat="${c.id}" type="button">
              <span class="cat-tile__icon">${UI.icon(c.icon, 22)}</span>
              <span class="cat-tile__name">${c.name}</span>
              <span class="t-dim fs-13" style="margin-top:2px;">${c.blurb}</span>
            </button>
          `).join('')}
        </div>
        <div class="row mt-6" style="justify-content:flex-end;">
          <button class="btn btn--primary" id="step-next" type="button" ${state.cat ? '' : 'disabled aria-disabled="true"'}>Continuar</button>
        </div>
      `;
    } else if (step === 2) {
      body = `
        <h1>Conte com detalhes</h1>
        <p class="lead mt-2">Quanto mais específico, melhores serão as propostas.</p>
        <form class="stack mt-6" data-form="new-demand-step" data-next="#/cliente/nova-demanda?step=3">
          ${UI.field({
            label: 'Descrição',
            name: 'description',
            type: 'textarea',
            placeholder: 'Ex: a torneira da pia da cozinha está pingando há dois dias. Já apertei a base e não resolveu.',
            required: true,
            value: state.description || ''
          })}
          <div>
            <span class="field__label">Fotos (opcional, até 3)</span>
            <div class="grid grid-3 mt-2">
              <button class="upload-tile" type="button">${UI.icon('camera', 28, 'class="upload-tile__icon"')}<strong>Adicionar foto</strong><span class="t-dim fs-13">Câmera ou galeria</span></button>
              <button class="upload-tile" type="button">${UI.icon('camera', 28, 'class="upload-tile__icon"')}<span class="t-dim fs-13">Adicionar mais</span></button>
              <button class="upload-tile" type="button">${UI.icon('camera', 28, 'class="upload-tile__icon"')}<span class="t-dim fs-13">Adicionar mais</span></button>
            </div>
          </div>
          <div class="row" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="#/cliente/nova-demanda?step=1">Voltar</a>
            <button class="btn btn--primary" type="submit">Continuar</button>
          </div>
        </form>
      `;
    } else if (step === 3) {
      const c = D.DEMO_CLIENT;
      body = `
        <h1>Onde será o serviço?</h1>
        <p class="lead mt-2">Você pode usar o endereço cadastrado ou outro.</p>
        <form class="stack mt-6" data-form="new-demand-step" data-next="#/cliente/nova-demanda?step=4">
          <label class="card card--interactive" style="cursor:pointer; display:block;">
            <div class="row" style="gap: 10px; align-items: flex-start;">
              <input type="radio" name="addr" value="default" checked />
              <div>
                <strong>${c.address}</strong>
                <div class="t-dim fs-14">${c.neighborhood} · ${c.city}-${c.state} · ${c.cep}</div>
              </div>
            </div>
          </label>
          <label class="card card--interactive" style="cursor:pointer; display:block;">
            <div class="row" style="gap: 10px; align-items: flex-start;">
              <input type="radio" name="addr" value="other" />
              <div>
                <strong>Usar outro endereço</strong>
                <div class="t-dim fs-14">Você informa nas próximas etapas.</div>
              </div>
            </div>
          </label>
          <div class="row" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="#/cliente/nova-demanda?step=2">Voltar</a>
            <button class="btn btn--primary" type="submit">Continuar</button>
          </div>
        </form>
      `;
    } else if (step === 4) {
      const opts = [
        { v: 'hoje', t: 'Hoje', d: 'Demanda urgente' },
        { v: 'ate_3_dias', t: 'Até 3 dias', d: 'Tem alguma urgência' },
        { v: 'ate_7_dias', t: 'Até 7 dias', d: 'Resolvo essa semana' },
        { v: 'sem_pressa', t: 'Sem pressa', d: 'Quando tiver bom prestador' }
      ];
      const periods = ['Manhã', 'Tarde', 'Noite', 'Qualquer'];
      body = `
        <h1>Quando você precisa?</h1>
        <form class="stack mt-6" data-form="new-demand-step" data-next="#/cliente/nova-demanda?step=5">
          <div class="grid grid-2">
            ${opts.map((o) => `
              <label class="card card--interactive" style="display:block;">
                <div class="row" style="gap: 10px; align-items:flex-start;">
                  <input type="radio" name="urgency" value="${o.v}" ${o.v === 'ate_3_dias' ? 'checked' : ''} />
                  <div><strong>${o.t}</strong><div class="t-dim fs-14">${o.d}</div></div>
                </div>
              </label>
            `).join('')}
          </div>
          <div class="mt-4">
            <span class="field__label">Período preferido</span>
            <div class="row mt-2" style="gap:6px; flex-wrap:wrap;">
              ${periods.map((p, i) => `<label class="chip ${i === 1 ? 'is-active' : ''}"><input type="radio" name="period" value="${p}" ${i === 1 ? 'checked' : ''} hidden />${p}</label>`).join('')}
            </div>
          </div>
          <div class="row" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="#/cliente/nova-demanda?step=3">Voltar</a>
            <button class="btn btn--primary" type="submit">Continuar</button>
          </div>
        </form>
      `;
    } else {
      body = `
        <h1>Ideia de orçamento? <span class="t-dim" style="font-family:var(--font-sans); font-size:18px; font-weight:400;">(opcional)</span></h1>
        <p class="lead mt-2">Isso ajuda os prestadores a calibrar a proposta. Pode pular se preferir.</p>
        <form class="stack mt-6" data-form="finish-new-demand">
          <div class="card">
            <div class="row row--between">
              <span class="t-dim fs-14">Valor que você considera razoável</span>
              <strong id="budget-output" style="color: var(--primary); font-family: var(--font-serif); font-size: 22px;">R$ 100 – R$ 280</strong>
            </div>
            <input type="range" min="50" max="1500" value="280" step="10" class="slider mt-4" id="budget-slider" />
            <div class="row row--between mt-2 t-dim fs-13"><span>R$ 50</span><span>R$ 1.500</span></div>
          </div>
          <div class="row" style="justify-content:space-between;">
            <a class="btn btn--ghost" href="#/cliente/nova-demanda?step=4">Voltar</a>
            <div class="row" style="gap:8px;">
              <button class="btn btn--ghost" type="submit" data-skip="1">Pular</button>
              <button class="btn btn--primary" type="submit">Publicar demanda</button>
            </div>
          </div>
        </form>
      `;
    }

    return `
      <section class="page">
        <div class="container container--narrow">
          <div class="row row--between mb-4">
            <span class="eyebrow">Nova solicitação</span>
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
  // VIEW 9 — Demanda publicada (aguardando)
  // ====================================================================
  function demandPublished(params) {
    const id = params.id;
    const dem = D.findDemand(id) || D.findDemand('dem-001');
    const cat = D.findCategory(dem.cat);
    return `
      <section class="page">
        <div class="container container--narrow">
          <div class="t-center mt-5 mb-7">
            <div style="width:80px; height:80px; margin:0 auto var(--space-4); border-radius:50%; background: var(--success-soft); color: var(--success); display:flex; align-items:center; justify-content:center;">
              ${UI.icon('check', 38)}
            </div>
            <h1>Demanda publicada</h1>
            <p class="lead mt-2">Já está visível para prestadores qualificados na sua região.</p>
          </div>

          <div class="card mb-5">
            <div class="row mb-2" style="gap: 10px;">
              <span class="cat-tile__icon" style="width:36px; height:36px;">${UI.icon(cat.icon, 18)}</span>
              <div>
                <div class="card__title" style="font-size:17px;">${dem.title}</div>
                <div class="t-dim fs-13">${cat.name} · ${dem.neighborhood}</div>
              </div>
            </div>
          </div>

          <div class="card card--soft">
            <div class="row" style="gap: 12px;">
              <span style="width:40px; height:40px; border-radius:50%; background:#fff; color: var(--primary); display:inline-flex; align-items:center; justify-content:center;">${UI.icon('bell', 20)}</span>
              <div>
                <strong>27 prestadores qualificados na sua região foram notificados</strong>
                <div class="t-dim fs-14 mt-1">Você costuma receber a primeira proposta em até 2 horas.</div>
              </div>
            </div>
          </div>

          <div class="timeline mt-6">
            <div class="timeline__item is-done">Demanda publicada · ${D.formatRelativeMinutes(0)}</div>
            <div class="timeline__item is-active">Aguardando primeira proposta · estimado em até 2 horas</div>
            <div class="timeline__item">Comparar e escolher</div>
            <div class="timeline__item">Combinar com prestador</div>
          </div>

          <div class="row mt-7" style="gap:10px; justify-content:center;">
            <a class="btn btn--primary" href="#/cliente/demanda/${dem.id}/propostas">Ver propostas (simular)</a>
            <a class="btn btn--ghost" href="#/cliente">Voltar para o início</a>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 10 — Lista de propostas recebidas
  // ====================================================================
  function proposalsList(params) {
    const id = params.id;
    const dem = D.findDemand(id) || D.findDemand('dem-001');
    const cat = D.findCategory(dem.cat);
    const proposals = D.proposalsForDemand(dem.id).filter((p) => p.status !== 'rejected' || dem.status === 'hired');

    return `
      <section class="page">
        <div class="container">
          <div class="row mb-2" style="gap:8px; align-items:center;">
            <a href="#/cliente" class="btn btn--ghost btn--sm">${UI.icon('arrow_left', 14)} Voltar</a>
          </div>
          <div class="row row--between mb-5" style="align-items:flex-start; gap:16px;">
            <div>
              <span class="eyebrow">Propostas recebidas</span>
              <h1 class="mt-2">${dem.title}</h1>
              <div class="t-dim fs-14 mt-2">${cat.name} · ${dem.neighborhood} · publicada ${D.formatRelativeMinutes(dem.published_minutes_ago)}</div>
            </div>
            <div class="badge badge--solid">${proposals.length} propostas</div>
          </div>

          <div class="row mb-5" style="gap:8px; flex-wrap:wrap;">
            <span class="t-dim fs-14" style="margin-right:8px;">Ordenar por</span>
            <button class="segmented" id="sort-bar">
              <span class="segmented__item is-active" data-sort="recent">Mais recente</span>
              <span class="segmented__item" data-sort="cheapest">Menor preço</span>
              <span class="segmented__item" data-sort="rated">Melhor avaliado</span>
              <span class="segmented__item" data-sort="closest">Mais perto</span>
            </button>
          </div>

          <div class="stack-lg" id="proposal-list">
            ${proposals.map((p) => proposalCard(p, dem)).join('')}
          </div>

          <p class="t-dim fs-13 mt-7 t-center">Você não é cobrado pelo LarCare por aceitar uma proposta. O pagamento acontece direto entre você e o prestador.</p>
        </div>
      </section>
    `;
  }

  function proposalCard(p, dem) {
    const pro = D.findProvider(p.provider_id);
    const dist = D.distanceFromClient(pro);
    return `
      <article class="proposal" data-proposal-id="${p.id}">
        <div class="proposal__head">
          ${UI.avatar(pro, 'lg')}
          <div style="flex:1; min-width:0;">
            <div class="proposal__name">${pro.first_name}</div>
            <div class="row mt-1" style="gap: 8px; align-items:center; flex-wrap:wrap;">
              ${UI.rating(pro)}
              <span class="t-dim fs-13">· ${pro.specialties[0] ? pro.specialties[0].years + ' anos em ' + D.findCategory(pro.specialties[0].cat).name.toLowerCase() : ''}</span>
            </div>
            <div class="row mt-2" style="gap: 4px;">
              ${UI.chip('Verificado', { variant: 'success', icon: 'shield_check', static: true })}
              ${pro.verified.background ? UI.chip('Antecedente OK', { variant: 'success', static: true }) : ''}
              ${pro.brings_material === 'sim' ? UI.chip('Leva material', { variant: 'accent', static: true }) : ''}
              ${pro.has_vehicle ? UI.chip('Veículo próprio', { static: true }) : ''}
            </div>
          </div>
          <div class="text-right">
            <div class="proposal__price">${D.formatBRL(p.value)}</div>
            <div class="t-dim fs-13 mt-1">${dist.toFixed(1)} km</div>
          </div>
        </div>

        <div class="proposal__row">
          <span>${UI.icon('clock', 14)} ${p.time_estimate}</span>
          <span>${UI.icon('calendar', 14)} ${p.availability_text}</span>
          <span class="t-dim">· enviada ${D.formatRelativeMinutes(p.sent_minutes_ago)}</span>
        </div>

        <div class="proposal__msg">${escapeHtml(p.message)}</div>

        <div class="proposal__cta">
          <a class="btn btn--ghost btn--sm" href="#/cliente/proposta/${p.id}">Ver perfil completo</a>
          <a class="btn btn--primary btn--sm" href="#/cliente/contratado/${p.id}">Aceitar proposta ${UI.icon('arrow_right', 14)}</a>
        </div>
      </article>
    `;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // ====================================================================
  // VIEW 11 — Detalhe da proposta + perfil do prestador
  // ====================================================================
  function proposalDetail(params) {
    const propId = params.id;
    const prop = D.PROPOSALS.find((x) => x.id === propId);
    if (!prop) return notFound();
    const pro = D.findProvider(prop.provider_id);
    const dem = D.findDemand(prop.demand_id);
    const dist = D.distanceFromClient(pro);

    const distrib = ratingDistribution(pro);

    return `
      <section class="page">
        <div class="container container--narrow">
          <div class="row mb-3" style="gap:8px;">
            <a class="btn btn--ghost btn--sm" href="#/cliente/demanda/${dem.id}/propostas">${UI.icon('arrow_left', 14)} Voltar para propostas</a>
          </div>

          <div class="card">
            <div class="row" style="gap:18px; align-items:flex-start;">
              ${UI.avatar(pro, 'xl')}
              <div style="flex:1;">
                <h1 style="font-size: 28px;">${pro.first_name}</h1>
                <div class="row mt-2" style="gap:10px; flex-wrap:wrap;">
                  ${pro.specialties.map((s) => UI.chip(D.findCategory(s.cat).name + ' · ' + s.years + ' anos', { static: true })).join('')}
                </div>
                <div class="t-dim mt-3 fs-14">${pro.neighborhood} · ${dist.toFixed(1)} km de você · raio de atendimento ${pro.radius_km} km</div>
              </div>
            </div>
          </div>

          <div class="card mt-5">
            <h3>Verificações</h3>
            <ul class="checklist mt-3">
              <li class="checklist__item"><span class="checklist__check">${UI.icon('check', 14)}</span><div><strong>Identidade conferida</strong><div class="t-dim fs-13">Documento oficial e selfie validados</div></div></li>
              <li class="checklist__item"><span class="checklist__check">${UI.icon('check', 14)}</span><div><strong>Antecedente criminal verificado</strong><div class="t-dim fs-13">Sem pendências em ${formatDate(pro.verified.last_check)}</div></div></li>
              <li class="checklist__item"><span class="checklist__check">${UI.icon('check', 14)}</span><div><strong>Endereço comprovado</strong><div class="t-dim fs-13">Comprovante recente conferido</div></div></li>
              <li class="checklist__item"><span class="checklist__check">${UI.icon('check', 14)}</span><div><strong>Cadastro completo</strong><div class="t-dim fs-13">Atualizado em ${formatDate(pro.verified.last_check)}</div></div></li>
            </ul>
          </div>

          <div class="card mt-5">
            <div class="row row--between mb-3">
              <h3>Avaliações</h3>
              <div class="rating">${UI.ratingStars(pro.rating_avg)}<span class="rating__value" style="margin-left:6px;">${pro.rating_avg.toFixed(1)}</span><span class="t-dim">(${pro.rating_count})</span></div>
            </div>
            <div class="stack mt-3">
              ${distrib.map((row) => `
                <div class="row" style="gap: 10px; align-items: center;">
                  <span class="t-dim fs-13" style="width: 46px;">${row.stars} ★</span>
                  <div style="flex:1; height: 6px; background: var(--surface-2); border-radius: 999px; overflow:hidden;">
                    <div style="width: ${row.pct}%; height:100%; background: var(--accent);"></div>
                  </div>
                  <span class="t-dim fs-13" style="width: 30px; text-align:right;">${row.count}</span>
                </div>
              `).join('')}
            </div>
            <div class="divider mt-5 mb-5"></div>
            <div class="stack">
              ${pro.reviews.map((r) => `
                <div>
                  <div class="row" style="gap: 8px; align-items:center;">
                    <span style="font-weight:600;">${r.author}</span>
                    ${UI.ratingStars(r.rating)}
                    <span class="t-dim fs-13">· ${formatDate(r.date)}</span>
                  </div>
                  <p class="mt-2 t-dim" style="line-height:1.55;">"${r.text}"</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card mt-5">
            <h3>Apresentação</h3>
            <p class="t-dim mt-2" style="line-height:1.65;">${pro.bio}</p>
          </div>

          <div class="card card--accent mt-5">
            <span class="eyebrow">Proposta para sua demanda</span>
            <div class="row mt-3 row--between">
              <div>
                <div class="proposal__price">${D.formatBRL(prop.value)}</div>
                <div class="t-dim fs-14 mt-1">${prop.time_estimate} · ${prop.availability_text}</div>
              </div>
              <div class="rating">${UI.ratingStars(pro.rating_avg)}</div>
            </div>
            <div class="proposal__msg mt-4">${escapeHtml(prop.message)}</div>
          </div>

          <div class="row mt-6" style="gap:10px; justify-content:space-between;">
            <a class="btn btn--ghost" href="#/cliente/demanda/${dem.id}/propostas">Voltar para a lista</a>
            <a class="btn btn--primary btn--lg" href="#/cliente/contratado/${prop.id}">Aceitar esta proposta</a>
          </div>
        </div>
      </section>
    `;
  }

  function ratingDistribution(pro) {
    // build a fictitious but plausible distribution from rating_avg/count
    const total = pro.rating_count;
    const avg = pro.rating_avg;
    const seeds = [
      { stars: 5, w: avg >= 4.7 ? 0.78 : (avg >= 4.4 ? 0.62 : 0.48) },
      { stars: 4, w: 0.20 },
      { stars: 3, w: 0.05 },
      { stars: 2, w: 0.015 },
      { stars: 1, w: 0.005 }
    ];
    const sumW = seeds.reduce((a, s) => a + s.w, 0);
    const counts = seeds.map((s) => Math.round((s.w / sumW) * total));
    const max = Math.max(...counts);
    return seeds.map((s, i) => ({ stars: s.stars, count: counts[i], pct: max ? Math.round((counts[i] / max) * 100) : 0 }));
  }

  // ====================================================================
  // VIEW 12 — Confirmação e contato liberado
  // ====================================================================
  function contactUnlocked(params) {
    const propId = params.id;
    const prop = D.PROPOSALS.find((x) => x.id === propId);
    if (!prop) return notFound();
    const pro = D.findProvider(prop.provider_id);
    const dem = D.findDemand(prop.demand_id);
    const phoneDigits = '5511974213308';

    return `
      <section class="page">
        <div class="container container--narrow t-center">
          <div style="width:96px; height:96px; margin:0 auto var(--space-5); border-radius:50%; background: var(--success-soft); color: var(--success); display:flex; align-items:center; justify-content:center; animation: route-in 380ms cubic-bezier(0.16, 1, 0.3, 1);">
            ${UI.icon('check', 48)}
          </div>
          <h1>Pronto!</h1>
          <p class="lead mt-2">Aqui está o contato de <strong>${pro.first_name}</strong>.</p>
        </div>

        <div class="container container--narrow mt-7">
          <div class="card">
            <div class="row" style="gap:14px; align-items:center;">
              ${UI.avatar(pro, 'lg')}
              <div style="flex:1;">
                <strong>${pro.first_name}</strong>
                <div class="t-dim fs-14">${pro.specialties.map((s) => D.findCategory(s.cat).name).join(' · ')}</div>
                ${UI.rating(pro)}
              </div>
            </div>
            <div class="divider mt-4 mb-4"></div>
            <div class="stack">
              <a class="btn btn--primary btn--block btn--lg" href="https://wa.me/${phoneDigits}?text=${encodeURIComponent('Oi ' + pro.first_name + ', tudo bem? Vi sua proposta no LarCare para o serviço: ' + dem.title)}" target="_blank" rel="noopener">${UI.icon('whatsapp', 18)} Falar no WhatsApp</a>
              <a class="btn btn--outline btn--block" href="tel:+${phoneDigits}">${UI.icon('phone', 16)} Ligar (11) 9 ${phoneDigits.slice(-9, -4)}-${phoneDigits.slice(-4)}</a>
              <a class="btn btn--ghost btn--block" href="#/cliente/proposta/${prop.id}">Ver detalhes da proposta novamente</a>
            </div>
          </div>

          <div class="card card--soft mt-5">
            <p class="t-dim" style="line-height:1.6;">A partir daqui, vocês combinam direto. Lembre-se: sua avaliação após o serviço ajuda outros clientes e mantém a plataforma de quem entrega bem.</p>
          </div>

          <div class="row mt-6" style="justify-content:space-between; gap:10px;">
            <a class="btn btn--ghost" href="#/cliente">Voltar para o início</a>
            <a class="btn btn--outline" href="#/cliente/avaliar/${prop.id}">Avaliar serviço (depois)</a>
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 13 — Avaliação pós-serviço (cliente)
  // ====================================================================
  function clientReview(params) {
    const propId = params.id;
    const prop = D.PROPOSALS.find((x) => x.id === propId) || D.PROPOSALS[0];
    const pro = D.findProvider(prop.provider_id);
    const items = [
      { id: 'punctuality', label: 'Pontualidade' },
      { id: 'quality',     label: 'Qualidade do serviço' },
      { id: 'manner',      label: 'Postura e comportamento' },
      { id: 'price',       label: 'Preço justo' }
    ];
    return `
      <section class="page">
        <div class="container container--narrow">
          <div class="t-center mb-5">
            <div style="width:64px; height:64px; margin:0 auto var(--space-3); border-radius:50%; background: var(--accent-soft); display:flex; align-items:center; justify-content:center; color:#6f4f24;">
              ${UI.icon('star', 30)}
            </div>
            <h1>Como foi seu serviço com ${pro.first_name}?</h1>
            <p class="lead mt-2">Sua avaliação ajuda outros clientes e mantém a plataforma honesta.</p>
          </div>

          <form class="card" data-form="client-review">
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
                <label class="field__label">Quer deixar um comentário? <span class="t-dim">(opcional)</span></label>
                <textarea class="textarea mt-2" name="comment" placeholder="Conte rapidamente como foi"></textarea>
              </div>
              <label class="check">
                <input type="checkbox" checked />
                <span class="check__text">Recomendaria ${pro.first_name} para outros clientes</span>
              </label>
            </div>
            <div class="row mt-6" style="justify-content:space-between;">
              <a class="btn btn--ghost" href="#/cliente">Avaliar depois</a>
              <button class="btn btn--primary" type="submit">Enviar avaliação</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // VIEW 14 — Histórico de serviços
  // ====================================================================
  function clientHistory() {
    const list = D.CLIENT_HISTORY;
    return `
      <section class="page page--app">
        <div class="container">
          <span class="eyebrow">Histórico</span>
          <h1 class="mt-2">Serviços concluídos</h1>
          <div class="row mt-4" style="gap:8px; flex-wrap:wrap;">
            <span class="chip is-active chip--static">Todos</span>
            <span class="chip chip--static">Este ano</span>
            <span class="chip chip--static">Por categoria</span>
            <span class="chip chip--static">Avaliação dada</span>
          </div>
          <div class="stack-lg mt-6">
            ${list.map((h) => {
              const pro = D.findProvider(h.provider_id);
              const cat = D.findCategory(h.cat);
              return `
                <article class="card">
                  <div class="row row--between" style="gap:14px;">
                    <div class="row" style="gap:12px;">
                      ${UI.avatar(pro)}
                      <div>
                        <div style="font-weight:600;">${h.title}</div>
                        <div class="t-dim fs-13">${cat.name} · ${pro.first_name} · ${formatDate(h.date)}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <strong>${D.formatBRL(h.value)}</strong>
                      <div class="rating mt-1">${UI.ratingStars(h.rating_given)}</div>
                    </div>
                  </div>
                  <div class="row mt-4" style="gap:8px;">
                    <a class="btn btn--ghost btn--sm" href="#/cliente/proposta/prop-001-a">Detalhes</a>
                    <a class="btn btn--outline btn--sm" href="#/cliente/nova-demanda">Contratar de novo</a>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // 404 fallback
  // ====================================================================
  function notFound() {
    return `
      <section class="page">
        <div class="container container--narrow t-center">
          <h1>Página não encontrada</h1>
          <p class="lead mt-3">O link que você abriu não existe (ou ainda não existe).</p>
          <a class="btn btn--primary mt-5" href="#/">Voltar para o início</a>
        </div>
      </section>
    `;
  }

  // ====================================================================
  // Export public + client views (provider views appended in next file segment)
  // ====================================================================
  global.LarCareViews = global.LarCareViews || {};
  Object.assign(global.LarCareViews, {
    landing, about, howItWorksClient, howItWorksProvider, security,
    clientSignup, clientDashboard, clientNewDemand,
    demandPublished, proposalsList, proposalDetail,
    contactUnlocked, clientReview, clientHistory,
    notFound,
    // helpers exposed for other view files
    _helpers: { greeting, formatDate, escapeHtml, urgencyChip, categoryChip, ratingDistribution }
  });
})(window);
