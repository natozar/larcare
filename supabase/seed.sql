-- =============================================================================
-- LarCare — seed equivalente a js/mock_data.js (Ribeirão Preto-SP)
-- =============================================================================
-- Idempotente (ON CONFLICT DO NOTHING). Pode ser re-executado.
-- IDs textuais preservam slugs do mock para hot-swap mock ⇄ supabase sem
-- mudança de rota.
--
-- 8 categorias finais (recorte Ribeirão Preto), 12 prestadores em bairros
-- reais, 10 demandas com endereços plausíveis, 30+ propostas calibradas
-- por categoria. 3 demandas históricas + 3 avaliações.
--
-- Trigger trg_avaliacao_recalc_rating é desabilitado durante o seed
-- (rating_avg/rating_count vêm do dataset agregado, não das 3 avaliações
-- históricas sintéticas).
-- =============================================================================

begin;

-- ===========================================================================
-- 1. categorias  (8 — versão demo Ribeirão Preto)
-- ===========================================================================
delete from public.categorias where id not in
  ('eletrica','hidraulica','ar','montagem','pintura','chaveiro','gas','faz_tudo');

insert into public.categorias (id, nome, icone, blurb, ordem) values
  ('eletrica',   'Elétrica',              'bolt',    'Tomadas, lâmpadas, disjuntores',  1),
  ('hidraulica', 'Hidráulica',            'drop',    'Vazamentos, torneiras, descargas', 2),
  ('ar',         'Ar-condicionado',       'tv',      'Instalação, limpeza, recarga',     3),
  ('montagem',   'Montagem de móveis',    'box',     'Guarda-roupa, estante, mesa',      4),
  ('pintura',    'Pintura',               'brush',   'Cômodos, retoques, paredes',       5),
  ('chaveiro',   'Chaveiro',              'lock',    'Fechaduras, cópias, urgência',     6),
  ('gas',        'Gás',                   'flame',   'Botijão, registro, instalação',    7),
  ('faz_tudo',   'Faz-tudo',              'wrench',  'Pequenos consertos diversos',      8)
on conflict (id) do update set
  nome = excluded.nome, icone = excluded.icone,
  blurb = excluded.blurb, ordem = excluded.ordem;

-- ===========================================================================
-- 2. profiles  (Maria Cristina no Jardim Califórnia + 12 prestadores em RP)
-- ===========================================================================
insert into public.profiles
  (id, role, first_name, full_name, initials, age, avatar_color, email, phone,
   neighborhood, city, state, address, cep, latitude, longitude, member_since)
