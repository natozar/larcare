-- =============================================================================
-- LarCare — seed equivalente ao js/mock_data.js
-- =============================================================================
-- Idempotente (ON CONFLICT DO NOTHING). Pode ser re-executado.
-- IDs textuais preservam slugs do mock para hot-swap mock ⇄ supabase sem
-- mudança de rota.
--
-- ATENÇÃO: o trigger trg_avaliacao_recalc_rating é desabilitado durante o
-- seed porque rating_avg/rating_count vêm direto do dataset histórico mockado
-- (12 prestadores com totais já agregados). Reabilitado ao final.
-- =============================================================================

begin;

-- ===========================================================================
-- 1. categorias
-- ===========================================================================
insert into public.categorias (id, nome, icone, blurb, ordem) values
  ('eletrica',   'Elétrica residencial',         'bolt',    'Tomadas, lâmpadas, disjuntores',  1),
  ('hidraulica', 'Hidráulica residencial',       'drop',    'Vazamentos, torneiras, descargas', 2),
  ('marcenaria', 'Marcenaria leve',              'saw',     'Pequenos consertos em madeira',    3),
  ('pintura',    'Pintura interna',              'brush',   'Cômodos, retoques, paredes',       4),
  ('jardinagem', 'Jardinagem',                   'leaf',    'Poda, grama, plantas',             5),
  ('montagem',   'Montagem de móveis',           'box',     'Guarda-roupa, estante, mesa',      6),
  ('instalacao', 'Instalação de equipamentos',   'tv',      'Suporte de TV, ar, prateleira',    7),
  ('reparos',    'Reparos gerais',               'wrench',  'Pequenos consertos diversos',      8),
  ('limpeza',    'Limpeza pesada',               'sparkle', 'Pós-obra, mudança, vidros',        9),
  ('preventiva', 'Manutenção preventiva',        'shield',  'Vistoria e ajustes de rotina',    10)
on conflict (id) do nothing;

-- ===========================================================================
-- 2. profiles  (cliente demo + 12 prestadores)
--    user_id permanece NULL: profiles de seed/demo não têm conta auth.
--    Quando um cliente/prestador real se cadastrar via Supabase Auth, novo
--    profile entra com user_id preenchido.
-- ===========================================================================
insert into public.profiles
  (id, role, first_name, full_name, initials, age, avatar_color, email, phone,
   neighborhood, city, state, address, cep, latitude, longitude, member_since)
values
  -- Cliente demo (Pinheiros)
  ('cli-001', 'cliente', 'Maria Cristina', 'Maria Cristina Almeida', 'MC', 42, 'accent',
   'maria.almeida@example.com', '(11) 9 7421-3308', 'Pinheiros', 'São Paulo', 'SP',
   'Rua Cardeal Arcoverde, 1408 — Apto 92', '05408-002', -23.5687, -46.6907, '2025-08-19'),

  -- Prestadores 1..12
  ('pro-001', 'prestador', 'Carlos H.',  'Carlos Henrique S.',  'CH', 38, 'primary', null, null, 'Vila Madalena', 'São Paulo', 'SP', null, null, -23.5489, -46.6920, '2025-06-12'),
  ('pro-002', 'prestador', 'Roberto F.', 'Roberto Faria L.',    'RF', 51, 'primary', null, null, 'Pinheiros',     'São Paulo', 'SP', null, null, -23.5687, -46.6907, '2025-03-20'),
  ('pro-003', 'prestador', 'André P.',   'André Pacheco N.',    'AP', 33, 'primary', null, null, 'Vila Mariana',  'São Paulo', 'SP', null, null, -23.5887, -46.6342, '2025-09-04'),
  ('pro-004', 'prestador', 'Luciana T.', 'Luciana Teixeira M.', 'LT', 44, 'accent',  null, null, 'Tatuapé',       'São Paulo', 'SP', null, null, -23.5403, -46.5775, '2025-05-15'),
  ('pro-005', 'prestador', 'José E.',    'José Evandro S.',     'JE', 58, 'primary', null, null, 'Santana',       'São Paulo', 'SP', null, null, -23.5005, -46.6244, '2024-11-08'),
  ('pro-006', 'prestador', 'Wesley A.',  'Wesley Andrade B.',   'WA', 29, 'primary', null, null, 'Butantã',       'São Paulo', 'SP', null, null, -23.5715, -46.7156, '2025-10-21'),
  ('pro-007', 'prestador', 'Marcia L.',  'Marcia Lopes V.',     'ML', 47, 'accent',  null, null, 'Lapa',          'São Paulo', 'SP', null, null, -23.5283, -46.7064, '2025-04-30'),
  ('pro-008', 'prestador', 'Sérgio K.',  'Sérgio Kobayashi T.', 'SK', 41, 'primary', null, null, 'Aclimação',     'São Paulo', 'SP', null, null, -23.5742, -46.6306, '2025-07-11'),
  ('pro-009', 'prestador', 'Felipe G.',  'Felipe Gomes A.',     'FG', 35, 'primary', null, null, 'Ipiranga',      'São Paulo', 'SP', null, null, -23.5905, -46.6088, '2025-12-01'),
  ('pro-010', 'prestador', 'Rita N.',    'Rita Nakamura O.',    'RN', 39, 'accent',  null, null, 'Perdizes',      'São Paulo', 'SP', null, null, -23.5410, -46.6817, '2025-08-25'),
  ('pro-011', 'prestador', 'Bruno M.',   'Bruno Maciel P.',     'BM', 32, 'primary', null, null, 'Vila Madalena', 'São Paulo', 'SP', null, null, -23.5489, -46.6920, '2026-01-14'),
  ('pro-012', 'prestador', 'Antônio V.', 'Antônio Vieira C.',   'AV', 62, 'primary', null, null, 'Vila Mariana',  'São Paulo', 'SP', null, null, -23.5887, -46.6342, '2024-10-03')
