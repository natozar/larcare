/* =========================================================================
   LarCare — push notifications
   =========================================================================
   API:
     requestPermission() — pede permissão (Notification.requestPermission)
     show(title, options) — exibe notificação via SW se disponível
     isGranted() — boolean
     setEnabled(bool) — toggle global persistido
     setCategoryEnabled(cat, bool) — toggle por categoria
     wireSimulatorEvents() — escuta eventos do simulator e dispara push
   Persistência: localStorage:larcare:push_*
   ========================================================================= */
(function (global) {
  'use strict';

  const STORE_GLOBAL = 'larcare:push_enabled';
  const STORE_CAT = 'larcare:push_categories';
  const CATS = ['proposals', 'payments', 'reviews', 'demands'];

  function supported() {
    return 'Notification' in global && 'serviceWorker' in navigator;
  }

  function isGranted() {
    return supported() && Notification.permission === 'granted';
  }

  function permissionState() {
    if (!supported()) return 'unsupported';
    return Notification.permission; // 'default' | 'granted' | 'denied'
  }

  async function requestPermission() {
    if (!supported()) return 'unsupported';
    try {
      const r = await Notification.requestPermission();
      return r;
    } catch (_) { return 'denied'; }
  }

  function isEnabled() {
    const v = localStorage.getItem(STORE_GLOBAL);
    return v === null ? true : v === '1';
  }
  function setEnabled(v) { localStorage.setItem(STORE_GLOBAL, v ? '1' : '0'); }

  function getCategorySettings() {
    try {
      const raw = localStorage.getItem(STORE_CAT);
      return raw ? JSON.parse(raw) : CATS.reduce((o, k) => (o[k] = true, o), {});
    } catch (_) { return CATS.reduce((o, k) => (o[k] = true, o), {}); }
  }
  function isCategoryEnabled(cat) {
    const s = getCategorySettings();
    return s[cat] !== false;
  }
  function setCategoryEnabled(cat, v) {
    const s = getCategorySettings();
    s[cat] = !!v;
    try { localStorage.setItem(STORE_CAT, JSON.stringify(s)); } catch (_) {}
  }

  async function show(title, options, category) {
    if (!isEnabled() || (category && !isCategoryEnabled(category))) return;
    if (!isGranted()) return;
    options = Object.assign({
      body: '',
      icon: 'icons/icon-192.png',
      badge: 'icons/icon-192.png',
      tag: 'larcare-' + Date.now(),
      vibrate: [50, 30, 50]
    }, options || {});
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) await reg.showNotification(title, options);
        return;
      }
    } catch (_) {}
    // Fallback direto (sem SW): tenta API direta
    try { new Notification(title, options); } catch (_) {}
  }

  function wireSimulatorEvents() {
    document.addEventListener('larcare:proposal-received', (e) => {
      if (!e.detail || !e.detail.provider) return;
      show('Nova proposta', {
        body: `${e.detail.provider.first_name} enviou uma proposta`,
        data: { url: '#/cliente/demanda/' + e.detail.demand.id + '/propostas' }
      }, 'proposals');
    });
    document.addEventListener('larcare:payment-confirmed', (e) => {
      const pay = e.detail || {};
      show('Pagamento recebido', {
        body: `R$ ${pay.valor || ''} confirmado — disponível em 2 dias úteis`,
        data: { url: '#/financeiro-prestador' }
      }, 'payments');
    });
    document.addEventListener('larcare:demand-created', (e) => {
      const d = e.detail && e.detail.demand;
      if (!d) return;
      show('Demanda nova na sua região', {
        body: `${d.title} · ${d.neighborhood}`,
        data: { url: '#/prestador/demanda/' + d.id }
      }, 'demands');
    });
  }

  // Bottom sheet pra pedir permissão (2ª interação relevante)
  function maybeAskPermission() {
    if (!supported()) return;
    if (permissionState() !== 'default') return;
    if (localStorage.getItem('larcare:push_asked') === '1') return;
    // Aparece após eventos de engajamento (1 proposta recebida OU 1 pagamento)
    const flag = () => localStorage.setItem('larcare:push_asked', '1');
    function showAskSheet() {
      const ui = global.LarCareUI;
      if (!ui || !ui.modal) return;
      ui.modal({
        title: 'Receber notificações?',
        body: 'Avisamos quando chegar nova proposta, pagamento, avaliação. Você pode desativar depois em Perfil.',
        primary: 'Ativar',
        secondary: 'Agora não',
        onPrimary: async () => { flag(); await requestPermission(); },
        onSecondary: () => { flag(); }
      });
    }
    document.addEventListener('larcare:proposal-received', () => setTimeout(showAskSheet, 4000), { once: true });
    document.addEventListener('larcare:payment-confirmed', () => setTimeout(showAskSheet, 2000), { once: true });
  }

  function start() {
    if (!supported()) return;
    wireSimulatorEvents();
    maybeAskPermission();
  }

  async function testNotification() {
    if (!supported()) {
      if (global.LarCareUI) global.LarCareUI.toast('Notificações não suportadas neste browser', 'warning');
      return;
    }
    if (permissionState() === 'default') {
      const r = await requestPermission();
      if (r !== 'granted') {
        if (global.LarCareUI) global.LarCareUI.toast('Permissão negada', 'warning');
        return;
      }
    }
    if (!isGranted()) {
      if (global.LarCareUI) global.LarCareUI.toast('Permita notificações nas configurações do navegador', 'warning');
      return;
    }
    await show('Notificação de teste', { body: 'Tudo funcionando! 🎉' });
    if (global.LarCareUI) global.LarCareUI.toast('Notificação enviada', 'success');
  }

  global.LarCareNotify = {
    supported, isGranted, permissionState, requestPermission,
    isEnabled, setEnabled, isCategoryEnabled, setCategoryEnabled,
    show, start, testNotification, CATS
  };
})(window);
