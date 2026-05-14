-- =============================================================================
-- LarCare — Row Level Security
-- =============================================================================
-- Princípios:
--   * RLS ON em TODAS as tabelas, incluindo lookups (categorias).
--   * Auth via auth.uid(); função is_admin() encapsula a checagem da tabela admins.
--   * Vetores de risco testados mentalmente:
--       - Prestador inserindo proposta com prestador_id alheio  → WITH CHECK exige
--         que prestador_id case com seu próprio profile (via user_id).
--       - Cliente lendo propostas de outras demandas            → SELECT exige
--         posse da demanda.
--       - Auto-avaliação                                         → CHECK constraint
--         no schema + WITH CHECK que autor_id <> alvo_id.
--       - Prestador vendo demanda fora da sua categoria         → SELECT exige
--         match em prestador_categorias.
--       - Anônimo enumerando demandas                            → não há policy
--         pública em demandas; apenas autenticados.
--   * SECURITY DEFINER em is_admin() para evitar recursão de RLS na lookup admins.
-- =============================================================================

-- helper
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

-- ---------------------------------------------------------------------------
-- enable RLS em tudo
-- ---------------------------------------------------------------------------
alter table public.categorias            enable row level security;
alter table public.profiles              enable row level security;
alter table public.prestadores           enable row level security;
alter table public.prestador_categorias  enable row level security;
alter table public.demandas              enable row level security;
alter table public.propostas             enable row level security;
alter table public.avaliacoes            enable row level security;
alter table public.admins                enable row level security;

-- ===========================================================================
-- categorias  — leitura pública; write só admin
-- ===========================================================================
create policy "categorias_read_public" on public.categorias
  for select using (true);
create policy "categorias_admin_write" on public.categorias
  for all using (public.is_admin()) with check (public.is_admin());

-- ===========================================================================
-- profiles
--   SELECT:
--     - próprio (via user_id)
--     - perfis prestador ativos: leitura pública (necessário p/ landing/feed)
--     - admin
--   UPDATE: próprio
--   INSERT: só pelo dono (ao se cadastrar)
--   DELETE: só admin (soft delete preferível)
-- ===========================================================================
create policy "profiles_self_read" on public.profiles
  for select using (user_id = auth.uid() or public.is_admin());

create policy "profiles_provider_public_read" on public.profiles
  for select using (role = 'prestador' and deleted_at is null);

create policy "profiles_self_insert" on public.profiles
  for insert with check (user_id = auth.uid());

create policy "profiles_self_update" on public.profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ===========================================================================
-- prestadores
--   SELECT: público dos active
--   INSERT: ao cadastrar (precisa que profile correspondente seja do usuário)
--   UPDATE: dono via profiles.user_id
--   DELETE: só admin
-- ===========================================================================
create policy "prestadores_read_public" on public.prestadores
  for select using (active = true);

create policy "prestadores_self_insert" on public.prestadores
  for insert with check (
    exists (select 1 from public.profiles p
            where p.id = profile_id and p.user_id = auth.uid())
  );

create policy "prestadores_self_update" on public.prestadores
  for update using (
    exists (select 1 from public.profiles p
            where p.id = profile_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.profiles p
            where p.id = profile_id and p.user_id = auth.uid())
  );

create policy "prestadores_admin_all" on public.prestadores
  for all using (public.is_admin()) with check (public.is_admin());

-- ===========================================================================
-- prestador_categorias  — leitura pública (parte do perfil); write pelo dono
-- ===========================================================================
create policy "pc_read_public" on public.prestador_categorias
  for select using (true);

create policy "pc_self_write" on public.prestador_categorias
  for all using (
    exists (select 1 from public.profiles p
            where p.id = prestador_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.profiles p
            where p.id = prestador_id and p.user_id = auth.uid())
  );

create policy "pc_admin_all" on public.prestador_categorias
  for all using (public.is_admin()) with check (public.is_admin());

-- ===========================================================================
-- demandas
--   SELECT:
--     - dono da demanda
--     - prestador autenticado em categoria compatível (feed) e status open/proposals
--     - admin
--   INSERT: cliente autenticado, force client_id == seu profile
--   UPDATE: dono enquanto status in (open, proposals)
--   DELETE: só admin
-- ===========================================================================
create policy "demandas_owner_read" on public.demandas
  for select using (
    exists (select 1 from public.profiles p
            where p.id = client_id and p.user_id = auth.uid())
    or public.is_admin()
  );

