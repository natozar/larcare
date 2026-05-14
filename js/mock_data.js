/* =========================================================================
   LarCare — mock dataset (Ribeirão Preto-SP)
   Taxonomia em dois níveis: GROUPS (4) → CATEGORIES (18).
   Tudo aqui é fictício mas plausível para a praça.
   ========================================================================= */
(function (global) {
  'use strict';

  // ------------------------------------------------------------------
  // Grupos de categorias (4) — usado pra agrupar visualmente em telas
  // ------------------------------------------------------------------
  const GROUPS = [
    { id: 'reparos',  name: 'Reparos',           emoji: '🔧', ordem: 1 },
    { id: 'limpeza',  name: 'Limpeza',           emoji: '🫧', ordem: 2 },
    { id: 'casa',     name: 'Cuidado da casa',   emoji: '🏡', ordem: 3 },
    { id: 'familia',  name: 'Família e pet',     emoji: '🐾', ordem: 4 }
  ];

  // ------------------------------------------------------------------
  // Categorias (18 — taxonomia expandida cobrindo cuidado cotidiano)
  // ------------------------------------------------------------------
  const CATEGORIES = [
    // Reparos (7)
    { id: 'eletrica',   grupo: 'reparos', name: 'Elétrica',              icon: 'bolt',    emoji: '💡', blurb: 'Tomadas, lâmpadas, disjuntores' },
    { id: 'hidraulica', grupo: 'reparos', name: 'Hidráulica',            icon: 'drop',    emoji: '💧', blurb: 'Vazamentos, torneiras, descargas' },
    { id: 'ar',         grupo: 'reparos', name: 'Ar-condicionado',       icon: 'tv',      emoji: '❄️', blurb: 'Instalação, limpeza, recarga' },
    { id: 'pintura',    grupo: 'reparos', name: 'Pintura',               icon: 'brush',   emoji: '🎨', blurb: 'Cômodos, retoques, paredes' },
    { id: 'chaveiro',   grupo: 'reparos', name: 'Chaveiro',              icon: 'lock',    emoji: '🔑', blurb: 'Fechaduras, cópias, urgência' },
    { id: 'gas',        grupo: 'reparos', name: 'Gás',                   icon: 'flame',   emoji: '🔥', blurb: 'Botijão, registro, instalação' },
    { id: 'faz_tudo',   grupo: 'reparos', name: 'Marido de aluguel',     icon: 'wrench',  emoji: '🛠️', blurb: 'Pequenos consertos diversos' },
    // Limpeza (4)
    { id: 'diarista',   grupo: 'limpeza', name: 'Diarista',              icon: 'sparkle', emoji: '🧹', blurb: 'Faxina semanal, casa habitada' },
    { id: 'faxina',     grupo: 'limpeza', name: 'Faxina pesada',         icon: 'sparkle', emoji: '✨', blurb: 'Limpeza profunda de toda a casa' },
    { id: 'estofados',  grupo: 'limpeza', name: 'Limpeza de estofados',  icon: 'sparkle', emoji: '🛋️', blurb: 'Sofás, poltronas, colchões' },
    { id: 'pos_obra',   grupo: 'limpeza', name: 'Limpeza pós-obra',      icon: 'sparkle', emoji: '🧽', blurb: 'Vidros, azulejos, esquadria' },
    // Cuidado da casa (4)
    { id: 'jardinagem', grupo: 'casa',    name: 'Jardinagem',            icon: 'leaf',    emoji: '🌿', blurb: 'Poda, grama, plantas' },
    { id: 'dedetizacao',grupo: 'casa',    name: 'Dedetização',           icon: 'shield',  emoji: '🪲', blurb: 'Cupim, barata, formiga, rato' },
    { id: 'caixa_dagua',grupo: 'casa',    name: "Limpeza de caixa d'água",icon: 'drop',   emoji: '🚰', blurb: 'Limpeza semestral certificada' },
    { id: 'montagem',   grupo: 'casa',    name: 'Montagem de móveis',    icon: 'box',     emoji: '📦', blurb: 'Guarda-roupa, estante, mesa' },
    // Família e pet (3)
    { id: 'pet_sitter', grupo: 'familia', name: 'Pet sitter / passeio',  icon: 'leaf',    emoji: '🐕', blurb: 'Passeio, alimentação, cuidado' },
    { id: 'idoso',      grupo: 'familia', name: 'Cuidado de idoso',      icon: 'shield',  emoji: '🤝', blurb: 'Companhia, banho, medicação' },
    { id: 'baba',       grupo: 'familia', name: 'Babá eventual',         icon: 'user',    emoji: '👶', blurb: 'Cuidado infantil sob demanda' }
  ];

  // ------------------------------------------------------------------
  // Geo helpers — coordenadas reais por bairro de Ribeirão Preto-SP
  // ------------------------------------------------------------------
  const NEIGHBORHOODS = {
    'Centro':              { lat: -21.1763, lng: -47.8208, cep: '14010-100' },
    'Jardim Botânico':     { lat: -21.2192, lng: -47.8278, cep: '14021-630' },
    'Iguatemi':            { lat: -21.2306, lng: -47.8061, cep: '14091-220' },
    'Ribeirânia':          { lat: -21.1639, lng: -47.8067, cep: '14096-360' },
    'Castelo':             { lat: -21.1822, lng: -47.8514, cep: '14040-180' },
    'Sumarezinho':         { lat: -21.1500, lng: -47.8389, cep: '14055-140' },
    'Vila Tibério':        { lat: -21.1606, lng: -47.8147, cep: '14050-090' },
    'Jardim Califórnia':   { lat: -21.2122, lng: -47.8506, cep: '14026-450' },
    'Alto da Boa Vista':   { lat: -21.1394, lng: -47.8181, cep: '14025-330' },
    'Nova Aliança':        { lat: -21.2389, lng: -47.7969, cep: '14026-740' },
    'Ipiranga':            { lat: -21.1856, lng: -47.8400, cep: '14080-720' },
    'Jardim Paulista':     { lat: -21.1922, lng: -47.8208, cep: '14090-180' }
  };

  const DIST_FROM_CLIENT = {
    'Jardim Califórnia':   0.4, 'Nova Aliança':        2.1,
    'Jardim Botânico':     1.7, 'Iguatemi':            3.4,
    'Castelo':             3.8, 'Centro':              4.6,
    'Jardim Paulista':     3.2, 'Ipiranga':            3.0,
    'Vila Tibério':        5.1, 'Sumarezinho':         7.4,
    'Alto da Boa Vista':   8.2, 'Ribeirânia':          5.9
  };

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
    phone: '(16) 9 9421-3308',
    city: 'Ribeirão Preto',
    state: 'SP',
    neighborhood: 'Jardim Califórnia',
    address: 'Rua Tomé de Souza, 240 — Apto 32',
    cep: '14026-450',
    completed_services: 3,
    member_since: '2025-09-12'
  };

  // ------------------------------------------------------------------
  // Prestadores (15 — 12 originais + 3 novos cobrindo as categorias novas)
  // ------------------------------------------------------------------
  const PROVIDERS = [
    {
      id: 'pro-001', first_name: 'Carlos H.', full_name: 'Carlos Henrique S.', initials: 'CH',
      age: 38, avatar_color: 'primary', neighborhood: 'Centro', city: 'Ribeirão Preto',
      radius_km: 12, rating_avg: 4.8, rating_count: 32, response_minutes: 28,
      acceptance_rate: 0.86, brings_material: 'depende', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-02' },
      specialties: [{ cat: 'eletrica', years: 15 }, { cat: 'faz_tudo', years: 9 }],
      bio: 'Eletricista há 15 anos atendendo Ribeirão Preto. Levo ferramenta completa, oriento sobre material antes de comprar e deixo tudo limpo no fim. Formado pelo SENAI e com NR-10 atualizada.',
      reviews: [
        { author: 'Beatriz M.', rating: 5, text: 'Carlos chegou no horário, identificou o problema do disjuntor em 10 minutos e ainda revisou os outros pontos da casa.', date: '2026-03-29' },
        { author: 'Renata C.', rating: 5, text: 'Trocou três pontos de luz e instalou um pendente. Trabalho limpo e preço justo.', date: '2026-03-12' },
        { author: 'Felipe S.', rating: 4, text: 'Excelente serviço, só atrasou uns 20 minutos por trânsito. Avisou antes.', date: '2026-02-20' },
        { author: 'Ana Lúcia O.', rating: 5, text: 'Resolveu um curto na cozinha que outro eletricista não tinha conseguido.', date: '2026-02-04' },
        { author: 'Marcos R.', rating: 5, text: 'Muito profissional, explicou tudo. Recomendo.', date: '2026-01-22' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,1], fri: [1,1,1], sat: [1,0,0], sun: [0,0,0] }
    },
    {
      id: 'pro-002', first_name: 'Roberto F.', full_name: 'Roberto Faria L.', initials: 'RF',
      age: 51, avatar_color: 'primary', neighborhood: 'Jardim Botânico', city: 'Ribeirão Preto',
      radius_km: 10, rating_avg: 4.9, rating_count: 47, response_minutes: 18,
      acceptance_rate: 0.92, brings_material: 'sim', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-08' },
      specialties: [{ cat: 'hidraulica', years: 22 }, { cat: 'faz_tudo', years: 18 }],
      bio: 'Vinte e dois anos de hidráulica residencial em Ribeirão. Vazamento, troca de torneira, instalação de filtro, reparo em descarga, desentupimento leve.',
      reviews: [
        { author: 'Patrícia D.', rating: 5, text: 'Cheguei do trabalho com o banheiro alagado. Roberto veio em duas horas, achou o vazamento dentro da parede e arrumou no mesmo dia.', date: '2026-04-10' },
        { author: 'Gustavo H.', rating: 5, text: 'Trocou duas torneiras e instalou filtro. Cobrou exatamente o combinado.', date: '2026-03-28' },
        { author: 'Sônia M.', rating: 5, text: 'Educadíssimo, deixou tudo limpo. Vou contratar de novo.', date: '2026-03-15' },
        { author: 'Camila R.', rating: 4, text: 'Resolveu o problema mas demorou um pouco pra responder no início. Trabalho impecável.', date: '2026-02-26' },
        { author: 'Diego A.', rating: 5, text: 'Profissional sério, sem enrolação. Indico de olhos fechados.', date: '2026-02-10' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,1,0], sun: [0,0,0] }
    },
    {
      id: 'pro-003', first_name: 'André P.', full_name: 'André Pacheco N.', initials: 'AP',
      age: 33, avatar_color: 'primary', neighborhood: 'Iguatemi', city: 'Ribeirão Preto',
      radius_km: 15, rating_avg: 4.7, rating_count: 28, response_minutes: 42,
      acceptance_rate: 0.78, brings_material: 'depende', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-03-30' },
      specialties: [{ cat: 'montagem', years: 9 }, { cat: 'faz_tudo', years: 6 }],
      bio: 'Especialista em montagem de móveis planejados e prontos. Madesa, Tok&Stok, IKEA, Etna, sob medida. Trabalho com manual ou sem.',
      reviews: [
        { author: 'Letícia F.', rating: 5, text: 'Montou um guarda-roupa Madesa de 6 portas. Precisou refazer uma parte e nem cobrou diferença.', date: '2026-04-15' },
        { author: 'Henrique B.', rating: 5, text: 'Montou estante, mesa de jantar e cabeceira em uma tarde só.', date: '2026-04-01' },
        { author: 'Tatiana M.', rating: 4, text: 'Bom serviço, mas teve uma peça riscada que ele não percebeu. Fora isso, ótimo.', date: '2026-03-22' },
        { author: 'João Vitor L.', rating: 5, text: 'Rápido, organizado, levou os parafusos extras necessários.', date: '2026-03-08' },
        { author: 'Elaine S.', rating: 5, text: 'Recomendo. Pessoa de confiança.', date: '2026-02-19' }
      ],
      availability: { mon: [0,1,1], tue: [0,1,1], wed: [0,1,1], thu: [0,1,1], fri: [0,1,1], sat: [1,1,0], sun: [0,0,0] }
    },
    {
      id: 'pro-004', first_name: 'Luciana T.', full_name: 'Luciana Teixeira M.', initials: 'LT',
      age: 44, avatar_color: 'accent', neighborhood: 'Ribeirânia', city: 'Ribeirão Preto',
      radius_km: 10, rating_avg: 4.9, rating_count: 38, response_minutes: 22,
      acceptance_rate: 0.88, brings_material: 'depende', has_vehicle: false,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-12' },
      specialties: [{ cat: 'pintura', years: 14 }, { cat: 'faz_tudo', years: 8 }],
      bio: 'Pintora há 14 anos. Atendo apartamentos pequenos e médios. Especialidade em acabamento fino, tinta lavável e textura.',
      reviews: [
        { author: 'Mariana C.', rating: 5, text: 'Pintou o quarto da minha filha em um dia e ficou impecável.', date: '2026-04-18' },
        { author: 'Bruna L.', rating: 5, text: 'Acabamento perfeito, sem respingos, sem cheiro forte.', date: '2026-03-30' },
        { author: 'Rodrigo P.', rating: 4, text: 'Bom serviço. Demorou meio dia a mais mas o resultado compensou.', date: '2026-03-19' },
        { author: 'Cláudia A.', rating: 5, text: 'Muito atenciosa. Pintou com a casa habitada e não bagunçou nada.', date: '2026-03-04' },
        { author: 'Sandra M.', rating: 5, text: 'Recomendo de coração.', date: '2026-02-22' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,0,0], sun: [0,0,0] }
    },
    {
      id: 'pro-005', first_name: 'José E.', full_name: 'José Evandro S.', initials: 'JE',
      age: 58, avatar_color: 'primary', neighborhood: 'Castelo', city: 'Ribeirão Preto',
      radius_km: 18, rating_avg: 4.6, rating_count: 53, response_minutes: 35,
      acceptance_rate: 0.81, brings_material: 'nao', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-03-21' },
      specialties: [{ cat: 'eletrica', years: 30 }, { cat: 'hidraulica', years: 12 }, { cat: 'faz_tudo', years: 25 }],
      bio: 'Trinta anos de profissão. Eletricista de formação, hoje atendo também hidráulica básica e pequenos reparos. Trabalho do jeito certo, sem improvisar.',
      reviews: [
        { author: 'Vânia O.', rating: 5, text: 'Seu Zé é um achado. Pessoa séria, técnica boa, conversa explicando tudo.', date: '2026-04-09' },
        { author: 'Igor M.', rating: 5, text: 'Atendeu na minha região sem reclamar do trânsito. Trabalho minucioso.', date: '2026-03-25' },
        { author: 'Lúcia R.', rating: 4, text: 'Demorou um pouco para vir, mas quando veio resolveu de uma vez.', date: '2026-03-11' },
        { author: 'Pedro J.', rating: 4, text: 'Bom técnico. Cobra justo. Não leva material, combinem antes.', date: '2026-02-28' },
        { author: 'Renata G.', rating: 5, text: 'Educado, paciente, profissional.', date: '2026-02-14' }
      ],
      availability: { mon: [1,1,1], tue: [1,1,1], wed: [1,1,1], thu: [1,1,1], fri: [1,1,1], sat: [1,1,0], sun: [0,0,0] }
    },
    {
      id: 'pro-006', first_name: 'Wesley A.', full_name: 'Wesley Andrade B.', initials: 'WA',
      age: 29, avatar_color: 'primary', neighborhood: 'Sumarezinho', city: 'Ribeirão Preto',
      radius_km: 14, rating_avg: 4.7, rating_count: 21, response_minutes: 12,
      acceptance_rate: 0.94, brings_material: 'sim', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-15' },
      specialties: [{ cat: 'ar', years: 7 }, { cat: 'eletrica', years: 4 }],
      bio: 'Técnico de ar-condicionado e elétrica. Instalo splits, limpo e reviso aparelhos, faço recarga de gás. Levo nível a laser e detector de fuga.',
      reviews: [
        { author: 'Daniel R.', rating: 5, text: 'Split de 12 mil BTUs em parede de drywall. Reforço, suporte, infraestrutura escondida.', date: '2026-04-20' },
        { author: 'Marina S.', rating: 5, text: 'Resposta em 5 minutos no app, veio no mesmo dia.', date: '2026-04-08' },
        { author: 'Rafael C.', rating: 4, text: 'Bom serviço, achei o preço um pouquinho acima da média.', date: '2026-03-26' },
        { author: 'Juliana O.', rating: 5, text: 'Limpou meu split que estava com cheiro forte. Aparelho voltou novo.', date: '2026-03-10' },
        { author: 'Bruno L.', rating: 5, text: 'Profissional jovem mas competente.', date: '2026-02-25' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,1,0], sun: [1,0,0] }
    },
    {
      id: 'pro-007', first_name: 'Márcia L.', full_name: 'Márcia Lopes V.', initials: 'ML',
      age: 47, avatar_color: 'accent', neighborhood: 'Vila Tibério', city: 'Ribeirão Preto',
      radius_km: 16, rating_avg: 4.8, rating_count: 41, response_minutes: 25,
      acceptance_rate: 0.85, brings_material: 'sim', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-05' },
      specialties: [{ cat: 'chaveiro', years: 16 }, { cat: 'faz_tudo', years: 6 }],
      bio: 'Chaveira há 16 anos. Atendo Ribeirão e região 24h. Abertura sem dano, troca de segredo, fechadura tetra, digital e biométrica.',
      reviews: [
        { author: 'Cristina A.', rating: 5, text: 'Esqueci a chave dentro de casa às 23h. Márcia veio em 30 minutos, abriu sem arrombar.', date: '2026-04-14' },
        { author: 'Helena S.', rating: 5, text: 'Pontual, organizada, eficiente.', date: '2026-04-02' },
        { author: 'Vinicius D.', rating: 5, text: 'Profissional que atende com seriedade e sem cobrar absurdo na emergência.', date: '2026-03-19' },
        { author: 'Tatiana B.', rating: 4, text: 'Demorou um pouco para confirmar mas resolveu rápido.', date: '2026-03-05' },
        { author: 'Adriana M.', rating: 5, text: 'Indicaria pra qualquer pessoa.', date: '2026-02-20' }
      ],
      availability: { mon: [1,1,1], tue: [1,1,1], wed: [1,1,1], thu: [1,1,1], fri: [1,1,1], sat: [1,1,1], sun: [1,1,1] }
    },
    {
      id: 'pro-008', first_name: 'Sérgio K.', full_name: 'Sérgio Kobayashi T.', initials: 'SK',
      age: 41, avatar_color: 'primary', neighborhood: 'Alto da Boa Vista', city: 'Ribeirão Preto',
      radius_km: 16, rating_avg: 4.5, rating_count: 34, response_minutes: 48,
      acceptance_rate: 0.74, brings_material: 'depende', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-03-26' },
      specialties: [{ cat: 'gas', years: 11 }, { cat: 'faz_tudo', years: 5 }],
      bio: 'Instalador de gás com 11 anos de experiência. Atendo residencial e comercial. Botijão, fogão, cooktop, registro, teste de vazamento. Cadastrado na concessionária.',
      reviews: [
        { author: 'Cecília F.', rating: 5, text: 'Identificou um vazamento no registro que eu não conseguia achar. Tranquilizou minha casa inteira.', date: '2026-04-22' },
        { author: 'Marco T.', rating: 5, text: 'Instalou meu fogão de embutir com cuidado. Avisa quando algo está fora do padrão.', date: '2026-04-06' },
        { author: 'Lara P.', rating: 4, text: 'Bom mas demorou para retornar a primeira mensagem.', date: '2026-03-23' },
        { author: 'Gabriela M.', rating: 4, text: 'Combinou preço justo e cumpriu.', date: '2026-03-09' },
        { author: 'Antonio R.', rating: 5, text: 'Pessoa de confiança. Indico para qualquer urgência.', date: '2026-02-22' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,0,0], sun: [0,0,0] }
    },
    {
      id: 'pro-009', first_name: 'Felipe G.', full_name: 'Felipe Gomes A.', initials: 'FG',
      age: 35, avatar_color: 'primary', neighborhood: 'Nova Aliança', city: 'Ribeirão Preto',
      radius_km: 13, rating_avg: 4.4, rating_count: 19, response_minutes: 55,
      acceptance_rate: 0.68, brings_material: 'nao', has_vehicle: false,
      verified: { identity: true, background: true, address: true, last_check: '2026-03-18' },
      specialties: [{ cat: 'faz_tudo', years: 12 }, { cat: 'montagem', years: 7 }],
      bio: 'Faz-tudo da zona sul de Ribeirão. Pequenos consertos: dobradiça, fechadura simples, gaveta emperrada, prateleira torta.',
      reviews: [
        { author: 'Eliza S.', rating: 4, text: 'Resolveu três coisas pequenas pendentes há meses em uma manhã só.', date: '2026-04-11' },
        { author: 'Caio M.', rating: 5, text: 'Pessoa simpática, bom técnico. Resolveu uma fechadura que ninguém tinha conseguido.', date: '2026-03-24' },
        { author: 'Vera L.', rating: 4, text: 'Bom mas atrasou uma hora. Avisou só quando faltava 30 minutos.', date: '2026-03-12' },
        { author: 'Maurício A.', rating: 4, text: 'Serviço ok, sem grandes elogios mas sem reclamações.', date: '2026-02-26' },
        { author: 'Patrícia O.', rating: 5, text: 'Educado e cuidadoso. Voltaria a contratar.', date: '2026-02-08' }
      ],
      availability: { mon: [0,1,1], tue: [0,1,1], wed: [0,1,1], thu: [0,1,1], fri: [0,1,1], sat: [1,1,1], sun: [1,1,0] }
    },
    {
      id: 'pro-010', first_name: 'Rita N.', full_name: 'Rita Nakamura O.', initials: 'RN',
      age: 39, avatar_color: 'accent', neighborhood: 'Ipiranga', city: 'Ribeirão Preto',
      radius_km: 9, rating_avg: 4.9, rating_count: 26, response_minutes: 19,
      acceptance_rate: 0.91, brings_material: 'sim', has_vehicle: false,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-11' },
      specialties: [{ cat: 'pintura', years: 11 }, { cat: 'faz_tudo', years: 4 }],
      bio: 'Pintora especialista em ambientes com criança e pet. Tinta sem cheiro, secagem rápida, cobertura completa do mobiliário.',
      reviews: [
        { author: 'Aline T.', rating: 5, text: 'Pintou a sala e o corredor com meus dois cachorros em casa. Cobriu tudo, deixou impecável.', date: '2026-04-19' },
        { author: 'Daniela G.', rating: 5, text: 'Não tem cheiro de tinta. Magia.', date: '2026-04-05' },
        { author: 'Roberto S.', rating: 5, text: 'Ambiente ficou outro. Recomendo.', date: '2026-03-22' },
        { author: 'Vanessa F.', rating: 4, text: 'Boa profissional, demorou meio dia a mais mas avisou.', date: '2026-03-08' },
        { author: 'Camila P.', rating: 5, text: 'Acabamento de excelência.', date: '2026-02-21' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [0,0,0], sun: [0,0,0] }
    },
    {
      id: 'pro-011', first_name: 'Bruno M.', full_name: 'Bruno Maciel P.', initials: 'BM',
      age: 32, avatar_color: 'primary', neighborhood: 'Jardim Paulista', city: 'Ribeirão Preto',
      radius_km: 11, rating_avg: 4.2, rating_count: 14, response_minutes: 65,
      acceptance_rate: 0.62, brings_material: 'nao', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-03-15' },
      specialties: [{ cat: 'ar', years: 5 }, { cat: 'faz_tudo', years: 6 }],
      bio: 'Atendo instalação e limpeza de splits. Também faço suportes, varões de cortina e escada articulada.',
      reviews: [
        { author: 'Lúcia A.', rating: 5, text: 'Resolveu o pingo do meu split em 30 minutos.', date: '2026-04-08' },
        { author: 'Mariana V.', rating: 4, text: 'Bom serviço, demorou para confirmar agenda.', date: '2026-03-28' },
        { author: 'Eduardo R.', rating: 4, text: 'Trabalho ok. Cobrou um pouco mais do que esperava.', date: '2026-03-14' },
        { author: 'Sílvia M.', rating: 4, text: 'Educado. Eficiente. Ajustaria comunicação.', date: '2026-03-02' },
        { author: 'Júlio C.', rating: 4, text: 'Atende rápido quando confirma. Confirmar é a parte difícil.', date: '2026-02-15' }
      ],
      availability: { mon: [0,1,1], tue: [0,1,1], wed: [0,1,1], thu: [0,1,1], fri: [0,1,1], sat: [1,1,0], sun: [0,0,0] }
    },
    {
      id: 'pro-012', first_name: 'Antônio V.', full_name: 'Antônio Vieira C.', initials: 'AV',
      age: 62, avatar_color: 'primary', neighborhood: 'Centro', city: 'Ribeirão Preto',
      radius_km: 20, rating_avg: 4.9, rating_count: 68, response_minutes: 31,
      acceptance_rate: 0.89, brings_material: 'depende', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-09' },
      specialties: [{ cat: 'montagem', years: 35 }, { cat: 'faz_tudo', years: 28 }],
      bio: 'Marceneiro de oficina há 35 anos. Montagem caprichada, conserto de móvel antigo, restauração, porta empenada.',
      reviews: [
        { author: 'Marília B.', rating: 5, text: 'Restaurou uma cômoda da minha avó. Voltou nova.', date: '2026-04-21' },
        { author: 'Otávio L.', rating: 5, text: 'Pessoa rara. Profissional de oficina antiga.', date: '2026-04-04' },
        { author: 'Beatriz N.', rating: 5, text: 'Consertou três cadeiras e duas portas de armário. Trabalho impecável.', date: '2026-03-21' },
        { author: 'Suzana P.', rating: 5, text: 'Vale cada centavo. Não é o mais barato, mas é o melhor.', date: '2026-03-07' },
        { author: 'Roberto G.', rating: 5, text: 'Trabalho de sapateiro, no melhor sentido.', date: '2026-02-19' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,0,0], sun: [0,0,0] }
    },
    // NOVOS — categoriais expandidas
    {
      id: 'pro-013', first_name: 'Diana M.', full_name: 'Diana Moreira S.', initials: 'DM',
      age: 36, avatar_color: 'accent', neighborhood: 'Iguatemi', city: 'Ribeirão Preto',
      radius_km: 12, rating_avg: 4.9, rating_count: 54, response_minutes: 21,
      acceptance_rate: 0.93, brings_material: 'sim', has_vehicle: false,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-18' },
      specialties: [{ cat: 'diarista', years: 10 }, { cat: 'faxina', years: 7 }, { cat: 'estofados', years: 3 }],
      bio: 'Diarista experiente com material profissional. Atendo Ribeirão Preto e Cravinhos. Faxina semanal, pesada e limpeza pós-mudança. Estofados eu também faço.',
      reviews: [
        { author: 'Clarissa B.', rating: 5, text: 'Diana é organizada como ninguém. Casa fica brilhando, e ela sabe onde está cada coisa.', date: '2026-04-25' },
        { author: 'Vera T.', rating: 5, text: 'Trabalha em silêncio, com a casa habitada. Cuidadosa com objetos delicados.', date: '2026-04-12' },
        { author: 'Mônica P.', rating: 5, text: 'Limpou três sofás e duas poltronas em uma manhã. Resultado perfeito.', date: '2026-04-01' },
        { author: 'Sílvia R.', rating: 5, text: 'Pontual, séria, simpática. Cobra justo.', date: '2026-03-15' },
        { author: 'Renata A.', rating: 4, text: 'Bom serviço. Esqueceu de limpar uma janela mas voltou no dia seguinte.', date: '2026-02-28' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,0,0], sun: [0,0,0] }
    },
    {
      id: 'pro-014', first_name: 'Helena R.', full_name: 'Helena Ribeiro S.', initials: 'HR',
      age: 49, avatar_color: 'primary', neighborhood: 'Sumarezinho', city: 'Ribeirão Preto',
      radius_km: 18, rating_avg: 4.7, rating_count: 22, response_minutes: 38,
      acceptance_rate: 0.84, brings_material: 'sim', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-03' },
      specialties: [{ cat: 'jardinagem', years: 15 }, { cat: 'dedetizacao', years: 8 }, { cat: 'caixa_dagua', years: 5 }],
      bio: 'Cuido de jardim residencial em Ribeirão há 15 anos. Faço dedetização certificada (cupim, formiga, barata, rato) e limpeza de caixa d\'água. Trabalho com produtos registrados Anvisa.',
      reviews: [
        { author: 'Glaucia M.', rating: 5, text: 'Cuida do meu jardim há um ano. Sabe planta como ninguém e cobra honesto.', date: '2026-04-20' },
        { author: 'Carlos L.', rating: 5, text: 'Dedetizou cupim em armário antigo sem precisar tirar nada do lugar. Resolveu de uma vez.', date: '2026-04-05' },
        { author: 'Sandra B.', rating: 4, text: 'Limpou a caixa d\'água e deu certificado direitinho. Profissional.', date: '2026-03-18' },
        { author: 'Pedro V.', rating: 5, text: 'Recomendo. Pessoa séria, trabalho bem feito.', date: '2026-03-02' },
        { author: 'Mariana T.', rating: 5, text: 'Atende família inteira. Cuidados básicos toda quinzena.', date: '2026-02-15' }
      ],
      availability: { mon: [1,1,0], tue: [1,1,0], wed: [1,1,0], thu: [1,1,0], fri: [1,1,0], sat: [1,1,0], sun: [0,0,0] }
    },
    {
      id: 'pro-015', first_name: 'Lúcia F.', full_name: 'Lúcia Fontana B.', initials: 'LF',
      age: 54, avatar_color: 'accent', neighborhood: 'Vila Tibério', city: 'Ribeirão Preto',
      radius_km: 14, rating_avg: 4.9, rating_count: 31, response_minutes: 17,
      acceptance_rate: 0.96, brings_material: 'depende', has_vehicle: true,
      verified: { identity: true, background: true, address: true, last_check: '2026-04-22' },
      specialties: [{ cat: 'pet_sitter', years: 7 }, { cat: 'idoso', years: 12 }, { cat: 'baba', years: 8 }],
      bio: 'Cuidadora profissional há 12 anos. Cuido de idoso em domicílio (banho, medicação, companhia), pet sitter de cachorros e gatos, e babá eventual para crianças até 8 anos. Curso de primeiros socorros atualizado.',
      reviews: [
        { author: 'Adriana L.', rating: 5, text: 'Lúcia cuida da minha mãe três tardes por semana. Carinhosa, paciente, totalmente confiável.', date: '2026-04-26' },
        { author: 'Marcos B.', rating: 5, text: 'Levou minha cachorra ao parque por duas semanas enquanto eu viajava. Mandava foto todo dia.', date: '2026-04-08' },
        { author: 'Patrícia O.', rating: 5, text: 'Babá pontual e cuidadosa. Minha filha de 4 anos adora.', date: '2026-03-28' },
        { author: 'Renato D.', rating: 5, text: 'Pessoa rara. Combina o profissionalismo com o carinho de mãe.', date: '2026-03-10' },
        { author: 'Cecília N.', rating: 4, text: 'Atende quase sempre. Quando não pode, indica alguém de confiança.', date: '2026-02-25' }
      ],
      availability: { mon: [1,1,1], tue: [1,1,1], wed: [1,1,1], thu: [1,1,1], fri: [1,1,1], sat: [1,1,0], sun: [1,0,0] }
    }
  ];

  // ------------------------------------------------------------------
  // Demandas (15) — 10 originais + 5 novas cobrindo novas categorias
  // ------------------------------------------------------------------
  const DEMANDS = [
    { id: 'dem-001', client_id: 'cli-001', cat: 'hidraulica',
      title: 'Torneira da pia da cozinha pingando há 3 dias',
      description: 'Comecei notando uma gotinha de manhã, agora está pingando contínuo. Já apertei a base e não resolveu.',
      neighborhood: 'Jardim Califórnia', address_summary: 'Rua Tomé de Souza — Jardim Califórnia',
      urgency: 'ate_3_dias', urgency_label: 'Até 3 dias', time_pref: 'tarde',
      budget_min: 100, budget_max: 280, photos: 2,
      published_at_iso: '2026-05-14T09:42:00', published_minutes_ago: 12,
      status: 'proposals', proposal_count: 4, featured_for_demo: true },
    { id: 'dem-002', client_id: 'cli-001', cat: 'ar',
      title: 'Instalar split de ar de 12.000 BTUs no quarto',
      description: 'Comprei o split novo (Samsung WindFree). Tem suporte da parede pronto e ponto elétrico de 220V.',
      neighborhood: 'Jardim Califórnia', address_summary: 'Rua Tomé de Souza — Jardim Califórnia',
      urgency: 'ate_7_dias', urgency_label: 'Até 7 dias', time_pref: 'qualquer',
      budget_min: 280, budget_max: 480, photos: 1,
      published_at_iso: '2026-05-12T15:20:00', published_minutes_ago: 60*48 + 130,
      status: 'hired', proposal_count: 6 },
    { id: 'dem-003', client_id: 'cli-001', cat: 'eletrica',
      title: 'Lâmpada do banheiro queimou (pé direito alto)',
      description: 'Banheiro com teto de 3,80 m. Suspeito que precise trocar o soquete também.',
      neighborhood: 'Jardim Califórnia', address_summary: 'Rua Tomé de Souza — Jardim Califórnia',
      urgency: 'hoje', urgency_label: 'Hoje', time_pref: 'noite',
      budget_min: 60, budget_max: 150, photos: 0,
      published_at_iso: '2026-05-14T08:10:00', published_minutes_ago: 165,
      status: 'proposals', proposal_count: 3 },
    { id: 'dem-004', cat: 'faz_tudo',
      title: 'Suporte de TV 55 polegadas para fixar na parede',
      description: 'TV Samsung 55" comprada ontem. Parede de drywall com perfil estrutural.',
      neighborhood: 'Ribeirânia', address_summary: 'Rua Lafaiete — Ribeirânia',
      urgency: 'ate_3_dias', urgency_label: 'Até 3 dias', time_pref: 'tarde',
      budget_min: 120, budget_max: 250, photos: 1,
      published_at_iso: '2026-05-14T07:30:00', published_minutes_ago: 205,
      status: 'open', proposal_count: 2 },
    { id: 'dem-005', cat: 'pintura',
      title: 'Pintura de quarto pequeno (12 m²)',
      description: 'Quarto da minha filha. Quero mudar de bege para verde-claro. Tinta lavável já comprada.',
      neighborhood: 'Iguatemi', address_summary: 'Rua Pio XI — Iguatemi',
      urgency: 'sem_pressa', urgency_label: 'Sem pressa', time_pref: 'qualquer',
      budget_min: 280, budget_max: 600, photos: 2,
      published_at_iso: '2026-05-13T11:45:00', published_minutes_ago: 60*18 + 12,
      status: 'open', proposal_count: 5 },
    { id: 'dem-006', cat: 'hidraulica',
      title: 'Vazamento em torneira do tanque',
      description: 'Torneira do tanque pinga forte mesmo fechada. Já tentei trocar o vedante, não resolveu.',
      neighborhood: 'Sumarezinho', address_summary: 'Av. Independência — Sumarezinho',
      urgency: 'ate_3_dias', urgency_label: 'Até 3 dias', time_pref: 'manha',
      budget_min: 80, budget_max: 180, photos: 1,
      published_at_iso: '2026-05-14T06:15:00', published_minutes_ago: 280,
      status: 'open', proposal_count: 3 },
    { id: 'dem-007', cat: 'montagem',
      title: 'Montagem de guarda-roupa Madesa 6 portas',
      description: 'Comprei na sexta, chegou hoje. Caixas grandes ainda fechadas.',
      neighborhood: 'Vila Tibério', address_summary: 'Rua Saldanha Marinho — Vila Tibério',
      urgency: 'ate_7_dias', urgency_label: 'Até 7 dias', time_pref: 'qualquer',
      budget_min: 250, budget_max: 450, photos: 0,
      published_at_iso: '2026-05-13T17:30:00', published_minutes_ago: 60*12 + 27,
      status: 'open', proposal_count: 4 },
    { id: 'dem-008', cat: 'gas',
      title: 'Cheiro de gás perto do registro do fogão — urgente',
      description: 'Cheiro forte de gás na cozinha quando uso o fogão. Já fechei o registro principal.',
      neighborhood: 'Alto da Boa Vista', address_summary: 'Rua Tibiriçá — Alto da Boa Vista',
      urgency: 'hoje', urgency_label: 'Hoje', time_pref: 'manha',
      budget_min: 120, budget_max: 280, photos: 1,
      published_at_iso: '2026-05-13T09:15:00', published_minutes_ago: 60*21,
      status: 'open', proposal_count: 2 },
    { id: 'dem-009', cat: 'faz_tudo',
      title: 'Furadeira não pega — preciso fazer 8 furos para prateleiras',
      description: 'Tenho a furadeira mas a bateria não está mais segurando carga.',
      neighborhood: 'Nova Aliança', address_summary: 'Rua Tabajaras — Nova Aliança',
      urgency: 'ate_3_dias', urgency_label: 'Até 3 dias', time_pref: 'tarde',
      budget_min: 80, budget_max: 160, photos: 0,
      published_at_iso: '2026-05-14T10:05:00', published_minutes_ago: 5,
      status: 'open', proposal_count: 3 },
    { id: 'dem-010', cat: 'chaveiro',
      title: 'Fechadura emperrada na porta da frente — chaveiro urgente',
      description: 'Chave entra mas não gira completo. Já passei grafite, melhorou um dia, voltou.',
      neighborhood: 'Jardim Paulista', address_summary: 'Rua Carlos Adami — Jardim Paulista',
      urgency: 'hoje', urgency_label: 'Hoje', time_pref: 'qualquer',
      budget_min: 100, budget_max: 250, photos: 0,
      published_at_iso: '2026-05-14T11:55:00', published_minutes_ago: 1,
      status: 'open', proposal_count: 4 },
    // NOVAS — cobrindo categorias expandidas
    { id: 'dem-011', cat: 'diarista',
      title: 'Diarista semanal para apartamento de 65 m²',
      description: 'Apartamento de 2 quartos, sem pet. Toda quinta-feira de manhã. Material posso fornecer. Preciso alguém de confiança que trabalhe com a casa habitada — minha mãe fica em casa.',
      neighborhood: 'Jardim Botânico', address_summary: 'Av. Independência — Jardim Botânico',
      urgency: 'ate_7_dias', urgency_label: 'Até 7 dias', time_pref: 'manha',
      budget_min: 130, budget_max: 200, photos: 0,
      published_at_iso: '2026-05-13T08:30:00', published_minutes_ago: 60*24,
      status: 'open', proposal_count: 2 },
    { id: 'dem-012', cat: 'jardinagem',
      title: 'Manutenção mensal de jardim com gramado e cerca viva',
      description: 'Quintal de 80 m² com grama esmeralda, cerca viva de pingo de ouro e três jardineiras grandes. Preciso de visita mensal: corte de grama, poda da cerca e adubação.',
      neighborhood: 'Castelo', address_summary: 'Rua Quintino Bocaiuva — Castelo',
      urgency: 'sem_pressa', urgency_label: 'Sem pressa', time_pref: 'qualquer',
      budget_min: 180, budget_max: 350, photos: 1,
      published_at_iso: '2026-05-12T14:00:00', published_minutes_ago: 60*46,
      status: 'open', proposal_count: 1 },
    { id: 'dem-013', cat: 'dedetizacao',
      title: 'Dedetização contra cupim em armário antigo',
      description: 'Tenho um armário de madeira herdado da minha avó que começou a soltar pó de cupim. Quero tratar o armário sem precisar tirá-lo do lugar (pesado). Apartamento pequeno, 50 m².',
      neighborhood: 'Centro', address_summary: 'Rua Visconde de Inhaúma — Centro',
      urgency: 'ate_3_dias', urgency_label: 'Até 3 dias', time_pref: 'tarde',
      budget_min: 200, budget_max: 400, photos: 1,
      published_at_iso: '2026-05-13T16:00:00', published_minutes_ago: 60*15,
      status: 'open', proposal_count: 2 },
    { id: 'dem-014', cat: 'pet_sitter',
      title: 'Pet sitter para cachorro labrador durante viagem (5 dias)',
      description: 'Vou viajar do dia 22 a 27 de maio. Preciso de alguém de confiança para passar 2x ao dia (manhã e noite) na minha casa para alimentar e levar o Bento (labrador, 4 anos, dócil) pra passear 30 min cada vez.',
      neighborhood: 'Jardim Califórnia', address_summary: 'Rua Tomé de Souza — Jardim Califórnia',
      urgency: 'ate_7_dias', urgency_label: 'Até 7 dias', time_pref: 'qualquer',
      budget_min: 250, budget_max: 500, photos: 1,
      published_at_iso: '2026-05-14T07:15:00', published_minutes_ago: 220,
      status: 'open', proposal_count: 1 },
    { id: 'dem-015', cat: 'caixa_dagua',
      title: "Limpeza e higienização de caixa d'água (1000L)",
      description: "Caixa de água de 1000L de polietileno, no telhado. Última limpeza foi há 11 meses. Preciso de profissional certificado para limpar e me passar o comprovante para o condomínio.",
      neighborhood: 'Ipiranga', address_summary: 'Rua Bom Pastor — Ipiranga',
      urgency: 'ate_7_dias', urgency_label: 'Até 7 dias', time_pref: 'manha',
      budget_min: 250, budget_max: 400, photos: 0,
      published_at_iso: '2026-05-12T10:00:00', published_minutes_ago: 60*50,
      status: 'open', proposal_count: 1 }
  ];

  // ------------------------------------------------------------------
  // Propostas (50)
  // ------------------------------------------------------------------
  const PROPOSALS = [
    // dem-001 — 4 propostas (destaque)
    { id: 'prop-001-a', demand_id: 'dem-001', provider_id: 'pro-002', value: 180, time_estimate: '1 hora', availability_text: 'Hoje à tarde 14h-17h', message: 'Pelo que descreveu, vou levar reparo de vedação e uma torneira nova compatível como reserva.', sent_minutes_ago: 8, status: 'pending' },
    { id: 'prop-001-b', demand_id: 'dem-001', provider_id: 'pro-005', value: 140, time_estimate: '1h30', availability_text: 'Hoje após 18h ou amanhã 9h', message: 'Posso atender hoje à noite. Não levo material — me passa o modelo da torneira.', sent_minutes_ago: 6, status: 'pending' },
    { id: 'prop-001-c', demand_id: 'dem-001', provider_id: 'pro-009', value: 95, time_estimate: '45 minutos', availability_text: 'Amanhã à tarde', message: 'Atendo na sua região. Provavelmente é a vedação interna, normalmente resolve sem trocar a peça.', sent_minutes_ago: 4, status: 'pending' },
    { id: 'prop-001-d', demand_id: 'dem-001', provider_id: 'pro-001', value: 220, time_estimate: '1 hora', availability_text: 'Hoje 16h ou amanhã 10h', message: 'Trabalho com hidráulica básica. Levo torneira de reposição. Garantia de 30 dias.', sent_minutes_ago: 2, status: 'pending' },
    // dem-002 — contratada
    { id: 'prop-002-a', demand_id: 'dem-002', provider_id: 'pro-006', value: 380, time_estimate: '2h30', availability_text: 'Sábado de manhã', message: 'Levo bomba de vácuo, manômetro e bucha. Instalação completa com teste de carga.', sent_minutes_ago: 60*48, status: 'accepted' },
    { id: 'prop-002-b', demand_id: 'dem-002', provider_id: 'pro-011', value: 320, time_estimate: '2h', availability_text: 'Quinta à tarde', message: 'Faço split rápido. Nível e furadeira de impacto.', sent_minutes_ago: 60*47, status: 'rejected' },
    { id: 'prop-002-c', demand_id: 'dem-002', provider_id: 'pro-001', value: 410, time_estimate: '2h30', availability_text: 'Quando combinarmos', message: 'Faço parte elétrica também se precisar. Garantia 30 dias.', sent_minutes_ago: 60*46, status: 'rejected' },
    { id: 'prop-002-d', demand_id: 'dem-002', provider_id: 'pro-005', value: 360, time_estimate: '3h', availability_text: 'Quarta à tarde', message: 'Sem pressa, sem improviso.', sent_minutes_ago: 60*45, status: 'rejected' },
    { id: 'prop-002-e', demand_id: 'dem-002', provider_id: 'pro-009', value: 290, time_estimate: '3h', availability_text: 'Sábado ou domingo', message: 'Atendo aos finais de semana.', sent_minutes_ago: 60*44, status: 'rejected' },
    { id: 'prop-002-f', demand_id: 'dem-002', provider_id: 'pro-008', value: 350, time_estimate: '2h', availability_text: 'Quinta de manhã', message: 'Experiência com split de embutir e dreno especial.', sent_minutes_ago: 60*43, status: 'rejected' },
    // dem-003 — 3 propostas
    { id: 'prop-003-a', demand_id: 'dem-003', provider_id: 'pro-001', value: 110, time_estimate: '40 min', availability_text: 'Hoje 19h-21h', message: 'Posso passar hoje à noite. Levo lâmpada led e soquete novo.', sent_minutes_ago: 80, status: 'pending' },
    { id: 'prop-003-b', demand_id: 'dem-003', provider_id: 'pro-005', value: 85, time_estimate: '30 min', availability_text: 'Amanhã 9h', message: 'Não atendo à noite, mas posso passar cedo amanhã.', sent_minutes_ago: 65, status: 'pending' },
    { id: 'prop-003-c', demand_id: 'dem-003', provider_id: 'pro-006', value: 130, time_estimate: '30 min', availability_text: 'Hoje 20h', message: 'Tenho escada para 4 m.', sent_minutes_ago: 30, status: 'pending' },
    // dem-004 — 2
    { id: 'prop-004-a', demand_id: 'dem-004', provider_id: 'pro-006', value: 180, time_estimate: '1h', availability_text: 'Amanhã à tarde', message: 'TV grande em drywall pede reforço. Levo barra de fixação.', sent_minutes_ago: 90, status: 'pending' },
    { id: 'prop-004-b', demand_id: 'dem-004', provider_id: 'pro-011', value: 150, time_estimate: '1h', availability_text: 'Domingo', message: 'Atendo Ribeirânia. Levo nível e parafusos.', sent_minutes_ago: 70, status: 'pending' },
    // dem-005 — 5
    { id: 'prop-005-a', demand_id: 'dem-005', provider_id: 'pro-004', value: 380, time_estimate: '1 dia', availability_text: 'Próxima semana', message: 'Cubro tudo, fita crepe e proteção do piso.', sent_minutes_ago: 60*8, status: 'pending' },
    { id: 'prop-005-b', demand_id: 'dem-005', provider_id: 'pro-010', value: 420, time_estimate: '1 dia', availability_text: 'Quinta ou sexta', message: 'Trabalho com a casa habitada, sem cheiro forte.', sent_minutes_ago: 60*6, status: 'pending' },
    { id: 'prop-005-c', demand_id: 'dem-005', provider_id: 'pro-001', value: 350, time_estimate: '1 dia', availability_text: 'Segunda', message: 'Faço pintura simples também. Preço fixo.', sent_minutes_ago: 60*5, status: 'pending' },
    { id: 'prop-005-d', demand_id: 'dem-005', provider_id: 'pro-005', value: 320, time_estimate: '1 dia + retoque', availability_text: 'Esta semana', message: 'Retoque grátis em 30 dias.', sent_minutes_ago: 60*4, status: 'pending' },
    { id: 'prop-005-e', demand_id: 'dem-005', provider_id: 'pro-009', value: 280, time_estimate: '1,5 dias', availability_text: 'Sábado', message: 'Trabalho cuidadoso, cobro hora.', sent_minutes_ago: 60*2, status: 'pending' },
    // dem-006 — 3
    { id: 'prop-006-a', demand_id: 'dem-006', provider_id: 'pro-002', value: 110, time_estimate: '40 min', availability_text: 'Amanhã 9h', message: 'Bom que já comprou a torneira. Levo conexão extra.', sent_minutes_ago: 200, status: 'pending' },
    { id: 'prop-006-b', demand_id: 'dem-006', provider_id: 'pro-005', value: 95, time_estimate: '30 min', availability_text: 'Amanhã 8h', message: 'Trabalho rápido nesse tipo de troca.', sent_minutes_ago: 180, status: 'pending' },
    { id: 'prop-006-c', demand_id: 'dem-006', provider_id: 'pro-009', value: 130, time_estimate: '40 min', availability_text: 'Hoje à tarde', message: 'Atendo Sumarezinho hoje mesmo.', sent_minutes_ago: 120, status: 'pending' },
    // dem-007 — 4
    { id: 'prop-007-a', demand_id: 'dem-007', provider_id: 'pro-003', value: 320, time_estimate: '4-5 horas', availability_text: 'Sábado 9h', message: 'Madesa 6 portas faço de olhos fechados. Nível e calços.', sent_minutes_ago: 60*8, status: 'pending' },
    { id: 'prop-007-b', demand_id: 'dem-007', provider_id: 'pro-012', value: 380, time_estimate: '5 horas', availability_text: 'Próxima quarta', message: 'Trabalho cuidadoso. Reviso fechaduras no fim.', sent_minutes_ago: 60*6, status: 'pending' },
    { id: 'prop-007-c', demand_id: 'dem-007', provider_id: 'pro-009', value: 280, time_estimate: '5-6 horas', availability_text: 'Domingo', message: 'Faço aos finais de semana.', sent_minutes_ago: 60*4, status: 'pending' },
    { id: 'prop-007-d', demand_id: 'dem-007', provider_id: 'pro-011', value: 260, time_estimate: '5 horas', availability_text: 'Sábado à tarde', message: 'Atendo Vila Tibério.', sent_minutes_ago: 60*2, status: 'pending' },
    // dem-008 — 2
    { id: 'prop-008-a', demand_id: 'dem-008', provider_id: 'pro-008', value: 220, time_estimate: '1h', availability_text: 'Em até 1 hora', message: 'Levo detector eletrônico e peças de reposição. Teste pneumático antes de liberar.', sent_minutes_ago: 60*15, status: 'pending' },
    { id: 'prop-008-b', demand_id: 'dem-008', provider_id: 'pro-005', value: 180, time_estimate: '1h30', availability_text: 'Hoje à tarde', message: 'Identifico o ponto e troco a peça. Faço gás faz 12 anos.', sent_minutes_ago: 60*8, status: 'pending' },
    // dem-009 — 3
    { id: 'prop-009-a', demand_id: 'dem-009', provider_id: 'pro-006', value: 120, time_estimate: '40 min', availability_text: 'Hoje à tarde', message: 'Furadeira Bosch. 8 furos em alvenaria são rápidos.', sent_minutes_ago: 4, status: 'pending' },
    { id: 'prop-009-b', demand_id: 'dem-009', provider_id: 'pro-001', value: 95, time_estimate: '30 min', availability_text: 'Hoje 15h-17h', message: 'Atendo Nova Aliança hoje. Furadeira SDS, broca widia e buchas.', sent_minutes_ago: 12, status: 'pending' },
    { id: 'prop-009-c', demand_id: 'dem-009', provider_id: 'pro-005', value: 140, time_estimate: '45 min', availability_text: 'Amanhã pela manhã', message: 'Posso passar amanhã. Trago tudo, inclusive nível.', sent_minutes_ago: 22, status: 'pending' },
    // dem-010 — 4 (urgente)
    { id: 'prop-010-a', demand_id: 'dem-010', provider_id: 'pro-007', value: 180, time_estimate: '40 min', availability_text: 'Em 30 min', message: 'Atendo Jardim Paulista, posso sair agora. Cilindro de reserva. Sem arrombar.', sent_minutes_ago: 1, status: 'pending' },
    { id: 'prop-010-b', demand_id: 'dem-010', provider_id: 'pro-001', value: 220, time_estimate: '1 hora', availability_text: 'Em 1 hora', message: 'Posso passar em 1h, conjunto Yale e Stam de reserva. Garantia 30 dias.', sent_minutes_ago: 1, status: 'pending' },
    { id: 'prop-010-c', demand_id: 'dem-010', provider_id: 'pro-009', value: 150, time_estimate: '30 min', availability_text: 'Amanhã 7h antes da viagem', message: 'Posso passar amanhã cedinho, antes da sua viagem.', sent_minutes_ago: 0.5, status: 'pending' },
    { id: 'prop-010-d', demand_id: 'dem-010', provider_id: 'pro-005', value: 130, time_estimate: '40 min', availability_text: 'Hoje à noite', message: 'Atendo até 22h hoje. Cilindro novo + lubrificação.', sent_minutes_ago: 0.2, status: 'pending' },
    // dem-011 — diarista, 2
    { id: 'prop-011-a', demand_id: 'dem-011', provider_id: 'pro-013', value: 150, time_estimate: '6 horas / dia', availability_text: 'Toda quinta de manhã', message: 'Atendo Jardim Botânico todas as quintas. Trabalho em silêncio quando há alguém em casa. Sua mãe vai gostar.', sent_minutes_ago: 60*22, status: 'pending' },
    { id: 'prop-011-b', demand_id: 'dem-011', provider_id: 'pro-007', value: 180, time_estimate: '6 horas', availability_text: 'Quintas, sextas ou sábados', message: 'Posso atender em horários alternativos se quinta não der certo.', sent_minutes_ago: 60*8, status: 'pending' },
    // dem-012 — jardinagem, 1
    { id: 'prop-012-a', demand_id: 'dem-012', provider_id: 'pro-014', value: 260, time_estimate: '4 horas mensais', availability_text: 'Primeira terça do mês', message: 'Cuido de jardim com gramado esmeralda há 15 anos. Levo cortador, podão e adubo. Trabalho regular mensal com desconto.', sent_minutes_ago: 60*40, status: 'pending' },
    // dem-013 — dedetização, 2
    { id: 'prop-013-a', demand_id: 'dem-013', provider_id: 'pro-014', value: 320, time_estimate: '1h30 + retorno', availability_text: 'Esta semana', message: 'Aplicação localizada em armário, sem precisar tirar. Produto certificado Anvisa. Inclui retorno em 30 dias.', sent_minutes_ago: 60*12, status: 'pending' },
    { id: 'prop-013-b', demand_id: 'dem-013', provider_id: 'pro-008', value: 280, time_estimate: '1h', availability_text: 'Amanhã à tarde', message: 'Aplicação tradicional com seringa em pontos de saída. Boa para cupim seco.', sent_minutes_ago: 60*8, status: 'pending' },
    // dem-014 — pet sitter, 1
    { id: 'prop-014-a', demand_id: 'dem-014', provider_id: 'pro-015', value: 380, time_estimate: '2 visitas/dia, 5 dias', availability_text: '22 a 27 de maio', message: 'Já cuidei de labrador antes. Mando foto e vídeo de cada visita. Sou cadastrada com curso de primeiros socorros pet.', sent_minutes_ago: 60*5, status: 'pending' },
    // dem-015 — caixa d'água, 1
    { id: 'prop-015-a', demand_id: 'dem-015', provider_id: 'pro-014', value: 310, time_estimate: '2 horas', availability_text: 'Quarta de manhã', message: 'Limpeza completa com lavagem, desinfecção e secagem. Entrego certificado para o condomínio.', sent_minutes_ago: 60*46, status: 'pending' }
  ];

  // ------------------------------------------------------------------
  // Histórico do cliente demo (concluídos)
  // ------------------------------------------------------------------
  const CLIENT_HISTORY = [
    { id: 'h1', date: '2026-04-18', cat: 'eletrica',  provider_id: 'pro-001', title: 'Troca de tomada na sala',     value: 130, rating_given: 5 },
    { id: 'h2', date: '2026-03-04', cat: 'montagem',  provider_id: 'pro-003', title: 'Montagem de estante',         value: 240, rating_given: 5 },
    { id: 'h3', date: '2026-01-10', cat: 'chaveiro',  provider_id: 'pro-007', title: 'Troca de segredo da porta',   value: 180, rating_given: 4 }
  ];

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  function findById(arr, id) { return arr.find((x) => x.id === id) || null; }
  function findCategory(id)  { return findById(CATEGORIES, id); }
  function findGroup(id)     { return findById(GROUPS, id); }
  function findProvider(id)  { return findById(PROVIDERS, id); }
  function findDemand(id)    { return findById(DEMANDS, id); }
  function categoriesByGroup(grupoId) { return CATEGORIES.filter((c) => c.grupo === grupoId); }
  function proposalsForDemand(id) { return PROPOSALS.filter((p) => p.demand_id === id); }
  function demandsForProvider(id) {
    const pro = findProvider(id);
    if (!pro) return DEMANDS;
    const cats = pro.specialties.map((s) => s.cat);
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
    const v = DIST_FROM_CLIENT[provider.neighborhood];
    return v != null ? v : 7.0;
  }

  global.LarCareData = {
    GROUPS, CATEGORIES, PROVIDERS, DEMANDS, PROPOSALS, DEMO_CLIENT, CLIENT_HISTORY, NEIGHBORHOODS,
    findCategory, findGroup, findProvider, findDemand, categoriesByGroup,
    proposalsForDemand, proposalsByProvider, demandsForProvider,
    formatRelativeMinutes, formatBRL, formatRange, distanceFromClient
  };
})(window);
