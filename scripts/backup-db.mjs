#!/usr/bin/env node
/**
 * Take a database snapshot from the command line.
 *
 * The server also does this on its own once a day (see server/backup.js), so
 * this script is for on-demand snapshots — before a risky change, say — or for
 * driving from cron if you'd rather schedule it externally.
 *
 *   DATABASE_PATH=/path/to/plates.db node scripts/backup-db.mjs
 *
 * Env:
 *   DATABASE_PATH  source database (required)
 *   BACKUP_DIR     where snapshots go (default: <db dir>/backups)
 *   KEEP_DAYS      days of snapshots to retain (default: 14)
 */
import { runBackup } from '../server/backup.js';

const dbPath = process.env.DATABASE_PATH;
if (!dbPath) {
  console.error('DATABASE_PATH is required');
  process.exit(1);
}

try {
  const r = runBackup({
    dbPath,
    backupDir: process.env.BACKUP_DIR,
    keepDays: Number(process.env.KEEP_DAYS || 14),
  });
  console.log(
    `[${new Date().toISOString()}] Backed up ${r.games} game(s), ${r.findings} finding(s) ` +
      `-> ${r.dest} (${r.bytes} bytes)`
  );
  if (r.pruned) console.log(`Pruned ${r.pruned} snapshot(s)`);
} catch (err) {
  console.error(`Backup failed: ${err.message}`);
  process.exit(1);
}
