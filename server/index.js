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
  removeFinding,
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
  return {
    id: game.id,
    name: game.name,
    createdAt: game.created_at,
    players: getPlayers(gameId).map((p) => ({ id: p.id, name: p.name, joinedAt: p.joined_at })),
    findings: getFindings(gameId).map((f) => ({
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
  const payload = gamePayload(gameId);
  if (payload) io.to(gameId).emit('game:update', payload);
  return payload;
}

app.post('/api/games', (req, res) => {
  const { name, playerName } = req.body;
  if (!name?.trim() || !playerName?.trim()) {
    return res.status(400).json({ error: 'Game name and player name are required' });
  }
  const gameId = nanoid(8);
  const playerId = nanoid(12);
  createGame(gameId, name.trim());
  addPlayer(playerId, gameId, playerName.trim());
  const payload = gamePayload(gameId);
  res.json({ ...payload, playerId });
});

app.get('/api/games/:id', (req, res) => {
  const payload = gamePayload(req.params.id);
  if (!payload) return res.status(404).json({ error: 'Game not found' });
  res.json(payload);
});

app.post('/api/games/:id/join', (req, res) => {
  const { playerName } = req.body;
  const gameId = req.params.id;
  if (!getGame(gameId)) return res.status(404).json({ error: 'Game not found' });
  if (!playerName?.trim()) return res.status(400).json({ error: 'Player name is required' });
  const playerId = nanoid(12);
  addPlayer(playerId, gameId, playerName.trim());
  broadcastGame(gameId);
  res.json({ ...gamePayload(gameId), playerId });
});

app.post('/api/games/:id/findings', (req, res) => {
  const gameId = req.params.id;
  const { stateCode, playerId, playerName, latitude, longitude, locationLabel } = req.body;
  if (!getGame(gameId)) return res.status(404).json({ error: 'Game not found' });
  if (!stateCode || !playerId || !playerName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    addFinding({ gameId, stateCode, playerId, playerName, latitude, longitude, locationLabel });
    const payload = broadcastGame(gameId);
    res.json(payload);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'This state was already found in this game' });
    }
    throw err;
  }
});

app.delete('/api/games/:id/findings/:stateCode', (req, res) => {
  const gameId = req.params.id;
  if (!getGame(gameId)) return res.status(404).json({ error: 'Game not found' });
  removeFinding(gameId, req.params.stateCode);
  const payload = broadcastGame(gameId);
  res.json(payload);
});

io.on('connection', (socket) => {
  socket.on('game:join', (gameId) => {
    if (getGame(gameId)) {
      socket.join(gameId);
      socket.emit('game:update', gamePayload(gameId));
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
