/* =========================================================================
   LarCare — gerenciador de tema (claro / escuro / sistema)
   =========================================================================
   Aplica via data-theme no <html>. 3 modos:
     - 'light': força tema claro
     - 'dark': força tema escuro
     - 'system': segue prefers-color-scheme (default)
   Persiste em localStorage:larcare:theme_preference.
   Atualiza <meta name="theme-color"> dinamicamente.
   ========================================================================= */
(function (global) {
  'use strict';

  const STORE = 'larcare:theme_preference';
  const VALID = ['light', 'dark', 'system'];

  function getPreference() {
    try { const v = localStorage.getItem(STORE); return VALID.includes(v) ? v : 'system'; } catch (_) { return 'system'; }
  }
  function setPreference(v) {
    if (!VALID.includes(v)) return;
    try { localStorage.setItem(STORE, v); } catch (_) {}
    apply();
  }
  function effectiveTheme() {
    const pref = getPreference();
    if (pref === 'light' || pref === 'dark') return pref;
    return global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function apply() {
    const t = effectiveTheme();
    document.documentElement.setAttribute('data-theme', t);
    // Atualiza meta theme-color para o PWA status bar
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#1A2E27' : '#3E6B5C');
  }
  function init() {
    apply();
    // Reage a mudanças de preferência do sistema quando em modo 'system'
    if (global.matchMedia) {
      const mq = global.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', () => { if (getPreference() === 'system') apply(); });
    }
  }

  global.LarCareTheme = { getPreference, setPreference, effectiveTheme, init, apply };
})(window);
