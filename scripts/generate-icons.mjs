#!/usr/bin/env node
/** Draw PWA icons: green app background + license plate with "50" stripe */
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function inRoundedRect(x, y, w, h, cx, cy, cw, ch, radius) {
  const rx = cx * w;
  const ry = cy * h;
  const rw = cw * w;
  const rh = ch * h;
  const r = radius * Math.min(w, h);
  if (x < rx || x > rx + rw || y < ry || y > ry + rh) return false;
  const corners = [
    [rx + r, ry + r, r],
    [rx + rw - r, ry + r, r],
    [rx + r, ry + rh - r, r],
    [rx + rw - r, ry + rh - r, r],
  ];
  for (const [ccx, ccy, cr] of corners) {
    const dx = x - ccx;
    const dy = y - ccy;
    if (Math.abs(dx) < cr && Math.abs(dy) < cr && dx * dx + dy * dy > cr * cr) return false;
  }
  return true;
}

function plateIcon(size) {
  const pixels = Buffer.alloc(size * size * 3);
  const bg = [26, 77, 62];
  const plate = [245, 245, 240];
  const stripe = [244, 196, 48];
  const border = [40, 40, 40];
  const text = [26, 77, 62];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 3;
      let rgb = bg;

      if (inRoundedRect(x, y, size, size, 0.12, 0.28, 0.76, 0.44, 0.08)) {
        rgb = plate;
        if (y < size * 0.36) rgb = stripe;
        const edge =
          x < size * 0.13 ||
          x > size * 0.87 ||
          y < size * 0.29 ||
          y > size * 0.71 ||
          Math.abs(y - size * 0.36) < size * 0.012;
        if (edge) rgb = border;

        const cy = size * 0.54;
        const barW = size * 0.22;
        const barH = size * 0.08;
        if (Math.abs(x - size * 0.5) < barW && Math.abs(y - cy) < barH) rgb = text;
        if (Math.abs(x - size * 0.38) < barW * 0.55 && Math.abs(y - cy) < barH) rgb = text;
        if (Math.abs(x - size * 0.62) < barW * 0.55 && Math.abs(y - cy) < barH) rgb = text;
      }

      pixels[i] = rgb[0];
      pixels[i + 1] = rgb[1];
      pixels[i + 2] = rgb[2];
    }
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const row = Buffer.alloc(1 + size * 3);
  const raw = Buffer.alloc((1 + size * 3) * size);
  for (let y = 0; y < size; y++) {
    pixels.copy(row, 1, y * size * 3, (y + 1) * size * 3);
    row.copy(raw, y * row.length);
  }
  const compressed = zlib.deflateSync(raw);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="108" fill="#1a4d3e"/>
  <rect x="64" y="148" width="384" height="200" rx="24" fill="#f5f5f0" stroke="#282828" stroke-width="10"/>
  <rect x="64" y="148" width="384" height="56" rx="24" fill="#f4c430"/>
  <text x="256" y="290" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="108" font-weight="800" fill="#1a4d3e">50</text>
  <text x="256" y="420" text-anchor="middle" font-size="80">🚗</text>
</svg>`;

writeFileSync(join(outDir, 'icon.svg'), svg);
for (const size of [192, 512]) {
  writeFileSync(join(outDir, `icon-${size}.png`), plateIcon(size));
}
console.log('Icons written to public/icons/');