on conflict (id) do nothing;

-- ===========================================================================
-- 3. prestadores  (extensão 1:1, com rating denormalizado direto do dataset)
-- ===========================================================================
insert into public.prestadores
  (profile_id, bio, radius_km, rating_avg, rating_count, response_minutes,
   acceptance_rate, brings_material, has_vehicle, availability,
   verified_identity, verified_background, verified_address, last_check, approved_at, active)
values
  ('pro-001',
   'Eletricista há 15 anos, atendo Vila Madalena, Pinheiros e Sumaré. Levo ferramenta completa, oriento sobre material antes de comprar e deixo tudo limpo no fim. Fui formado pelo SENAI e mantenho NR-10 atualizada.',
   12, 4.80, 32, 28, 0.86, 'depende', true,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,1],"fri":[1,1,1],"sat":[1,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-02', '2025-06-15 12:00:00+00', true),

  ('pro-002',
   'Vinte e dois anos de hidráulica residencial. Vazamento, troca de torneira, instalação de filtro, reparo em descarga, desentupimento leve. Levo material básico e cobro só o que usar.',
   8, 4.90, 47, 18, 0.92, 'sim', true,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[1,1,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-08', '2025-03-22 12:00:00+00', true),

  ('pro-003',
   'Especialista em montagem de móveis planejados e prontos. Madesa, Tok&Stok, IKEA, Etna, móvel sob medida. Trabalho com manual ou sem manual quando necessário.',
   15, 4.70, 28, 42, 0.78, 'depende', true,
   '{"mon":[0,1,1],"tue":[0,1,1],"wed":[0,1,1],"thu":[0,1,1],"fri":[0,1,1],"sat":[1,1,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-03-30', '2025-09-05 12:00:00+00', true),

  ('pro-004',
   'Pintora há 14 anos. Atendo apartamentos pequenos e médios. Especialidade em acabamento fino, tinta lavável e textura. Cobro por cômodo, oriento sobre cor e tinta antes da compra.',
   10, 4.90, 38, 22, 0.88, 'depende', false,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[1,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-12', '2025-05-16 12:00:00+00', true),

  ('pro-005',
   'Trinta anos de profissão. Eletricista de formação, hoje atendo também hidráulica básica e pequenos reparos. Trabalho devagar, do jeito certo, sem improvisar.',
   18, 4.60, 53, 35, 0.81, 'nao', true,
   '{"mon":[1,1,1],"tue":[1,1,1],"wed":[1,1,1],"thu":[1,1,1],"fri":[1,1,1],"sat":[1,1,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-03-21', '2024-11-10 12:00:00+00', true),

  ('pro-006',
   'Instalo suportes de TV (qualquer tamanho), ares-condicionados split (parte civil), prateleiras pesadas e quadros. Levo bucha, parafuso e nível a laser.',
   14, 4.70, 21, 12, 0.94, 'sim', true,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[1,1,0],"sun":[1,0,0]}'::jsonb,
   true, true, true, '2026-04-15', '2025-10-22 12:00:00+00', true),

  ('pro-007',
   'Limpeza pesada, pós-obra, pós-mudança. Trabalho com material próprio profissional (não uso o que tem em casa). Atendo apartamentos até 120 m² em uma diária.',
   12, 4.80, 41, 25, 0.85, 'sim', false,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[0,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-05', '2025-05-02 12:00:00+00', true),

  ('pro-008',
   'Cuido de jardins residenciais pequenos e médios. Poda, corte de grama, trato de pragas, replantio. Serviço mensal ou avulso. Levo equipamento próprio.',
   16, 4.50, 34, 48, 0.74, 'depende', true,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[1,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-03-26', '2025-07-13 12:00:00+00', true),

  ('pro-009',
   'Faço-tudo da zona sul. Pequenos consertos: dobradiça, fechadura, gaveta emperrada, prateleira torta, ralo entupido leve. Combino preço por hora ou por serviço.',
   13, 4.40, 19, 55, 0.68, 'nao', false,
   '{"mon":[0,1,1],"tue":[0,1,1],"wed":[0,1,1],"thu":[0,1,1],"fri":[0,1,1],"sat":[1,1,1],"sun":[1,1,0]}'::jsonb,
   true, true, true, '2026-03-18', '2025-12-04 12:00:00+00', true),

  ('pro-010',
   'Pintora especialista em ambientes com criança e pet. Tinta sem cheiro, secagem rápida, cobertura completa do mobiliário. Trabalho com a casa habitada.',
   9, 4.90, 26, 19, 0.91, 'sim', false,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[0,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-11', '2025-08-27 12:00:00+00', true),

  ('pro-011',
   'Instalo prateleiras, suportes, varões de cortina, escada articulada. Atendimentos rápidos. Não levo material, oriento o que comprar antes.',
   11, 4.20, 14, 65, 0.62, 'nao', true,
   '{"mon":[0,1,1],"tue":[0,1,1],"wed":[0,1,1],"thu":[0,1,1],"fri":[0,1,1],"sat":[1,1,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-03-15', '2026-01-15 12:00:00+00', true),

  ('pro-012',
   'Marceneiro de oficina há 35 anos. Conserto de móvel antigo, restauração, dobradiça, gaveta, porta empenada. Trabalho artesanal, prazo combinado, orçamento por escrito.',
   20, 4.90, 68, 31, 0.89, 'depende', true,
   '{"mon":[1,1,0],"tue":[1,1,0],"wed":[1,1,0],"thu":[1,1,0],"fri":[1,1,0],"sat":[1,0,0],"sun":[0,0,0]}'::jsonb,
   true, true, true, '2026-04-09', '2024-10-05 12:00:00+00', true)
on conflict (profile_id) do nothing;

-- ===========================================================================
-- 4. prestador_categorias  (especialidades + anos)
-- ===========================================================================
insert into public.prestador_categorias (prestador_id, categoria_id, years) values
  ('pro-001', 'eletrica',   15),
  ('pro-001', 'reparos',     9),
  ('pro-002', 'hidraulica', 22),
  ('pro-002', 'reparos',    18),
  ('pro-003', 'montagem',    9),
  ('pro-003', 'marcenaria',  6),
  ('pro-004', 'pintura',    14),
  ('pro-004', 'reparos',     8),
  ('pro-005', 'eletrica',   30),
  ('pro-005', 'hidraulica', 12),
  ('pro-005', 'reparos',    25),
  ('pro-006', 'instalacao',  7),
  ('pro-006', 'eletrica',    4),
  ('pro-007', 'limpeza',    16),
  ('pro-007', 'preventiva',  6),
  ('pro-008', 'jardinagem', 11),
  ('pro-008', 'preventiva',  5),
  ('pro-009', 'reparos',    12),
  ('pro-009', 'montagem',    7),
  ('pro-010', 'pintura',    11),
  ('pro-010', 'limpeza',     4),
  ('pro-011', 'instalacao',  5),
  ('pro-011', 'reparos',     6),
  ('pro-012', 'marcenaria', 35),
  ('pro-012', 'reparos',    28)
on conflict (prestador_id, categoria_id) do nothing;

-- ===========================================================================
-- 5. demandas  (10) — ID, bairro/lat-lng casam com prestadores próximos
--    Demandas anônimas no mock (sem client_id) são todas vinculadas a cli-001
--    pra satisfazer FK.
-- ===========================================================================
insert into public.demandas
  (id, client_id, categoria_id, title, description, neighborhood, address_summary,
   latitude, longitude, urgency, urgency_label, time_pref, budget_min, budget_max,
   photos_count, status, featured_for_demo, published_at)
values
  ('dem-001', 'cli-001', 'hidraulica',
   'Torneira da pia da cozinha pingando há 3 dias',
   'Comecei notando uma gotinha de manhã, agora está pingando contínuo. Já apertei a base e não resolveu. Não sei se é a vedação ou a torneira inteira. Pia branca, granito, torneira monocomando que veio com o apartamento (uns 5 anos).',
   'Pinheiros', 'Rua Cardeal Arcoverde — Pinheiros', -23.5687, -46.6907,
   'ate_3_dias', 'Até 3 dias', 'tarde', 100, 280, 2,
   'proposals', true, '2026-04-25 09:42:00+00'),

  ('dem-002', 'cli-001', 'instalacao',
   'Instalar 2 prateleiras na sala (madeira já comprada)',
   'Tenho duas prateleiras retas (80 x 25 cm) já compradas, com mãos francesas inclusas. Parede de alvenaria, sem fiação no trecho. Preciso instaladas em altura específica para alinhar com TV.',
   'Pinheiros', 'Rua Cardeal Arcoverde — Pinheiros', -23.5687, -46.6907,
   'ate_7_dias', 'Até 7 dias', 'qualquer', 80, 200, 1,
   'hired', false, '2026-04-23 15:20:00+00'),

  ('dem-003', 'cli-001', 'eletrica',
   'Lâmpada do banheiro queimou (pé direito alto)',
   'Banheiro tem teto de 3,80 m. Não consigo trocar com escada que tenho em casa. Lâmpada está em ponto fixo, suspeito que precise trocar o soquete também (a anterior queimou em 2 meses).',
   'Vila Mariana', 'Rua Domingos de Morais — Vila Mariana', -23.5887, -46.6342,
   'hoje', 'Hoje', 'noite', 60, 150, 0,
   'proposals', false, '2026-04-25 08:10:00+00'),

  ('dem-004', 'cli-001', 'instalacao',
   'Suporte de TV de 55 polegadas para fixar na parede',
   'TV Samsung 55" comprada ontem. Parede de drywall com perfil estrutural. Suporte fixo simples, com rabichos de cabo já comprados.',
   'Tatuapé', 'Rua Tuiuti — Tatuapé', -23.5403, -46.5775,
   'ate_3_dias', 'Até 3 dias', 'tarde', 120, 250, 1,
   'open', false, '2026-04-25 07:30:00+00'),

  ('dem-005', 'cli-001', 'pintura',
   'Pintura de quarto pequeno (12 m²) — paredes em bom estado',
   'Quarto da minha filha. Quero mudar de bege para verde-claro. Tinta lavável já comprada (2 latas de 18L Coral). Sem necessidade de massa, paredes lisas. Móveis serão tirados antes.',
   'Santana', 'Rua Voluntários da Pátria — Santana', -23.5005, -46.6244,
   'sem_pressa', 'Sem pressa', 'qualquer', 280, 600, 2,
   'open', false, '2026-04-24 11:45:00+00'),

  ('dem-006', 'cli-001', 'hidraulica',
   'Vazamento em torneira do tanque da área de serviço',
   'Torneira do tanque pinga forte mesmo fechada. Já tentei trocar o vedante, não resolveu. Preciso provavelmente trocar a torneira inteira. Comprei uma nova, está aqui.',
   'Butantã', 'Rua Itapaiúna — Butantã', -23.5715, -46.7156,
   'ate_3_dias', 'Até 3 dias', 'manha', 80, 180, 1,
   'open', false, '2026-04-25 06:15:00+00'),

  ('dem-007', 'cli-001', 'montagem',
   'Montagem de guarda-roupa Madesa 6 portas',
   'Comprei na sexta, chegou hoje. Caixas grandes ainda fechadas. Quarto está livre. Preciso montar e ajustar nivelamento (piso inclinado uns 2 cm).',
   'Lapa', 'Rua Catão — Lapa', -23.5283, -46.7064,
   'ate_7_dias', 'Até 7 dias', 'qualquer', 250, 450, 0,
   'open', false, '2026-04-24 17:30:00+00'),

  ('dem-008', 'cli-001', 'jardinagem',
   'Cortar grama do quintal (cerca de 20 m²)',
   'Quintal pequeno, grama esmeralda. Última roçada foi há 6 semanas, está alta mas nada extremo. Tenho pontos de água. Só preciso cortar e descartar.',
   'Aclimação', 'Rua Muniz de Souza — Aclimação', -23.5742, -46.6306,
   'ate_7_dias', 'Até 7 dias', 'manha', 120, 220, 1,
   'open', false, '2026-04-24 09:15:00+00'),

  ('dem-009', 'cli-001', 'eletrica',
   'Furadeira não pega — preciso fazer 8 furos para prateleiras',
   'Tenho a furadeira mas a bateria não está mais segurando carga. Preciso de alguém com furadeira boa para fazer 8 furos em parede de alvenaria, tudo em bucha de 8 mm.',
   'Ipiranga', 'Rua Bom Pastor — Ipiranga', -23.5905, -46.6088,
   'ate_3_dias', 'Até 3 dias', 'tarde', 80, 160, 0,
   'open', false, '2026-04-25 10:05:00+00'),

  ('dem-010', 'cli-001', 'reparos',
   'Conserto de fechadura emperrada na porta da frente',
   'Chave entra mas não gira completo. Já passei grafite, melhorou um dia, voltou. Porta principal do apartamento, urgente porque amanhã vou viajar.',
   'Vila Madalena', 'Rua Aspicuelta — Vila Madalena', -23.5489, -46.6920,
   'hoje', 'Hoje', 'qualquer', 100, 250, 0,
   'open', false, '2026-04-25 11:55:00+00')
on conflict (id) do nothing;

-- Demandas históricas (cli-001 já concluiu) — fonte de avaliacoes ratings reais.
-- Status='completed' permite que avaliacoes INSERT passe a CHECK das policies.
insert into public.demandas
  (id, client_id, categoria_id, title, description, neighborhood, address_summary,
   latitude, longitude, urgency, urgency_label, time_pref, budget_min, budget_max,
   photos_count, status, featured_for_demo, published_at, hired_at, completed_at)
values
  ('hist-001', 'cli-001', 'eletrica',
   'Troca de tomada na sala',
   'Tomada da sala queimou. Preciso de troca.',
   'Pinheiros', 'Rua Cardeal Arcoverde — Pinheiros', -23.5687, -46.6907,
   'ate_3_dias', 'Até 3 dias', 'tarde', 100, 180, 0,
   'completed', false, '2026-03-15 10:00:00+00', '2026-03-16 14:00:00+00', '2026-03-18 16:00:00+00'),

  ('hist-002', 'cli-001', 'montagem',
   'Montagem de estante Tok&Stok',
   'Estante de 4 prateleiras Tok&Stok recém-comprada.',
   'Pinheiros', 'Rua Cardeal Arcoverde — Pinheiros', -23.5687, -46.6907,
   'ate_7_dias', 'Até 7 dias', 'qualquer', 180, 280, 1,
   'completed', false, '2026-01-30 09:00:00+00', '2026-02-02 10:00:00+00', '2026-02-04 17:00:00+00'),

  ('hist-003', 'cli-001', 'limpeza',
   'Limpeza pós-mudança',
   'Apartamento de 75 m², pós-mudança, limpeza pesada.',
   'Pinheiros', 'Rua Cardeal Arcoverde — Pinheiros', -23.5687, -46.6907,
   'ate_7_dias', 'Até 7 dias', 'qualquer', 320, 450, 0,
   'completed', false, '2025-12-05 14:00:00+00', '2025-12-07 09:00:00+00', '2025-12-10 18:00:00+00')
on conflict (id) do nothing;

-- ===========================================================================
-- 6. propostas  (40 + 3 históricas aceitas)
-- ===========================================================================

-- dem-001 (destaque, 4 propostas pending)
insert into public.propostas
  (id, demanda_id, prestador_id, value, time_estimate, availability_text, message, status, sent_at)
values
  ('prop-001-a', 'dem-001', 'pro-002', 180.00, '1 hora',     'Posso passar hoje à tarde, entre 14h e 17h',
   'Pelo que descreveu, vou levar reparo de vedação e uma torneira nova compatível como reserva. Se a vedação resolver, cobro só a hora. Se precisar trocar, entra o material no valor combinado.',
   'pending', now() - interval '8 minutes'),
  ('prop-001-b', 'dem-001', 'pro-005', 140.00, '1h30',       'Hoje a partir das 18h ou amanhã 9h',
   'Posso atender hoje à noite. Não levo material — me passa o modelo da torneira que oriento o que comprar antes para não termos que voltar à loja.',
   'pending', now() - interval '6 minutes'),
  ('prop-001-c', 'dem-001', 'pro-009',  95.00, '45 minutos', 'Amanhã à tarde',
   'Atendo na sua região. Provavelmente é a vedação interna, normalmente resolve sem trocar a peça.',
   'pending', now() - interval '4 minutes'),
  ('prop-001-d', 'dem-001', 'pro-001', 220.00, '1 hora',     'Hoje 16h ou amanhã 10h',
   'Trabalho com hidráulica básica também. Levo torneira de reposição equivalente à sua (Docol/Deca). Garantia de 30 dias do serviço.',
   'pending', now() - interval '2 minutes'),

-- dem-002 (já contratada — 1 accepted + 5 rejected)
  ('prop-002-a', 'dem-002', 'pro-006', 160.00, '1h30',  'Sábado de manhã',  'Levo nível a laser e bucha adequada. Furação em alvenaria, sem complicação.',
   'accepted', now() - interval '48 hours'),
  ('prop-002-b', 'dem-002', 'pro-003', 130.00, '1h',    'Quinta à tarde',   'Faço com cuidado, prateleira pesada exige reforço.', 'rejected', now() - interval '47 hours'),
  ('prop-002-c', 'dem-002', 'pro-011', 110.00, '45 min','Quando combinarmos','Faço prateleira simples e dupla. Levo só a furadeira, material por sua conta.', 'rejected', now() - interval '46 hours'),
  ('prop-002-d', 'dem-002', 'pro-009',  90.00, '1h',    'Sábado ou domingo','Atendo aos sábados. Tenho experiência em prateleira com mão francesa.', 'rejected', now() - interval '45 hours'),
  ('prop-002-e', 'dem-002', 'pro-005', 170.00, '1h30',  'Quarta à tarde',   'Faço com nível profissional, alinhamento exato.', 'rejected', now() - interval '44 hours'),
  ('prop-002-f', 'dem-002', 'pro-001', 190.00, '1h',    'Quinta de manhã',  'Posso instalar e revisar pontos elétricos do mesmo cômodo se quiser.', 'rejected', now() - interval '43 hours'),

-- dem-003 (3 pending)
  ('prop-003-a', 'dem-003', 'pro-001', 110.00, '40 min', 'Hoje à noite, 19h-21h', 'Posso passar hoje à noite. Levo lâmpada led e soquete novo se precisar trocar.', 'pending', now() - interval '80 minutes'),
  ('prop-003-b', 'dem-003', 'pro-005',  85.00, '30 min', 'Amanhã 9h',             'Não atendo à noite, mas posso passar cedo amanhã.', 'pending', now() - interval '65 minutes'),
  ('prop-003-c', 'dem-003', 'pro-006', 130.00, '30 min', 'Hoje 20h',              'Tenho escada para 4 m. Resolvo na noite.', 'pending', now() - interval '30 minutes'),

-- dem-004 (2 pending)
  ('prop-004-a', 'dem-004', 'pro-006', 180.00, '1h', 'Amanhã à tarde', 'TV grande em drywall pede reforço. Levo barra de fixação.', 'pending', now() - interval '90 minutes'),
  ('prop-004-b', 'dem-004', 'pro-011', 150.00, '1h', 'Domingo',         'Atendo Tatuapé. Levo nível e parafusos compatíveis.', 'pending', now() - interval '70 minutes'),

-- dem-005 (5 pending)
  ('prop-005-a', 'dem-005', 'pro-004', 380.00, '1 dia',           'Próxima semana, qualquer dia', 'Quarto pequeno, 1 dia inteiro. Cubro tudo, levo fita crepe e proteção do piso. Tinta lavável seca rápido.', 'pending', now() - interval '8 hours'),
  ('prop-005-b', 'dem-005', 'pro-010', 420.00, '1 dia',           'Quinta ou sexta',              'Trabalho com a casa habitada, sem cheiro forte. Cubro mobiliário restante. Acabamento fino.', 'pending', now() - interval '6 hours'),
  ('prop-005-c', 'dem-005', 'pro-007', 350.00, '1 dia',           'Segunda',                      'Limpeza pós-pintura inclusa.', 'pending', now() - interval '5 hours'),
  ('prop-005-d', 'dem-005', 'pro-005', 320.00, '1 dia + retoque', 'Esta semana',                  'Posso fazer com retoque grátis em até 30 dias.', 'pending', now() - interval '4 hours'),
  ('prop-005-e', 'dem-005', 'pro-009', 280.00, '1,5 dias',        'Sábado',                       'Trabalho cuidadoso, cobro hora.', 'pending', now() - interval '2 hours'),

-- dem-006 (3 pending)
  ('prop-006-a', 'dem-006', 'pro-002', 110.00, '40 min', 'Amanhã 9h',     'Bom que já comprou a torneira. Levo conexão extra caso a antiga tenha danificado o ladrão.', 'pending', now() - interval '200 minutes'),
  ('prop-006-b', 'dem-006', 'pro-005',  95.00, '30 min', 'Amanhã 8h',     'Trabalho rápido nesse tipo de troca.', 'pending', now() - interval '180 minutes'),
  ('prop-006-c', 'dem-006', 'pro-009', 130.00, '40 min', 'Hoje à tarde',  'Atendo Butantã hoje mesmo se topar.', 'pending', now() - interval '120 minutes'),

-- dem-007 (4 pending)
  ('prop-007-a', 'dem-007', 'pro-003', 320.00, '4-5 horas', 'Sábado 9h',          'Madesa 6 portas eu faço com olhos fechados. Levo nível e calços. Piso inclinado resolvido com pé regulador.', 'pending', now() - interval '8 hours'),
  ('prop-007-b', 'dem-007', 'pro-012', 380.00, '5 horas',   'Próxima quarta',     'Trabalho cuidadoso, sem riscos. Reviso fechaduras e dobradiças no fim.', 'pending', now() - interval '6 hours'),
  ('prop-007-c', 'dem-007', 'pro-009', 280.00, '5-6 horas', 'Domingo',            'Faço aos finais de semana.', 'pending', now() - interval '4 hours'),
  ('prop-007-d', 'dem-007', 'pro-011', 260.00, '5 horas',   'Sábado à tarde',     'Atendo Lapa. Combine antes a logística do quarto.', 'pending', now() - interval '2 hours'),

-- dem-008 (2 pending)
  ('prop-008-a', 'dem-008', 'pro-008', 150.00, '1 hora', 'Amanhã 8h',     'Levo cortador profissional, descarte combinado. Quintal pequeno, atendo rápido.', 'pending', now() - interval '15 hours'),
  ('prop-008-b', 'dem-008', 'pro-005', 180.00, '1h30',   'Sexta de manhã','Faço corte e adubação leve no mesmo dia se quiser.', 'pending', now() - interval '8 hours'),

-- dem-009 (3 pending)
  ('prop-009-a', 'dem-009', 'pro-006', 120.00, '40 min', 'Hoje à tarde',         'Furadeira de impacto Bosch. 8 furos em alvenaria são rápidos. Levo bucha de 8 mm.', 'pending', now() - interval '4 minutes'),
  ('prop-009-b', 'dem-009', 'pro-001',  95.00, '30 min', 'Hoje 15h-17h',         'Atendo Ipiranga hoje mesmo. Levo furadeira SDS, broca widia e buchas de 8 mm. Sem volta à loja.', 'pending', now() - interval '12 minutes'),
  ('prop-009-c', 'dem-009', 'pro-005', 140.00, '45 min', 'Amanhã pela manhã',    'Posso passar amanhã se topar. Trago tudo que precisa, inclusive nivelamento dos furos.', 'pending', now() - interval '22 minutes'),

-- dem-010 (4 pending — urgente)
  ('prop-010-a', 'dem-010', 'pro-006', 180.00, '40 min', 'Posso ir agora, em 30 min',    'Atendo Vila Madalena, posso sair agora. Levo serralheria portátil, troca de cilindro se precisar.', 'pending', now() - interval '1 minute'),
  ('prop-010-b', 'dem-010', 'pro-001', 220.00, '1 hora', 'Em 1 hora',                    'Estou aqui na região. Cilindro Yale e Stam de reserva no carro. Garantia de 30 dias.', 'pending', now() - interval '1 minute'),
  ('prop-010-c', 'dem-010', 'pro-011', 150.00, '30 min', 'Amanhã 7h antes da viagem',    'Posso passar amanhã bem cedinho, antes da sua viagem. Conserto rápido.', 'pending', now()),
  ('prop-010-d', 'dem-010', 'pro-009', 130.00, '40 min', 'Hoje à noite',                 'Atendo até as 22h hoje. Cilindro novo + lubrificação completa.', 'pending', now())
on conflict (id) do nothing;

-- Propostas aceitas históricas (uma por demanda histórica)
insert into public.propostas
  (id, demanda_id, prestador_id, value, time_estimate, availability_text, message, status, sent_at, responded_at)
values
  ('prop-hist-001', 'hist-001', 'pro-001', 130.00, '1 hora', 'Combinado',
   'Troca de tomada simples. Levo tomada nova de 20A.',
   'accepted', '2026-03-15 11:00:00+00', '2026-03-15 12:30:00+00'),

  ('prop-hist-002', 'hist-002', 'pro-003', 240.00, '3 horas', 'Combinado',
   'Estante Tok&Stok bem feita exige paciência. Levo nível e bits PH2.',
   'accepted', '2026-01-30 10:00:00+00', '2026-01-30 11:00:00+00'),

  ('prop-hist-003', 'hist-003', 'pro-007', 380.00, '6 horas', 'Combinado',
   'Pós-mudança em 75 m². Material próprio, descarte combinado.',
   'accepted', '2025-12-05 15:00:00+00', '2025-12-05 16:30:00+00')
on conflict (id) do nothing;

-- ===========================================================================
-- 7. avaliacoes históricas
--    Trigger desligado para evitar conflito com rating_avg já dado no INSERT
--    de prestadores (esses 3 votos são apenas amostra; rating_avg vem do
--    histórico agregado real do prestador).
-- ===========================================================================
alter table public.avaliacoes disable trigger trg_avaliacao_recalc_rating;

insert into public.avaliacoes
  (demanda_id, autor_id, alvo_id, autor_tipo, nota_geral, comentario, recomenda, published_at)
values
  ('hist-001', 'cli-001', 'pro-001', 'cliente', 5,
   'Trocou a tomada e revisou o quadro inteiro. Trabalho impecável.', true,
   '2026-03-18 20:00:00+00'),
  ('hist-002', 'cli-001', 'pro-003', 'cliente', 5,
   'Montou a estante em três horas, levou os parafusos extras.',     true,
   '2026-02-04 19:00:00+00'),
  ('hist-003', 'cli-001', 'pro-007', 'cliente', 4,
   'Limpeza ótima. Esqueceu um vidro de fora mas voltou no dia seguinte.', true,
   '2025-12-10 21:00:00+00')
on conflict (demanda_id, autor_id) do nothing;

alter table public.avaliacoes enable trigger trg_avaliacao_recalc_rating;

-- ===========================================================================
-- 8. Verificação rápida (sai no log do psql)
-- ===========================================================================
do $$
begin
  raise notice 'Seed concluído. Contagens:';
  raise notice '  categorias:           %', (select count(*) from public.categorias);
  raise notice '  profiles:             %', (select count(*) from public.profiles);
  raise notice '  prestadores:          %', (select count(*) from public.prestadores);
  raise notice '  prestador_categorias: %', (select count(*) from public.prestador_categorias);
  raise notice '  demandas:             %', (select count(*) from public.demandas);
  raise notice '  propostas:            %', (select count(*) from public.propostas);
  raise notice '  avaliacoes:           %', (select count(*) from public.avaliacoes);
end $$;

commit;
