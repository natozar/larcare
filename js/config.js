/* =========================================================================
   LarCare — configuração de runtime
   =========================================================================
   Este arquivo é commitado intencionalmente. A anon key do Supabase é
   pública por design (a segurança vem das policies de RLS, não do segredo
   da chave). A service_role key NUNCA aparece aqui.

   Flag de hot-swap:
     USE_SUPABASE=false → o app roda 100% sobre js/mock_data.js (default
                         seguro, idêntico ao protótipo no ar).
     USE_SUPABASE=true  → o app consulta o Supabase no boot e popula
                         window.LarCareData com dados reais.

   Para ligar o backend real:
     1) provisione um projeto Supabase
     2) rode as migrations em supabase/migrations/ (supabase db push)
     3) rode o seed em supabase/seed.sql (supabase db execute --file ...)
     4) preencha SUPABASE_URL e SUPABASE_ANON_KEY abaixo
     5) flipe USE_SUPABASE para true e re-publique
   ========================================================================= */
(function (global) {
  'use strict';
  global.LarCareConfig = {
    USE_SUPABASE: false,
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
    // CDN do SDK supabase-js v2 via ESM. Carregado por dynamic import só
    // quando USE_SUPABASE=true.
    SUPABASE_SDK_URL: 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm',
    // Versão visível ao usuário (perfil → "Versão do aplicativo").
    // Manter sincronizada com CACHE_VERSION do sw.js a cada deploy.
    VERSION: '2.3.5'
  };
})(window);