values
  -- Cliente demo
  ('cli-001', 'cliente', 'Maria Cristina', 'Maria Cristina Almeida', 'MC', 42, 'accent',
   'maria.almeida@example.com', '(16) 9 9421-3308',
   'Jardim Califórnia', 'Ribeirão Preto', 'SP',
   'Rua Tomé de Souza, 240 — Apto 32', '14026-450',
   -21.2122, -47.8506, '2025-09-12'),

  -- Prestadores 1..12 (todos em Ribeirão Preto-SP)
  ('pro-001', 'prestador', 'Carlos H.',  'Carlos Henrique S.',  'CH', 38, 'primary', null, null, 'Centro',             'Ribeirão Preto', 'SP', null, '14010-100', -21.1763, -47.8208, '2025-06-12'),
  ('pro-002', 'prestador', 'Roberto F.', 'Roberto Faria L.',    'RF', 51, 'primary', null, null, 'Jardim Botânico',    'Ribeirão Preto', 'SP', null, '14021-630', -21.2192, -47.8278, '2025-03-20'),
  ('pro-003', 'prestador', 'André P.',   'André Pacheco N.',    'AP', 33, 'primary', null, null, 'Iguatemi',           'Ribeirão Preto', 'SP', null, '14091-220', -21.2306, -47.8061, '2025-09-04'),
  ('pro-004', 'prestador', 'Luciana T.', 'Luciana Teixeira M.', 'LT', 44, 'accent',  null, null, 'Ribeirânia',         'Ribeirão Preto', 'SP', null, '14096-360', -21.1639, -47.8067, '2025-05-15'),
  ('pro-005', 'prestador', 'José E.',    'José Evandro S.',     'JE', 58, 'primary', null, null, 'Castelo',            'Ribeirão Preto', 'SP', null, '14040-180', -21.1822, -47.8514, '2024-11-08'),
  ('pro-006', 'prestador', 'Wesley A.',  'Wesley Andrade B.',   'WA', 29, 'primary', null, null, 'Sumarezinho',        'Ribeirão Preto', 'SP', null, '14055-140', -21.1500, -47.8389, '2025-10-21'),
  ('pro-007', 'prestador', 'Márcia L.',  'Márcia Lopes V.',     'ML', 47, 'accent',  null, null, 'Vila Tibério',       'Ribeirão Preto', 'SP', null, '14050-090', -21.1606, -47.8147, '2025-04-30'),
  ('pro-008', 'prestador', 'Sérgio K.',  'Sérgio Kobayashi T.', 'SK', 41, 'primary', null, null, 'Alto da Boa Vista',  'Ribeirão Preto', 'SP', null, '14025-330', -21.1394, -47.8181, '2025-07-11'),
  ('pro-009', 'prestador', 'Felipe G.',  'Felipe Gomes A.',     'FG', 35, 'primary', null, null, 'Nova Aliança',       'Ribeirão Preto', 'SP', null, '14026-740', -21.2389, -47.7969, '2025-12-01'),
  ('pro-010', 'prestador', 'Rita N.',    'Rita Nakamura O.',    'RN', 39, 'accent',  null, null, 'Ipiranga',           'Ribeirão Preto', 'SP', null, '14080-720', -21.1856, -47.8400, '2025-08-25'),
  ('pro-011', 'prestador', 'Bruno M.',   'Bruno Maciel P.',     'BM', 32, 'primary', null, null, 'Jardim Paulista',    'Ribeirão Preto', 'SP', null, '14090-180', -21.1922, -47.8208, '2026-01-14'),
  ('pro-012', 'prestador', 'Antônio V.', 'Antônio Vieira C.',   'AV', 62, 'primary', null, null, 'Centro',             'Ribeirão Preto', 'SP', null, '14010-100', -21.1763, -47.8208, '2024-10-03')
on conflict (id) do update set
  role = excluded.role, neighborhood = excluded.neighborhood, city = excluded.city,
  state = excluded.state, cep = excluded.cep,
  latitude = excluded.latitude, longitude = excluded.longitude;

-- ===========================================================================
-- 3. prestadores  (1:1 com profiles, rating denormalizado direto do dataset)
-- ===========================================================================
insert into public.prestadores
  (profile_id, bio, radius_km, rating_avg, rating_count, response_minutes,
   acceptance_rate, brings_material, has_vehicle, availability,
   verified_identity, verified_background, verified_address, last_check, approved_at, active)
