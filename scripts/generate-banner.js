import fs from 'fs';
import sharp from 'sharp';

const width = 1920;
const height = 1080;

// Evencify warm golden yellow
const yellow = '#FDC634';
const yellowRingThick = '#FDC634';
const yellowRingThin = '#FDC634';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="none">
  <defs>
    <!-- Background subtle gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EFF2F7" />
      <stop offset="25%" stop-color="#F7F9FC" />
      <stop offset="50%" stop-color="#FFFFFF" />
      <stop offset="75%" stop-color="#F8FAFD" />
      <stop offset="100%" stop-color="#EFF2F7" />
    </linearGradient>

    <!-- Corner shade gradient for depth -->
    <radialGradient id="topLeftShade" cx="0%" cy="0%" r="55%">
      <stop offset="0%" stop-color="#E5EAF2" stop-opacity="0.85" />
      <stop offset="60%" stop-color="#EFF2F7" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bottomLeftShade" cx="0%" cy="100%" r="65%">
      <stop offset="0%" stop-color="#E2E8F0" stop-opacity="0.75" />
      <stop offset="60%" stop-color="#EFF2F7" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </radialGradient>

    <!-- Soft diffuse drop shadows for wavy card layers -->
    <filter id="waveShadowTop" x="-10%" y="-10%" width="130%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#1E293B" flood-opacity="0.07" />
      <feDropShadow dx="0" dy="5" stdDeviation="8" flood-color="#1E293B" flood-opacity="0.04" />
    </filter>

    <filter id="waveShadowBottom" x="-10%" y="-20%" width="130%" height="140%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="-14" stdDeviation="22" flood-color="#1E293B" flood-opacity="0.07" />
      <feDropShadow dx="0" dy="-5" stdDeviation="8" flood-color="#1E293B" flood-opacity="0.04" />
    </filter>

    <filter id="circleShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#64748B" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Base background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
  <rect width="${width}" height="${height}" fill="url(#topLeftShade)" />
  <rect width="${width}" height="${height}" fill="url(#bottomLeftShade)" />

  <!-- ========================================================================= -->
  <!-- TOP SECTION                                                               -->
  <!-- ========================================================================= -->

  <!-- Top-Right Layer 1: Under-wave backdrop -->
  <path d="M 450 0 C 700 80, 950 180, 1150 140 C 1380 90, 1600 240, 1920 340 L 1920 0 Z"
        fill="#EEF2F7" opacity="0.6" />

  <!-- Top-Left Subtle White Hollow Ring (behind main wave) -->
  <circle cx="280" cy="115" r="50" fill="none" stroke="#FFFFFF" stroke-width="11" filter="url(#circleShadow)" />

  <!-- Top Primary White Wave Layer (with drop shadow) -->
  <path d="M -50 0 
           L -50 50
           C 150 30, 260 120, 460 150 
           C 660 180, 850 80, 1100 110 
           C 1350 140, 1450 380, 1920 360 
           L 1920 0 Z"
        fill="#FFFFFF"
        filter="url(#waveShadowTop)" />

  <!-- Top Curving Yellow Ribbon Wave Line -->
  <path d="M 0 0 
           C 150 90, 250 165, 430 178 
           C 640 190, 830 90, 1070 122 
           C 1300 155, 1420 400, 1920 390"
        fill="none"
        stroke="${yellow}"
        stroke-width="4.5"
        stroke-linecap="round"
        stroke-linejoin="round" />

  <!-- Top Secondary Thin Yellow Wave Line -->
  <path d="M 1740 405 C 1820 415, 1880 425, 1920 430"
        fill="none"
        stroke="${yellow}"
        stroke-width="3"
        stroke-linecap="round" />

  <!-- Top-Right Concentric Yellow Arc Rings (Safe inside canvas) -->
  <!-- Outer thick ring -->
  <circle cx="1500" cy="10" r="215" fill="none" stroke="${yellowRingThick}" stroke-width="34" />
  <!-- Inner thin ring -->
  <circle cx="1500" cy="10" r="150" fill="none" stroke="${yellowRingThin}" stroke-width="11" />

  <!-- Top-Right 3x3 Yellow Dot Matrix Grid (Safe inside canvas) -->
  <g transform="translate(1680, 250)">
    <!-- Row 1 -->
    <circle cx="0" cy="0" r="5.5" fill="${yellow}" />
    <circle cx="28" cy="0" r="5.5" fill="${yellow}" />
    <circle cx="56" cy="0" r="5.5" fill="${yellow}" />
    <!-- Row 2 -->
    <circle cx="0" cy="28" r="5.5" fill="${yellow}" />
    <circle cx="28" cy="28" r="5.5" fill="${yellow}" />
    <circle cx="56" cy="28" r="5.5" fill="${yellow}" />
    <!-- Row 3 -->
    <circle cx="0" cy="56" r="5.5" fill="${yellow}" />
    <circle cx="28" cy="56" r="5.5" fill="${yellow}" />
    <circle cx="56" cy="56" r="5.5" fill="${yellow}" />
  </g>


  <!-- ========================================================================= -->
  <!-- BOTTOM SECTION                                                            -->
  <!-- ========================================================================= -->

  <!-- Bottom-Left Layer 1: Under-wave backdrop -->
  <path d="M 0 540 C 250 520, 500 700, 750 780 C 1050 870, 1450 820, 1920 980 L 1920 1080 L 0 1080 Z"
        fill="#EEF2F7" opacity="0.6" />

  <!-- Bottom-Right Subtle White Hollow Ring -->
  <circle cx="1600" cy="930" r="54" fill="none" stroke="#FFFFFF" stroke-width="12" filter="url(#circleShadow)" />

  <!-- Bottom Primary White Wave Layer (with upward drop shadow) -->
  <path d="M 0 620 
           C 220 580, 420 740, 680 780 
           C 950 820, 1150 940, 1420 920 
           C 1650 900, 1780 1020, 1920 1010 
           L 1920 1080 
           L 0 1080 Z"
        fill="#FFFFFF"
        filter="url(#waveShadowBottom)" />

  <!-- Bottom Curving Yellow Ribbon Wave Line -->
  <path d="M -10 570 
           C 180 570, 360 740, 640 775 
           C 900 810, 1120 935, 1380 910 
           C 1550 890, 1720 990, 1920 1030"
        fill="none"
        stroke="${yellow}"
        stroke-width="4.5"
        stroke-linecap="round"
        stroke-linejoin="round" />

  <!-- Bottom-Left Concentric Yellow Arc Rings (Safe inside canvas) -->
  <!-- Outer thick ring -->
  <circle cx="360" cy="1070" r="225" fill="none" stroke="${yellowRingThick}" stroke-width="34" />
  <!-- Inner thin ring -->
  <circle cx="360" cy="1070" r="160" fill="none" stroke="${yellowRingThin}" stroke-width="11" />

  <!-- Bottom-Left 3x3 Yellow Dot Matrix Grid (Safe inside canvas) -->
  <g transform="translate(135, 700)">
    <!-- Row 1 -->
    <circle cx="0" cy="0" r="5.5" fill="${yellow}" />
    <circle cx="28" cy="0" r="5.5" fill="${yellow}" />
    <circle cx="56" cy="0" r="5.5" fill="${yellow}" />
    <!-- Row 2 -->
    <circle cx="0" cy="28" r="5.5" fill="${yellow}" />
    <circle cx="28" cy="28" r="5.5" fill="${yellow}" />
    <circle cx="56" cy="28" r="5.5" fill="${yellow}" />
    <!-- Row 3 -->
    <circle cx="0" cy="56" r="5.5" fill="${yellow}" />
    <circle cx="28" cy="56" r="5.5" fill="${yellow}" />
    <circle cx="56" cy="56" r="5.5" fill="${yellow}" />
  </g>

</svg>`;

async function generateAssets() {
  console.log('Writing SVG file...');
  fs.writeFileSync('public/hero-banner.svg', svgContent);
  if (fs.existsSync('dist')) {
    fs.writeFileSync('dist/hero-banner.svg', svgContent);
  }

  const svgBuffer = Buffer.from(svgContent);

  console.log('Generating WebP asset...');
  await sharp(svgBuffer)
    .webp({ quality: 95 })
    .toFile('public/hero-banner.webp');
  
  if (fs.existsSync('dist')) {
    await sharp(svgBuffer)
      .webp({ quality: 95 })
      .toFile('dist/hero-banner.webp');
  }

  console.log('Generating PNG asset...');
  await sharp(svgBuffer)
    .png()
    .toFile('public/hero-banner.png');

  if (fs.existsSync('dist')) {
    await sharp(svgBuffer)
      .png()
      .toFile('dist/hero-banner.png');
  }

  // Also sync hero banner.png
  fs.copyFileSync('public/hero-banner.png', 'public/hero banner.png');
  if (fs.existsSync('dist')) {
    fs.copyFileSync('public/hero-banner.png', 'dist/hero banner.png');
  }

  console.log('All hero banner assets generated successfully!');
}

generateAssets().catch(console.error);
