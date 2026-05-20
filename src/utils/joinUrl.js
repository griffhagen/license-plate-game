export function getJoinGameIdFromUrl() {
  const id = new URLSearchParams(window.location.search).get('join');
  return id?.trim().toLowerCase() || null;
}

export function clearJoinFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('join')) return;
  url.searchParams.delete('join');
  const path = url.pathname + (url.search || '') + url.hash;
  window.history.replaceState({}, '', path);
}
