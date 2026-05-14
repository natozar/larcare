/* =========================================================================
   LarCare — detector de plataforma e estado de instalação PWA
   =========================================================================
   API limpa:
     LarCareDetect.isIOS()        → iPhone/iPad/iPod (incluindo iPadOS-as-Mac)
     LarCareDetect.isAndroid()    → Chrome/Edge/Samsung Internet em Android
     LarCareDetect.isStandalone() → já instalado (Android display-mode OU iOS navigator.standalone)
     LarCareDetect.isInAppBrowser() → Instagram/FB/WhatsApp/Telegram/Twitter/LinkedIn webview
     LarCareDetect.supportsNativePrompt() → tem suporte a beforeinstallprompt
     LarCareDetect.getContext() → snapshot completo { platform, canInstall, isInstalled, inAppBrowser, hasNative }
   ========================================================================= */
(function (global) {
  'use strict';

  const ua = (global.navigator && global.navigator.userAgent) || '';

  function isIOS() {
    if (/iPhone|iPad|iPod/i.test(ua)) return true;
    // iPadOS 13+ identifica como Mac. Detectar via touch capability + MacIntel platform.
    const platform = global.navigator && global.navigator.platform;
    const maxTouch = (global.navigator && global.navigator.maxTouchPoints) || 0;
    if (platform === 'MacIntel' && maxTouch > 1) return true;
    // Última defesa: presença de navigator.standalone (API só-iOS) implica iOS
    if (typeof global.navigator.standalone === 'boolean') return true;
    return false;
  }

  function isAndroid() { return /Android/i.test(ua); }

  function isStandalone() {
    try {
      if (global.matchMedia && global.matchMedia('(display-mode: standalone)').matches) return true;
    } catch (_) { /* matchMedia inexistente em ambientes velhos */ }
    if (global.navigator && global.navigator.standalone === true) return true;
    return false;
  }

  // In-app browsers conhecidos. Lista por UA marker; cobre os mais comuns no Brasil.
  const IN_APP_MARKERS = [
    'Instagram',      // Instagram
    'FBAN', 'FBAV',   // Facebook
    'FB_IAB',         // Facebook in-app
    'Messenger',      // FB Messenger
    'WhatsApp',       // WhatsApp link preview/share
    'Telegram',       // TelegramBot e variantes
    'TwitterAndroid', 'Twitter for',  // X / Twitter
    'LinkedInApp',    // LinkedIn
    'TikTok',         // TikTok
    'Snapchat',       // Snap
    'Line/'           // LINE messenger
  ];
  function isInAppBrowser() {
    return IN_APP_MARKERS.some((m) => ua.indexOf(m) !== -1);
  }

  function supportsNativePrompt() {
    // beforeinstallprompt é Chromium-only (Chrome, Edge, Brave, Samsung Internet).
    // Não disponível em iOS Safari, Firefox, ou alguns in-app browsers.
    return 'onbeforeinstallprompt' in global || isAndroid();
  }

  function platform() {
    if (isStandalone()) return 'installed';
    if (isInAppBrowser()) return 'in_app_browser';
    if (isIOS()) return 'ios';
    if (isAndroid()) return 'android';
    return 'desktop';
  }

  function getContext() {
    const inApp = isInAppBrowser();
    const installed = isStandalone();
    const p = platform();
    return {
      platform: p,
      isInstalled: installed,
      inAppBrowser: inApp,
      hasNativePrompt: supportsNativePrompt() && !inApp,
      canInstall: !installed && !inApp && (p === 'android' || p === 'ios' || p === 'desktop')
    };
  }

  // Debug log no boot (silencioso em produção via console.debug)
  try {
    if (console && console.debug) {
      console.debug('[LarCareDetect]', getContext(), { ua: ua.substring(0, 120) });
    }
  } catch (_) {}

  global.LarCareDetect = {
    isIOS, isAndroid, isStandalone, isInAppBrowser, supportsNativePrompt,
    platform, getContext
  };
})(window);
