import { useGame } from './hooks/useGame';
import HomeScreen from './components/HomeScreen';
import GameView from './components/GameView';

export default function App() {
  const gameHook = useGame();
  const { game, loading } = gameHook;

  if (loading) {
    return (
      <div className="app loading-screen">
        <div className="loader" />
        <p>Loading your road trip…</p>
      </div>
    );
  }

  if (!game) {
    return <HomeScreen {...gameHook} />;
  }

  return <GameView {...gameHook} />;
}
