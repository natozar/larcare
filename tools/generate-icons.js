#!/usr/bin/env node
/* =========================================================================
   LarCare — gerador de PNGs do logo
   =========================================================================
   Pré-requisito: npm install sharp (devDep)
   Uso: node tools/generate-icons.js
   Lê icons/favicon.svg, gera PNGs em todos os tamanhos PWA + splash iOS
   + Open Graph + Twitter card.
   ========================================================================= */
const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (_) {
  console.error('\n❌ sharp não está instalado.');
  console.error('Execute: npm install --save-dev sharp');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const SVG_PATH = path.join(ROOT, 'icons', 'favicon.svg');
const OUT_DIR = path.join(ROOT, 'icons');

if (!fs.existsSync(SVG_PATH)) {
  console.error('❌ SVG fonte não encontrado em:', SVG_PATH);
  process.exit(1);
}

const SVG_BUFFER = fs.readFileSync(SVG_PATH);
const SAGE = '#3E6B5C';
const BG = '#FAF8F4';

// Lista de tamanhos a gerar
const SIZES = [
  { name: 'favicon-16.png',  size: 16 },
  { name: 'favicon-32.png',  size: 32 },
  { name: 'icon-72.png',     size: 72 },
  { name: 'icon-96.png',     size: 96 },
  { name: 'icon-128.png',    size: 128 },
  { name: 'icon-144.png',    size: 144 },
  { name: 'icon-152.png',    size: 152 },
  { name: 'icon-192.png',    size: 192 },
  { name: 'icon-384.png',    size: 384 },
  { name: 'icon-512.png',    size: 512 }
];

// Maskable icons: 80% safe zone (icon ocupa 80% do canvas, 10% padding)
const MASKABLE = [
  { name: 'icon-maskable-192.png', size: 192 },
  { name: 'icon-maskable-512.png', size: 512 }
];

// Apple touch icon: fundo sálvia sólido (sem transparência)
const APPLE = [
  { name: 'apple-touch-icon.png',     size: 180 },
  { name: 'apple-touch-icon-152.png', size: 152 },
  { name: 'apple-touch-icon-167.png', size: 167 }
];

// Splash screens iOS
const SPLASH = [
  { name: 'splash-1290x2796.png', w: 1290, h: 2796 }, // iPhone 15 Pro Max
  { name: 'splash-1179x2556.png', w: 1179, h: 2556 }, // iPhone 15
  { name: 'splash-1170x2532.png', w: 1170, h: 2532 }, // iPhone 14
  { name: 'splash-1284x2778.png', w: 1284, h: 2778 }, // iPhone 12/13 Pro Max
  { name: 'splash-1080x1920.png', w: 1080, h: 1920 }, // Android genérico
  { name: 'splash-750x1334.png',  w: 750,  h: 1334 }  // iPhone SE
];

async function genStandard() {
  for (const s of SIZES) {
    const out = path.join(OUT_DIR, s.name);
    await sharp(SVG_BUFFER)
      .resize(s.size, s.size)
      .png()
      .toFile(out);
    console.log('✓', s.name);
  }
}

async function genMaskable() {
  for (const s of MASKABLE) {
    const padding = Math.floor(s.size * 0.1);
    const inner = s.size - padding * 2;
    const innerSvg = await sharp(SVG_BUFFER).resize(inner, inner).png().toBuffer();
    await sharp({
      create: {
        width: s.size, height: s.size,
        channels: 4,
        background: SAGE
      }
    })
      .composite([{ input: innerSvg, left: padding, top: padding }])
      .png()
      .toFile(path.join(OUT_DIR, s.name));
    console.log('✓', s.name);
  }
}

async function genAppleTouch() {
  for (const s of APPLE) {
    const inner = Math.floor(s.size * 0.72);
    const padding = Math.floor((s.size - inner) / 2);
    const innerSvg = await sharp(SVG_BUFFER).resize(inner, inner).png().toBuffer();
    await sharp({
      create: {
        width: s.size, height: s.size,
        channels: 4,
        background: SAGE  // sólido, sem transparência
      }
    })
      .composite([{ input: innerSvg, left: padding, top: padding }])
      .png()
      .toFile(path.join(OUT_DIR, s.name));
    console.log('✓', s.name);
  }
}

async function genSplash() {
  for (const s of SPLASH) {
    // Logo centralizado, 30% da menor dimensão
    const logoSize = Math.floor(Math.min(s.w, s.h) * 0.30);
    const innerSvg = await sharp(SVG_BUFFER).resize(logoSize, logoSize).png().toBuffer();
    const left = Math.floor((s.w - logoSize) / 2);
    const top = Math.floor((s.h - logoSize) / 2);
    await sharp({
      create: {
        width: s.w, height: s.h,
        channels: 4,
        background: BG
      }
    })
      .composite([{ input: innerSvg, left, top }])
      .png()
      .toFile(path.join(OUT_DIR, s.name));
    console.log('✓', s.name);
  }
}

async function genOG() {
  // 1200x630 com logo + tagline. Texto via SVG overlay.
  const overlay = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FAF8F4"/>
          <stop offset="100%" stop-color="#E9F0EC"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="500" text-anchor="middle" font-family="Inter, sans-serif" font-size="32" fill="#3E6B5C" font-weight="600">Cuidado para sua casa, em Ribeirão Preto</text>
      <text x="600" y="555" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#5C6661">larcare.com.br</text>
    </svg>
  `;
  const logoSize = 280;
  const logoBuf = await sharp(SVG_BUFFER).resize(logoSize, logoSize).png().toBuffer();
  await sharp(Buffer.from(overlay))
    .composite([{ input: logoBuf, left: 460, top: 110 }])
    .png()
    .toFile(path.join(OUT_DIR, 'og-image.png'));
  console.log('✓ og-image.png');

  await sharp(Buffer.from(overlay.replace('630', '600')))
    .resize(1200, 600)
    .composite([{ input: logoBuf, left: 460, top: 100 }])
    .png()
    .toFile(path.join(OUT_DIR, 'twitter-card.png'));
  console.log('✓ twitter-card.png');
}

(async () => {
  console.log('Gerando PNGs do logo LarCare...\n');
  try {
    await genStandard();
    await genMaskable();
    await genAppleTouch();
    await genSplash();
    await genOG();
    console.log('\n✅ Todos os ícones gerados em icons/');
    console.log('   Total:', SIZES.length + MASKABLE.length + APPLE.length + SPLASH.length + 2, 'arquivos');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
})();
