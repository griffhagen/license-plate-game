import { useGame } from './hooks/useGame';
import { useTheme } from './hooks/useTheme';
import HomeScreen from './components/HomeScreen';
import GameView from './components/GameView';

export default function App() {
  const gameHook = useGame();
  const themeHook = useTheme();
  const { game, loading } = gameHook;

  if (loading) {
    return (
      <div className="app loading-screen">
        <span className="hero-plate loading-plate">USA</span>
        <div className="loader" />
        <p>Loading your road trip…</p>
      </div>
    );
  }

  if (!game) {
    return <HomeScreen {...gameHook} {...themeHook} />;
  }

  return <GameView {...gameHook} {...themeHook} />;
}
