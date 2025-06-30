"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Weapon = { name: string; power: number };
export type Monster = { name: string; level: number; health: number; avatar: string };
export type Companion = { name: string; role: string; description: string; avatar: string; unlocked: boolean };
export type Dragon = { name: string; element: string; description: string; avatar: string; unlocked: boolean };

const weapons: Weapon[] = [
  { name: "Aethersteel Blade", power: 10 },
  { name: "Sun Court Spear", power: 30 },
  { name: "Alchemist's Bomb", power: 50 },
  { name: "Beast Tamer's Whip", power: 80 },
  { name: "Dwarven Warhammer", power: 120 },
  { name: "Veilforged Staff", power: 180 },
  { name: "Phoenix Bow", power: 250 },
  { name: "Shadow Blade", power: 350 },
  { name: "Dragon's Fang", power: 500 }
];

const monsters: Monster[] = [
  { name: "Wraithspawn", level: 2, health: 20, avatar: "/avatars/wraithspawn.png" },
  { name: "Corrupted Wolf", level: 5, health: 40, avatar: "/avatars/corrupted_wolf.png" },
  { name: "Goblin Raider", level: 8, health: 60, avatar: "/avatars/goblin_raider.png" },
  { name: "Bloodthorn Ent", level: 12, health: 100, avatar: "/avatars/bloodthorn_ent.png" },
  { name: "Veil Sorcerer", level: 16, health: 160, avatar: "/avatars/veil_sorcerer.png" },
  { name: "Troll Brute", level: 20, health: 220, avatar: "/avatars/troll_brute.png" },
  { name: "Wraith Dragon", level: 25, health: 400, avatar: "/avatars/wraith_dragon.png" }
];

const companions: Companion[] = [
  {
    name: "Lira the Alchemist",
    role: "Rogue Alchemist",
    description: "A quick-witted potion maker who can craft bombs and healing elixirs. Loyal, but haunted by her past experiments.",
    avatar: "/avatars/lira.png",
    unlocked: true
  },
  {
    name: "Sir Caelum",
    role: "Knight of the Sun Court",
    description: "A fallen knight seeking redemption. His shield can block magical attacks, but his faith is shaken.",
    avatar: "/avatars/caelum.png",
    unlocked: false
  },
  {
    name: "Mira & Fen",
    role: "Beast Tamer & Companion",
    description: "A wild-hearted tamer and her half-corrupted wolf, Fen. They can sniff out secrets and bypass certain monsters.",
    avatar: "/avatars/mira_fen.png",
    unlocked: false
  }
];

const dragons: Dragon[] = [
  {
    name: "Florwyn",
    element: "Bloom",
    description: "The gentle Bloom Dragon, whose mind is fractured. Restoring her will heal the Greenvale.",
    avatar: "/avatars/florwyn.png",
    unlocked: false
  },
  {
    name: "Pyroxis",
    element: "Flame",
    description: "The tyrant of Ashenreach, burning villages to maintain order. Can be freed or chained.",
    avatar: "/avatars/pyroxis.png",
    unlocked: false
  },
  {
    name: "Zephyra",
    element: "Wind",
    description: "The Wind Dragon, trapped in a time loop above Skyrend Cliffs.",
    avatar: "/avatars/zephyra.png",
    unlocked: false
  },
  {
    name: "Miryss",
    element: "Tides",
    description: "The Tides Dragon, now a leviathan whisperer in the abyssal Thal’mora.",
    avatar: "/avatars/miryss.png",
    unlocked: false
  },
  {
    name: "Dragmar",
    element: "Stone",
    description: "The Stone Dragon, encasing Kael’Dor in stasis to halt corruption.",
    avatar: "/avatars/dragmar.png",
    unlocked: false
  },
  {
    name: "Veyrith",
    element: "Aether",
    description: "The corrupted Aether Dragon, first among equals, now the source of the Dragonfall.",
    avatar: "/avatars/veyrith.png",
    unlocked: false
  }
];

// --- Chapter system ---
export type Chapter = {
  name: string;
  description: string;
  unlockXp: number;
  difficulty: number;
};

