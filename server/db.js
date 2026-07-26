import { DatabaseSync } from 'node:sqlite';
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

const db = new DatabaseSync(dbPath);

/** node:sqlite reports constraint violations as a generic ERR_SQLITE_ERROR with
 *  the extended result code in `errcode`. Callers branch on better-sqlite3's
 *  string codes, so re-tag the two we act on. */
const CONSTRAINT_CODES = new Map([
  [2067, 'SQLITE_CONSTRAINT_UNIQUE'],
  [1555, 'SQLITE_CONSTRAINT_PRIMARYKEY'],
]);

function rethrowTagged(err) {
  const tag = err?.code === 'ERR_SQLITE_ERROR' && CONSTRAINT_CODES.get(err.errcode);
  if (tag) err.code = tag;
  throw err;
}

/** node:sqlite has no db.transaction(); wrap the statements by hand. */
function transaction(fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    return rethrowTagged(err);
  }
}

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

export function getPlayerByName(gameId, name) {
  return db
    .prepare('SELECT * FROM players WHERE game_id = ? AND LOWER(name) = LOWER(?)')
    .get(gameId, name.trim());
}

export function getPlayers(gameId) {
  return db.prepare('SELECT * FROM players WHERE game_id = ? ORDER BY joined_at').all(gameId);
}

/** Merge any pre-existing duplicate (same game + case-insensitive name) player rows,
 *  keeping the earliest-joined row and reassigning the rest's findings to it. */
function dedupeDuplicatePlayers() {
  const players = db.prepare('SELECT * FROM players ORDER BY joined_at').all();
  const byGame = new Map();
  for (const p of players) {
    if (!byGame.has(p.game_id)) byGame.set(p.game_id, []);
    byGame.get(p.game_id).push(p);
  }

  const reassignFindings = db.prepare(
    'UPDATE findings SET player_id = ?, player_name = ? WHERE player_id = ?'
  );
  const deletePlayer = db.prepare('DELETE FROM players WHERE id = ?');

  transaction(() => {
    for (const list of byGame.values()) {
      const canonicalByName = new Map();
      for (const p of list) {
        const key = p.name.trim().toLowerCase();
        const canonical = canonicalByName.get(key);
        if (!canonical) {
          canonicalByName.set(key, p);
          continue;
        }
        reassignFindings.run(canonical.id, canonical.name, p.id);
        deletePlayer.run(p.id);
      }
    }
  });
}

dedupeDuplicatePlayers();

export function getFindings(gameId) {
  return db
    .prepare(
      `SELECT state_code, player_id, player_name, latitude, longitude, location_label, found_at
       FROM findings WHERE game_id = ? ORDER BY found_at`
    )
    .all(gameId);
}

function coerceCoord(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function coerceFindingCoords({ latitude, longitude, locationLabel }) {
  return {
    latitude: coerceCoord(latitude),
    longitude: coerceCoord(longitude),
    locationLabel: locationLabel ? String(locationLabel).trim() : null,
  };
}

export function addFinding({ gameId, stateCode, playerId, playerName, latitude, longitude, locationLabel }) {
  const coords = coerceFindingCoords({ latitude, longitude, locationLabel });
  const stmt = db.prepare(`
    INSERT INTO findings (game_id, state_code, player_id, player_name, latitude, longitude, location_label)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  try {
    return stmt.run(
      gameId,
      stateCode,
      playerId,
      playerName,
      coords.latitude,
      coords.longitude,
      coords.locationLabel
    );
  } catch (err) {
    return rethrowTagged(err);
  }
}

export function updateFindingLocation({ gameId, stateCode, latitude, longitude, locationLabel }) {
  const coords = coerceFindingCoords({ latitude, longitude, locationLabel });
  return db
    .prepare(
      `UPDATE findings SET latitude = ?, longitude = ?, location_label = ?
       WHERE game_id = ? AND state_code = ?`
    )
    .run(coords.latitude, coords.longitude, coords.locationLabel, gameId, stateCode);
}

export function removeFinding(gameId, stateCode) {
  return db.prepare('DELETE FROM findings WHERE game_id = ? AND state_code = ?').run(gameId, stateCode);
}

export function restoreGame({ id, name, players, findings }) {
  const insertFinding = db.prepare(`
    INSERT INTO findings (game_id, state_code, player_id, player_name, latitude, longitude, location_label, found_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(game_id, state_code) DO UPDATE SET
      player_id = excluded.player_id,
      player_name = excluded.player_name,
      latitude = excluded.latitude,
      longitude = excluded.longitude,
      location_label = excluded.location_label,
      found_at = excluded.found_at
  `);

  transaction(() => {
    createGame(id, name);
    for (const p of players) {
      addPlayer(p.id, id, p.name);
    }
    for (const f of findings) {
      const coords = coerceFindingCoords({
        latitude: f.latitude,
        longitude: f.longitude,
        locationLabel: f.locationLabel,
      });
      insertFinding.run(
        id,
        f.stateCode,
        f.playerId,
        f.playerName,
        coords.latitude,
        coords.longitude,
        coords.locationLabel,
        f.foundAt || new Date().toISOString()
      );
    }
  });
}

export default db;
