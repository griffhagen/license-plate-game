import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import * as api from '../api';
import { clearJoinFromUrl, getJoinGameIdFromUrl } from '../utils/joinUrl';

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
    const joinFromUrl = getJoinGameIdFromUrl();
    const session = loadSession();

    // Invite link for a different game — show join screen, not old session
    if (joinFromUrl && session?.gameId && joinFromUrl !== session.gameId.toLowerCase()) {
      clearSession();
      setLoading(false);
      return;
    }

    if (!session?.gameId || !session?.playerId) {
      setLoading(false);
      return;
    }

    api
      .getGame(session.gameId)
      .then((data) => {
        applyGame(data, session.playerId);
        if (joinFromUrl && joinFromUrl === data.id.toLowerCase()) {
          clearJoinFromUrl();
        }
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
    const id = gameId.trim().toLowerCase();
    if (!id) throw new Error('Game code is required');
    const data = await api.joinGame(id, playerName);
    const session = { gameId: data.id, playerId: data.playerId, playerName };
    saveSession(session);
    applyGame(data, data.playerId);
    clearJoinFromUrl();
    return data;
  };

  const leaveGame = () => {
    clearSession();
    setGame(null);
    setPlayerId(null);
  };

  const importBackup = async (backup, playerName) => {
    setError(null);
    const data = await api.importGame(backup, playerName);
    const session = { gameId: data.id, playerId: data.playerId, playerName };
    saveSession(session);
    applyGame(data, data.playerId);
    clearJoinFromUrl();
    return data;
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
    importBackup,
    markFound,
    unmarkFound,
  };
}
