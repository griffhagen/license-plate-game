import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import * as api from '../api';

const SESSION_KEY = 'plate-game-session';

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function useGame() {
  const [game, setGame] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyGame = useCallback((data, pid) => {
    setGame({
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
      players: data.players,
      findings: data.findings,
    });
    if (pid) setPlayerId(pid);
  }, []);

  useEffect(() => {
    const session = loadSession();
    if (!session?.gameId || !session?.playerId) {
      setLoading(false);
      return;
    }
    api
      .getGame(session.gameId)
      .then((data) => {
        applyGame(data, session.playerId);
      })
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, [applyGame]);

  useEffect(() => {
    if (!game?.id) return;
    const socket = io({ path: '/socket.io' });
    socket.emit('game:join', game.id);
    socket.on('game:update', (data) => applyGame(data));
    return () => socket.disconnect();
  }, [game?.id, applyGame]);

  const startGame = async (name, playerName) => {
    setError(null);
    const data = await api.createGame(name, playerName);
    const session = { gameId: data.id, playerId: data.playerId, playerName };
    saveSession(session);
    applyGame(data, data.playerId);
    return data;
  };

  const joinExisting = async (gameId, playerName) => {
    setError(null);
    const data = await api.joinGame(gameId, playerName);
    const session = { gameId: data.id, playerId: data.playerId, playerName };
    saveSession(session);
    applyGame(data, data.playerId);
    return data;
  };

  const leaveGame = () => {
    clearSession();
    setGame(null);
    setPlayerId(null);
  };

  const markFound = async (stateCode, geo) => {
    const session = loadSession();
    if (!game?.id || !session) return;
    const data = await api.addFinding(game.id, {
      stateCode,
      playerId: session.playerId,
      playerName: session.playerName,
      latitude: geo?.latitude,
      longitude: geo?.longitude,
      locationLabel: geo?.label,
    });
    applyGame(data, session.playerId);
  };

  const unmarkFound = async (stateCode) => {
    if (!game?.id) return;
    const data = await api.removeFinding(game.id, stateCode);
    applyGame(data, playerId);
  };

  return {
    game,
    playerId,
    loading,
    error,
    setError,
    startGame,
    joinExisting,
    leaveGame,
    markFound,
    unmarkFound,
  };
}