create policy "demandas_prestador_feed_read" on public.demandas
  for select using (
    deleted_at is null
    and status in ('open','proposals')
    and exists (
      select 1
      from public.profiles pp
      join public.prestadores pr on pr.profile_id = pp.id
      join public.prestador_categorias pc on pc.prestador_id = pr.profile_id
      where pp.user_id = auth.uid()
        and pc.categoria_id = demandas.categoria_id
        and pr.active = true
    )
  );

create policy "demandas_self_insert" on public.demandas
  for insert with check (
    exists (select 1 from public.profiles p
            where p.id = client_id
              and p.user_id = auth.uid()
              and p.role = 'cliente')
  );

create policy "demandas_owner_update" on public.demandas
  for update using (
    exists (select 1 from public.profiles p
            where p.id = client_id and p.user_id = auth.uid())
    and status in ('open','proposals')
  ) with check (
    exists (select 1 from public.profiles p
            where p.id = client_id and p.user_id = auth.uid())
  );

create policy "demandas_admin_all" on public.demandas
  for all using (public.is_admin()) with check (public.is_admin());

-- ===========================================================================
-- propostas
--   SELECT:
--     - cliente dono da demanda
--     - prestador autor
--     - admin
--   INSERT: prestador autenticado em categoria compatível, prestador_id == ele
--   UPDATE:
--     - prestador autor enquanto status='pending' (pode editar/cancelar)
--     - cliente dono pode mover status para accepted/rejected
--   DELETE: só admin
-- ===========================================================================
create policy "propostas_client_read" on public.propostas
  for select using (
    exists (
      select 1 from public.demandas d
      join public.profiles p on p.id = d.client_id
      where d.id = demanda_id and p.user_id = auth.uid()
    )
  );

create policy "propostas_provider_read" on public.propostas
  for select using (
    exists (select 1 from public.profiles p
            where p.id = prestador_id and p.user_id = auth.uid())
  );

create policy "propostas_admin_all" on public.propostas
  for all using (public.is_admin()) with check (public.is_admin());

create policy "propostas_self_insert" on public.propostas
  for insert with check (
    exists (
      select 1
      from public.profiles p
      join public.prestadores pr on pr.profile_id = p.id
      join public.prestador_categorias pc on pc.prestador_id = pr.profile_id
      join public.demandas d on d.id = demanda_id
      where p.user_id = auth.uid()
        and p.id = prestador_id
        and pc.categoria_id = d.categoria_id
        and d.status in ('open','proposals')
        and d.deleted_at is null
    )
  );

create policy "propostas_author_update" on public.propostas
  for update using (
    exists (select 1 from public.profiles p
            where p.id = prestador_id and p.user_id = auth.uid())
    and status = 'pending'
  ) with check (
    exists (select 1 from public.profiles p
            where p.id = prestador_id and p.user_id = auth.uid())
  );

create policy "propostas_client_decision" on public.propostas
  for update using (
    exists (
      select 1 from public.demandas d
      join public.profiles p on p.id = d.client_id
      where d.id = demanda_id and p.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.demandas d
      join public.profiles p on p.id = d.client_id
      where d.id = demanda_id and p.user_id = auth.uid()
    )
  );

-- ===========================================================================
-- avaliacoes
--   SELECT: público (publicadas — sem rascunho neste esquema)
--   INSERT: envolvidos na demanda concluída, sem auto-avaliação
--   UPDATE/DELETE: só admin (avaliação é imutável por design)
-- ===========================================================================
create policy "avaliacoes_read_public" on public.avaliacoes
  for select using (true);

create policy "avaliacoes_self_insert" on public.avaliacoes
  for insert with check (
    autor_id <> alvo_id
    and exists (select 1 from public.profiles p
                where p.id = autor_id and p.user_id = auth.uid())
    and exists (
      select 1 from public.demandas d
      where d.id = demanda_id and d.status = 'completed'
        and (
          (autor_tipo = 'cliente'
            and d.client_id = autor_id
            and exists (select 1 from public.propostas pr
                        where pr.demanda_id = d.id
                          and pr.prestador_id = alvo_id
                          and pr.status = 'accepted'))
          or
          (autor_tipo = 'prestador'
            and d.client_id = alvo_id
            and exists (select 1 from public.propostas pr
                        where pr.demanda_id = d.id
                          and pr.prestador_id = autor_id
                          and pr.status = 'accepted'))
        )
    )
  );

create policy "avaliacoes_admin_all" on public.avaliacoes
  for all using (public.is_admin()) with check (public.is_admin());

-- ===========================================================================
-- admins  — opaca a não-admins
-- ===========================================================================
create policy "admins_read_admin" on public.admins
  for select using (public.is_admin());

create policy "admins_write_admin" on public.admins
  for all using (public.is_admin()) with check (public.is_admin());
