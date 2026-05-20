import { normalizeFinding } from './findingLocation.js';

export const BACKUP_VERSION = 1;

export function buildGameBackup(game) {
  const findings = (game.findings || [])
    .map(normalizeFinding)
    .filter(Boolean);

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    game: {
      id: game.id,
      name: game.name,
      createdAt: game.createdAt,
      players: game.players,
      findings,
    },
  };
}

export function parseGameBackup(raw) {
  let data;
  try {
    data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    throw new Error('Could not read file — make sure it is a .json backup from Export');
  }
  if (!data?.game) {
    throw new Error('Invalid backup file format');
  }
  if (Number(data.version) !== BACKUP_VERSION) {
    throw new Error('Unsupported backup version');
  }
  const { game } = data;
  if (!game.name?.trim()) {
    throw new Error('Backup is missing trip name');
  }
  if (!Array.isArray(game.findings)) {
    game.findings = [];
  }
  if (!Array.isArray(game.players)) {
    game.players = [];
  }
  game.findings = game.findings.map(normalizeFinding).filter(Boolean);
  return data;
}

export function downloadGameBackup(game) {
  const backup = buildGameBackup(game);
  const safeName = game.name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'trip';
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `plate-game-${safeName}-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function readBackupFile(file) {
  const text = await file.text();
  return parseGameBackup(text);
}
