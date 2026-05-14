/* =========================================================================
   LarCare — data layer com hot-swap mock ⇄ supabase
   =========================================================================
   Estratégia:
     * As views (22 funções em views.js / views_provider.js) consomem o
       namespace global window.LarCareData (arrays + helpers) de forma
       SÍNCRONA. Refatorar todas as views para async iria custar caro e
       gerar risco de regressão no protótipo do pitch.
     * Em vez disso, fazemos UM bootstrap async no boot do app. Se
       USE_SUPABASE=false, retornamos imediatamente (mock_data.js já
       populou LarCareData). Se true, buscamos tudo do Supabase em
       paralelo, transformamos no mesmo shape do mock e REPLACE o
       LarCareData global. A partir daí, render é síncrono.
     * Custo: primeira carga espera os fetches. Aceitável dado o volume
       (12 prestadores + 13 demandas + ~45 propostas + categorias).
       Futuro: paginação, lazy load por rota, realtime — vão exigir
       quebrar o sync. Quando essa hora chegar, fazer já com clareza
       arquitetural; hoje, não.
   ========================================================================= */
(function (global) {
  'use strict';

  const MOCK = global.LarCareData; // snapshot do que mock_data.js definiu
  const cfg  = global.LarCareConfig;

  // ------------------------------------------------------------------
  // Helpers reaproveitados (puramente utilitários, sem estado de dados)
  // ------------------------------------------------------------------
  const NEIGHBORHOOD_DISTANCE = {
    'Pinheiros': 0.4, 'Vila Madalena': 1.6, 'Perdizes': 3.2,
    'Butantã': 4.1, 'Lapa': 5.8, 'Vila Mariana': 6.4,
    'Tatuapé': 12.2, 'Santana': 9.7, 'Aclimação': 7.3, 'Ipiranga': 8.9
  };

  function buildNamespace(d) {
    const findById = (arr, id) => arr.find((x) => x.id === id) || null;
    return {
      CATEGORIES: d.categories,
      PROVIDERS: d.providers,
      DEMANDS: d.demands,
      PROPOSALS: d.proposals,
      DEMO_CLIENT: d.demo_client,
      CLIENT_HISTORY: d.client_history,
      findCategory: (id) => findById(d.categories, id),
      findProvider: (id) => findById(d.providers, id),
      findDemand: (id) => findById(d.demands, id),
      proposalsForDemand: (id) => d.proposals.filter((p) => p.demand_id === id),
      proposalsByProvider: (id) => d.proposals.filter((p) => p.provider_id === id),
      demandsForProvider: (id) => {
        const pro = findById(d.providers, id);
        if (!pro) return d.demands;
        const cats = pro.specialties.map((s) => s.cat);
        const matched = d.demands.filter((x) => cats.indexOf(x.cat) !== -1);
        return matched.length >= 4 ? matched : d.demands;
      },
      formatRelativeMinutes: MOCK.formatRelativeMinutes,
      formatBRL: MOCK.formatBRL,
      formatRange: MOCK.formatRange,
      distanceFromClient: (provider) => {
        const v = NEIGHBORHOOD_DISTANCE[provider.neighborhood];
        return v != null ? v : 7.0;
      }
    };
  }

  // ------------------------------------------------------------------
  // Transform: Supabase rows → shape esperado pelas views (igual ao mock)
  // ------------------------------------------------------------------
  function transformProvider(profile, prestador, categorias, reviews) {
    return {
      id: profile.id,
      first_name: profile.first_name,
      full_name: profile.full_name,
      initials: profile.initials,
      age: profile.age,
      avatar_color: profile.avatar_color || 'primary',
      neighborhood: profile.neighborhood,
      city: profile.city,
      radius_km: prestador.radius_km,
      rating_avg: Number(prestador.rating_avg) || 0,
      rating_count: prestador.rating_count || 0,
      response_minutes: prestador.response_minutes,
      acceptance_rate: Number(prestador.acceptance_rate) || 0,
      brings_material: prestador.brings_material,
      has_vehicle: !!prestador.has_vehicle,
      verified: {
        identity: !!prestador.verified_identity,
        background: !!prestador.verified_background,
        address: !!prestador.verified_address,
        last_check: prestador.last_check
      },
      specialties: categorias.map((c) => ({ cat: c.categoria_id, years: c.years })),
      bio: prestador.bio,
      reviews: reviews.map((r) => ({
        author: r.author_name || 'Cliente LarCare',
        rating: r.nota_geral,
        text: r.comentario || '',
        date: (r.published_at || '').substring(0, 10)
      })),
      availability: prestador.availability || {}
    };
  }

  function transformDemand(row) {
    return {
      id: row.id,
      client_id: row.client_id,
      cat: row.categoria_id,
      title: row.title,
      description: row.description,
      neighborhood: row.neighborhood,
      address_summary: row.address_summary,
      urgency: row.urgency,
      urgency_label: row.urgency_label,
      time_pref: row.time_pref,
      budget_min: row.budget_min,
      budget_max: row.budget_max,
      photos: row.photos_count || 0,
      published_at_iso: row.published_at,
      published_minutes_ago: row.published_at
        ? Math.max(1, Math.round((Date.now() - new Date(row.published_at).getTime()) / 60000))
        : 0,
      status: row.status,
      proposal_count: row._proposal_count || 0,
      featured_for_demo: !!row.featured_for_demo
    };
  }

  function transformProposal(row) {
    return {
      id: row.id,
      demand_id: row.demanda_id,
      provider_id: row.prestador_id,
      value: Number(row.value),
      time_estimate: row.time_estimate,
      availability_text: row.availability_text,
      message: row.message,
      sent_minutes_ago: row.sent_at
        ? Math.max(0.1, (Date.now() - new Date(row.sent_at).getTime()) / 60000)
        : 0,
      status: row.status
    };
  }

  // ------------------------------------------------------------------
  // Fetch tudo de uma vez (paralelo) e monta o namespace
  // ------------------------------------------------------------------
  async function fetchAll(supa) {
    const [cats, profiles, prestadores, prestCats, demandas, propostas, avaliacoes] =
      await Promise.all([
        supa.from('categorias').select('*').order('ordem'),
        supa.from('profiles').select('*'),
        supa.from('prestadores').select('*').eq('active', true),
        supa.from('prestador_categorias').select('*'),
        supa.from('demandas').select('*').is('deleted_at', null),
        supa.from('propostas').select('*'),
        supa.from('avaliacoes').select('*').eq('autor_tipo', 'cliente')
      ]);

    const firstErr = [cats, profiles, prestadores, prestCats, demandas, propostas, avaliacoes]
      .find((r) => r.error);
    if (firstErr) throw firstErr.error;

    const profileById = new Map(profiles.data.map((p) => [p.id, p]));

    // Categorias → shape mock
    const categories = cats.data.map((c) => ({
      id: c.id, name: c.nome, icon: c.icone, blurb: c.blurb
    }));

    // Reviews indexadas por prestador (alvo_id) com nome do autor
    const reviewsByProvider = new Map();
    avaliacoes.data.forEach((a) => {
      const author = profileById.get(a.autor_id);
      const enriched = { ...a, author_name: author ? author.first_name : 'Cliente LarCare' };
      if (!reviewsByProvider.has(a.alvo_id)) reviewsByProvider.set(a.alvo_id, []);
      reviewsByProvider.get(a.alvo_id).push(enriched);
    });

    // Specialties indexadas por prestador_id
    const catsByPrestador = new Map();
    prestCats.data.forEach((pc) => {
      if (!catsByPrestador.has(pc.prestador_id)) catsByPrestador.set(pc.prestador_id, []);
      catsByPrestador.get(pc.prestador_id).push(pc);
    });

    const providers = prestadores.data.map((pr) => {
      const profile = profileById.get(pr.profile_id);
      if (!profile) return null;
      return transformProvider(
        profile,
        pr,
        catsByPrestador.get(pr.profile_id) || [],
        reviewsByProvider.get(pr.profile_id) || []
      );
    }).filter(Boolean);

    // Proposal counts por demanda (para a vitrine do prestador)
    const propCountByDemand = new Map();
    propostas.data.forEach((p) => {
      propCountByDemand.set(p.demanda_id, (propCountByDemand.get(p.demanda_id) || 0) + 1);
    });

    const demands = demandas.data
      .filter((d) => d.id && !d.id.startsWith('hist-')) // histórico fica fora do feed
      .map((d) => transformDemand({ ...d, _proposal_count: propCountByDemand.get(d.id) || 0 }));

    const proposals = propostas.data
      .filter((p) => !p.id.startsWith('prop-hist-'))
      .map(transformProposal);

    // Cliente demo (overlay: mantém shape do mock, pega valores do DB quando disponível)
    const cliRow = profileById.get('cli-001');
    const demo_client = cliRow ? {
      id: cliRow.id,
      first_name: cliRow.first_name,
      last_name: (cliRow.full_name || '').split(' ').slice(1).join(' '),
      initials: cliRow.initials,
      age: cliRow.age,
      avatar_color: cliRow.avatar_color,
      email: cliRow.email,
      phone: cliRow.phone,
      city: cliRow.city,
      state: cliRow.state,
      neighborhood: cliRow.neighborhood,
      address: cliRow.address,
      cep: cliRow.cep,
      completed_services: avaliacoes.data.filter((a) => a.autor_id === 'cli-001').length,
      member_since: cliRow.member_since
    } : MOCK.DEMO_CLIENT;

    // Histórico: vem das demandas hist-NNN (completed)
    const histProposals = propostas.data.filter((p) => p.id.startsWith('prop-hist-'));
    const client_history = demandas.data
      .filter((d) => (d.id || '').startsWith('hist-') && d.client_id === 'cli-001')
      .map((d) => {
        const accepted = histProposals.find((p) => p.demanda_id === d.id);
        const rating = avaliacoes.data.find((a) => a.demanda_id === d.id && a.autor_id === 'cli-001');
        return {
          id: d.id,
          date: (d.completed_at || d.published_at || '').substring(0, 10),
          cat: d.categoria_id,
          provider_id: accepted ? accepted.prestador_id : null,
          title: d.title,
          value: accepted ? Number(accepted.value) : 0,
          rating_given: rating ? rating.nota_geral : null
        };
      });

    return buildNamespace({
      categories, providers, demands, proposals, demo_client, client_history
    });
  }

  // ------------------------------------------------------------------
  // Bootstrap público
  // ------------------------------------------------------------------
  async function bootstrap() {
    if (!cfg || !cfg.USE_SUPABASE) {
      // mock_data.js já populou LarCareData. Nada a fazer.
      return { source: 'mock' };
    }

    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
      console.warn('[LarCare] USE_SUPABASE=true mas credenciais ausentes; caindo em mock.');
      return { source: 'mock', warning: 'missing-credentials' };
    }

    try {
      const mod = await import(cfg.SUPABASE_SDK_URL);
      const supa = mod.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: { persistSession: false } // protótipo não autentica ainda
      });
      const ns = await fetchAll(supa);
      global.LarCareData = ns;
      global.LarCareSupa = supa; // exposto para futuras mutations (criar demanda, proposta, etc)
      return { source: 'supabase' };
    } catch (err) {
      console.error('[LarCare] Falha no bootstrap Supabase, caindo em mock:', err);
      return { source: 'mock', error: err.message || String(err) };
    }
  }

  // Expõe bootstrap no namespace existente; deixa todos os dados/helpers
  // do mock acessíveis enquanto não chama bootstrap.
  global.LarCareData.bootstrap = bootstrap;
})(window);
