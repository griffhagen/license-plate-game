import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  createGame,
  getGame,
  addPlayer,
  getPlayers,
  getFindings,
  addFinding,
  updateFindingLocation,
  removeFinding,
  restoreGame,
  coerceFindingCoords,
} from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: isProd ? false : ['http://localhost:5173'], methods: ['GET', 'POST'] },
});

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

function gamePayload(gameId) {
  const game = getGame(gameId);
  if (!game) return null;
  const id = game.id;
  return {
    id: game.id,
    name: game.name,
    createdAt: game.created_at,
    players: getPlayers(id).map((p) => ({ id: p.id, name: p.name, joinedAt: p.joined_at })),
    findings: getFindings(id).map((f) => ({
      stateCode: f.state_code,
      playerId: f.player_id,
      playerName: f.player_name,
      latitude: f.latitude,
      longitude: f.longitude,
      locationLabel: f.location_label,
      foundAt: f.found_at,
    })),
  };
}

function broadcastGame(gameId) {
  const game = getGame(gameId);
  if (!game) return null;
  const payload = gamePayload(game.id);
  if (payload) io.to(game.id).emit('game:update', payload);
  return payload;
}

function prepareRestoreData(game, playerName) {
  const importer = playerName.trim();
  const sourcePlayers =
    Array.isArray(game.players) && game.players.length > 0 ? game.players : [];

  const idMap = new Map();
  const players = sourcePlayers.map((p) => {
    const newId = nanoid(12);
    if (p.id) idMap.set(p.id, newId);
    return {
      id: newId,
      name: String(p.name || 'Player').trim(),
      joinedAt: p.joinedAt || new Date().toISOString(),
    };
  });

  let playerId = players.find((p) => p.name.toLowerCase() === importer.toLowerCase())?.id;
  if (!playerId) {
    playerId = nanoid(12);
    players.push({ id: playerId, name: importer, joinedAt: new Date().toISOString() });
  }

  const seenStates = new Set();
  const findings = (game.findings || [])
    .map((f) => {
      const stateCode = String(f.stateCode || f.state_code || '')
        .trim()
        .toUpperCase();
      if (!stateCode || stateCode.length !== 2) return null;
      const mappedPlayerId = idMap.get(f.playerId ?? f.player_id) || playerId;
      const owner =
        players.find((p) => p.id === mappedPlayerId) ||
        players.find((p) => p.name === (f.playerName || f.player_name));
      const coords = coerceFindingCoords({
        latitude: f.latitude ?? f.lat,
        longitude: f.longitude ?? f.lng ?? f.lon,
        locationLabel: f.locationLabel ?? f.location_label ?? f.label,
      });
      return {
        stateCode,
        playerId: mappedPlayerId,
        playerName: String(f.playerName || f.player_name || owner?.name || importer).trim(),
        latitude: coords.latitude,
        longitude: coords.longitude,
        locationLabel: coords.locationLabel,
        foundAt: f.foundAt || f.found_at || new Date().toISOString(),
      };
    })
    .filter((f) => {
      if (!f || seenStates.has(f.stateCode)) return false;
      seenStates.add(f.stateCode);
      return true;
    });

  return { players, findings, playerId };
}

app.post('/api/games/import', (req, res) => {
  const { backup, playerName } = req.body;
  const game = backup?.game;
  if (!game?.name?.trim()) {
    return res.status(400).json({ error: 'Invalid backup data' });
  }
  if (!playerName?.trim()) {
    return res.status(400).json({ error: 'Your name is required to restore' });
  }

  const previousId = game.id ? normalizeGameId(game.id) : null;
  let gameId = previousId || nanoid(8).toLowerCase();
  if (getGame(gameId)) {
    gameId = nanoid(8).toLowerCase();
  }

  const { players, findings, playerId } = prepareRestoreData(game, playerName);

  try {
    restoreGame({
      id: gameId,
      name: game.name.trim(),
      players,
      findings,
    });
    const payload = gamePayload(gameId);
    res.json({
      ...payload,
      playerId,
      restored: true,
      previousId,
      newGameCode: gameId !== previousId,
    });
  } catch (err) {
    console.error('Import failed:', err);
    const msg =
      err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY'
        ? 'Restore failed: conflicting data on server'
        : 'Could not restore backup';
    return res.status(500).json({ error: msg });
  }
});

app.post('/api/games', (req, res) => {
  const { name, playerName } = req.body;
  if (!name?.trim() || !playerName?.trim()) {
    return res.status(400).json({ error: 'Game name and player name are required' });
  }
  const gameId = nanoid(8).toLowerCase();
  const playerId = nanoid(12);
  createGame(gameId, name.trim());
  addPlayer(playerId, gameId, playerName.trim());
  const payload = gamePayload(gameId);
  res.json({ ...payload, playerId });
});

function normalizeGameId(id) {
  return String(id || '').trim().toLowerCase();
}

app.get('/api/games/:id', (req, res) => {
  const payload = gamePayload(normalizeGameId(req.params.id));
  if (!payload) return res.status(404).json({ error: 'Game not found' });
  res.json(payload);
});

app.post('/api/games/:id/join', (req, res) => {
  const { playerName } = req.body;
  const gameId = normalizeGameId(req.params.id);
  if (!playerName?.trim()) return res.status(400).json({ error: 'Player name is required' });
  const game = getGame(gameId);
  if (!game) return res.status(404).json({ error: 'Game not found' });
  const playerId = nanoid(12);
  addPlayer(playerId, game.id, playerName.trim());
  broadcastGame(game.id);
  res.json({ ...gamePayload(game.id), playerId });
});

app.patch('/api/games/:id/findings/:stateCode', (req, res) => {
  const game = getGame(normalizeGameId(req.params.id));
  if (!game) return res.status(404).json({ error: 'Game not found' });
  const stateCode = String(req.params.stateCode || '').trim().toUpperCase();
  const { latitude, longitude, locationLabel } = req.body;
  const coords = coerceFindingCoords({ latitude, longitude, locationLabel });
  if (coords.latitude == null || coords.longitude == null) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  const result = updateFindingLocation({
    gameId: game.id,
    stateCode,
    ...coords,
  });
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Finding not found' });
  }
  const payload = broadcastGame(game.id);
  res.json(payload);
});

app.post('/api/games/:id/findings', (req, res) => {
  const game = getGame(normalizeGameId(req.params.id));
  const { stateCode, playerId, playerName, latitude, longitude, locationLabel } = req.body;
  if (!game) return res.status(404).json({ error: 'Game not found' });
  if (!stateCode || !playerId || !playerName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const coords = coerceFindingCoords({ latitude, longitude, locationLabel });
  try {
    addFinding({
      gameId: game.id,
      stateCode,
      playerId,
      playerName,
      ...coords,
    });
    const payload = broadcastGame(game.id);
    res.json(payload);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'This state was already found in this game' });
    }
    throw err;
  }
});

app.delete('/api/games/:id/findings/:stateCode', (req, res) => {
  const game = getGame(normalizeGameId(req.params.id));
  if (!game) return res.status(404).json({ error: 'Game not found' });
  removeFinding(game.id, req.params.stateCode);
  const payload = broadcastGame(game.id);
  res.json(payload);
});

io.on('connection', (socket) => {
  socket.on('game:join', (gameId) => {
    const game = getGame(gameId);
    if (game) {
      socket.join(game.id);
      socket.emit('game:update', gamePayload(game.id));
    }
  });
});

if (isProd) {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/socket.io')) {
      res.sendFile(join(distPath, 'index.html'));
    }
  });
}

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