export const chapters: Chapter[] = [
  {
    name: "Prologue: The Last Repeller",
    description: "Escape the ruins and reach Greenvale. Learn the basics of combat and inventory.",
    unlockXp: 0,
    difficulty: 1,
  },
  {
    name: "Chapter 1: Whispers in the Greenvale",
    description: "Face twisted nature and recover the Dream Shards.",
    unlockXp: 20,
    difficulty: 2,
  },
  {
    name: "Chapter 2: Cinders of the Crimson Peak",
    description: "Confront Pyroxis and the fire-mages in Ashenreach.",
    unlockXp: 50,
    difficulty: 3,
  },
  {
    name: "Chapter 3: The Shattered Court",
    description: "Unravel the Sun Court’s betrayal and recruit Sir Caelum.",
    unlockXp: 90,
    difficulty: 4,
  },
  {
    name: "Chapter 4: Skyrend’s Paradox",
    description: "Break Zephyra’s time loop and gain her wind powers.",
    unlockXp: 150,
    difficulty: 5,
  },
  {
    name: "Chapter 5: The Abyssal Pact",
    description: "Descend to Thal’mora and awaken Miryss, the Tides Dragon.",
    unlockXp: 220,
    difficulty: 6,
  },
  {
    name: "Chapter 6: Stone and Stasis",
    description: "Free Dragmar and confront the Veil’s corruption in Kael’Dor.",
    unlockXp: 300,
    difficulty: 7,
  },
  {
    name: "Finale: The Aetherfall",
    description: "Face Veyrith and decide the fate of Eldoria.",
    unlockXp: 400,
    difficulty: 8,
  },
];

export type GameState = {
  xp: number;
  health: number;
  gold: number;
  currentWeaponIndex: number;
  inventory: string[];
  fighting: number | null;
  monsterHealth: number;
  gameText: string;
  monsterStatsVisible: boolean;
  monsterName: string;
  monsterHealthText: number;
  gameOver: boolean;
  win: boolean;
  loreShown: boolean;
  companions: Companion[];
  dragons: Dragon[];
  currentChapter: number;
  battleLog?: string[];
  location: 'lore' | 'town' | 'store' | 'cave' | 'battle'; // NEW
};

const loreText = `Eldoria: Shadow of the Dragonfall\n\nFor millennia, the realm of Eldoria thrived in harmony, protected by the six Dragon Guardians. But when Veyrith, the Aether Dragon, was corrupted by Maltheor from the Veil Beyond, the world was plunged into chaos. The Dragonfall shattered the land, twisted nature, and summoned Wraithspawn.\n\nYou are the last Dragon Repeller, raised in secret by Elandor after the fall of Serath’Kai. Armed with an Aethersteel blade and ancient runes, you must restore balance, gather allies, and face the darkness.\n\n---\n\n**Your Companions (Unlocked):**\n- Lira the Alchemist: A quick-witted potion maker.\n\n**Dragons (Known):**\n- Florwyn (Bloom): Mind fractured, Greenvale in peril.\n- Pyroxis (Flame): Tyrant of Ashenreach.\n- Zephyra (Wind): Trapped in a time loop.\n- Miryss (Tides): Leviathan whisperer.\n- Dragmar (Stone): Encased Kael’Dor in stasis.\n- Veyrith (Aether): Corrupted, source of the Dragonfall.\n\n---\n\nPress 'Begin Adventure' to start your quest!`;

const initialState: GameState = {
  xp: 10,
  health: 100,
  gold: 120,
  currentWeaponIndex: 0,
  inventory: ["Aethersteel Blade"],
  fighting: null,
  monsterHealth: 0,
  gameText: loreText,
  monsterStatsVisible: false,
  monsterName: "",
  monsterHealthText: 0,
  gameOver: false,
  win: false,
  loreShown: false,
  companions: companions,
  dragons: dragons,
  currentChapter: 0,
  battleLog: [],
  location: 'lore', // NEW
};

