export const BACKUP_VERSION = 1;

export function buildGameBackup(game) {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    game: {
      id: game.id,
      name: game.name,
      createdAt: game.createdAt,
      players: game.players,
      findings: game.findings,
    },
  };
}

export function parseGameBackup(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!data || data.version !== BACKUP_VERSION || !data.game) {
    throw new Error('Invalid backup file format');
  }
  const { game } = data;
  if (!game.name?.trim() || !Array.isArray(game.findings)) {
    throw new Error('Backup is missing trip data');
  }
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
