import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || join(__dirname, 'plates.db');

const dbDir = dirname(dbPath);
try {
  mkdirSync(dbDir, { recursive: true });
} catch {
  /* exists */
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL,
    name TEXT NOT NULL,
    joined_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS findings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    state_code TEXT NOT NULL,
    player_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    location_label TEXT,
    found_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(game_id, state_code),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
  );
`);

export function createGame(id, name) {
  db.prepare('INSERT INTO games (id, name) VALUES (?, ?)').run(id, name);
}

export function getGame(id) {
  const normalized = String(id || '').trim().toLowerCase();
  return db
    .prepare('SELECT * FROM games WHERE LOWER(id) = ?')
    .get(normalized);
}

export function addPlayer(id, gameId, name) {
  db.prepare('INSERT INTO players (id, game_id, name) VALUES (?, ?, ?)').run(id, gameId, name);
}

export function getPlayers(gameId) {
  return db.prepare('SELECT * FROM players WHERE game_id = ? ORDER BY joined_at').all(gameId);
}

export function getFindings(gameId) {
  return db
    .prepare(
      `SELECT state_code, player_id, player_name, latitude, longitude, location_label, found_at
       FROM findings WHERE game_id = ? ORDER BY found_at`
    )
    .all(gameId);
}

export function addFinding({ gameId, stateCode, playerId, playerName, latitude, longitude, locationLabel }) {
  const stmt = db.prepare(`
    INSERT INTO findings (game_id, state_code, player_id, player_name, latitude, longitude, location_label)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(gameId, stateCode, playerId, playerName, latitude ?? null, longitude ?? null, locationLabel ?? null);
}

export function removeFinding(gameId, stateCode) {
  return db.prepare('DELETE FROM findings WHERE game_id = ? AND state_code = ?').run(gameId, stateCode);
}

export function restoreGame({ id, name, players, findings }) {
  const insertFinding = db.prepare(`
    INSERT INTO findings (game_id, state_code, player_id, player_name, latitude, longitude, location_label, found_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const run = db.transaction(() => {
    createGame(id, name);
    for (const p of players) {
      addPlayer(p.id, id, p.name);
    }
    for (const f of findings) {
      insertFinding.run(
        id,
        f.stateCode,
        f.playerId,
        f.playerName,
        f.latitude ?? null,
        f.longitude ?? null,
        f.locationLabel ?? null,
        f.foundAt || new Date().toISOString()
      );
    }
  });

  run();
}

export default db;
