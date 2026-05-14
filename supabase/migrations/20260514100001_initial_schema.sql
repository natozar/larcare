-- =============================================================================
-- LarCare — schema inicial
-- =============================================================================
-- Convenções:
--   * IDs textuais em entidades que aparecem na URL do PWA (categorias,
--     demandas, propostas, profiles) preservam slugs vindos do mock (`dem-001`,
--     `pro-001`, `cli-001`, `eletrica`). Isso permite hot-swap entre mock e
--     backend sem mudar rotas.
--   * Avaliações usam UUID (não aparecem em URLs e queremos imutabilidade forte).
--   * Geolocalização é lat/lng double precision + função haversine. PostGIS fica
--     deferido até a busca por raio virar gargalo real.
--   * Soft delete em profiles/prestadores/demandas (preserva dataset, o ativo de
--     longo prazo). Hard delete em propostas (alta churn, sem valor histórico).
--   * CHECK constraints em vez de ENUM types (alteração futura sem ALTER TYPE).
--   * Admin é tabela própria (simples, evita JWT claims).
-- =============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- haversine (km). Imutável → indexável se virar necessidade.
-- ---------------------------------------------------------------------------
create or replace function public.distance_km(
  lat1 double precision, lng1 double precision,
  lat2 double precision, lng2 double precision
) returns double precision language sql immutable as $$
  select 6371 * 2 * asin(sqrt(
    power(sin(radians((lat2 - lat1) / 2)), 2)
    + cos(radians(lat1)) * cos(radians(lat2))
    * power(sin(radians((lng2 - lng1) / 2)), 2)
  ))
$$;

