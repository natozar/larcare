/* =========================================================================
   LarCare — internacionalização (i18n)
   =========================================================================
   API:
     t(key, params?) — retorna string traduzida com interpolação {var}
     setLocale(locale) — muda idioma e dispara re-render
     getLocale() — retorna locale atual
     formatCurrency(value) — formata moeda conforme locale
     formatDate(d) — formata data conforme locale
   Locales suportados: pt-BR (default), en-US, es-ES
   Persistência: localStorage:larcare:locale
   ========================================================================= */
(function (global) {
  'use strict';

  const STORE = 'larcare:locale';
  const DEFAULT = 'pt-BR';
  const SUPPORTED = ['pt-BR', 'en-US', 'es-ES'];

  // Subset de chaves cobertas — owner expande conforme necessário
  const DICTIONARIES = {
    'pt-BR': {
      'common.next': 'Próximo',
      'common.back': 'Voltar',
      'common.cancel': 'Cancelar',
      'common.confirm': 'Confirmar',
      'common.save': 'Salvar',
      'common.loading': 'Carregando…',
      'common.error': 'Algo deu errado',
      'common.retry': 'Tentar novamente',
      'common.search': 'Buscar',
      'common.see_all': 'Ver tudo',
      'common.empty': 'Nenhum resultado',
      'home.cta_primary': 'Preciso de um reparo',
      'home.cta_secondary': 'Sou prestador',
      'nav.home': 'Início',
      'nav.search': 'Buscar',
      'nav.conversations': 'Conversas',
      'nav.profile': 'Perfil',
      'nav.dashboard': 'Dashboard',
      'nav.demands': 'Demandas',
      'profile.theme': 'Tema',
      'profile.theme.light': 'Claro',
      'profile.theme.dark': 'Escuro',
      'profile.theme.system': 'Sistema',
      'profile.language': 'Idioma',
      'profile.notifications': 'Notificações',
      'profile.sounds': 'Sons',
      'profile.vibration': 'Vibração',
      'payment.title': 'Pagamento',
      'payment.total': 'Total',
      'payment.fee_label': 'Taxa LarCare (5%)',
      'payment.pay_button': 'Pagar R$ {total}',
      'payment.confirmed': 'Pagamento confirmado!',
      'chat.typing': 'digitando…',
      'chat.online': 'online',
      'chat.send': 'Enviar',
      'time.now': 'agora mesmo',
      'time.minutes_ago': 'há {min} min',
      'time.hours_ago': 'há {h}h',
      'time.days_ago': 'há {d}d',
      'demand.create': 'Criar nova solicitação',
      'demand.urgency.now': 'Agora',
      'demand.urgency.today': 'Hoje',
      'demand.urgency.this_week': 'Esta semana',
      'demand.urgency.no_rush': 'Sem pressa',
      'demand.status.open': 'Aberta',
      'demand.status.proposals': 'Recebendo propostas',
      'demand.status.hired': 'Contratada',
      'demand.status.completed': 'Concluída',
      'demand.status.cancelled': 'Cancelada',
      'proposal.send': 'Enviar proposta',
      'proposal.accept': 'Aceitar',
      'proposal.reject': 'Recusar',
      'proposal.message_label': 'Mensagem para o cliente',
      'review.rate': 'Avaliar serviço',
      'review.thanks': 'Obrigado pela avaliação!',
      'chat.placeholder': 'Mensagem',
      'chat.record_hint': 'Solte para enviar · arraste pra cancelar',
      'emergency.cta': 'Preciso de ajuda agora',
      'emergency.searching': 'Buscando prestadores prioritários',
      'emergency.sla': 'SLA: primeira resposta em',
      'favorites.empty': 'Nenhum favorito ainda',
      'favorites.add': 'Adicionar aos favoritos',
      'favorites.remove': 'Remover dos favoritos',
      'history.empty': 'Nenhum serviço ainda'
    },
    'en-US': {
      'common.next': 'Next',
      'common.back': 'Back',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.save': 'Save',
      'common.loading': 'Loading…',
      'common.error': 'Something went wrong',
      'common.retry': 'Try again',
      'common.search': 'Search',
      'common.see_all': 'See all',
      'common.empty': 'No results',
      'home.cta_primary': 'I need a repair',
      'home.cta_secondary': "I'm a provider",
      'nav.home': 'Home',
      'nav.search': 'Search',
      'nav.conversations': 'Chats',
      'nav.profile': 'Profile',
      'nav.dashboard': 'Dashboard',
      'nav.demands': 'Demands',
      'profile.theme': 'Theme',
      'profile.theme.light': 'Light',
      'profile.theme.dark': 'Dark',
      'profile.theme.system': 'System',
      'profile.language': 'Language',
      'profile.notifications': 'Notifications',
      'profile.sounds': 'Sounds',
      'profile.vibration': 'Vibration',
      'payment.title': 'Payment',
      'payment.total': 'Total',
      'payment.fee_label': 'LarCare fee (5%)',
      'payment.pay_button': 'Pay $ {total}',
      'payment.confirmed': 'Payment confirmed!',
      'chat.typing': 'typing…',
      'chat.online': 'online',
      'chat.send': 'Send',
      'time.now': 'just now',
      'time.minutes_ago': '{min} min ago',
      'time.hours_ago': '{h}h ago',
      'time.days_ago': '{d}d ago',
      'demand.create': 'New request',
      'demand.urgency.now': 'Now',
      'demand.urgency.today': 'Today',
      'demand.urgency.this_week': 'This week',
      'demand.urgency.no_rush': 'No rush',
      'demand.status.open': 'Open',
      'demand.status.proposals': 'Receiving bids',
      'demand.status.hired': 'Hired',
      'demand.status.completed': 'Completed',
      'demand.status.cancelled': 'Cancelled',
      'proposal.send': 'Send bid',
      'proposal.accept': 'Accept',
      'proposal.reject': 'Decline',
      'proposal.message_label': 'Message to client',
      'review.rate': 'Rate service',
      'review.thanks': 'Thanks for the review!',
      'chat.placeholder': 'Message',
      'chat.record_hint': 'Release to send · drag to cancel',
      'emergency.cta': 'I need help now',
      'emergency.searching': 'Finding priority providers',
      'emergency.sla': 'SLA: first response in',
      'favorites.empty': 'No favorites yet',
      'favorites.add': 'Add to favorites',
      'favorites.remove': 'Remove from favorites',
      'history.empty': 'No services yet'
    },
    'es-ES': {
      'common.next': 'Siguiente',
      'common.back': 'Volver',
      'common.cancel': 'Cancelar',
      'common.confirm': 'Confirmar',
      'common.save': 'Guardar',
      'common.loading': 'Cargando…',
      'common.error': 'Algo salió mal',
      'common.retry': 'Reintentar',
      'common.search': 'Buscar',
      'common.see_all': 'Ver todo',
      'common.empty': 'Sin resultados',
      'home.cta_primary': 'Necesito una reparación',
      'home.cta_secondary': 'Soy prestador',
      'nav.home': 'Inicio',
      'nav.search': 'Buscar',
      'nav.conversations': 'Chats',
      'nav.profile': 'Perfil',
      'nav.dashboard': 'Panel',
      'nav.demands': 'Solicitudes',
      'profile.theme': 'Tema',
      'profile.theme.light': 'Claro',
      'profile.theme.dark': 'Oscuro',
      'profile.theme.system': 'Sistema',
      'profile.language': 'Idioma',
      'profile.notifications': 'Notificaciones',
      'profile.sounds': 'Sonidos',
      'profile.vibration': 'Vibración',
      'payment.title': 'Pago',
      'payment.total': 'Total',
      'payment.fee_label': 'Comisión LarCare (5%)',
      'payment.pay_button': 'Pagar € {total}',
      'payment.confirmed': '¡Pago confirmado!',
      'chat.typing': 'escribiendo…',
      'chat.online': 'en línea',
      'chat.send': 'Enviar',
      'time.now': 'ahora mismo',
      'time.minutes_ago': 'hace {min} min',
      'time.hours_ago': 'hace {h}h',
      'time.days_ago': 'hace {d}d',
      'demand.create': 'Nueva solicitud',
      'demand.urgency.now': 'Ahora',
      'demand.urgency.today': 'Hoy',
      'demand.urgency.this_week': 'Esta semana',
      'demand.urgency.no_rush': 'Sin prisa',
      'demand.status.open': 'Abierta',
      'demand.status.proposals': 'Recibiendo ofertas',
      'demand.status.hired': 'Contratada',
      'demand.status.completed': 'Completada',
      'demand.status.cancelled': 'Cancelada',
      'proposal.send': 'Enviar oferta',
      'proposal.accept': 'Aceptar',
      'proposal.reject': 'Rechazar',
      'proposal.message_label': 'Mensaje al cliente',
      'review.rate': 'Calificar servicio',
      'review.thanks': '¡Gracias por tu reseña!',
      'chat.placeholder': 'Mensaje',
      'chat.record_hint': 'Suelta para enviar · arrastra para cancelar',
      'emergency.cta': 'Necesito ayuda ahora',
      'emergency.searching': 'Buscando proveedores prioritarios',
      'emergency.sla': 'SLA: primera respuesta en',
      'favorites.empty': 'Sin favoritos aún',
      'favorites.add': 'Añadir a favoritos',
      'favorites.remove': 'Quitar de favoritos',
      'history.empty': 'Sin servicios aún'
    }
  };

  function getLocale() {
    try {
      const stored = localStorage.getItem(STORE);
      if (stored && SUPPORTED.includes(stored)) return stored;
    } catch (_) {}
    // Auto-detecta da primeira visita
    const nav = global.navigator && global.navigator.language;
    if (nav && SUPPORTED.includes(nav)) return nav;
    if (nav && nav.startsWith('pt')) return 'pt-BR';
    if (nav && nav.startsWith('es')) return 'es-ES';
    if (nav && nav.startsWith('en')) return 'en-US';
    return DEFAULT;
  }

  function setLocale(loc) {
    if (!SUPPORTED.includes(loc)) return;
    try { localStorage.setItem(STORE, loc); } catch (_) {}
    document.documentElement.lang = loc.split('-')[0]; // <html lang="pt">
    if (global.LarCareApp && global.LarCareApp.rerender) global.LarCareApp.rerender();
  }

  function t(key, params) {
    const loc = getLocale();
    const dict = DICTIONARIES[loc] || DICTIONARIES[DEFAULT];
    let str = dict[key] || DICTIONARIES[DEFAULT][key] || key;
    if (params) {
      Object.keys(params).forEach((p) => {
        str = str.replace(new RegExp('\\{' + p + '\\}', 'g'), params[p]);
      });
    }
    return str;
  }

  function formatCurrency(value) {
    const loc = getLocale();
    const currencies = { 'pt-BR': 'BRL', 'en-US': 'USD', 'es-ES': 'EUR' };
    try {
      return new Intl.NumberFormat(loc, { style: 'currency', currency: currencies[loc] || 'BRL', maximumFractionDigits: 0 }).format(value);
    } catch (_) { return 'R$ ' + value; }
  }

  function formatDate(d) {
    const loc = getLocale();
    try { return new Date(d).toLocaleDateString(loc, { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch (_) { return String(d); }
  }

  function init() {
    document.documentElement.lang = getLocale().split('-')[0];
  }

  global.LarCareI18n = { t, getLocale, setLocale, formatCurrency, formatDate, init, SUPPORTED };
})(window);
