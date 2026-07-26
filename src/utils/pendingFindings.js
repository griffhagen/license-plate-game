/**
 * Plates marked while offline.
 *
 * Road trips run through dead zones, so a find has to survive the drive out of
 * one. Queued finds are kept per game in localStorage and replayed once the
 * connection returns.
 */

const QUEUE_KEY = 'plate-game-pending';

function readAll() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(all));
  } catch {
    /* storage full or unavailable — the find is still in memory for this session */
  }
}

export function loadPending(gameId) {
  if (!gameId) return [];
  const list = readAll()[gameId];
  return Array.isArray(list) ? list : [];
}

/** Queue a find, replacing any earlier queued entry for the same plate. */
export function addPending(gameId, finding) {
  if (!gameId || !finding?.stateCode) return [];
  const all = readAll();
  const list = (Array.isArray(all[gameId]) ? all[gameId] : []).filter(
    (f) => f.stateCode !== finding.stateCode
  );
  list.push(finding);
  all[gameId] = list;
  writeAll(all);
  return list;
}

export function removePending(gameId, stateCode) {
  if (!gameId) return [];
  const all = readAll();
  const list = (Array.isArray(all[gameId]) ? all[gameId] : []).filter(
    (f) => f.stateCode !== stateCode
  );
  if (list.length) all[gameId] = list;
  else delete all[gameId];
  writeAll(all);
  return list;
}

export function clearPending(gameId) {
  const all = readAll();
  delete all[gameId];
  writeAll(all);
}

/**
 * Server findings plus any queued ones the server hasn't accepted yet, so the
 * grid, map and leaderboard all show an offline find immediately.
 */
export function mergePending(serverFindings, pending) {
  if (!pending?.length) return serverFindings;
  const onServer = new Set(serverFindings.map((f) => f.stateCode));
  const extras = pending
    .filter((f) => !onServer.has(f.stateCode))
    .map((f) => ({ ...f, pending: true }));
  return extras.length ? [...serverFindings, ...extras] : serverFindings;
}