values
  ('pro-001', 'Eletricista há 15 anos atendendo Ribeirão Preto. Levo ferramenta completa, oriento sobre material antes de comprar e deixo tudo limpo no fim. Formado pelo SENAI e com NR-10 atualizada.',
   12, 4.80, 32, 28, 0.86, 'depende', true,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,1],"fri":[1,1,1],"sat":[1,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-02', '2025-06-15 12:00:00+00', true),

  ('pro-002', 'Vinte e dois anos de hidráulica residencial em Ribeirão e região. Vazamento, troca de torneira, instalação de filtro, reparo em descarga, desentupimento leve.',
   10, 4.90, 47, 18, 0.92, 'sim', true,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[1,1,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-08', '2025-03-22 12:00:00+00', true),

  ('pro-003', 'Especialista em montagem de móveis planejados e prontos. Madesa, Tok&Stok, IKEA, Etna, móvel sob medida.',
   15, 4.70, 28, 42, 0.78, 'depende', true,
   '{"mon":[0,1,1],"tue":[0,1,1],"wed":[0,1,1],"thu":[0,1,1],"fri":[0,1,1],"sat":[1,1,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-03-30', '2025-09-05 12:00:00+00', true),

  ('pro-004', 'Pintora há 14 anos. Atendo apartamentos pequenos e médios. Especialidade em acabamento fino, tinta lavável e textura.',
   10, 4.90, 38, 22, 0.88, 'depende', false,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[1,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-12', '2025-05-16 12:00:00+00', true),

  ('pro-005', 'Trinta anos de profissão. Eletricista de formação, hoje atendo também hidráulica básica e pequenos reparos.',
   18, 4.60, 53, 35, 0.81, 'nao', true,
   '{"mon":[1,1,1],"tue":[1,1,1],"wed":[1,1,1],"thu":[1,1,1],"fri":[1,1,1],"sat":[1,1,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-03-21', '2024-11-10 12:00:00+00', true),

  ('pro-006', 'Técnico de ar-condicionado e elétrica. Instalo splits, limpo e reviso aparelhos, faço recarga de gás. Levo nível a laser e detector de fuga.',
   14, 4.70, 21, 12, 0.94, 'sim', true,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[1,1,0],"sun":[1,0,0]}'::jsonb,
   true, true, true, '2026-04-15', '2025-10-22 12:00:00+00', true),

  ('pro-007', 'Chaveira há 16 anos. Atendo Ribeirão e região 24h. Abertura sem dano, troca de segredo, cópia codificada, fechadura tetra, digital e biométrica.',
   16, 4.80, 41, 25, 0.85, 'sim', true,
   '{"mon":[1,1,1],"tue":[1,1,1],"wed":[1,1,1],"thu":[1,1,1],"fri":[1,1,1],"sat":[1,1,1],"sun":[1,1,1]}'::jsonb,
   true, true, true, '2026-04-05', '2025-05-02 12:00:00+00', true),

  ('pro-008', 'Instalador de gás com 11 anos de experiência. Atendo residencial e comercial. Botijão, fogão, cooktop, registro, teste de vazamento. Cadastrado na concessionária.',
   16, 4.50, 34, 48, 0.74, 'depende', true,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[1,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-03-26', '2025-07-13 12:00:00+00', true),

  ('pro-009', 'Faz-tudo da zona sul de Ribeirão. Pequenos consertos: dobradiça, fechadura simples, gaveta emperrada, prateleira torta.',
   13, 4.40, 19, 55, 0.68, 'nao', false,
   '{"mon":[0,1,1],"tue":[0,1,1],"wed":[0,1,1],"thu":[0,1,1],"fri":[0,1,1],"sat":[1,1,1],"sun":[1,1,0]}'::jsonb,
   true, true, true, '2026-03-18', '2025-12-04 12:00:00+00', true),

  ('pro-010', 'Pintora especialista em ambientes com criança e pet. Tinta sem cheiro, secagem rápida, cobertura completa do mobiliário. Trabalho com a casa habitada.',
   9, 4.90, 26, 19, 0.91, 'sim', false,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[0,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-11', '2025-08-27 12:00:00+00', true),

  ('pro-011', 'Atendo instalação e limpeza de splits. Também faço suportes, varões de cortina e escada articulada. Não levo material, oriento o que comprar antes.',
   11, 4.20, 14, 65, 0.62, 'nao', true,
   '{"mon":[0,1,1],"tue":[0,1,1],"wed":[0,1,1],"thu":[0,1,1],"fri":[0,1,1],"sat":[1,1,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-03-15', '2026-01-15 12:00:00+00', true),

  ('pro-012', 'Marceneiro de oficina há 35 anos. Montagem caprichada, conserto de móvel antigo, restauração, dobradiça, gaveta, porta empenada.',
   20, 4.90, 68, 31, 0.89, 'depende', true,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[1,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-09', '2024-10-05 12:00:00+00', true)
on conflict (profile_id) do update set
  bio = excluded.bio, radius_km = excluded.radius_km,
  rating_avg = excluded.rating_avg, rating_count = excluded.rating_count;

-- ===========================================================================
-- 4. prestador_categorias  (especialidades 8-cats finais)
-- ===========================================================================
delete from public.prestador_categorias where prestador_id in
  ('pro-001','pro-002','pro-003','pro-004','pro-005','pro-006',
   'pro-007','pro-008','pro-009','pro-010','pro-011','pro-012');

insert into public.prestador_categorias (prestador_id, categoria_id, years) values
  ('pro-001', 'eletrica',   15),
  ('pro-001', 'faz_tudo',    9),
  ('pro-002', 'hidraulica', 22),
  ('pro-002', 'faz_tudo',   18),
  ('pro-003', 'montagem',    9),
  ('pro-003', 'faz_tudo',    6),
  ('pro-004', 'pintura',    14),
  ('pro-004', 'faz_tudo',    8),
  ('pro-005', 'eletrica',   30),
  ('pro-005', 'hidraulica', 12),
  ('pro-005', 'faz_tudo',   25),
  ('pro-006', 'ar',          7),
  ('pro-006', 'eletrica',    4),
  ('pro-007', 'chaveiro',   16),
  ('pro-007', 'faz_tudo',    6),
  ('pro-008', 'gas',        11),
  ('pro-008', 'faz_tudo',    5),
  ('pro-009', 'faz_tudo',   12),
  ('pro-009', 'montagem',    7),
  ('pro-010', 'pintura',    11),
  ('pro-010', 'faz_tudo',    4),
  ('pro-011', 'ar',          5),
  ('pro-011', 'faz_tudo',    6),
  ('pro-012', 'montagem',   35),
  ('pro-012', 'faz_tudo',   28);

-- ===========================================================================
-- 5. demandas  (10 abertas em RP + 3 históricas)
-- ===========================================================================
insert into public.demandas
  (id, client_id, categoria_id, title, description, neighborhood, address_summary,
   latitude, longitude, urgency, urgency_label, time_pref, budget_min, budget_max,
   photos_count, status, featured_for_demo, published_at)
values
  ('dem-001', 'cli-001', 'hidraulica',
   'Torneira da pia da cozinha pingando há 3 dias',
   'Comecei notando uma gotinha de manhã, agora está pingando contínuo. Já apertei a base e não resolveu. Pia branca, granito, torneira monocomando que veio com o apartamento.',
   'Jardim Califórnia', 'Rua Tomé de Souza — Jardim Califórnia', -21.2122, -47.8506,
   'ate_3_dias', 'Até 3 dias', 'tarde', 100, 280, 2,
   'proposals', true, '2026-05-14 09:42:00+00'),

  ('dem-002', 'cli-001', 'ar',
   'Instalar split de ar de 12.000 BTUs no quarto',
   'Comprei o split novo (Samsung WindFree), tem o suporte da parede pronto e o ponto elétrico de 220V. Falta apenas furar a parede para a tubulação e instalar.',
   'Jardim Califórnia', 'Rua Tomé de Souza — Jardim Califórnia', -21.2122, -47.8506,
   'ate_7_dias', 'Até 7 dias', 'qualquer', 280, 480, 1,
   'hired', false, '2026-05-12 15:20:00+00'),

  ('dem-003', 'cli-001', 'eletrica',
   'Lâmpada do banheiro queimou (pé direito alto)',
   'Banheiro com teto de 3,80 m. Não consigo trocar com escada que tenho em casa. Suspeito que precise trocar o soquete também.',
   'Jardim Califórnia', 'Rua Tomé de Souza — Jardim Califórnia', -21.2122, -47.8506,
   'hoje', 'Hoje', 'noite', 60, 150, 0,
   'proposals', false, '2026-05-14 08:10:00+00'),

  ('dem-004', 'cli-001', 'faz_tudo',
   'Suporte de TV 55 polegadas para fixar na parede',
   'TV Samsung 55 polegadas comprada ontem. Parede de drywall com perfil estrutural. Suporte fixo simples, com rabichos de cabo já comprados.',
   'Ribeirânia', 'Rua Lafaiete — Ribeirânia', -21.1639, -47.8067,
   'ate_3_dias', 'Até 3 dias', 'tarde', 120, 250, 1,
   'open', false, '2026-05-14 07:30:00+00'),

  ('dem-005', 'cli-001', 'pintura',
   'Pintura de quarto pequeno (12 m²)',
   'Quarto da minha filha. Quero mudar de bege para verde-claro. Tinta lavável já comprada. Sem necessidade de massa, paredes lisas.',
   'Iguatemi', 'Rua Pio XI — Iguatemi', -21.2306, -47.8061,
   'sem_pressa', 'Sem pressa', 'qualquer', 280, 600, 2,
   'open', false, '2026-05-13 11:45:00+00'),

  ('dem-006', 'cli-001', 'hidraulica',
   'Vazamento em torneira do tanque da área de serviço',
   'Torneira do tanque pinga forte mesmo fechada. Já tentei trocar o vedante, não resolveu. Comprei uma nova.',
   'Sumarezinho', 'Av. Independência — Sumarezinho', -21.1500, -47.8389,
   'ate_3_dias', 'Até 3 dias', 'manha', 80, 180, 1,
   'open', false, '2026-05-14 06:15:00+00'),

  ('dem-007', 'cli-001', 'montagem',
   'Montagem de guarda-roupa Madesa 6 portas',
   'Comprei na sexta, chegou hoje. Caixas grandes ainda fechadas. Preciso montar e ajustar nivelamento.',
   'Vila Tibério', 'Rua Saldanha Marinho — Vila Tibério', -21.1606, -47.8147,
   'ate_7_dias', 'Até 7 dias', 'qualquer', 250, 450, 0,
   'open', false, '2026-05-13 17:30:00+00'),

  ('dem-008', 'cli-001', 'gas',
   'Cheiro de gás perto do registro do fogão — urgente',
   'Tenho cheiro forte de gás na cozinha quando uso o fogão. Já fechei o registro principal. Preciso de detector e troca do que estiver com defeito.',
   'Alto da Boa Vista', 'Rua Tibiriçá — Alto da Boa Vista', -21.1394, -47.8181,
   'hoje', 'Hoje', 'manha', 120, 280, 1,
   'open', false, '2026-05-13 09:15:00+00'),

  ('dem-009', 'cli-001', 'faz_tudo',
   'Furadeira não pega — preciso fazer 8 furos para prateleiras',
   'Tenho a furadeira mas a bateria não está mais segurando carga. Preciso de alguém com furadeira boa para 8 furos em alvenaria, bucha de 8 mm.',
   'Nova Aliança', 'Rua Tabajaras — Nova Aliança', -21.2389, -47.7969,
   'ate_3_dias', 'Até 3 dias', 'tarde', 80, 160, 0,
   'open', false, '2026-05-14 10:05:00+00'),

  ('dem-010', 'cli-001', 'chaveiro',
   'Fechadura emperrada na porta da frente — chaveiro urgente',
   'Chave entra mas não gira completo. Já passei grafite, melhorou um dia, voltou. Porta principal, urgente porque amanhã viajo.',
   'Jardim Paulista', 'Rua Carlos Adami — Jardim Paulista', -21.1922, -47.8208,
   'hoje', 'Hoje', 'qualquer', 100, 250, 0,
   'open', false, '2026-05-14 11:55:00+00')
on conflict (id) do update set
  categoria_id = excluded.categoria_id, title = excluded.title,
  description = excluded.description, neighborhood = excluded.neighborhood,
  address_summary = excluded.address_summary,
  latitude = excluded.latitude, longitude = excluded.longitude,
  status = excluded.status;

-- Demandas históricas (cli-001 já concluiu) — fonte de avaliacoes ratings reais.
insert into public.demandas
  (id, client_id, categoria_id, title, description, neighborhood, address_summary,
   latitude, longitude, urgency, urgency_label, time_pref, budget_min, budget_max,
   photos_count, status, featured_for_demo, published_at, hired_at, completed_at)
values
  ('hist-001', 'cli-001', 'eletrica',
   'Troca de tomada na sala',
   'Tomada da sala queimou. Preciso de troca.',
   'Jardim Califórnia', 'Rua Tomé de Souza — Jardim Califórnia', -21.2122, -47.8506,
   'ate_3_dias', 'Até 3 dias', 'tarde', 100, 180, 0,
   'completed', false, '2026-04-15 10:00:00+00', '2026-04-16 14:00:00+00', '2026-04-18 16:00:00+00'),

  ('hist-002', 'cli-001', 'montagem',
   'Montagem de estante',
   'Estante de 4 prateleiras recém-comprada.',
   'Jardim Califórnia', 'Rua Tomé de Souza — Jardim Califórnia', -21.2122, -47.8506,
   'ate_7_dias', 'Até 7 dias', 'qualquer', 180, 280, 1,
   'completed', false, '2026-02-28 09:00:00+00', '2026-03-02 10:00:00+00', '2026-03-04 17:00:00+00'),

  ('hist-003', 'cli-001', 'chaveiro',
   'Troca de segredo da porta',
   'Mudei recentemente, preciso trocar segredo de todas as fechaduras.',
   'Jardim Califórnia', 'Rua Tomé de Souza — Jardim Califórnia', -21.2122, -47.8506,
   'ate_7_dias', 'Até 7 dias', 'qualquer', 150, 250, 0,
   'completed', false, '2026-01-08 14:00:00+00', '2026-01-09 09:00:00+00', '2026-01-10 18:00:00+00')
on conflict (id) do update set status = excluded.status;

-- ===========================================================================
-- 6. propostas
-- ===========================================================================

-- dem-001 (destaque, 4 propostas pending)
insert into public.propostas
  (id, demanda_id, prestador_id, value, time_estimate, availability_text, message, status, sent_at)
values
  ('prop-001-a', 'dem-001', 'pro-002', 180.00, '1 hora',     'Posso passar hoje à tarde, entre 14h e 17h',
   'Pelo que descreveu, vou levar reparo de vedação e uma torneira nova compatível como reserva. Se a vedação resolver, cobro só a hora.',
   'pending', now() - interval '8 minutes'),
  ('prop-001-b', 'dem-001', 'pro-005', 140.00, '1h30',       'Hoje a partir das 18h ou amanhã 9h',
   'Posso atender hoje à noite. Não levo material — me passa o modelo da torneira que oriento o que comprar antes.',
   'pending', now() - interval '6 minutes'),
  ('prop-001-c', 'dem-001', 'pro-009',  95.00, '45 minutos', 'Amanhã à tarde',
   'Atendo na sua região. Provavelmente é a vedação interna, normalmente resolve sem trocar a peça.',
   'pending', now() - interval '4 minutes'),
  ('prop-001-d', 'dem-001', 'pro-001', 220.00, '1 hora',     'Hoje 16h ou amanhã 10h',
   'Trabalho com hidráulica básica também. Levo torneira de reposição equivalente à sua. Garantia de 30 dias.',
   'pending', now() - interval '2 minutes'),

-- dem-002 — já contratada (split de ar, 6 propostas, 1 accepted)
  ('prop-002-a', 'dem-002', 'pro-006', 380.00, '2h30',  'Sábado de manhã',
   'Levo bomba de vácuo, manômetro e bucha adequada. Instalação completa com teste de carga e isolamento.',
   'accepted', now() - interval '48 hours'),
  ('prop-002-b', 'dem-002', 'pro-011', 320.00, '2h',    'Quinta à tarde',   'Faço split rápido. Levo nível e furadeira de impacto.', 'rejected', now() - interval '47 hours'),
  ('prop-002-c', 'dem-002', 'pro-001', 410.00, '2h30',  'Quando combinarmos','Faço a parte elétrica também se precisar de revisão. Garantia de 30 dias.', 'rejected', now() - interval '46 hours'),
  ('prop-002-d', 'dem-002', 'pro-005', 360.00, '3h',    'Quarta à tarde',   'Faço sem pressa, sem improviso. Levo todo material elétrico.', 'rejected', now() - interval '45 hours'),
  ('prop-002-e', 'dem-002', 'pro-009', 290.00, '3h',    'Sábado ou domingo','Atendo aos finais de semana. Trago furadeira boa.', 'rejected', now() - interval '44 hours'),
  ('prop-002-f', 'dem-002', 'pro-008', 350.00, '2h',    'Quinta de manhã',  'Tenho experiência com split de embutir e dreno especial.', 'rejected', now() - interval '43 hours'),

-- dem-003 — 3 pending
  ('prop-003-a', 'dem-003', 'pro-001', 110.00, '40 min', 'Hoje à noite, 19h-21h', 'Posso passar hoje à noite. Levo lâmpada led e soquete novo se precisar trocar.', 'pending', now() - interval '80 minutes'),
  ('prop-003-b', 'dem-003', 'pro-005',  85.00, '30 min', 'Amanhã 9h',             'Não atendo à noite, mas posso passar cedo amanhã.', 'pending', now() - interval '65 minutes'),
  ('prop-003-c', 'dem-003', 'pro-006', 130.00, '30 min', 'Hoje 20h',              'Tenho escada para 4 m. Resolvo na noite.', 'pending', now() - interval '30 minutes'),

-- dem-004 — 2 pending (faz_tudo: suporte TV)
  ('prop-004-a', 'dem-004', 'pro-006', 180.00, '1h', 'Amanhã à tarde', 'TV grande em drywall pede reforço. Levo barra de fixação.', 'pending', now() - interval '90 minutes'),
  ('prop-004-b', 'dem-004', 'pro-011', 150.00, '1h', 'Domingo',         'Atendo Ribeirânia. Levo nível e parafusos compatíveis.', 'pending', now() - interval '70 minutes'),

-- dem-005 — 5 pending (pintura)
  ('prop-005-a', 'dem-005', 'pro-004', 380.00, '1 dia',           'Próxima semana, qualquer dia', 'Quarto pequeno, 1 dia inteiro. Cubro tudo, levo fita crepe e proteção do piso.', 'pending', now() - interval '8 hours'),
  ('prop-005-b', 'dem-005', 'pro-010', 420.00, '1 dia',           'Quinta ou sexta',              'Trabalho com a casa habitada, sem cheiro forte. Acabamento fino.', 'pending', now() - interval '6 hours'),
  ('prop-005-c', 'dem-005', 'pro-001', 350.00, '1 dia',           'Segunda',                      'Faço pintura simples também. Combino preço fixo.', 'pending', now() - interval '5 hours'),
  ('prop-005-d', 'dem-005', 'pro-005', 320.00, '1 dia + retoque', 'Esta semana',                  'Posso fazer com retoque grátis em até 30 dias.', 'pending', now() - interval '4 hours'),
  ('prop-005-e', 'dem-005', 'pro-009', 280.00, '1,5 dias',        'Sábado',                       'Trabalho cuidadoso, cobro hora.', 'pending', now() - interval '2 hours'),

-- dem-006 — 3 pending (hidráulica)
  ('prop-006-a', 'dem-006', 'pro-002', 110.00, '40 min', 'Amanhã 9h',     'Bom que já comprou a torneira. Levo conexão extra caso a antiga tenha danificado.', 'pending', now() - interval '200 minutes'),
  ('prop-006-b', 'dem-006', 'pro-005',  95.00, '30 min', 'Amanhã 8h',     'Trabalho rápido nesse tipo de troca.', 'pending', now() - interval '180 minutes'),
  ('prop-006-c', 'dem-006', 'pro-009', 130.00, '40 min', 'Hoje à tarde',  'Atendo Sumarezinho hoje mesmo se topar.', 'pending', now() - interval '120 minutes'),

-- dem-007 — 4 pending (montagem)
  ('prop-007-a', 'dem-007', 'pro-003', 320.00, '4-5 horas', 'Sábado 9h',          'Madesa 6 portas eu faço com olhos fechados. Levo nível e calços.', 'pending', now() - interval '8 hours'),
  ('prop-007-b', 'dem-007', 'pro-012', 380.00, '5 horas',   'Próxima quarta',     'Trabalho cuidadoso, sem riscos. Reviso fechaduras e dobradiças no fim.', 'pending', now() - interval '6 hours'),
  ('prop-007-c', 'dem-007', 'pro-009', 280.00, '5-6 horas', 'Domingo',            'Faço aos finais de semana.', 'pending', now() - interval '4 hours'),
  ('prop-007-d', 'dem-007', 'pro-011', 260.00, '5 horas',   'Sábado à tarde',     'Atendo Vila Tibério. Combine antes a logística do quarto.', 'pending', now() - interval '2 hours'),

-- dem-008 — 2 pending (gás urgente)
  ('prop-008-a', 'dem-008', 'pro-008', 220.00, '1h', 'Posso ir em até 1 hora',
   'Atendo emergência de gás em Ribeirão. Levo detector eletrônico e peças básicas de reposição.',
   'pending', now() - interval '15 hours'),
  ('prop-008-b', 'dem-008', 'pro-005', 180.00, '1h30', 'Hoje à tarde',
   'Identifico o ponto de vazamento e troco a peça defeituosa. Faço gás faz uns 12 anos.',
   'pending', now() - interval '8 hours'),

-- dem-009 — 3 pending (faz_tudo)
  ('prop-009-a', 'dem-009', 'pro-006', 120.00, '40 min', 'Hoje à tarde',         'Furadeira de impacto Bosch. 8 furos em alvenaria são rápidos.', 'pending', now() - interval '4 minutes'),
  ('prop-009-b', 'dem-009', 'pro-001',  95.00, '30 min', 'Hoje 15h-17h',         'Atendo Nova Aliança hoje mesmo. Levo furadeira SDS, broca widia e buchas de 8 mm.', 'pending', now() - interval '12 minutes'),
  ('prop-009-c', 'dem-009', 'pro-005', 140.00, '45 min', 'Amanhã pela manhã',    'Posso passar amanhã se topar. Trago tudo que precisa.', 'pending', now() - interval '22 minutes'),

-- dem-010 — 4 pending (chaveiro urgente)
  ('prop-010-a', 'dem-010', 'pro-007', 180.00, '40 min', 'Posso ir agora, em 30 min',    'Atendo Jardim Paulista, posso sair agora. Levo cilindro de reserva. Sem arrombar a porta.', 'pending', now() - interval '1 minute'),
  ('prop-010-b', 'dem-010', 'pro-001', 220.00, '1 hora', 'Em 1 hora',                    'Posso passar em 1 hora, levo conjunto Yale e Stam de reserva. Garantia de 30 dias.', 'pending', now() - interval '1 minute'),
  ('prop-010-c', 'dem-010', 'pro-009', 150.00, '30 min', 'Amanhã 7h antes da viagem',    'Posso passar amanhã bem cedinho, antes da sua viagem.', 'pending', now()),
  ('prop-010-d', 'dem-010', 'pro-005', 130.00, '40 min', 'Hoje à noite',                 'Atendo até as 22h hoje. Cilindro novo + lubrificação completa.', 'pending', now())
on conflict (id) do update set
  value = excluded.value, time_estimate = excluded.time_estimate,
  status = excluded.status;

-- Propostas históricas aceitas (uma por demanda hist-*)
insert into public.propostas
  (id, demanda_id, prestador_id, value, time_estimate, availability_text, message, status, sent_at, responded_at)
values
  ('prop-hist-001', 'hist-001', 'pro-001', 130.00, '1 hora', 'Combinado',
   'Troca de tomada simples. Levo tomada nova de 20A.',
   'accepted', '2026-04-15 11:00:00+00', '2026-04-15 12:30:00+00'),

  ('prop-hist-002', 'hist-002', 'pro-003', 240.00, '3 horas', 'Combinado',
   'Estante bem feita exige paciência. Levo nível e bits PH2.',
   'accepted', '2026-02-28 10:00:00+00', '2026-02-28 11:00:00+00'),

  ('prop-hist-003', 'hist-003', 'pro-007', 180.00, '2 horas', 'Combinado',
   'Troca de segredo de todas as fechaduras com cilindro novo. Garantia.',
   'accepted', '2026-01-08 15:00:00+00', '2026-01-08 16:30:00+00')
on conflict (id) do update set status = excluded.status;

-- ===========================================================================
-- 7. avaliacoes históricas (trigger desligado para não sobrescrever rating)
-- ===========================================================================
alter table public.avaliacoes disable trigger trg_avaliacao_recalc_rating;

insert into public.avaliacoes
  (demanda_id, autor_id, alvo_id, autor_tipo, nota_geral, comentario, recomenda, published_at)
values
  ('hist-001', 'cli-001', 'pro-001', 'cliente', 5,
   'Trocou a tomada e revisou o quadro inteiro. Trabalho impecável.', true,
   '2026-04-18 20:00:00+00'),
  ('hist-002', 'cli-001', 'pro-003', 'cliente', 5,
   'Montou a estante em três horas, levou os parafusos extras.',     true,
   '2026-03-04 19:00:00+00'),
  ('hist-003', 'cli-001', 'pro-007', 'cliente', 4,
   'Trocou segredo de todas as fechaduras. Profissional sério. Esqueceu de testar uma chave mas voltou no dia seguinte.', true,
   '2026-01-10 21:00:00+00')
on conflict (demanda_id, autor_id) do nothing;

alter table public.avaliacoes enable trigger trg_avaliacao_recalc_rating;

-- ===========================================================================
-- 8. Verificação rápida (sai no log do psql)
-- ===========================================================================
do $$
begin
  raise notice 'Seed concluído (Ribeirão Preto). Contagens:';
  raise notice '  categorias:           %', (select count(*) from public.categorias);
  raise notice '  profiles:             %', (select count(*) from public.profiles);
  raise notice '  prestadores:          %', (select count(*) from public.prestadores);
  raise notice '  prestador_categorias: %', (select count(*) from public.prestador_categorias);
  raise notice '  demandas:             %', (select count(*) from public.demandas);
  raise notice '  propostas:            %', (select count(*) from public.propostas);
  raise notice '  avaliacoes:           %', (select count(*) from public.avaliacoes);
end $$;

commit;
