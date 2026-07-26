/**
 * Errors carry either `offline` (the request never reached the server) or
 * `status` (the server answered and rejected it). Callers need to tell these
 * apart: an offline write is worth queueing and retrying, a rejected one is not.
 */
async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch {
    const err = new Error('No connection — check your signal.');
    err.offline = true;
    throw err;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong');
    err.status = res.status;
    throw err;
  }
  return data;
}

export function createGame(name, playerName) {
  return request('/games', {
    method: 'POST',
    body: JSON.stringify({ name, playerName }),
  });
}

export function getGame(gameId) {
  return request(`/games/${encodeURIComponent(gameId.trim().toLowerCase())}`);
}

export function joinGame(gameId, playerName) {
  return request(`/games/${encodeURIComponent(gameId.trim().toLowerCase())}/join`, {
    method: 'POST',
    body: JSON.stringify({ playerName }),
  });
}

export function addFinding(gameId, body) {
  return request(`/games/${gameId}/findings`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function removeFinding(gameId, stateCode) {
  return request(`/games/${gameId}/findings/${stateCode}`, { method: 'DELETE' });
}

export function updateFindingLocation(gameId, stateCode, geo) {
  return request(`/games/${gameId}/findings/${stateCode}`, {
    method: 'PATCH',
    body: JSON.stringify({
      latitude: geo.latitude,
      longitude: geo.longitude,
      locationLabel: geo.label,
    }),
  });
}

export function importGame(backup, playerName) {
  return request('/games/import', {
    method: 'POST',
    body: JSON.stringify({ backup, playerName }),
  });
}
