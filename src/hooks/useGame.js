import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import * as api from '../api';
import { clearJoinFromUrl, getJoinGameIdFromUrl } from '../utils/joinUrl';
import { hasGeoCoords } from '../utils/findingLocation';
import {
  addPending,
  clearPending,
  loadPending,
  mergePending,
  removePending,
} from '../utils/pendingFindings';
import { forgetTrip, loadTrips, rememberTrip } from '../utils/tripHistory';

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
  const [pendingCount, setPendingCount] = useState(0);
  const [trips, setTrips] = useState(() => loadTrips());

  // Last payload the server sent, kept so queued finds can be re-merged onto it
  // without another round trip.
  const serverGameRef = useRef(null);
  const pendingRef = useRef([]);

  const publish = useCallback((serverGame, pid) => {
    if (!serverGame) return;
    setGame({
      id: serverGame.id,
      name: serverGame.name,
      createdAt: serverGame.createdAt,
      players: serverGame.players,
      findings: mergePending(serverGame.findings, pendingRef.current),
    });
    setPendingCount(pendingRef.current.length);
    if (pid) setPlayerId(pid);
  }, []);

  const applyGame = useCallback(
    (data, pid) => {
      serverGameRef.current = data;
      pendingRef.current = loadPending(data.id);
      publish(data, pid);
      // Keep this device's trip list current as the game changes, so the code
      // is still here after you leave.
      setTrips(
        rememberTrip({
          gameId: data.id,
          name: data.name,
          playerName: loadSession()?.playerName,
          foundCount: data.findings.length,
        })
      );
    },
    [publish]
  );

  /**
   * Replay queued finds. Safe to call often — it no-ops when the queue is empty.
   * Declared before the effects that list it as a dependency: those dependency
   * arrays are evaluated during render, so a later `const` would be in its
   * temporal dead zone and throw.
   */
  const flushPending = useCallback(async () => {
    const gameId = serverGameRef.current?.id;
    if (!gameId || !pendingRef.current.length) return;

    for (const item of [...pendingRef.current]) {
      try {
        serverGameRef.current = await api.addFinding(gameId, item);
        pendingRef.current = removePending(gameId, item.stateCode);
      } catch (err) {
        // Still offline — leave the rest queued for the next attempt.
        if (err.offline) break;
        // The server rejected it (409 someone else logged the plate first, or
        // 400 for a bad code). Retrying can never succeed, so drop it instead
        // of letting it block everything behind it.
        pendingRef.current = removePending(gameId, item.stateCode);
      }
    }
    publish(serverGameRef.current, null);
  }, [publish]);

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
    // Re-join on every connect, not just the first. A dropped connection
    // reconnects with a new socket id, and rooms are tracked per socket, so
    // joining once means live updates stop for good after the first blip.
    // The server replies to game:join with a full game:update, which also
    // resyncs anything missed while offline.
    socket.on('connect', () => {
      socket.emit('game:join', game.id);
      // Back online: push anything caught in a dead zone.
      flushPending();
    });
    socket.on('game:update', (data) => applyGame(data));
    return () => socket.disconnect();
  }, [game?.id, applyGame, flushPending]);

  // The socket can stay down while the network is back (captive portals, tab
  // throttling), so listen for the browser's own signal too.
  useEffect(() => {
    if (!game?.id) return undefined;
    const onOnline = () => flushPending();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [game?.id, flushPending]);

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

  /** Rejoin a trip from this device's history, reusing the name played under. */
  const resumeTrip = async (trip) => {
    if (!trip?.gameId) return null;
    const name = trip.playerName?.trim();
    if (!name) throw new Error('Join with your name to reopen this trip');
    return joinExisting(trip.gameId, name);
  };

  const forgetTripById = (gameId) => setTrips(forgetTrip(gameId));

  const leaveGame = () => {
    if (game?.id) clearPending(game.id);
    clearSession();
    pendingRef.current = [];
    serverGameRef.current = null;
    setPendingCount(0);
    setGame(null);
    setPlayerId(null);
  };

  const importBackup = async (backup, playerName) => {
    setError(null);
    clearSession();
    const data = await api.importGame(backup, playerName);
    const session = { gameId: data.id, playerId: data.playerId, playerName: playerName.trim() };
    saveSession(session);
    applyGame(data, data.playerId);
    clearJoinFromUrl();
    const mapSpots = data.findings.filter(hasGeoCoords).length;
    const locNote =
      mapSpots > 0
        ? ` ${mapSpots} map location${mapSpots !== 1 ? 's' : ''} included.`
        : '';
    if (data.newGameCode) {
      sessionStorage.setItem(
        'plate-restore-msg',
        `Trip restored with ${data.findings.length} plates.${locNote} New game code: ${data.id} — share this code with your group.`
      );
    } else {
      sessionStorage.setItem(
        'plate-restore-msg',
        `Trip restored with ${data.findings.length} plates found.${locNote}`
      );
    }
    return data;
  };

  const markFound = async (stateCode, geo) => {
    const session = loadSession();
    if (!game?.id || !session) return;
    const finding = {
      stateCode,
      playerId: session.playerId,
      playerName: session.playerName,
      latitude: geo?.latitude ?? null,
      longitude: geo?.longitude ?? null,
      locationLabel: geo?.label ?? null,
    };

    try {
      const data = await api.addFinding(game.id, finding);
      applyGame(data, session.playerId);
    } catch (err) {
      // A rejection from the server is real and belongs in front of the user.
      // A dead connection is not: queue the find and show it as caught.
      if (!err.offline) throw err;
      pendingRef.current = addPending(game.id, {
        ...finding,
        foundAt: new Date().toISOString(),
      });
      publish(serverGameRef.current, session.playerId);
    }
  };

  const addLocationToFinding = async (stateCode, geo) => {
    if (!game?.id) return;
    const data = await api.updateFindingLocation(game.id, stateCode, geo);
    applyGame(data, playerId);
  };

  const unmarkFound = async (stateCode) => {
    if (!game?.id) return;
    // A find that never reached the server is undone by dropping it from the
    // queue — no connection needed.
    if (pendingRef.current.some((f) => f.stateCode === stateCode)) {
      pendingRef.current = removePending(game.id, stateCode);
      publish(serverGameRef.current, playerId);
      return;
    }
    const data = await api.removeFinding(game.id, stateCode);
    applyGame(data, playerId);
  };

  const refreshGame = async () => {
    if (!game?.id) return;
    const data = await api.getGame(game.id);
    applyGame(data, playerId);
  };

  return {
    game,
    playerId,
    loading,
    error,
    setError,
    pendingCount,
    flushPending,
    trips,
    resumeTrip,
    forgetTripById,
    startGame,
    joinExisting,
    leaveGame,
    importBackup,
    markFound,
    unmarkFound,
    addLocationToFinding,
    refreshGame,
  };
}
