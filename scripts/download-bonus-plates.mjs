#!/usr/bin/env node
/**
 * Download bonus plate images into public/plates/ and merge into plateImages.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BONUS_PLATE_SOURCES, BONUS_PLATE_CODES } from './bonus-plate-sources.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'plates');
const JS_OUT = path.join(ROOT, 'src', 'data', 'plateImages.js');
const UA = 'LicensePlateGame/1.0 (educational; local cache)';

const BONUS_EXTS = ['jpg', 'jpeg', 'png', 'svg'];

function removeStaleBonusFiles(code, keepExt) {
  for (const ext of BONUS_EXTS) {
    if (ext === keepExt) continue;
    const file = path.join(OUT_DIR, `${code}.${ext}`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}

async function downloadPlate(code, { url, ext }) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 400) throw new Error(`File too small (${buf.length}b)`);
  const localName = `${code}.${ext}`;
  fs.writeFileSync(path.join(OUT_DIR, localName), buf);
  removeStaleBonusFiles(code, ext);
  return `/plates/${localName}`;
}

function readExistingPlateImages() {
  const file = path.join(ROOT, 'src', 'data', 'plateImages.js');
  if (!fs.existsSync(file)) return {};
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/export const PLATE_IMAGES = (\{[\s\S]*?\});/);
  if (!match) return {};
  return JSON.parse(match[1]);
}

function writePlateImages(images) {
  const sorted = Object.fromEntries(
    Object.keys(images)
      .sort()
      .map((k) => [k, images[k]])
  );
  const js =
    '/** US state plates: theus50.com · Bonus plates: Wikimedia + WLP singles (see scripts/bonus-plate-sources.js) */\n' +
    `export const PLATE_IMAGES = ${JSON.stringify(sorted, null, 2)};\n\n` +
    'export function getPlateImageUrl(code) {\n  return PLATE_IMAGES[code] ?? null;\n}\n';
  fs.writeFileSync(JS_OUT, js);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const images = readExistingPlateImages();
  const errors = [];

  for (const code of BONUS_PLATE_CODES) {
    const source = BONUS_PLATE_SOURCES[code];
    try {
      images[code] = await downloadPlate(code, source);
      console.log(`✓ ${code} <- ${source.credit}`);
      await new Promise((r) => setTimeout(r, 2000));
    } catch (e) {
      errors.push({ code, error: e.message });
      console.error(`✗ ${code}: ${e.message}`);
    }
  }

  writePlateImages(images);
  const ok = BONUS_PLATE_CODES.length - errors.length;
  console.log(`\nBonus photos: ${ok}/${BONUS_PLATE_CODES.length}`);
  if (errors.length) {
    console.log('Generating styled SVG placeholders for missing photos…');
    await import('./generate-bonus-plate-svgs.mjs');
  }
  if (errors.length === BONUS_PLATE_CODES.length) {
    process.exit(1);
  }
}

main();
