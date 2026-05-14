/* =========================================================================
   LarCare — wrapper Leaflet (mapa real interativo)
   =========================================================================
   Dependência: Leaflet 1.9.4 via CDN no <head>.
   API:
     LarCareMap.create(elementId, opts) — inicializa mapa
     LarCareMap.addProviderPin(map, provider)
     LarCareMap.addDemandPin(map, demand)
     LarCareMap.drawRadius(map, center, km)
   Centro default: Ribeirão Preto (-21.1775, -47.8103)
   ========================================================================= */
(function (global) {
  'use strict';

  const RP = { lat: -21.1775, lng: -47.8103 };
  const DEFAULT_ZOOM = 13;

  function L() { return global.L; }

  function isReady() { return !!global.L; }

  function loadLeafletIfNeeded() {
    return new Promise((resolve) => {
      if (isReady()) return resolve();
      // Carrega CDN dinamicamente se ainda não está no head
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = resolve;
      script.onerror = () => resolve(); // degrada silenciosamente
      document.head.appendChild(script);
    });
  }

  async function create(elementId, opts) {
    await loadLeafletIfNeeded();
    if (!isReady()) return null;
    const el = document.getElementById(elementId);
    if (!el) return null;
    opts = opts || {};
    const center = opts.center || [RP.lat, RP.lng];
    const zoom = opts.zoom || DEFAULT_ZOOM;
    const map = L().map(elementId, { zoomControl: opts.zoomControl !== false }).setView(center, zoom);
    L().tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    // Em dark mode, aplica filter no container de tiles
    applyDarkFilterIfNeeded(map);
    return map;
  }

  function applyDarkFilterIfNeeded(map) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const container = map.getContainer();
    if (isDark) {
      container.style.filter = 'invert(0.9) hue-rotate(180deg) brightness(0.95) contrast(0.85)';
    }
  }

  function providerPinIcon(provider) {
    if (!isReady()) return null;
    const initials = (provider && provider.initials) || '??';
    const accent = provider && provider.avatar_color === 'accent';
    const bg = accent ? '#D4A574' : '#3E6B5C';
    const html = `
      <div style="
        width: 36px; height: 36px; border-radius: 50%;
        background: ${bg}; color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-family: Inter, sans-serif; font-weight: 600; font-size: 13px;
        border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">${initials}</div>
    `;
    return L().divIcon({ html, className: '', iconSize: [40, 40], iconAnchor: [20, 20] });
  }

  function demandPinIcon(demand) {
    if (!isReady()) return null;
    const D = global.LarCareData;
    const cat = D ? D.findCategory(demand.cat) : null;
    const emoji = cat ? cat.emoji : '📍';
    const html = `
      <div style="
        width: 32px; height: 32px; border-radius: 50%;
        background: #fff; border: 2px solid #3E6B5C;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        animation: demand-pin-pulse 2s ease infinite;
      ">${emoji}</div>
    `;
    return L().divIcon({ html, className: '', iconSize: [36, 36], iconAnchor: [18, 18] });
  }

  function clientPinIcon() {
    if (!isReady()) return null;
    const html = `
      <div style="
        width: 24px; height: 24px; border-radius: 50%;
        background: #5A7D9A; border: 3px solid #fff;
        box-shadow: 0 0 0 4px rgba(90,125,154,0.3), 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `;
    return L().divIcon({ html, className: '', iconSize: [24, 24], iconAnchor: [12, 12] });
  }

  function addProviderPin(map, provider) {
    if (!isReady() || !map || !provider) return null;
    const D = global.LarCareData;
    const NEIGHBORHOODS = D ? D.NEIGHBORHOODS : {};
    const n = NEIGHBORHOODS[provider.neighborhood];
    if (!n) return null;
    const marker = L().marker([n.lat, n.lng], { icon: providerPinIcon(provider) }).addTo(map);
    const cat = D && provider.specialties[0] ? D.findCategory(provider.specialties[0].cat) : null;
    marker.bindPopup(`
      <div style="font-family: Inter, sans-serif; min-width: 180px;">
        <strong style="font-size: 14px;">${provider.first_name}</strong><br/>
        <span style="font-size: 12px; color: #5C6661;">${cat ? cat.emoji + ' ' + cat.name : ''}</span><br/>
        <span style="font-size: 12px;">⭐ ${provider.rating_avg.toFixed(1)} (${provider.rating_count})</span><br/>
        <a href="#/cliente/proposta/prop-001-a" style="color: #3E6B5C; font-size: 12px; text-decoration: none;">Ver detalhe →</a>
      </div>
    `);
    return marker;
  }

  function addDemandPin(map, demand) {
    if (!isReady() || !map || !demand) return null;
    const D = global.LarCareData;
    const NEIGHBORHOODS = D ? D.NEIGHBORHOODS : {};
    const n = NEIGHBORHOODS[demand.neighborhood];
    if (!n) return null;
    const marker = L().marker([n.lat, n.lng], { icon: demandPinIcon(demand) }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: Inter, sans-serif; min-width: 200px;">
        <strong style="font-size: 14px;">${demand.title}</strong><br/>
        <span style="font-size: 12px; color: #5C6661;">${demand.neighborhood}</span><br/>
        <span style="font-size: 12px;">${demand.urgency_label}</span>
      </div>
    `);
    return marker;
  }

  function addClientPin(map, lat, lng) {
    if (!isReady() || !map) return null;
    return L().marker([lat, lng], { icon: clientPinIcon() }).addTo(map);
  }

  function drawRadius(map, center, km) {
    if (!isReady() || !map) return null;
    return L().circle(center, {
      radius: km * 1000,
      color: '#3E6B5C', fillColor: '#3E6B5C', fillOpacity: 0.08, weight: 2
    }).addTo(map);
  }

  function fitToPins(map, markers) {
    if (!isReady() || !map || !markers || !markers.length) return;
    const group = L().featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
  }

  global.LarCareMap = {
    create, addProviderPin, addDemandPin, addClientPin, drawRadius,
    fitToPins, isReady, loadLeafletIfNeeded,
    RP_CENTER: RP, DEFAULT_ZOOM
  };
})(window);
