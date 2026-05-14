/* =========================================================================
   LarCare — som via Web Audio API (sem arquivo externo)
   =========================================================================
   Três sons curtos (≤300ms total) compostos com osciladores. Volume baixo
   (~0.06) pra não invadir. Toggle persistido em localStorage.
   Padrões de vibração distintos por evento.
   ========================================================================= */
(function (global) {
  'use strict';

  let audioCtx = null;
  function ctx() {
    if (audioCtx) return audioCtx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
      return audioCtx;
    } catch (_) { return null; }
  }

  // ---- toggle (default ligado, persistido) ----
  function enabled() {
    const v = localStorage.getItem('larcare_sounds');
    return v === null ? true : v === '1';
  }
  function setEnabled(on) { localStorage.setItem('larcare_sounds', on ? '1' : '0'); }

  function vibEnabled() {
    const v = localStorage.getItem('larcare_vibration');
    return v === null ? true : v === '1';
  }
  function setVibEnabled(on) { localStorage.setItem('larcare_vibration', on ? '1' : '0'); }

  // ---- composição de tons ----
  function tone(freq, duration, type = 'sine', volume = 0.06, delay = 0) {
    if (!enabled()) return;
    const ac = ctx();
    if (!ac) return;
    const t0 = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    osc.connect(gain);
    gain.connect(ac.destination);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  // ---- presets ----
  // Proposta recebida — pequeno chime de duas notas, leve e atento
  function proposalReceived() {
    tone(880, 0.12, 'sine', 0.05, 0);
    tone(1320, 0.10, 'sine', 0.045, 0.085);
    vibrate([40, 30, 40]);
  }
  // Proposta aceita — acorde ascendente de três notas, sensação de confirmação
  function proposalAccepted() {
    tone(660, 0.10, 'sine', 0.06, 0);
    tone(880, 0.10, 'sine', 0.06, 0.075);
    tone(1100, 0.16, 'sine', 0.06, 0.15);
    vibrate([80, 50, 80, 50, 80]);
  }
  // Avaliação enviada — três notas curtas, sensação de fim feliz
  function reviewSubmitted() {
    tone(523, 0.08, 'triangle', 0.05, 0);
    tone(659, 0.08, 'triangle', 0.05, 0.06);
    tone(784, 0.14, 'triangle', 0.06, 0.12);
    vibrate([50]);
  }

  // ---- vibração com toggle separado ----
  function vibrate(pattern) {
    if (!vibEnabled()) return;
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (_) {}
  }

  global.LarCareAudio = {
    enabled, setEnabled, vibEnabled, setVibEnabled,
    proposalReceived, proposalAccepted, reviewSubmitted,
    vibrate
  };
})(window);