-- ===========================================================================
-- categorias
-- ===========================================================================
create table public.categorias (
  id          text primary key,            -- slug. Ex.: 'eletrica'
  nome        text not null,               -- 'Elétrica residencial'
  icone       text,                        -- chave de ícone consumida pelo PWA
  blurb       text,                        -- microcopy curto na landing
  ordem       int  default 0,              -- ordenação visual
  ativo       boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
comment on table public.categorias is 'Catálogo de categorias de serviço (lookup público).';

create trigger trg_categorias_updated before update on public.categorias
  for each row execute procedure public.set_updated_at();

-- ===========================================================================
-- profiles  (cliente | prestador | admin)
-- ===========================================================================
create table public.profiles (
  id              text primary key,            -- mock-friendly slug (cli-001, pro-001)
  user_id         uuid unique references auth.users(id) on delete set null,
                                              -- nullable: seed/demo profiles existem sem auth
  role            text not null check (role in ('cliente','prestador','admin')),
  first_name      text not null,
  full_name       text,
  initials        text,
  age             int check (age between 14 and 110),
  avatar_color    text check (avatar_color in ('primary','accent','soft','neutral')),
  email           text,
  phone           text,
  neighborhood    text,
  city            text,
  state           text,
  address         text,
  cep             text,
  latitude        double precision,
  longitude       double precision,
  member_since    date default current_date,
  deleted_at      timestamptz,                -- soft delete
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
comment on table public.profiles is
  'Identidade base. user_id linka com auth.users quando há sign-up real; pode ser NULL para seeds de demo.';

create index ix_profiles_user_id   on public.profiles(user_id);
create index ix_profiles_role_live on public.profiles(role) where deleted_at is null;
create index ix_profiles_geo_live  on public.profiles(latitude, longitude) where deleted_at is null;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ===========================================================================
-- prestadores  (extensão 1:1 de profiles)
-- ===========================================================================
create table public.prestadores (
  profile_id          text primary key references public.profiles(id) on delete cascade,
  bio                 text,
  radius_km           int default 10 check (radius_km > 0 and radius_km <= 100),
  rating_avg          numeric(3,2) default 0 check (rating_avg between 0 and 5),
                                                  -- denormalizado: mantido por trigger
  rating_count        int default 0 check (rating_count >= 0),
  response_minutes    int,
  acceptance_rate     numeric(3,2) check (acceptance_rate between 0 and 1),
  brings_material     text check (brings_material in ('sim','nao','depende')),
  has_vehicle         boolean default false,
  availability        jsonb,                       -- { mon:[m,t,n], tue:[...] }
  verified_identity   boolean default false,
  verified_background boolean default false,
  verified_address    boolean default false,
  last_check          date,
  approved_at         timestamptz,
  active              boolean default true,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
comment on table public.prestadores is
  'Dados técnicos do prestador. rating_avg/rating_count mantidos por trigger after-insert em avaliacoes.';

create index ix_prestadores_active_live on public.prestadores(active) where active = true;
create index ix_prestadores_rating      on public.prestadores(rating_avg desc, rating_count desc);

create trigger trg_prestadores_updated before update on public.prestadores
  for each row execute procedure public.set_updated_at();

-- ===========================================================================
-- prestador_categorias  (m:n)
-- ===========================================================================
create table public.prestador_categorias (
  prestador_id   text references public.prestadores(profile_id) on delete cascade,
  categoria_id   text references public.categorias(id)          on delete restrict,
  years          int default 0 check (years >= 0 and years <= 80),
  primary key (prestador_id, categoria_id)
);
comment on table public.prestador_categorias is
  'Especialidades por prestador com anos de experiência. Usada por RLS para filtrar feed do prestador por categoria.';

create index ix_pc_categoria on public.prestador_categorias(categoria_id);

-- ===========================================================================
-- demandas
-- ===========================================================================
create table public.demandas (
  id                  text primary key,        -- 'dem-001'. URL-friendly.
  client_id           text not null references public.profiles(id) on delete restrict,
  categoria_id        text not null references public.categorias(id) on delete restrict,
  title               text not null,
  description         text,
  neighborhood        text,
  address_summary     text,                    -- exibido antes da contratação (sem número)
  latitude            double precision,
  longitude           double precision,
  urgency             text check (urgency in ('hoje','ate_3_dias','ate_7_dias','sem_pressa')),
  urgency_label       text,
  time_pref           text check (time_pref in ('manha','tarde','noite','qualquer')),
  budget_min          int check (budget_min >= 0),
  budget_max          int check (budget_max >= 0),
  photos_count        int default 0 check (photos_count >= 0),
  status              text not null default 'open'
                        check (status in ('open','proposals','hired','completed','cancelled','expired')),
  featured_for_demo   boolean default false,   -- flag da demanda destaque do pitch (dem-001)
  published_at        timestamptz default now(),
  expires_at          timestamptz,
  hired_at            timestamptz,
  completed_at        timestamptz,
  deleted_at          timestamptz,             -- soft delete
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),
  check (budget_max is null or budget_min is null or budget_max >= budget_min)
);
comment on table public.demandas is
  'Pedido publicado por cliente. Status evolui: open → proposals → hired → completed (ou cancelled/expired).';

create index ix_demandas_status_live on public.demandas(status) where deleted_at is null;
create index ix_demandas_cat_live    on public.demandas(categoria_id) where deleted_at is null;
create index ix_demandas_client      on public.demandas(client_id);
create index ix_demandas_geo_live    on public.demandas(latitude, longitude) where deleted_at is null;
create index ix_demandas_published   on public.demandas(published_at desc);

create trigger trg_demandas_updated before update on public.demandas
  for each row execute procedure public.set_updated_at();

-- ===========================================================================
-- propostas
-- ===========================================================================
create table public.propostas (
  id                  text primary key,        -- 'prop-001-a'
  demanda_id          text not null references public.demandas(id)                  on delete cascade,
  prestador_id        text not null references public.prestadores(profile_id)       on delete cascade,
  value               numeric(10,2) not null check (value > 0),
  time_estimate       text,
  availability_text   text,
  message             text,
  status              text not null default 'pending'
                        check (status in ('pending','accepted','rejected','withdrawn')),
  sent_at             timestamptz default now(),
  responded_at        timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),
  unique (demanda_id, prestador_id)            -- um prestador propõe uma vez por demanda
);
comment on table public.propostas is
  'Proposta enviada por prestador para uma demanda. Hard-delete por design (churn alta, sem valor histórico).';

create index ix_propostas_demanda    on public.propostas(demanda_id);
create index ix_propostas_prestador  on public.propostas(prestador_id);
create index ix_propostas_status     on public.propostas(status);

create trigger trg_propostas_updated before update on public.propostas
  for each row execute procedure public.set_updated_at();

-- ===========================================================================
-- avaliacoes
-- ===========================================================================
create table public.avaliacoes (
  id                  uuid primary key default uuid_generate_v4(),
  demanda_id          text not null references public.demandas(id) on delete restrict,
  autor_id            text not null references public.profiles(id) on delete restrict,
  alvo_id             text not null references public.profiles(id) on delete restrict,
  autor_tipo          text not null check (autor_tipo in ('cliente','prestador')),
  -- nota_geral é sempre obrigatória. As dimensões por aspecto são opcionais (UI mostra
  -- dimensões diferentes pra cliente vs prestador).
  nota_geral          int  not null check (nota_geral between 1 and 5),
  nota_pontualidade   int  check (nota_pontualidade between 1 and 5),
  nota_qualidade      int  check (nota_qualidade between 1 and 5),
  nota_postura        int  check (nota_postura between 1 and 5),
  nota_preco          int  check (nota_preco between 1 and 5),
  comentario          text,
  recomenda           boolean,
  published_at        timestamptz default now(),
  created_at          timestamptz default now(),
  check (autor_id <> alvo_id),                     -- nunca auto-avaliação
  unique (demanda_id, autor_id)                    -- um voto por demanda por ator
);
comment on table public.avaliacoes is
  'Avaliação cruzada após demanda concluída. Imutável (sem updated_at). Trigger recalcula rating_avg do prestador.';

create index ix_avaliacoes_alvo    on public.avaliacoes(alvo_id);
create index ix_avaliacoes_demanda on public.avaliacoes(demanda_id);

-- ---------------------------------------------------------------------------
-- trigger: recalcula rating_avg/rating_count do prestador quando ele recebe avaliação
-- (autor_tipo='cliente' significa: cliente avaliando prestador)
-- ---------------------------------------------------------------------------
create or replace function public.recalc_prestador_rating()
returns trigger language plpgsql as $$
declare
  v_alvo text;
begin
  if new.autor_tipo = 'cliente' then
    v_alvo := new.alvo_id;
    update public.prestadores
      set rating_count = (
            select count(*) from public.avaliacoes a
            where a.alvo_id = v_alvo and a.autor_tipo = 'cliente'
          ),
          rating_avg = coalesce((
            select round(avg(nota_geral)::numeric, 2) from public.avaliacoes a
            where a.alvo_id = v_alvo and a.autor_tipo = 'cliente'
          ), 0)
      where profile_id = v_alvo;
  end if;
  return new;
end;
$$;

create trigger trg_avaliacao_recalc_rating
  after insert on public.avaliacoes
  for each row execute procedure public.recalc_prestador_rating();

-- ===========================================================================
-- admins
-- ===========================================================================
create table public.admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  granted_at  timestamptz default now(),
  granted_by  uuid references auth.users(id)
);
comment on table public.admins is
  'Usuários com privilégio administrativo (moderação, suporte, aprovação de prestador).';
