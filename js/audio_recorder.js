/* =========================================================================
   LarCare — gravador de áudio para chat (MediaRecorder + visual waveform)
   =========================================================================
   API:
     LarCareRecorder.supported() — boolean
     LarCareRecorder.start() — Promise<void> (pede permissão)
     LarCareRecorder.stop() — Promise<{ blob, duration, dataUrl, waveform }>
     LarCareRecorder.cancel() — descarta
     LarCareRecorder.isRecording() — boolean
   Waveform: array de 32 amplitudes [0-1] amostradas durante gravação
   ========================================================================= */
(function (global) {
  'use strict';

  let mediaStream = null;
  let recorder = null;
  let chunks = [];
  let startedAt = 0;
  let analyser = null;
  let waveSamples = [];
  let sampleTimer = null;

  function supported() {
    return !!(global.navigator && global.navigator.mediaDevices &&
              global.navigator.mediaDevices.getUserMedia && global.MediaRecorder);
  }

  async function start() {
    if (!supported()) throw new Error('Áudio não suportado');
    mediaStream = await global.navigator.mediaDevices.getUserMedia({ audio: true });
    // Detecta mime suportado
    const mimes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    const mime = mimes.find((m) => MediaRecorder.isTypeSupported(m)) || '';
    recorder = new MediaRecorder(mediaStream, mime ? { mimeType: mime } : {});
    chunks = [];
    waveSamples = [];
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.start();
    startedAt = Date.now();

    // Analisador para waveform
    try {
      const AudioCtx = global.AudioContext || global.webkitAudioContext;
      const ctx = new AudioCtx();
      const src = ctx.createMediaStreamSource(mediaStream);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      sampleTimer = setInterval(() => {
        analyser.getByteFrequencyData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i];
        const avg = sum / buf.length / 255;
        waveSamples.push(avg);
        if (waveSamples.length > 96) waveSamples.shift();
      }, 80);
    } catch (_) { /* fallback: waveform vazia */ }
  }

  function isRecording() { return !!recorder && recorder.state === 'recording'; }
  function elapsed() { return startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0; }
  function currentWaveform() { return waveSamples.slice(); }

  async function stop() {
    if (!recorder) return null;
    const duration = elapsed();
    const finalWave = downsampleWaveform(waveSamples, 32);
    return new Promise((resolve) => {
      recorder.onstop = async () => {
        clearInterval(sampleTimer); sampleTimer = null;
        cleanup();
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        const dataUrl = await blobToDataUrl(blob);
        chunks = [];
        recorder = null;
        startedAt = 0;
        resolve({ blob, duration, dataUrl, waveform: finalWave });
      };
      recorder.stop();
    });
  }

  function cancel() {
    if (!recorder) return;
    try { recorder.ondataavailable = null; recorder.stop(); } catch (_) {}
    clearInterval(sampleTimer); sampleTimer = null;
    cleanup();
    chunks = []; waveSamples = []; recorder = null; startedAt = 0;
  }

  function cleanup() {
    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => t.stop());
      mediaStream = null;
    }
  }

  function blobToDataUrl(blob) {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  function downsampleWaveform(samples, target) {
    if (!samples.length) return new Array(target).fill(0.2);
    if (samples.length <= target) {
      while (samples.length < target) samples.push(samples[samples.length - 1] || 0);
      return samples;
    }
    const step = samples.length / target;
    const out = [];
    for (let i = 0; i < target; i++) {
      const start = Math.floor(i * step);
      const end = Math.floor((i + 1) * step);
      const slice = samples.slice(start, end);
      const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
      out.push(avg);
    }
    return out;
  }

  function fakeWaveform(seed) {
    // Para mock do interlocutor (waveform sintética determinística)
    let s = seed || 42;
    function rnd() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }
    return Array.from({ length: 32 }, () => 0.2 + rnd() * 0.7);
  }

  function renderWaveformSVG(waveform, opts) {
    opts = opts || {};
    const w = opts.width || 160;
    const h = opts.height || 28;
    const barW = (w - (waveform.length - 1) * 2) / waveform.length;
    const color = opts.color || 'currentColor';
    const bars = waveform.map((amp, i) => {
      const barH = Math.max(2, amp * h);
      const x = i * (barW + 2);
      const y = (h - barH) / 2;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${color}" rx="${barW/2}"/>`;
    }).join('');
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${bars}</svg>`;
  }

  global.LarCareRecorder = {
    supported, start, stop, cancel, isRecording, elapsed,
    currentWaveform, fakeWaveform, renderWaveformSVG, downsampleWaveform
  };
})(window);
