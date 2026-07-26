#!/usr/bin/env node
/**
 * Snapshot the game database, then prune old snapshots.
 *
 * Uses SQLite's `VACUUM INTO` rather than copying the file: it takes a
 * consistent snapshot even if someone is logging a plate mid-run, which a plain
 * `cp` cannot promise. The output is a normal .db file — open it directly, or
 * point DATABASE_PATH at it to restore.
 *
 * Run from cron:
 *   DATABASE_PATH=/path/to/plates.db node scripts/backup-db.mjs
 *
 * Env:
 *   DATABASE_PATH  source database (required)
 *   BACKUP_DIR     where snapshots go (default: <db dir>/backups)
 *   KEEP_DAYS      days of snapshots to retain (default: 14)
 */
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';

const dbPath = process.env.DATABASE_PATH;
const keepDays = Number(process.env.KEEP_DAYS || 14);
const stamp = new Date().toISOString().slice(0, 10);

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

if (!dbPath) {
  console.error('DATABASE_PATH is required');
  process.exit(1);
}
if (!existsSync(dbPath)) {
  console.error(`No database at ${dbPath}`);
  process.exit(1);
}

const backupDir = process.env.BACKUP_DIR || join(dirname(dbPath), 'backups');
mkdirSync(backupDir, { recursive: true });

const dest = join(backupDir, `plates-${stamp}.db`);
// Same-day reruns replace that day's snapshot; VACUUM INTO refuses to overwrite.
if (existsSync(dest)) unlinkSync(dest);

const db = new DatabaseSync(dbPath, { readOnly: true });
try {
  db.exec(`VACUUM INTO '${dest.replace(/'/g, "''")}'`);
} finally {
  db.close();
}

const games = new DatabaseSync(dest, { readOnly: true });
const { count } = games.prepare('SELECT COUNT(*) AS count FROM games').get();
const { finds } = games.prepare('SELECT COUNT(*) AS finds FROM findings').get();
games.close();

log(`Backed up ${count} game(s), ${finds} finding(s) -> ${dest} (${statSync(dest).size} bytes)`);

const cutoff = Date.now() - keepDays * 86400000;
let pruned = 0;
for (const name of readdirSync(backupDir)) {
  if (!/^plates-\d{4}-\d{2}-\d{2}\.db$/.test(name)) continue;
  const full = join(backupDir, name);
  if (statSync(full).mtimeMs < cutoff) {
    unlinkSync(full);
    pruned += 1;
  }
}
if (pruned) log(`Pruned ${pruned} snapshot(s) older than ${keepDays} days`);
