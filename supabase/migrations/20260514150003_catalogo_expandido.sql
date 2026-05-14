-- =============================================================================
-- LarCare — catálogo expandido (taxonomia em 2 níveis)
-- =============================================================================
-- Adiciona tabela grupos_categoria + FK em categorias.
-- Novas categorias cobrem o universo de "cuidado cotidiano" do lar feminino
-- urbano classe B/C: limpeza, jardim, dedetização, pet sitter, cuidador
-- de idoso, babá. Total: 4 grupos × 18 categorias.
-- =============================================================================

create table public.grupos_categoria (
  id          text primary key,
  nome        text not null,
  emoji       text,            -- ícone unicode pra grids visuais
  ordem       int default 0,
  ativo       boolean default true,
  created_at  timestamptz default now()
);
comment on table public.grupos_categoria is
  'Agrupamento visual de categorias (Reparos, Limpeza, Casa, Família).';

alter table public.categorias add column grupo_id text references public.grupos_categoria(id);
alter table public.categorias add column emoji text;

create index ix_categorias_grupo on public.categorias(grupo_id);

-- RLS: leitura pública, write só admin (mesmo pattern de categorias)
alter table public.grupos_categoria enable row level security;

create policy "grupos_read_public" on public.grupos_categoria for select using (true);
create policy "grupos_admin_write" on public.grupos_categoria for all
  using (public.is_admin()) with check (public.is_admin());
