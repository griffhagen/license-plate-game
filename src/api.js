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
  return request(`/games/${gameId}`);
}

export function joinGame(gameId, playerName) {
  return request(`/games/${gameId}/join`, {
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
