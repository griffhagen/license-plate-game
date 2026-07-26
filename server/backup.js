/**
 * Database snapshots.
 *
 * Uses SQLite's `VACUUM INTO` rather than copying the file: it produces a
 * consistent snapshot even while someone is logging a plate, which a plain
 * copy cannot promise. Each snapshot is an ordinary database — open it
 * directly, or point DATABASE_PATH at it to roll back.
 */
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';

const SNAPSHOT_RE = /^plates-\d{4}-\d{2}-\d{2}\.db$/;

export function snapshotName(date = new Date()) {
  return `plates-${date.toISOString().slice(0, 10)}.db`;
}

export function backupDirFor(dbPath, override) {
  return override || join(dirname(dbPath), 'backups');
}

/** True when today's snapshot already exists — lets callers skip the work. */
export function hasSnapshotForToday(dbPath, backupDir) {
  return existsSync(join(backupDirFor(dbPath, backupDir), snapshotName()));
}

export function runBackup({ dbPath, backupDir, keepDays = 14 } = {}) {
  if (!dbPath) throw new Error('dbPath is required');
  if (!existsSync(dbPath)) throw new Error(`No database at ${dbPath}`);

  const dir = backupDirFor(dbPath, backupDir);
  mkdirSync(dir, { recursive: true });

  const dest = join(dir, snapshotName());
  // VACUUM INTO refuses to overwrite, so clear a same-day rerun first.
  if (existsSync(dest)) unlinkSync(dest);

  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    db.exec(`VACUUM INTO '${dest.replace(/'/g, "''")}'`);
  } finally {
    db.close();
  }

  const snap = new DatabaseSync(dest, { readOnly: true });
  const games = snap.prepare('SELECT COUNT(*) AS n FROM games').get().n;
  const findings = snap.prepare('SELECT COUNT(*) AS n FROM findings').get().n;
  snap.close();

  const cutoff = Date.now() - keepDays * 86400000;
  let pruned = 0;
  for (const name of readdirSync(dir)) {
    if (!SNAPSHOT_RE.test(name)) continue;
    const full = join(dir, name);
    if (statSync(full).mtimeMs < cutoff) {
      unlinkSync(full);
      pruned += 1;
    }
  }

  return { dest, games, findings, bytes: statSync(dest).size, pruned };
}

/**
 * Back up once a day from inside the server process.
 *
 * This host has no reachable cron, so the app schedules its own. It checks
 * hourly rather than sleeping 24h so a restart can't skip a day: whenever it
 * wakes and today has no snapshot, it takes one.
 */
export function scheduleDailyBackup({ dbPath, backupDir, keepDays, log = console.log } = {}) {
  const attempt = () => {
    try {
      if (hasSnapshotForToday(dbPath, backupDir)) return;
      const r = runBackup({ dbPath, backupDir, keepDays });
      log(
        `Backup: ${r.games} game(s), ${r.findings} finding(s) -> ${r.dest}` +
          (r.pruned ? ` (pruned ${r.pruned} old)` : '')
      );
    } catch (err) {
      // A failed backup must never take the game down with it.
      log(`Backup failed: ${err.message}`);
    }
  };

  attempt();
  const timer = setInterval(attempt, 60 * 60 * 1000);
  timer.unref?.();
  return () => clearInterval(timer);
}
