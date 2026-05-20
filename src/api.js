async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
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

export function importGame(backup, playerName) {
  return request('/games/import', {
    method: 'POST',
    body: JSON.stringify({ backup, playerName }),
  });
}
