/* =========================================================================
   LarCare — mock dataset
   Tudo aqui é fictício. Bairros, nomes, valores e avaliações foram
   compostos para serem realistas em São Paulo.
   ========================================================================= */
(function (global) {
  'use strict';

  // ------------------------------------------------------------------
  // Categorias
  // ------------------------------------------------------------------
  const CATEGORIES = [
    { id: 'eletrica',    name: 'Elétrica residencial',   icon: 'bolt',     blurb: 'Tomadas, lâmpadas, disjuntores' },
    { id: 'hidraulica',  name: 'Hidráulica residencial', icon: 'drop',     blurb: 'Vazamentos, torneiras, descargas' },
    { id: 'marcenaria',  name: 'Marcenaria leve',        icon: 'saw',      blurb: 'Pequenos consertos em madeira' },
    { id: 'pintura',     name: 'Pintura interna',        icon: 'brush',    blurb: 'Cômodos, retoques, paredes' },
    { id: 'jardinagem',  name: 'Jardinagem',             icon: 'leaf',     blurb: 'Poda, grama, plantas' },
    { id: 'montagem',    name: 'Montagem de móveis',     icon: 'box',      blurb: 'Guarda-roupa, estante, mesa' },
    { id: 'instalacao',  name: 'Instalação de equipamentos', icon: 'tv', blurb: 'Suporte de TV, ar, prateleira' },
    { id: 'reparos',     name: 'Reparos gerais',         icon: 'wrench',   blurb: 'Pequenos consertos diversos' },
    { id: 'limpeza',     name: 'Limpeza pesada',         icon: 'sparkle',  blurb: 'Pós-obra, mudança, vidros' },
    { id: 'preventiva',  name: 'Manutenção preventiva',  icon: 'shield',   blurb: 'Vistoria e ajustes de rotina' }
  ];

  // ------------------------------------------------------------------
  // Cliente demo
  // ------------------------------------------------------------------
  const DEMO_CLIENT = {
    id: 'cli-001',
    first_name: 'Maria Cristina',
    last_name: 'Almeida',
    initials: 'MC',
    age: 42,
    avatar_color: 'accent',
    email: 'maria.almeida@example.com',
    phone: '(11) 9 7421-3308',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Pinheiros',
    address: 'Rua Cardeal Arcoverde, 1408 — Apto 92',
    cep: '05408-002',
    completed_services: 3,
    member_since: '2025-08-19'
  };

  // ------------------------------------------------------------------
  // Prestadores (12)
  // ------------------------------------------------------------------
  const PROVIDERS = [
    {
      id: 'pro-001',
      first_name: 'Carlos H.',
      full_name: 'Carlos Henrique S.',
      initials: 'CH',
      age: 38,
      avatar_color: 'primary',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      radius_km: 12,
      rating_avg: 4.8,
      rating_count: 32,
      response_minutes: 28,
      acceptance_rate: 0.86,
      brings_material: 'depende',
      has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-02' },
      specialties: [
        { cat: 'eletrica',   years: 15 },
        { cat: 'reparos',    years: 9 }
      ],
      bio: 'Eletricista há 15 anos, atendo Vila Madalena, Pinheiros e Sumaré. Levo ferramenta completa, oriento sobre material antes de comprar e deixo tudo limpo no fim. Fui formado pelo SENAI e mantenho NR-10 atualizada.',
      reviews: [
        { author: 'Beatriz M.', rating: 5, text: 'Carlos chegou no horário, identificou o problema do disjuntor em 10 minutos e ainda revisou os outros pontos da casa. Indicação certa.', date: '2026-03-29' },
        { author: 'Renata C.', rating: 5, text: 'Trocou três pontos de luz e instalou um pendente que comprei pronto. Trabalho limpo e preço justo.', date: '2026-03-12' },
        { author: 'Felipe S.',  rating: 4, text: 'Excelente serviço, só atrasou uns 20 minutos por causa do trânsito. Avisou antes, sem problema.', date: '2026-02-20' },
        { author: 'Ana Lúcia O.', rating: 5, text: 'Resolveu um curto na cozinha que outro eletricista não tinha conseguido. Atendimento de quem sabe o que faz.', date: '2026-02-04' },
        { author: 'Marcos R.', rating: 5, text: 'Muito profissional, explicou tudo o que ia fazer. Recomendo.', date: '2026-01-22' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,1], fri: [1,1,1], sat: [1,0,0], sun: [0,0,0] }
    },
    {
      id: 'pro-002',
      first_name: 'Roberto F.',
      full_name: 'Roberto Faria L.',
      initials: 'RF',
      age: 51,
      avatar_color: 'primary',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      radius_km: 8,
      rating_avg: 4.9,
      rating_count: 47,
      response_minutes: 18,
      acceptance_rate: 0.92,
      brings_material: 'sim',
      has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-08' },
      specialties: [
        { cat: 'hidraulica', years: 22 },
        { cat: 'reparos',    years: 18 }
      ],
      bio: 'Vinte e dois anos de hidráulica residencial. Vazamento, troca de torneira, instalação de filtro, reparo em descarga, desentupimento leve. Levo material básico e cobro só o que usar.',
      reviews: [
        { author: 'Patrícia D.', rating: 5, text: 'Cheguei do trabalho com o banheiro alagado. Roberto veio em duas horas, achou o vazamento dentro da parede e arrumou no mesmo dia. Salvou meu fim de semana.', date: '2026-04-10' },
        { author: 'Gustavo H.', rating: 5, text: 'Trocou as duas torneiras da pia e instalou um filtro. Cobrou exatamente o que combinou.', date: '2026-03-28' },
        { author: 'Sônia M.', rating: 5, text: 'Educadíssimo, deixou tudo limpo. Vou contratar de novo.', date: '2026-03-15' },
        { author: 'Camila R.', rating: 4, text: 'Resolveu o problema mas demorou um pouco para responder no início. Depois que veio, trabalho impecável.', date: '2026-02-26' },
        { author: 'Diego A.', rating: 5, text: 'Profissional sério, sem enrolação. Indico de olhos fechados.', date: '2026-02-10' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,1,0], sun: [0,0,0] }
    },
    {
      id: 'pro-003',
      first_name: 'André P.',
      full_name: 'André Pacheco N.',
      initials: 'AP',
      age: 33,
      avatar_color: 'primary',
      neighborhood: 'Vila Mariana',
      city: 'São Paulo',
      radius_km: 15,
      rating_avg: 4.7,
      rating_count: 28,
      response_minutes: 42,
      acceptance_rate: 0.78,
      brings_material: 'depende',
      has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-03-30' },
      specialties: [
        { cat: 'montagem',  years: 9 },
        { cat: 'marcenaria', years: 6 }
      ],
      bio: 'Especialista em montagem de móveis planejados e prontos. Madesa, Tok&Stok, IKEA, Etna, móvel sob medida. Trabalho com manual ou sem manual quando necessário.',
      reviews: [
        { author: 'Letícia F.', rating: 5, text: 'Montou um guarda-roupa Madesa de 6 portas que eu já tinha aberto. Precisou refazer uma parte que eu tinha feito errado e nem cobrou diferença.', date: '2026-04-15' },
        { author: 'Henrique B.', rating: 5, text: 'Montou estante, mesa de jantar e cabeceira em uma tarde só. Trabalho rápido e bem feito.', date: '2026-04-01' },
        { author: 'Tatiana M.', rating: 4, text: 'Bom serviço, mas teve uma peça riscada que ele não percebeu. Resolvi por conta. Fora isso, ótimo.', date: '2026-03-22' },
        { author: 'João Vitor L.', rating: 5, text: 'Rápido, organizado, levou os parafusos extras necessários.', date: '2026-03-08' },
        { author: 'Elaine S.', rating: 5, text: 'Recomendo. Pessoa de confiança.', date: '2026-02-19' }
      ],
      availability: { mon: [0,1,1], tue: [0,1,1], wed: [0,1,1], thu: [0,1,1], fri: [0,1,1], sat: [1,1,0], sun: [0,0,0] }
    },
    {
      id: 'pro-004',
      first_name: 'Luciana T.',
      full_name: 'Luciana Teixeira M.',
      initials: 'LT',
      age: 44,
      avatar_color: 'accent',
      neighborhood: 'Tatuapé',
      city: 'São Paulo',
      radius_km: 10,
      rating_avg: 4.9,
      rating_count: 38,
      response_minutes: 22,
      acceptance_rate: 0.88,
      brings_material: 'depende',
      has_vehicle: false,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-12' },
      specialties: [
        { cat: 'pintura',   years: 14 },
        { cat: 'reparos',   years: 8 }
      ],
      bio: 'Pintora há 14 anos. Atendo apartamentos pequenos e médios. Especialidade em acabamento fino, tinta lavável e textura. Cobro por cômodo, oriento sobre cor e tinta antes da compra.',
      reviews: [
        { author: 'Mariana C.', rating: 5, text: 'Pintou o quarto da minha filha em um dia e ficou impecável. Levou a própria fita crepe e proteção do piso.', date: '2026-04-18' },
        { author: 'Bruna L.', rating: 5, text: 'Acabamento perfeito, sem respingos, sem cheiro forte demais. Combinou e cumpriu.', date: '2026-03-30' },
        { author: 'Rodrigo P.', rating: 4, text: 'Bom serviço. Demorou meio dia a mais do que combinou, mas o resultado compensou.', date: '2026-03-19' },
        { author: 'Cláudia A.', rating: 5, text: 'Pessoa muito atenciosa. Pintou com a casa habitada e não bagunçou nada.', date: '2026-03-04' },
        { author: 'Sandra M.', rating: 5, text: 'Recomendo de coração.', date: '2026-02-22' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,0,0], sun: [0,0,0] }
    },
    {
      id: 'pro-005',
      first_name: 'José E.',
      full_name: 'José Evandro S.',
      initials: 'JE',
      age: 58,
      avatar_color: 'primary',
      neighborhood: 'Santana',
      city: 'São Paulo',
      radius_km: 18,
      rating_avg: 4.6,
      rating_count: 53,
      response_minutes: 35,
      acceptance_rate: 0.81,
      brings_material: 'nao',
      has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-03-21' },
      specialties: [
        { cat: 'eletrica',   years: 30 },
        { cat: 'hidraulica', years: 12 },
        { cat: 'reparos',    years: 25 }
      ],
      bio: 'Trinta anos de profissão. Eletricista de formação, hoje atendo também hidráulica básica e pequenos reparos. Trabalho devagar, do jeito certo, sem improvisar.',
      reviews: [
        { author: 'Vânia O.', rating: 5, text: 'Seu Zé é um achado. Pessoa séria, técnica boa, conversa explicando tudo.', date: '2026-04-09' },
        { author: 'Igor M.', rating: 5, text: 'Atendeu na zona norte sem reclamar do trânsito. Trabalho minucioso.', date: '2026-03-25' },
        { author: 'Lúcia R.', rating: 4, text: 'Demorou um pouco para vir, mas quando veio resolveu de uma vez.', date: '2026-03-11' },
        { author: 'Pedro J.', rating: 4, text: 'Bom técnico. Cobra justo. Não leva material, então combinem antes.', date: '2026-02-28' },
        { author: 'Renata G.', rating: 5, text: 'Educado, paciente, profissional.', date: '2026-02-14' }
      ],
      availability: { mon: [1,1,1], tue: [1,1,1], wed: [1,1,1], thu: [1,1,1], fri: [1,1,1], sat: [1,1,0], sun: [0,0,0] }
    },
    {
      id: 'pro-006',
      first_name: 'Wesley A.',
      full_name: 'Wesley Andrade B.',
      initials: 'WA',
      age: 29,
      avatar_color: 'primary',
      neighborhood: 'Butantã',
      city: 'São Paulo',
      radius_km: 14,
      rating_avg: 4.7,
      rating_count: 21,
      response_minutes: 12,
      acceptance_rate: 0.94,
      brings_material: 'sim',
      has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-15' },
      specialties: [
        { cat: 'instalacao', years: 7 },
        { cat: 'eletrica',   years: 4 }
      ],
      bio: 'Instalo suportes de TV (qualquer tamanho), ares-condicionados split (parte civil), prateleiras pesadas e quadros. Levo bucha, parafuso e nível a laser.',
      reviews: [
        { author: 'Daniel R.', rating: 5, text: 'TV de 75 polegadas em parede de drywall. Reforço, suporte articulado, cabos escondidos. Ficou sensacional.', date: '2026-04-20' },
        { author: 'Marina S.', rating: 5, text: 'Resposta em 5 minutos no app, veio no mesmo dia. Eficiência total.', date: '2026-04-08' },
        { author: 'Rafael C.', rating: 4, text: 'Bom serviço, só achei o preço um pouquinho acima da média. Mas o trabalho compensa.', date: '2026-03-26' },
        { author: 'Juliana O.', rating: 5, text: 'Instalou três prateleiras pesadas em parede de gesso com reforço. Não soltou.', date: '2026-03-10' },
        { author: 'Bruno L.', rating: 5, text: 'Profissional jovem mas competente. Indico.', date: '2026-02-25' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,1,0], sun: [1,0,0] }
    },
    {
      id: 'pro-007',
      first_name: 'Marcia L.',
      full_name: 'Marcia Lopes V.',
      initials: 'ML',
      age: 47,
      avatar_color: 'accent',
      neighborhood: 'Lapa',
      city: 'São Paulo',
      radius_km: 12,
      rating_avg: 4.8,
      rating_count: 41,
      response_minutes: 25,
      acceptance_rate: 0.85,
      brings_material: 'sim',
      has_vehicle: false,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-05' },
      specialties: [
        { cat: 'limpeza',   years: 16 },
        { cat: 'preventiva', years: 6 }
      ],
      bio: 'Limpeza pesada, pós-obra, pós-mudança. Trabalho com material próprio profissional (não uso o que tem em casa). Atendo apartamentos até 120 m² em uma diária.',
      reviews: [
        { author: 'Cristina A.', rating: 5, text: 'Saí de uma reforma que parecia pesadelo e a Marcia entregou casa pronta para morar. Cada vidro, cada azulejo, cada esquadria.', date: '2026-04-14' },
        { author: 'Helena S.', rating: 5, text: 'Pontual, organizada, eficiente. Voltou para um detalhe que ela mesma não tinha gostado, sem cobrar.', date: '2026-04-02' },
        { author: 'Vinicius D.', rating: 5, text: 'Trabalho que a empresa de limpeza tradicional não fez bem, ela fez. Voltarei.', date: '2026-03-19' },
        { author: 'Tatiana B.', rating: 4, text: 'Boa profissional. Esqueceu de uma janela mas voltou no dia seguinte.', date: '2026-03-05' },
        { author: 'Adriana M.', rating: 5, text: 'Cuidadosa com móveis caros. Confio.', date: '2026-02-20' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [0,0,0], sun: [0,0,0] }
    },
    {
      id: 'pro-008',
      first_name: 'Sérgio K.',
      full_name: 'Sérgio Kobayashi T.',
      initials: 'SK',
      age: 41,
      avatar_color: 'primary',
      neighborhood: 'Aclimação',
      city: 'São Paulo',
      radius_km: 16,
      rating_avg: 4.5,
      rating_count: 34,
      response_minutes: 48,
      acceptance_rate: 0.74,
      brings_material: 'depende',
      has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-03-26' },
      specialties: [
        { cat: 'jardinagem', years: 11 },
        { cat: 'preventiva', years: 5 }
      ],
      bio: 'Cuido de jardins residenciais pequenos e médios. Poda, corte de grama, trato de pragas, replantio. Serviço mensal ou avulso. Levo equipamento próprio.',
      reviews: [
        { author: 'Cecília F.', rating: 5, text: 'Cuida do meu jardim há 8 meses. Pontual, caprichoso, cobra justo. Quintal nunca esteve tão arrumado.', date: '2026-04-22' },
        { author: 'Marco T.', rating: 5, text: 'Serviço bem feito. Avisa quando uma planta está doente, recomenda solução.', date: '2026-04-06' },
        { author: 'Lara P.', rating: 4, text: 'Bom mas deixou folhagem na calçada uma vez. No resto, ótimo.', date: '2026-03-23' },
        { author: 'Gabriela M.', rating: 4, text: 'Profissional sério. Demorou para responder a primeira mensagem mas depois foi rápido.', date: '2026-03-09' },
        { author: 'Antonio R.', rating: 5, text: 'Pessoa de confiança. Levo recomendando para vizinhos.', date: '2026-02-22' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,0,0], sun: [0,0,0] }
    },
    {
      id: 'pro-009',
      first_name: 'Felipe G.',
      full_name: 'Felipe Gomes A.',
      initials: 'FG',
      age: 35,
      avatar_color: 'primary',
      neighborhood: 'Ipiranga',
      city: 'São Paulo',
      radius_km: 13,
      rating_avg: 4.4,
      rating_count: 19,
      response_minutes: 55,
      acceptance_rate: 0.68,
      brings_material: 'nao',
      has_vehicle: false,
      verified: { identity: true, background: true, address: true, last_check: '2026-03-18' },
      specialties: [
        { cat: 'reparos',  years: 12 },
        { cat: 'montagem', years: 7 }
      ],
      bio: 'Faço-tudo da zona sul. Pequenos consertos: dobradiça, fechadura, gaveta emperrada, prateleira torta, ralo entupido leve. Combino preço por hora ou por serviço.',
      reviews: [
        { author: 'Eliza S.', rating: 4, text: 'Resolveu três coisas pequenas que estavam pendentes há meses em uma manhã só. Bom para esse tipo de serviço pendente.', date: '2026-04-11' },
        { author: 'Caio M.', rating: 5, text: 'Pessoa simpática, bom técnico. Resolveu uma fechadura que ninguém tinha conseguido.', date: '2026-03-24' },
        { author: 'Vera L.', rating: 4, text: 'Bom mas atrasou uma hora. Avisou só quando faltava 30 minutos.', date: '2026-03-12' },
        { author: 'Maurício A.', rating: 4, text: 'Serviço ok, sem grandes elogios mas sem reclamações.', date: '2026-02-26' },
        { author: 'Patrícia O.', rating: 5, text: 'Educado e cuidadoso. Voltaria a contratar.', date: '2026-02-08' }
      ],
      availability: { mon: [0,1,1], tue: [0,1,1], wed: [0,1,1], thu: [0,1,1], fri: [0,1,1], sat: [1,1,1], sun: [1,1,0] }
    },
    {
      id: 'pro-010',
      first_name: 'Rita N.',
      full_name: 'Rita Nakamura O.',
      initials: 'RN',
      age: 39,
      avatar_color: 'accent',
      neighborhood: 'Perdizes',
      city: 'São Paulo',
      radius_km: 9,
      rating_avg: 4.9,
      rating_count: 26,
      response_minutes: 19,
      acceptance_rate: 0.91,
      brings_material: 'sim',
      has_vehicle: false,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-11' },
      specialties: [
        { cat: 'pintura',    years: 11 },
        { cat: 'limpeza',    years: 4 }
      ],
      bio: 'Pintora especialista em ambientes com criança e pet. Tinta sem cheiro, secagem rápida, cobertura completa do mobiliário. Trabalho com a casa habitada.',
      reviews: [
        { author: 'Aline T.', rating: 5, text: 'Pintou a sala e o corredor com meus dois cachorros em casa. Cobriu tudo, deixou impecável e levou os restos.', date: '2026-04-19' },
        { author: 'Daniela G.', rating: 5, text: 'Não tem cheiro de tinta. Não sei como ela faz, mas é magia.', date: '2026-04-05' },
        { author: 'Roberto S.', rating: 5, text: 'Ambiente ficou outro. Recomendo.', date: '2026-03-22' },
        { author: 'Vanessa F.', rating: 4, text: 'Boa profissional, demorou meio dia a mais do que combinou, mas avisou.', date: '2026-03-08' },
        { author: 'Camila P.', rating: 5, text: 'Acabamento de excelência.', date: '2026-02-21' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [0,0,0], sun: [0,0,0] }
    },
    {
      id: 'pro-011',
      first_name: 'Bruno M.',
      full_name: 'Bruno Maciel P.',
      initials: 'BM',
      age: 32,
      avatar_color: 'primary',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      radius_km: 11,
      rating_avg: 4.2,
      rating_count: 14,
      response_minutes: 65,
      acceptance_rate: 0.62,
      brings_material: 'nao',
      has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-03-15' },
      specialties: [
        { cat: 'instalacao', years: 5 },
        { cat: 'reparos',    years: 6 }
      ],
      bio: 'Instalo prateleiras, suportes, varões de cortina, escada articulada. Atendimentos rápidos. Não levo material, oriento o que comprar antes.',
      reviews: [
        { author: 'Lúcia A.', rating: 5, text: 'Resolveu uma cortina romana em 30 minutos.', date: '2026-04-08' },
        { author: 'Mariana V.', rating: 4, text: 'Bom serviço, demorou para confirmar agenda.', date: '2026-03-28' },
        { author: 'Eduardo R.', rating: 4, text: 'Trabalho ok. Cobrou um pouco mais do que esperava por ser furo simples.', date: '2026-03-14' },
        { author: 'Sílvia M.', rating: 4, text: 'Educado. Eficiente. Ainda ajustaria comunicação.', date: '2026-03-02' },
        { author: 'Júlio C.', rating: 4, text: 'Atende rápido quando confirma. Confirmar é a parte difícil.', date: '2026-02-15' }
      ],
      availability: { mon: [0,1,1], tue: [0,1,1], wed: [0,1,1], thu: [0,1,1], fri: [0,1,1], sat: [1,1,0], sun: [0,0,0] }
    },
    {
      id: 'pro-012',
      first_name: 'Antônio V.',
      full_name: 'Antônio Vieira C.',
      initials: 'AV',
      age: 62,
      avatar_color: 'primary',
      neighborhood: 'Vila Mariana',
      city: 'São Paulo',
      radius_km: 20,
      rating_avg: 4.9,
      rating_count: 68,
      response_minutes: 31,
      acceptance_rate: 0.89,
      brings_material: 'depende',
      has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-09' },
      specialties: [
        { cat: 'marcenaria', years: 35 },
        { cat: 'reparos',    years: 28 }
      ],
      bio: 'Marceneiro de oficina há 35 anos. Conserto de móvel antigo, restauração, dobradiça, gaveta, porta empenada. Trabalho artesanal, prazo combinado, orçamento por escrito.',
      reviews: [
        { author: 'Marília B.', rating: 5, text: 'Restaurou uma cômoda da minha avó que eu já tinha desistido. Voltou nova. Trabalho de outro nível.', date: '2026-04-21' },
        { author: 'Otávio L.', rating: 5, text: 'Pessoa rara. Profissional de oficina antiga, de fazer com calma e bem feito.', date: '2026-04-04' },
        { author: 'Beatriz N.', rating: 5, text: 'Consertou três cadeiras e duas portas de armário. Trabalho impecável.', date: '2026-03-21' },
        { author: 'Suzana P.', rating: 5, text: 'Vale cada centavo. Não é o mais barato, mas é o melhor.', date: '2026-03-07' },
        { author: 'Roberto G.', rating: 5, text: 'Trabalho de sapateiro, no melhor sentido. Indico sempre.', date: '2026-02-19' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,0,0], sun: [0,0,0] }
    }
  ];

  // ------------------------------------------------------------------
  // Demandas (10) — datas relativas a 2026-04-25
  // ------------------------------------------------------------------
  const DEMANDS = [
    {
      id: 'dem-001',
      client_id: 'cli-001',
      cat: 'hidraulica',
      title: 'Torneira da pia da cozinha pingando há 3 dias',
      description: 'Comecei notando uma gotinha de manhã, agora está pingando contínuo. Já apertei a base e não resolveu. Não sei se é a vedação ou a torneira inteira. Pia branca, granito, torneira monocomando que veio com o apartamento (uns 5 anos).',
      neighborhood: 'Pinheiros',
      address_summary: 'Rua Cardeal Arcoverde — Pinheiros',
      urgency: 'ate_3_dias',
      urgency_label: 'Até 3 dias',
      time_pref: 'tarde',
      budget_min: 100, budget_max: 280,
      photos: 2,
      published_at_iso: '2026-04-25T09:42:00',
      published_minutes_ago: 12,
      status: 'proposals',
      proposal_count: 4,
      featured_for_demo: true
    },
    {
      id: 'dem-002',
      client_id: 'cli-001',
      cat: 'instalacao',
      title: 'Instalar 2 prateleiras na sala (madeira já comprada)',
      description: 'Tenho duas prateleiras retas (80 x 25 cm) já compradas, com mãos francesas inclusas. Parede de alvenaria, sem fiação no trecho. Preciso instaladas em altura específica para alinhar com TV.',
      neighborhood: 'Pinheiros',
      address_summary: 'Rua Cardeal Arcoverde — Pinheiros',
      urgency: 'ate_7_dias',
      urgency_label: 'Até 7 dias',
      time_pref: 'qualquer',
      budget_min: 80, budget_max: 200,
      photos: 1,
      published_at_iso: '2026-04-23T15:20:00',
      published_minutes_ago: 60 * 24 * 2 + 130,
      status: 'hired',
      proposal_count: 6
    },
    {
      id: 'dem-003',
      client_id: 'cli-001',
      cat: 'eletrica',
      title: 'Lâmpada do banheiro queimou (pé direito alto)',
      description: 'Banheiro tem teto de 3,80 m. Não consigo trocar com escada que tenho em casa. Lâmpada está em ponto fixo, suspeito que precise trocar o soquete também (a anterior queimou em 2 meses).',
      neighborhood: 'Vila Mariana',
      address_summary: 'Rua Domingos de Morais — Vila Mariana',
      urgency: 'hoje',
      urgency_label: 'Hoje',
      time_pref: 'noite',
      budget_min: 60, budget_max: 150,
      photos: 0,
      published_at_iso: '2026-04-25T08:10:00',
      published_minutes_ago: 165,
      status: 'proposals',
      proposal_count: 3
    },
    {
      id: 'dem-004',
      cat: 'instalacao',
      title: 'Suporte de TV de 55 polegadas para fixar na parede',
      description: 'TV Samsung 55" comprada ontem. Parede de drywall com perfil estrutural. Suporte fixo simples, com rabichos de cabo já comprados.',
      neighborhood: 'Tatuapé',
      address_summary: 'Rua Tuiuti — Tatuapé',
      urgency: 'ate_3_dias',
      urgency_label: 'Até 3 dias',
      time_pref: 'tarde',
      budget_min: 120, budget_max: 250,
      photos: 1,
      published_at_iso: '2026-04-25T07:30:00',
      published_minutes_ago: 205,
      status: 'open',
      proposal_count: 2
    },
    {
      id: 'dem-005',
      cat: 'pintura',
      title: 'Pintura de quarto pequeno (12 m²) — paredes em bom estado',
      description: 'Quarto da minha filha. Quero mudar de bege para verde-claro. Tinta lavável já comprada (2 latas de 18L Coral). Sem necessidade de massa, paredes lisas. Móveis serão tirados antes.',
      neighborhood: 'Santana',
      address_summary: 'Rua Voluntários da Pátria — Santana',
      urgency: 'sem_pressa',
      urgency_label: 'Sem pressa',
      time_pref: 'qualquer',
      budget_min: 280, budget_max: 600,
      photos: 2,
      published_at_iso: '2026-04-24T11:45:00',
      published_minutes_ago: 60 * 18 + 12,
      status: 'open',
      proposal_count: 5
    },
    {
      id: 'dem-006',
      cat: 'hidraulica',
      title: 'Vazamento em torneira do tanque da área de serviço',
      description: 'Torneira do tanque pinga forte mesmo fechada. Já tentei trocar o vedante, não resolveu. Preciso provavelmente trocar a torneira inteira. Comprei uma nova, está aqui.',
      neighborhood: 'Butantã',
      address_summary: 'Rua Itapaiúna — Butantã',
      urgency: 'ate_3_dias',
      urgency_label: 'Até 3 dias',
      time_pref: 'manha',
      budget_min: 80, budget_max: 180,
      photos: 1,
      published_at_iso: '2026-04-25T06:15:00',
      published_minutes_ago: 280,
      status: 'open',
      proposal_count: 3
    },
    {
      id: 'dem-007',
      cat: 'montagem',
      title: 'Montagem de guarda-roupa Madesa 6 portas',
      description: 'Comprei na sexta, chegou hoje. Caixas grandes ainda fechadas. Quarto está livre. Preciso montar e ajustar nivelamento (piso inclinado uns 2 cm).',
      neighborhood: 'Lapa',
      address_summary: 'Rua Catão — Lapa',
      urgency: 'ate_7_dias',
      urgency_label: 'Até 7 dias',
      time_pref: 'qualquer',
      budget_min: 250, budget_max: 450,
      photos: 0,
      published_at_iso: '2026-04-24T17:30:00',
      published_minutes_ago: 60 * 12 + 27,
      status: 'open',
      proposal_count: 4
    },
    {
      id: 'dem-008',
      cat: 'jardinagem',
      title: 'Cortar grama do quintal (cerca de 20 m²)',
      description: 'Quintal pequeno, grama esmeralda. Última roçada foi há 6 semanas, está alta mas nada extremo. Tenho pontos de água. Só preciso cortar e descartar.',
      neighborhood: 'Aclimação',
      address_summary: 'Rua Muniz de Souza — Aclimação',
      urgency: 'ate_7_dias',
      urgency_label: 'Até 7 dias',
      time_pref: 'manha',
      budget_min: 120, budget_max: 220,
      photos: 1,
      published_at_iso: '2026-04-24T09:15:00',
      published_minutes_ago: 60 * 21,
      status: 'open',
      proposal_count: 2
    },
    {
      id: 'dem-009',
      cat: 'eletrica',
      title: 'Furadeira não pega — preciso fazer 8 furos para prateleiras',
      description: 'Tenho a furadeira mas a bateria não está mais segurando carga. Preciso de alguém com furadeira boa para fazer 8 furos em parede de alvenaria, tudo em bucha de 8 mm.',
      neighborhood: 'Ipiranga',
      address_summary: 'Rua Bom Pastor — Ipiranga',
      urgency: 'ate_3_dias',
      urgency_label: 'Até 3 dias',
      time_pref: 'tarde',
      budget_min: 80, budget_max: 160,
      photos: 0,
      published_at_iso: '2026-04-25T10:05:00',
      published_minutes_ago: 5,
      status: 'open',
      proposal_count: 3
    },
    {
      id: 'dem-010',
      cat: 'reparos',
      title: 'Conserto de fechadura emperrada na porta da frente',
      description: 'Chave entra mas não gira completo. Já passei grafite, melhorou um dia, voltou. Porta principal do apartamento, urgente porque amanhã vou viajar.',
      neighborhood: 'Vila Madalena',
      address_summary: 'Rua Aspicuelta — Vila Madalena',
      urgency: 'hoje',
      urgency_label: 'Hoje',
      time_pref: 'qualquer',
      budget_min: 100, budget_max: 250,
      photos: 0,
      published_at_iso: '2026-04-25T11:55:00',
      published_minutes_ago: 1,
      status: 'open',
      proposal_count: 4
    }
  ];

  // ------------------------------------------------------------------
  // Propostas (alvo: 40+, com 4 obrigatórias na demanda destaque)
  // ------------------------------------------------------------------
  const PROPOSALS = [
    // dem-001 (destaque) — 4 propostas variadas
    {
      id: 'prop-001-a', demand_id: 'dem-001', provider_id: 'pro-002',
      value: 180, time_estimate: '1 hora',
      availability_text: 'Posso passar hoje à tarde, entre 14h e 17h',
      message: 'Pelo que descreveu, vou levar reparo de vedação e uma torneira nova compatível como reserva. Se a vedação resolver, cobro só a hora. Se precisar trocar, entra o material no valor combinado.',
      sent_minutes_ago: 8, status: 'pending'
    },
    {
      id: 'prop-001-b', demand_id: 'dem-001', provider_id: 'pro-005',
      value: 140, time_estimate: '1h30',
      availability_text: 'Hoje a partir das 18h ou amanhã 9h',
      message: 'Posso atender hoje à noite. Não levo material — me passa o modelo da torneira que oriento o que comprar antes para não termos que voltar à loja.',
      sent_minutes_ago: 6, status: 'pending'
    },
    {
      id: 'prop-001-c', demand_id: 'dem-001', provider_id: 'pro-009',
      value: 95, time_estimate: '45 minutos',
      availability_text: 'Amanhã à tarde',
      message: 'Atendo na sua região. Provavelmente é a vedação interna, normalmente resolve sem trocar a peça.',
      sent_minutes_ago: 4, status: 'pending'
    },
    {
      id: 'prop-001-d', demand_id: 'dem-001', provider_id: 'pro-001',
      value: 220, time_estimate: '1 hora',
      availability_text: 'Hoje 16h ou amanhã 10h',
      message: 'Trabalho com hidráulica básica também. Levo torneira de reposição equivalente à sua (Docol/Deca). Garantia de 30 dias do serviço.',
      sent_minutes_ago: 2, status: 'pending'
    },

    // dem-002 — já contratada (6 propostas, mostra histórico)
    { id: 'prop-002-a', demand_id: 'dem-002', provider_id: 'pro-006', value: 160, time_estimate: '1h30', availability_text: 'Sábado de manhã', message: 'Levo nível a laser e bucha adequada. Furação em alvenaria, sem complicação.', sent_minutes_ago: 60*48, status: 'accepted' },
    { id: 'prop-002-b', demand_id: 'dem-002', provider_id: 'pro-003', value: 130, time_estimate: '1h', availability_text: 'Quinta à tarde', message: 'Faço com cuidado, prateleira pesada exige reforço.', sent_minutes_ago: 60*47, status: 'rejected' },
    { id: 'prop-002-c', demand_id: 'dem-002', provider_id: 'pro-011', value: 110, time_estimate: '45 min', availability_text: 'Quando combinarmos', message: 'Faço prateleira simples e dupla. Levo só a furadeira, material por sua conta.', sent_minutes_ago: 60*46, status: 'rejected' },
    { id: 'prop-002-d', demand_id: 'dem-002', provider_id: 'pro-009', value: 90, time_estimate: '1h', availability_text: 'Sábado ou domingo', message: 'Atendo aos sábados. Tenho experiência em prateleira com mão francesa.', sent_minutes_ago: 60*45, status: 'rejected' },
    { id: 'prop-002-e', demand_id: 'dem-002', provider_id: 'pro-005', value: 170, time_estimate: '1h30', availability_text: 'Quarta à tarde', message: 'Faço com nível profissional, alinhamento exato.', sent_minutes_ago: 60*44, status: 'rejected' },
    { id: 'prop-002-f', demand_id: 'dem-002', provider_id: 'pro-001', value: 190, time_estimate: '1h', availability_text: 'Quinta de manhã', message: 'Posso instalar e revisar pontos elétricos do mesmo cômodo se quiser.', sent_minutes_ago: 60*43, status: 'rejected' },

    // dem-003 — 3 propostas
    { id: 'prop-003-a', demand_id: 'dem-003', provider_id: 'pro-001', value: 110, time_estimate: '40 min', availability_text: 'Hoje à noite, 19h-21h', message: 'Posso passar hoje à noite. Levo lâmpada led e soquete novo se precisar trocar.', sent_minutes_ago: 80, status: 'pending' },
    { id: 'prop-003-b', demand_id: 'dem-003', provider_id: 'pro-005', value: 85,  time_estimate: '30 min', availability_text: 'Amanhã 9h', message: 'Não atendo à noite, mas posso passar cedo amanhã.', sent_minutes_ago: 65, status: 'pending' },
    { id: 'prop-003-c', demand_id: 'dem-003', provider_id: 'pro-006', value: 130, time_estimate: '30 min', availability_text: 'Hoje 20h', message: 'Tenho escada para 4 m. Resolvo na noite.', sent_minutes_ago: 30, status: 'pending' },

    // dem-004 — 2
    { id: 'prop-004-a', demand_id: 'dem-004', provider_id: 'pro-006', value: 180, time_estimate: '1h', availability_text: 'Amanhã à tarde', message: 'TV grande em drywall pede reforço. Levo barra de fixação.', sent_minutes_ago: 90, status: 'pending' },
    { id: 'prop-004-b', demand_id: 'dem-004', provider_id: 'pro-011', value: 150, time_estimate: '1h', availability_text: 'Domingo', message: 'Atendo Tatuapé. Levo nível e parafusos compatíveis.', sent_minutes_ago: 70, status: 'pending' },

    // dem-005 — 5
    { id: 'prop-005-a', demand_id: 'dem-005', provider_id: 'pro-004', value: 380, time_estimate: '1 dia', availability_text: 'Próxima semana, qualquer dia', message: 'Quarto pequeno, 1 dia inteiro. Cubro tudo, levo fita crepe e proteção do piso. Tinta lavável seca rápido.', sent_minutes_ago: 60*8, status: 'pending' },
    { id: 'prop-005-b', demand_id: 'dem-005', provider_id: 'pro-010', value: 420, time_estimate: '1 dia', availability_text: 'Quinta ou sexta', message: 'Trabalho com a casa habitada, sem cheiro forte. Cubro mobiliário restante. Acabamento fino.', sent_minutes_ago: 60*6, status: 'pending' },
    { id: 'prop-005-c', demand_id: 'dem-005', provider_id: 'pro-007', value: 350, time_estimate: '1 dia', availability_text: 'Segunda', message: 'Limpeza pós-pintura inclusa.', sent_minutes_ago: 60*5, status: 'pending' },
    { id: 'prop-005-d', demand_id: 'dem-005', provider_id: 'pro-005', value: 320, time_estimate: '1 dia + retoque', availability_text: 'Esta semana', message: 'Posso fazer com retoque grátis em até 30 dias.', sent_minutes_ago: 60*4, status: 'pending' },
    { id: 'prop-005-e', demand_id: 'dem-005', provider_id: 'pro-009', value: 280, time_estimate: '1,5 dias', availability_text: 'Sábado', message: 'Trabalho cuidadoso, cobro hora.', sent_minutes_ago: 60*2, status: 'pending' },

    // dem-006 — 3
    { id: 'prop-006-a', demand_id: 'dem-006', provider_id: 'pro-002', value: 110, time_estimate: '40 min', availability_text: 'Amanhã 9h', message: 'Bom que já comprou a torneira. Levo conexão extra caso a antiga tenha danificado o ladrão.', sent_minutes_ago: 200, status: 'pending' },
    { id: 'prop-006-b', demand_id: 'dem-006', provider_id: 'pro-005', value: 95, time_estimate: '30 min', availability_text: 'Amanhã 8h', message: 'Trabalho rápido nesse tipo de troca.', sent_minutes_ago: 180, status: 'pending' },
    { id: 'prop-006-c', demand_id: 'dem-006', provider_id: 'pro-009', value: 130, time_estimate: '40 min', availability_text: 'Hoje à tarde', message: 'Atendo Butantã hoje mesmo se topar.', sent_minutes_ago: 120, status: 'pending' },

    // dem-007 — 4
    { id: 'prop-007-a', demand_id: 'dem-007', provider_id: 'pro-003', value: 320, time_estimate: '4-5 horas', availability_text: 'Sábado 9h', message: 'Madesa 6 portas eu faço com olhos fechados. Levo nível e calços. Piso inclinado resolvido com pé regulador.', sent_minutes_ago: 60*8, status: 'pending' },
    { id: 'prop-007-b', demand_id: 'dem-007', provider_id: 'pro-012', value: 380, time_estimate: '5 horas', availability_text: 'Próxima quarta', message: 'Trabalho cuidadoso, sem riscos. Reviso fechaduras e dobradiças no fim.', sent_minutes_ago: 60*6, status: 'pending' },
    { id: 'prop-007-c', demand_id: 'dem-007', provider_id: 'pro-009', value: 280, time_estimate: '5-6 horas', availability_text: 'Domingo', message: 'Faço aos finais de semana.', sent_minutes_ago: 60*4, status: 'pending' },
    { id: 'prop-007-d', demand_id: 'dem-007', provider_id: 'pro-011', value: 260, time_estimate: '5 horas', availability_text: 'Sábado à tarde', message: 'Atendo Lapa. Combine antes a logística do quarto.', sent_minutes_ago: 60*2, status: 'pending' },

    // dem-008 — 2
    { id: 'prop-008-a', demand_id: 'dem-008', provider_id: 'pro-008', value: 150, time_estimate: '1 hora', availability_text: 'Amanhã 8h', message: 'Levo cortador profissional, descarte combinado. Quintal pequeno, atendo rápido.', sent_minutes_ago: 60*15, status: 'pending' },
    { id: 'prop-008-b', demand_id: 'dem-008', provider_id: 'pro-005', value: 180, time_estimate: '1h30', availability_text: 'Sexta de manhã', message: 'Faço corte e adubação leve no mesmo dia se quiser.', sent_minutes_ago: 60*8, status: 'pending' },

    // dem-009 — 3
    { id: 'prop-009-a', demand_id: 'dem-009', provider_id: 'pro-006', value: 120, time_estimate: '40 min', availability_text: 'Hoje à tarde', message: 'Furadeira de impacto Bosch. 8 furos em alvenaria são rápidos. Levo bucha de 8 mm.', sent_minutes_ago: 4, status: 'pending' },
    { id: 'prop-009-b', demand_id: 'dem-009', provider_id: 'pro-001', value: 95, time_estimate: '30 min', availability_text: 'Hoje 15h-17h', message: 'Atendo Ipiranga hoje mesmo. Levo furadeira SDS, broca widia e buchas de 8 mm. Sem volta à loja.', sent_minutes_ago: 12, status: 'pending' },
    { id: 'prop-009-c', demand_id: 'dem-009', provider_id: 'pro-005', value: 140, time_estimate: '45 min', availability_text: 'Amanhã pela manhã', message: 'Posso passar amanhã se topar. Trago tudo que precisa, inclusive nivelamento dos furos.', sent_minutes_ago: 22, status: 'pending' },

    // dem-010 — 4 (urgente, alta atividade)
    { id: 'prop-010-a', demand_id: 'dem-010', provider_id: 'pro-006', value: 180, time_estimate: '40 min', availability_text: 'Posso ir agora, em 30 min', message: 'Atendo Vila Madalena, posso sair agora. Levo serralheria portátil, troca de cilindro se precisar.', sent_minutes_ago: 1, status: 'pending' },
    { id: 'prop-010-b', demand_id: 'dem-010', provider_id: 'pro-001', value: 220, time_estimate: '1 hora', availability_text: 'Em 1 hora', message: 'Estou aqui na região. Cilindro Yale e Stam de reserva no carro. Garantia de 30 dias.', sent_minutes_ago: 1, status: 'pending' },
    { id: 'prop-010-c', demand_id: 'dem-010', provider_id: 'pro-011', value: 150, time_estimate: '30 min', availability_text: 'Amanhã 7h antes da viagem', message: 'Posso passar amanhã bem cedinho, antes da sua viagem. Conserto rápido.', sent_minutes_ago: 0.5, status: 'pending' },
    { id: 'prop-010-d', demand_id: 'dem-010', provider_id: 'pro-009', value: 130, time_estimate: '40 min', availability_text: 'Hoje à noite', message: 'Atendo até as 22h hoje. Cilindro novo + lubrificação completa.', sent_minutes_ago: 0.2, status: 'pending' }
  ];

  // ------------------------------------------------------------------
  // Histórico do cliente demo (concluídos)
  // ------------------------------------------------------------------
  const CLIENT_HISTORY = [
    { id: 'h1', date: '2026-03-18', cat: 'eletrica',  provider_id: 'pro-001', title: 'Troca de tomada na sala', value: 130, rating_given: 5 },
    { id: 'h2', date: '2026-02-04', cat: 'montagem',  provider_id: 'pro-003', title: 'Montagem de estante Tok&Stok', value: 240, rating_given: 5 },
    { id: 'h3', date: '2025-12-10', cat: 'limpeza',   provider_id: 'pro-007', title: 'Limpeza pós-mudança',     value: 380, rating_given: 4 }
  ];

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  function findById(arr, id) { return arr.find((x) => x.id === id) || null; }
  function findCategory(id)  { return findById(CATEGORIES, id); }
  function findProvider(id)  { return findById(PROVIDERS, id); }
  function findDemand(id)    { return findById(DEMANDS, id); }
  function proposalsForDemand(id) { return PROPOSALS.filter((p) => p.demand_id === id); }
  function demandsForProvider(id) {
    // demands the provider could see in feed: matches a category they cover
    const pro = findProvider(id);
    if (!pro) return DEMANDS;
    const cats = pro.specialties.map((s) => s.cat);
    // For demo: prioritize matches, fall back to all if too few
    const matched = DEMANDS.filter((d) => cats.indexOf(d.cat) !== -1);
    return matched.length >= 4 ? matched : DEMANDS;
  }
  function proposalsByProvider(id) { return PROPOSALS.filter((p) => p.provider_id === id); }

  function formatRelativeMinutes(min) {
    if (min < 1) return 'agora mesmo';
    if (min < 60) return `há ${Math.round(min)} min`;
    const h = Math.round(min / 60);
    if (h < 24) return `há ${h} ${h === 1 ? 'hora' : 'horas'}`;
    const d = Math.round(h / 24);
    return `há ${d} ${d === 1 ? 'dia' : 'dias'}`;
  }
  function formatBRL(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  }
  function formatRange(min, max) {
    if (!min && !max) return 'Aberto';
    if (min && max) return `${formatBRL(min)} – ${formatBRL(max)}`;
    return formatBRL(min || max);
  }
  function distanceFromClient(provider) {
    // mock by neighborhood: Pinheiros is the demo client's home
    const map = {
      'Pinheiros': 0.4, 'Vila Madalena': 1.6, 'Perdizes': 3.2,
      'Butantã': 4.1, 'Lapa': 5.8, 'Vila Mariana': 6.4,
      'Tatuapé': 12.2, 'Santana': 9.7, 'Aclimação': 7.3, 'Ipiranga': 8.9
    };
    return map[provider.neighborhood] != null ? map[provider.neighborhood] : 7.0;
  }

  global.LarCareData = {
    CATEGORIES, PROVIDERS, DEMANDS, PROPOSALS, DEMO_CLIENT, CLIENT_HISTORY,
    findCategory, findProvider, findDemand,
    proposalsForDemand, proposalsByProvider, demandsForProvider,
    formatRelativeMinutes, formatBRL, formatRange, distanceFromClient
  };
})(window);
