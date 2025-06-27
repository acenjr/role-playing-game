import { GameProvider } from "../lib/game";
import {
  GameStats,
  GameText,
  GameControls,
} from "../components/GameUI";

export default function HomePage() {
  return (
    <GameProvider>
      <main className="max-w-2xl mx-auto mt-10 p-4 bg-background/80 rounded-lg shadow-lg border">
        <h1 className="text-3xl font-bold mb-4 text-center text-yellow-200 drop-shadow">
          Eldoria: Shadow of the Dragonfall
        </h1>
        <GameStats />
        <GameText />
        <GameControls />
      </main>
    </GameProvider>
  );
}
