#!/usr/bin/env node
/** Styled 2:1 plate SVGs for bonus codes without photos yet. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BONUS_PLATE_CODES } from './bonus-plate-sources.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'plates');

const DESIGNS = {
  CAN: { top: '#003478', topText: 'CANADA', body: '#F4F4F4', main: 'ONTARIO', sub: 'Yours to Discover' },
  MEX: { top: '#006847', topText: 'MÉXICO', body: '#F8F8F8', main: 'MEX', sub: 'Estados Unidos Mexicanos' },
  NAV: { top: '#8B4513', topText: 'NAVAJO NATION', body: '#F5E6C8', main: 'DINÉ', sub: 'Arizona · New Mexico · Utah' },
  CHK: { top: '#1a3a6c', topText: 'CHICKASAW NATION', body: '#E8E8E8', main: 'CHK', sub: 'Oklahoma' },
  CHO: { top: '#8B0000', topText: 'CHOCTAW NATION', body: '#F0F0F0', main: 'CHO', sub: 'Oklahoma' },
  MCG: { top: '#8B0000', topText: 'MUSCOGEE (CREEK)', body: '#F2F2F2', main: 'MCG', sub: 'Oklahoma' },
  OSG: { top: '#2F4F4F', topText: 'OSAGE NATION', body: '#ECECEC', main: 'OSG', sub: 'Oklahoma' },
  SEM: { top: '#800020', topText: 'SEMINOLE NATION', body: '#EFEFEF', main: 'SEM', sub: 'Oklahoma' },
};

function svg(code, d) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <rect width="400" height="200" rx="10" fill="${d.body}" stroke="#222" stroke-width="5"/>
  <rect x="5" y="5" width="390" height="44" rx="6" fill="${d.top}"/>
  <text x="200" y="34" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="700">${d.topText}</text>
  <text x="200" y="118" text-anchor="middle" fill="#1a1a1a" font-family="Arial Black,Helvetica,sans-serif" font-size="52" font-weight="900" letter-spacing="6">${d.main}</text>
  <text x="200" y="158" text-anchor="middle" fill="#444" font-family="Arial,Helvetica,sans-serif" font-size="14">${d.sub}</text>
  <text x="200" y="182" text-anchor="middle" fill="#666" font-family="Arial,Helvetica,sans-serif" font-size="11">${code}</text>
</svg>`;
}

function readPlateImagesJs() {
  const file = path.join(__dirname, '..', 'src', 'data', 'plateImages.js');
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/export const PLATE_IMAGES = (\{[\s\S]*?\});/);
  return match ? JSON.parse(match[1]) : {};
}

function writePlateImagesJs(images) {
  const sorted = Object.fromEntries(Object.keys(images).sort().map((k) => [k, images[k]]));
  const file = path.join(__dirname, '..', 'src', 'data', 'plateImages.js');
  const js =
    '/** US state plates: theus50.com · Bonus: Wikimedia + local SVG (npm run bonus-plates) */\n' +
    `export const PLATE_IMAGES = ${JSON.stringify(sorted, null, 2)};\n\n` +
    'export function getPlateImageUrl(code) {\n  return PLATE_IMAGES[code] ?? null;\n}\n';
  fs.writeFileSync(file, js);
}

const images = readPlateImagesJs();
const photoExt = ['jpg', 'jpeg', 'png'];

for (const code of BONUS_PLATE_CODES) {
  const hasPhoto = photoExt.some((ext) => fs.existsSync(path.join(OUT_DIR, `${code}.${ext}`)));
  if (hasPhoto) continue;
  const d = DESIGNS[code];
  if (!d) continue;
  fs.writeFileSync(path.join(OUT_DIR, `${code}.svg`), svg(code, d));
  images[code] = `/plates/${code}.svg`;
  console.log(`✓ ${code}.svg (styled placeholder)`);
}

writePlateImagesJs(images);
console.log('Updated plateImages.js');
