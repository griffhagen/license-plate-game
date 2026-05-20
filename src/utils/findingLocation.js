/** Normalize lat/lng/label from API, backup JSON, or legacy snake_case fields. */
export function coerceCoord(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function normalizeFinding(f) {
  if (!f || typeof f !== 'object') return null;
  const stateCode = String(f.stateCode ?? f.state_code ?? '')
    .trim()
    .toUpperCase();
  if (stateCode.length !== 2) return null;

  const latitude = coerceCoord(f.latitude ?? f.lat);
  const longitude = coerceCoord(f.longitude ?? f.lng ?? f.lon);
  const locationLabel =
    f.locationLabel ?? f.location_label ?? f.label ?? null;

  return {
    stateCode,
    playerId: f.playerId ?? f.player_id,
    playerName: f.playerName ?? f.player_name,
    latitude,
    longitude,
    locationLabel: locationLabel ? String(locationLabel).trim() : null,
    foundAt: f.foundAt ?? f.found_at,
  };
}

export function hasGeoCoords(finding) {
  return coerceCoord(finding?.latitude) != null && coerceCoord(finding?.longitude) != null;
}