type GameContextType = {
  state: GameState;
  goTown: () => void;
  goStore: () => void;
  goCave: () => void;
  fightMonster: (index: number) => void;
  fightDragon: () => void;
  attack: () => void;
  attackDragon: () => void;
  dodge: () => void;
  buyHealth: () => void;
  buyWeapon: () => void;
  restart: () => void;
  showLore: () => void;
  beginAdventure: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  useEffect(() => {
    // Find the highest unlocked chapter
    const unlocked = chapters.reduce((acc, ch, idx) => (state.xp >= ch.unlockXp ? idx : acc), 0);
    if (unlocked !== state.currentChapter) {
      setState(s => ({ ...s, currentChapter: unlocked }));
    }
    // Unlock companions/dragons as XP increases
    const { unlockedCompanions, unlockedDragons } = unlockCompanionsAndDragons(state.xp, state.companions, state.dragons);
    if (
      JSON.stringify(unlockedCompanions) !== JSON.stringify(state.companions) ||
      JSON.stringify(unlockedDragons) !== JSON.stringify(state.dragons)
    ) {
      setState(s => ({ ...s, companions: unlockedCompanions, dragons: unlockedDragons }));
    }
  }, [state.xp]);

  // Helper to update state
  const update = (patch: Partial<GameState>) => setState((s) => ({ ...s, ...patch }));

  // --- Advanced companion/dragon unlocks and effects ---
  const unlockCompanionsAndDragons = (xp: number, prevCompanions: Companion[], prevDragons: Dragon[]) => {
    // Unlock companions/dragons based on XP or chapter
    const unlockedCompanions = prevCompanions.map((c) => {
      if (!c.unlocked && ((c.name === "Sir Caelum" && xp >= 90) || (c.name === "Mira & Fen" && xp >= 150))) {
        return { ...c, unlocked: true };
      }
      return c;
    });
    const unlockedDragons = prevDragons.map((d) => {
      if (!d.unlocked && ((d.name === "Florwyn" && xp >= 20) || (d.name === "Pyroxis" && xp >= 50) || (d.name === "Zephyra" && xp >= 150) || (d.name === "Miryss" && xp >= 220) || (d.name === "Dragmar" && xp >= 300) || (d.name === "Veyrith" && xp >= 400))) {
        return { ...d, unlocked: true };
      }
      return d;
    });
    return { unlockedCompanions, unlockedDragons };
  };

  const showLore = () => {
    update({ gameText: loreText, loreShown: false, monsterStatsVisible: false, fighting: null, location: 'lore' });
  };

  const beginAdventure = () => {
    update({
      gameText: 'You are in the town square. You see a sign that says "Store".',
      monsterStatsVisible: false,
      fighting: null,
      gameOver: false,
      win: false,
      loreShown: true,
      location: 'town',
    });
  };

  const goTown = () => {
    update({
      gameText: 'You are in the town square. You see a sign that says "Store".',
      monsterStatsVisible: false,
      fighting: null,
      gameOver: false,
      win: false,
      location: 'town',
    });
  };

  const goStore = () => {
    update({
      gameText: 'You enter the store.',
      monsterStatsVisible: false,
      fighting: null,
      location: 'store',
    });
  };

  const goCave = () => {
    update({
      gameText: 'You enter the cave. You see some monsters.',
      monsterStatsVisible: false,
      fighting: null,
      location: 'cave',
    });
  };

  const fightMonster = (index: number) => {
    update({
      fighting: index,
      monsterHealth: monsters[index].health,
      monsterStatsVisible: true,
      monsterName: monsters[index].name,
      monsterHealthText: monsters[index].health,
      gameText: `You are fighting a ${monsters[index].name}.`,
      location: 'battle',
    });
  };

  const fightDragon = () => {
    update({
      fighting: 2,
      monsterHealth: monsters[2].health,
      monsterStatsVisible: true,
      monsterName: monsters[2].name,
      monsterHealthText: monsters[2].health,
      gameText: 'You are fighting the dragon!',
      location: 'battle',
    });
  };

  // --- Battle log update helper ---
  const addBattleLog = (entry: string) => {
    setState((s) => ({ ...s, battleLog: [...(s.battleLog || []), entry] }));
  };

  const attack = () => {
    if (state.fighting === null) return;
    const weapon = weapons[state.currentWeaponIndex];
    const monster = monsters[state.fighting];
    let monsterHealth = state.monsterHealth - (weapon.power + Math.floor(Math.random() * state.xp) + 1);
    let health = state.health - monster.level;
    // Companion/dragon effects (example: Lira heals, Florwyn gives shield)
    let companionEffect = "";
    if (state.companions.find(c => c.name === "Lira the Alchemist" && c.unlocked)) {
      health += 2; // Lira heals a bit
      companionEffect = "Lira tosses a healing elixir (+2 health). ";
    }
    if (state.dragons.find(d => d.name === "Florwyn" && d.unlocked)) {
      health += 3; // Florwyn shields
      companionEffect += "Florwyn’s aura shields you (+3 health). ";
    }
    if (health <= 0) {
      update({ health: 0, gameText: "You died. ☠️ Game over.", gameOver: true });
      addBattleLog(`You were slain by the ${monster.name}.`);
      return;
    }
    if (monsterHealth <= 0) {
      // Defeated monster
      let gold = state.gold + Math.floor(monster.level * 6.7);
      let xp = state.xp + monster.level;
      update({
        gold,
        xp,
        monsterStatsVisible: false,
        fighting: null,
        gameText: `You defeated the ${monster.name}! You gain gold and XP.`,
      });
      addBattleLog(`You defeated the ${monster.name}! ${companionEffect}`);
      return;
    }
    update({
      monsterHealth,
      health,
      monsterHealthText: monsterHealth,
      gameText: `You attack the ${monster.name} with your ${weapon.name}.`,
    });
    addBattleLog(`You hit the ${monster.name} with ${weapon.name}. ${companionEffect}`);
  };

  const attackDragon = () => {
    const weapon = weapons[state.currentWeaponIndex];
    let monsterHealth = state.monsterHealth - (weapon.power + Math.floor(Math.random() * state.xp) + 1);
    let health = state.health - monsters[2].level;
    // Dragon/companion effects (example: Pyroxis burns, Zephyra shields)
    let dragonEffect = "";
    if (state.dragons.find(d => d.name === "Pyroxis" && d.unlocked)) {
      monsterHealth -= 10; // Pyroxis burns
      dragonEffect = "Pyroxis scorches the foe (-10 health). ";
    }
    if (state.dragons.find(d => d.name === "Zephyra" && d.unlocked)) {
      health += 5; // Zephyra shields
      dragonEffect += "Zephyra’s winds shield you (+5 health). ";
    }
    if (health <= 0) {
      update({ health: 0, gameText: "You died. ☠️ Game over.", gameOver: true });
      addBattleLog("You were slain by the dragon.");
      return;
    }
    if (monsterHealth <= 0) {
      update({
        monsterStatsVisible: false,
        fighting: null,
        gameText: "You defeated the dragon! You win the game! 🏆",
        win: true,
      });
      addBattleLog(`You defeated the dragon! ${dragonEffect}`);
      return;
    }
    update({
      monsterHealth,
      health,
      monsterHealthText: monsterHealth,
      gameText: `You attack the dragon with your ${weapon.name}.`,
    });
    addBattleLog(`You hit the dragon with ${weapon.name}. ${dragonEffect}`);
  };

  const dodge = () => {
    if (state.fighting === null) return;
    let health = state.health - monsters[state.fighting].level;
    if (health <= 0) {
      update({ health: 0, gameText: "You died. ☠️ Game over.", gameOver: true });
      return;
    }
    update({ health, gameText: "You dodge the attack." });
  };

  const buyHealth = () => {
    if (state.gold >= 10) {
      update({ health: state.health + 10, gold: state.gold - 10, gameText: "You bought 10 health." });
    } else {
      update({ gameText: "Not enough gold." });
    }
  };

  const buyWeapon = () => {
    if (state.currentWeaponIndex < weapons.length - 1) {
      if (state.gold >= 30) {
        update({
          currentWeaponIndex: state.currentWeaponIndex + 1,
          gold: state.gold - 30,
          inventory: [...state.inventory, weapons[state.currentWeaponIndex + 1].name],
          gameText: `You bought a ${weapons[state.currentWeaponIndex + 1].name}.`,
        });
      } else {
        update({ gameText: "Not enough gold." });
      }
    } else {
      update({ gameText: "You already have the most powerful weapon!" });
    }
  };

  const restart = () => {
    setState(initialState);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        goTown: beginAdventure,
        goStore,
        goCave,
        fightMonster,
        fightDragon,
        attack,
        attackDragon,
        dodge,
        buyHealth,
        buyWeapon,
        restart,
        showLore,
        beginAdventure,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export { weapons, monsters };
