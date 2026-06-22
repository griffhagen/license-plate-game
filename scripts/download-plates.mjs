#!/usr/bin/env node
/**
 * Download official state license plate images from The US50
 * https://theus50.com/fastfacts/licenses-state.php
 * Photos © Jim Moini (per site). Bundled locally for offline/PWA use.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { THEUS50_SLUGS } from './theus50-slugs.js';
import { BONUS_PLATE_CODES } from './bonus-plate-sources.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'plates');
const JS_OUT = path.join(ROOT, 'src', 'data', 'plateImages.js');
const BASE = 'https://theus50.com/images/state-licenses';

function readBonusFromDisk() {
  const bonus = {};
  for (const code of BONUS_PLATE_CODES) {
    for (const ext of ['jpg', 'jpeg', 'png']) {
      const file = path.join(OUT_DIR, `${code}.${ext}`);
      if (fs.existsSync(file)) {
        bonus[code] = `/plates/${code}.${ext}`;
        break;
      }
    }
  }
  return bonus;
}

function writePlateImages(images) {
  const sorted = Object.fromEntries(
    Object.keys(images)
      .sort()
      .map((k) => [k, images[k]])
  );
  const js =
    '/** US state plates: theus50.com · Bonus plates: Wikimedia Commons (npm run bonus-plates) */\n' +
    `export const PLATE_IMAGES = ${JSON.stringify(sorted, null, 2)};\n\n` +
    'export function getPlateImageUrl(code) {\n  return PLATE_IMAGES[code] ?? null;\n}\n';
  fs.writeFileSync(JS_OUT, js);
}

async function downloadPlate(code, slug) {
  const url = `${BASE}/${slug}-license.jpg`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LicensePlateGame/1.0 (educational; local cache)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error(`File too small (${buf.length}b)`);
  const localName = `${code}.jpg`;
  fs.writeFileSync(path.join(OUT_DIR, localName), buf);
  return `/plates/${localName}`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  // Remove stale state files only — keep bonus plate images (CAN.jpg, etc.)
  const stateCodes = new Set(Object.keys(THEUS50_SLUGS));
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f === '.gitkeep') continue;
    const code = f.replace(/\.[^.]+$/, '');
    if (stateCodes.has(code)) fs.unlinkSync(path.join(OUT_DIR, f));
  }
  const images = {};
  const errors = [];

  for (const [code, slug] of Object.entries(THEUS50_SLUGS)) {
    try {
      images[code] = await downloadPlate(code, slug);
      console.log(`✓ ${code} <- ${slug}`);
      await new Promise((r) => setTimeout(r, 150));
    } catch (e) {
      errors.push({ code, error: e.message });
      console.error(`✗ ${code}: ${e.message}`);
    }
  }

  writePlateImages({ ...images, ...readBonusFromDisk() });

  console.log(`\nDone: ${Object.keys(images).length}/50 states (+ ${Object.keys(readBonusFromDisk()).length} bonus on disk)`);
  if (errors.length) {
    console.error(errors);
    process.exit(1);
  }
}

main();
