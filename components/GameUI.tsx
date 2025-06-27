"use client";

import { useState } from "react";
import { useGame, weapons } from "../lib/game";
import { Button } from "./ui/button";

export function GameStats() {
  const { state } = useGame();
  return (
    <div className="flex flex-wrap gap-4 border p-2 rounded-md bg-background/50">
      <span>XP: <strong>{state.xp}</strong></span>
      <span>Health: <strong>{state.health}</strong></span>
      <span>Gold: <strong>{state.gold}</strong></span>
      <span>Weapon: <strong>{weapons[state.currentWeaponIndex].name}</strong></span>
      <span>Inventory: <strong>{state.inventory.join(", ")}</strong></span>
    </div>
  );
}

function InventoryModal({ open, onClose, inventory }: { open: boolean; onClose: () => void; inventory: string[] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background p-6 rounded-lg shadow-lg min-w-[300px]">
        <h2 className="text-lg font-bold mb-2">Inventory</h2>
        <ul className="mb-4">
          {inventory.map((item, i) => (
            <li key={i} className="py-1">{item}</li>
          ))}
        </ul>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function StatsModal({ open, onClose, state }: { open: boolean; onClose: () => void; state: any }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background p-6 rounded-lg shadow-lg min-w-[300px]">
        <h2 className="text-lg font-bold mb-2">Character Stats</h2>
        <div className="mb-2">XP: <strong>{state.xp}</strong></div>
        <div className="mb-2">Health: <strong>{state.health}</strong></div>
        <div className="mb-2">Gold: <strong>{state.gold}</strong></div>
        <div className="mb-2">Weapon: <strong>{weapons[state.currentWeaponIndex].name}</strong></div>
        <div className="mb-2">Inventory: <strong>{state.inventory.join(", ")}</strong></div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export function GameText() {
  const { state } = useGame();
  return (
    <div className="bg-card text-card-foreground p-4 rounded-md my-2 min-h-[80px] whitespace-pre-line">
      {state.gameText}
    </div>
  );
}

export function GameControls() {
  const { state, goTown, goStore, goCave, fightMonster, fightDragon, attack, attackDragon, dodge, buyHealth, buyWeapon, restart, showLore, beginAdventure } = useGame();
  const [showInventory, setShowInventory] = useState(false);
  const [showStats, setShowStats] = useState(false);

  if (!state.loreShown) {
    return (
      <div className="flex gap-2 flex-wrap">
        <Button onClick={beginAdventure}>Begin Adventure</Button>
        <Button variant="secondary" onClick={() => setShowInventory(true)}>View Inventory</Button>
        <Button variant="secondary" onClick={() => setShowStats(true)}>View Stats</Button>
        <InventoryModal open={showInventory} onClose={() => setShowInventory(false)} inventory={state.inventory} />
        <StatsModal open={showStats} onClose={() => setShowStats(false)} state={state} />
      </div>
    );
  }

  if (state.gameOver || state.win) {
    return (
      <div className="flex gap-2 flex-wrap">
        <Button onClick={restart}>Restart</Button>
        <Button variant="secondary" onClick={showLore}>Back to Lore</Button>
        <Button variant="secondary" onClick={() => setShowInventory(true)}>View Inventory</Button>
        <Button variant="secondary" onClick={() => setShowStats(true)}>View Stats</Button>
        <InventoryModal open={showInventory} onClose={() => setShowInventory(false)} inventory={state.inventory} />
        <StatsModal open={showStats} onClose={() => setShowStats(false)} state={state} />
      </div>
    );
  }

  // Town
  if (!state.fighting && !state.monsterStatsVisible && state.gameText.includes("town square")) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={goStore}>Go to store</Button>
        <Button onClick={goCave}>Go to cave</Button>
        <Button onClick={() => fightMonster(2)}>Fight goblin</Button>
        <Button onClick={() => fightMonster(3)}>Fight orc</Button>
        <Button onClick={fightDragon}>Fight dragon</Button>
        <Button variant="secondary" onClick={restart}>Restart Game</Button>
        <Button variant="secondary" onClick={showLore}>Back to Lore</Button>
        <Button variant="secondary" onClick={() => setShowInventory(true)}>View Inventory</Button>
        <Button variant="secondary" onClick={() => setShowStats(true)}>View Stats</Button>
        <InventoryModal open={showInventory} onClose={() => setShowInventory(false)} inventory={state.inventory} />
        <StatsModal open={showStats} onClose={() => setShowStats(false)} state={state} />
      </div>
    );
  }
  // Store
  if (!state.fighting && !state.monsterStatsVisible && state.gameText.includes("store")) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={buyHealth}>Buy 10 health (10 gold)</Button>
        <Button onClick={buyWeapon}>Buy weapon (30 gold)</Button>
        <Button onClick={goTown}>Go to town square</Button>
        <Button variant="secondary" onClick={restart}>Restart Game</Button>
        <Button variant="secondary" onClick={showLore}>Back to Lore</Button>
        <Button variant="secondary" onClick={() => setShowInventory(true)}>View Inventory</Button>
        <Button variant="secondary" onClick={() => setShowStats(true)}>View Stats</Button>
        <InventoryModal open={showInventory} onClose={() => setShowInventory(false)} inventory={state.inventory} />
        <StatsModal open={showStats} onClose={() => setShowStats(false)} state={state} />
      </div>
    );
  }
  // Cave
  if (!state.fighting && !state.monsterStatsVisible && state.gameText.includes("cave")) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => fightMonster(0)}>Fight slime</Button>
        <Button onClick={() => fightMonster(1)}>Fight fanged beast</Button>
        <Button onClick={() => fightMonster(4)}>Fight troll</Button>
        <Button onClick={() => fightMonster(5)}>Fight sorcerer</Button>
        <Button onClick={goTown}>Go to town square</Button>
        <Button variant="secondary" onClick={restart}>Restart Game</Button>
        <Button variant="secondary" onClick={showLore}>Back to Lore</Button>
        <Button variant="secondary" onClick={() => setShowInventory(true)}>View Inventory</Button>
        <Button variant="secondary" onClick={() => setShowStats(true)}>View Stats</Button>
        <InventoryModal open={showInventory} onClose={() => setShowInventory(false)} inventory={state.inventory} />
        <StatsModal open={showStats} onClose={() => setShowStats(false)} state={state} />
      </div>
    );
  }
  // Fighting monster
  if (state.fighting !== null && state.monsterStatsVisible && state.fighting !== 6) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={attack}>Attack</Button>
        <Button onClick={dodge}>Dodge</Button>
        <Button onClick={goTown}>Run</Button>
        <Button variant="secondary" onClick={restart}>Restart Game</Button>
        <Button variant="secondary" onClick={showLore}>Back to Lore</Button>
        <Button variant="secondary" onClick={() => setShowInventory(true)}>View Inventory</Button>
        <Button variant="secondary" onClick={() => setShowStats(true)}>View Stats</Button>
        <InventoryModal open={showInventory} onClose={() => setShowInventory(false)} inventory={state.inventory} />
        <StatsModal open={showStats} onClose={() => setShowStats(false)} state={state} />
      </div>
    );
  }
  // Fighting dragon
  if (state.fighting === 6 && state.monsterStatsVisible) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button onClick={attackDragon}>Attack</Button>
        <Button onClick={dodge}>Dodge</Button>
        <Button onClick={goTown}>Run</Button>
        <Button variant="secondary" onClick={restart}>Restart Game</Button>
        <Button variant="secondary" onClick={showLore}>Back to Lore</Button>
        <Button variant="secondary" onClick={() => setShowInventory(true)}>View Inventory</Button>
        <Button variant="secondary" onClick={() => setShowStats(true)}>View Stats</Button>
        <InventoryModal open={showInventory} onClose={() => setShowInventory(false)} inventory={state.inventory} />
        <StatsModal open={showStats} onClose={() => setShowStats(false)} state={state} />
      </div>
    );
  }
  // After defeating monster
  if (!state.fighting && !state.monsterStatsVisible && state.gameText.includes("defeated")) {
    return (
      <div className="flex gap-2 flex-wrap">
        <Button onClick={goTown}>Go to town square</Button>
        <Button variant="secondary" onClick={restart}>Restart Game</Button>
        <Button variant="secondary" onClick={showLore}>Back to Lore</Button>
        <Button variant="secondary" onClick={() => setShowInventory(true)}>View Inventory</Button>
        <Button variant="secondary" onClick={() => setShowStats(true)}>View Stats</Button>
        <InventoryModal open={showInventory} onClose={() => setShowInventory(false)} inventory={state.inventory} />
        <StatsModal open={showStats} onClose={() => setShowStats(false)} state={state} />
      </div>
    );
  }
  return null;
}
