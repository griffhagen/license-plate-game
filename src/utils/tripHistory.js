/**
 * Trips this device has played.
 *
 * The active session holds one trip, so leaving a game used to lose its code
 * for good. This keeps a short list of everything played on this phone, which
 * covers what accounts would be for — without passwords or a login screen.
 * It is per-device by design: nothing here follows you to another phone.
 */

const HISTORY_KEY = 'plate-game-trips';
const MAX_TRIPS = 12;

function readList() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((t) => t?.gameId) : [];
  } catch {
    return [];
  }
}

function writeList(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_TRIPS)));
  } catch {
    /* storage unavailable — history is a convenience, not the source of truth */
  }
}

/** Most recently played first. */
export function loadTrips() {
  return readList().sort(
    (a, b) => new Date(b.lastPlayed || 0) - new Date(a.lastPlayed || 0)
  );
}

/**
 * Record or refresh a trip. Called whenever a game loads, so the name and
 * plate count stay current without a separate bookkeeping step.
 */
export function rememberTrip({ gameId, name, playerName, foundCount }) {
  if (!gameId) return loadTrips();
  const list = readList();
  const existing = list.find((t) => t.gameId === gameId);
  const entry = {
    gameId,
    name: name ?? existing?.name ?? 'Road trip',
    playerName: playerName ?? existing?.playerName ?? '',
    foundCount: foundCount ?? existing?.foundCount ?? 0,
    lastPlayed: new Date().toISOString(),
  };
  const next = [entry, ...list.filter((t) => t.gameId !== gameId)];
  writeList(next);
  return loadTrips();
}

export function forgetTrip(gameId) {
  writeList(readList().filter((t) => t.gameId !== gameId));
  return loadTrips();
}
