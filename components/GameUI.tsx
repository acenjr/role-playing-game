"use client";

import { useState, useEffect, useRef } from "react";
import { useGame, weapons } from "../lib/game";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { fadeVariants, modalVariants } from "./animations";

const chapters = [
	{
		name: "Prologue: The Last Repeller",
		description:
			"Escape the ruins and reach Greenvale. Learn the basics of combat and inventory.",
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
	// ...add more chapters as needed...
];

export function GameStats() {
	const { state } = useGame();
	const currentChapter = chapters.reduce(
		(acc, ch) => (state.xp >= ch.unlockXp ? ch : acc),
		chapters[0]
	);
	return (
		<div className="flex flex-wrap gap-4 border p-2 rounded-md bg-background/50">
			<span>
				XP: <strong>{state.xp}</strong>
			</span>
			<span>
				Health: <strong>{state.health}</strong>
			</span>
			<span>
				Gold: <strong>{state.gold}</strong>
			</span>
			<span>
				Weapon:{" "}
				<strong>{weapons[state.currentWeaponIndex].name}</strong>
			</span>
			<span>
				Inventory: <strong>{state.inventory.join(", ")}</strong>
			</span>
			<span>
				Chapter: <strong>{currentChapter.name}</strong>
			</span>
		</div>
	);
}

function InventoryModal({
	open,
	onClose,
	inventory,
}: {
	open: boolean;
	onClose: () => void;
	inventory: string[];
}) {
	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
					variants={fadeVariants}
					initial="initial"
					animate="animate"
					exit="exit"
				>
					<motion.div
						className="bg-background p-6 rounded-lg shadow-lg min-w-[300px]"
						variants={modalVariants}
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<h2 className="text-lg font-bold mb-2">Inventory</h2>
						<ul className="mb-4">
							{inventory.map((item, i) => (
								<li key={i} className="py-1">
									{item}
								</li>
							))}
						</ul>
						<button
							className="px-4 py-2 bg-primary text-primary-foreground rounded"
							onClick={onClose}
						>
							Close
						</button>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

function StatsModal({
	open,
	onClose,
	state,
}: {
	open: boolean;
	onClose: () => void;
	state: any;
}) {
	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
					variants={fadeVariants}
					initial="initial"
					animate="animate"
					exit="exit"
				>
					<motion.div
						className="bg-background p-6 rounded-lg shadow-lg min-w-[300px]"
						variants={modalVariants}
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<h2 className="text-lg font-bold mb-2">Character Stats</h2>
						<div className="mb-2">
							XP: <strong>{state.xp}</strong>
						</div>
						<div className="mb-2">
							Health: <strong>{state.health}</strong>
						</div>
						<div className="mb-2">
							Gold: <strong>{state.gold}</strong>
						</div>
						<div className="mb-2">
							Weapon:{" "}
							<strong>{weapons[state.currentWeaponIndex].name}</strong>
						</div>
						<div className="mb-2">
							Inventory:{" "}
							<strong>{state.inventory.join(", ")}</strong>
						</div>
						<button
							className="px-4 py-2 bg-primary text-primary-foreground rounded"
							onClick={onClose}
						>
							Close
						</button>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export function GameText() {
	const { state } = useGame();
	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={state.gameText}
				variants={fadeVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				className="bg-card text-card-foreground p-4 rounded-md my-2 min-h-[80px] whitespace-pre-line"
			>
				{state.gameText}
			</motion.div>
		</AnimatePresence>
	);
}

function ProgressBar({
	value,
	max,
	color,
	label,
}: {
	value: number;
	max: number;
	color: string;
	label: string;
}) {
	return (
		<div className="w-full mb-2">
			<div className="flex justify-between text-xs mb-1">
				<span>{label}</span>
				<span>
					{value} / {max}
				</span>
			</div>
			<div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
				<motion.div
					className="h-3 rounded-full"
					style={{ background: color }}
					initial={{ width: 0 }}
					animate={{ width: `${Math.max(0, (value / max) * 100)}%` }}
					transition={{ duration: 0.5 }}
				/>
			</div>
		</div>
	);
}

function BattleStats() {
	const { state } = useGame();
	const monster = state.fighting !== null ? require("../lib/game").monsters[state.fighting] : null;
	if (!state.monsterStatsVisible || state.fighting === null) return null;
	return (
		<div className="flex flex-col md:flex-row gap-4 my-4">
			<div className="flex-1">
				<div className="font-bold mb-1">You</div>
				<ProgressBar value={state.health} max={100} color="#34d399" label="Health" />
				<ProgressBar value={state.xp} max={100} color="#fbbf24" label="XP" />
			</div>
			<div className="flex-1">
				<div className="font-bold mb-1">{monster?.name ?? "Opponent"}</div>
				<ProgressBar value={state.monsterHealthText} max={monster?.health ?? 100} color="#f87171" label="Health" />
				<ProgressBar value={monster?.level ?? 0} max={30} color="#818cf8" label="Level" />
			</div>
		</div>
	);
}

function BattleLog() {
	const { state } = useGame();
	const lastAction = useRef<string>("");
	const lastOpponent = useRef<string>("");
	// This is a simple placeholder. In a real game, you would update this with each attack/dodge.
	// For now, just show the last action text.
	if (!state.monsterStatsVisible) return null;
	return (
		<motion.div
			className="my-2 p-2 rounded bg-background/70 border text-sm"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.3 }}
		>
			<div className="font-bold mb-1">Battle Log</div>
			<div className="flex flex-col gap-1">
				<span className="text-green-600">You: {state.gameText}</span>
				<span className="text-red-600">
					Opponent: {state.monsterName} attacks for{" "}
					{state.fighting !== null ? require("../lib/game").monsters[state.fighting].level : 0} damage!
				</span>
			</div>
		</motion.div>
	);
}

export function MonsterStats() {
	const { state } = useGame();
	return (
		<>
			<div className="border p-2 rounded-md bg-destructive text-destructive-foreground my-2 flex flex-col gap-1">
				<span>
					Monster Name: <strong>{state.monsterName}</strong>
				</span>
				<span>
					Health: <strong>{state.monsterHealthText}</strong>
				</span>
				<span>
					Level: <strong>{state.fighting !== null ? state.fighting + 1 : "-"}</strong>
				</span>
			</div>
			<BattleStats />
			<BattleLog />
		</>
	);
}

export function GameControls() {
	const {
		state,
		goTown,
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
	} = useGame();
	const [showInventory, setShowInventory] = useState(false);
	const [showStats, setShowStats] = useState(false);

	// Automatic level up: increase health, gold, and unlock weapons as XP increases
	useEffect(() => {
		if (state.xp >= 20 && state.currentWeaponIndex < 1) {
			buyWeapon();
		}
		if (state.xp >= 50 && state.currentWeaponIndex < 2) {
			buyWeapon();
		}
		// Add more auto-levels as needed
	}, [state.xp]);

	if (!state.loreShown) {
		return (
			<div className="flex gap-2 flex-wrap">
				<Button onClick={beginAdventure}>Begin Adventure</Button>
				<Button
					variant="secondary"
					onClick={() => setShowInventory(true)}
				>
					View Inventory
				</Button>
				<Button variant="secondary" onClick={() => setShowStats(true)}>
					View Stats
				</Button>
				<InventoryModal
					open={showInventory}
					onClose={() => setShowInventory(false)}
					inventory={state.inventory}
				/>
				<StatsModal
					open={showStats}
					onClose={() => setShowStats(false)}
					state={state}
				/>
			</div>
		);
	}

	if (state.gameOver || state.win) {
		return (
			<div className="flex gap-2 flex-wrap">
				<Button onClick={restart}>Restart</Button>
				<Button variant="secondary" onClick={showLore}>
					Back to Lore
				</Button>
				<Button variant="secondary" onClick={goTown}>
					Back to Town
				</Button>
				<Button
					variant="secondary"
					onClick={() => setShowInventory(true)}
				>
					View Inventory
				</Button>
				<Button variant="secondary" onClick={() => setShowStats(true)}>
					View Stats
				</Button>
				<InventoryModal
					open={showInventory}
					onClose={() => setShowInventory(false)}
					inventory={state.inventory}
				/>
				<StatsModal
					open={showStats}
					onClose={() => setShowStats(false)}
					state={state}
				/>
			</div>
		);
	}

	// Town
	if (state.location === 'town') {
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
			</div>
		);
	}
	// Store
	if (state.location === 'store') {
		return (
			<div className="flex flex-wrap gap-2">
				<Button onClick={buyHealth}>Buy 10 health (10 gold)</Button>
				<Button onClick={buyWeapon}>Buy weapon (30 gold)</Button>
				<Button onClick={goTown}>Go to town square</Button>
				<Button variant="secondary" onClick={goCave}>Go to cave</Button>
				<Button variant="secondary" onClick={restart}>Restart Game</Button>
				<Button variant="secondary" onClick={showLore}>Back to Lore</Button>
				<Button variant="secondary" onClick={() => setShowInventory(true)}>View Inventory</Button>
				<Button variant="secondary" onClick={() => setShowStats(true)}>View Stats</Button>
			</div>
		);
	}
	// Cave
	if (state.location === 'cave') {
		return (
			<div className="flex flex-wrap gap-2">
				<Button onClick={() => fightMonster(0)}>Fight slime</Button>
				<Button onClick={() => fightMonster(1)}>Fight fanged beast</Button>
				<Button onClick={() => fightMonster(4)}>Fight troll</Button>
				<Button onClick={() => fightMonster(5)}>Fight sorcerer</Button>
				<Button onClick={goTown}>Go to town square</Button>
				<Button variant="secondary" onClick={goStore}>Go to store</Button>
				<Button variant="secondary" onClick={restart}>Restart Game</Button>
				<Button variant="secondary" onClick={showLore}>Back to Lore</Button>
				<Button variant="secondary" onClick={() => setShowInventory(true)}>View Inventory</Button>
				<Button variant="secondary" onClick={() => setShowStats(true)}>View Stats</Button>
			</div>
		);
	}
	// Fighting monster
	if (
		state.fighting !== null &&
		state.monsterStatsVisible &&
		state.fighting !== 6
	) {
		return (
			<div className="flex flex-wrap gap-2">
				<Button onClick={attack}>Attack</Button>
				<Button onClick={dodge}>Dodge</Button>
				<Button onClick={goTown}>Run to town</Button>
				<Button variant="secondary" onClick={goStore}>
					Run to store
				</Button>
				<Button variant="secondary" onClick={goCave}>
					Run to cave
				</Button>
				<Button variant="secondary" onClick={restart}>
					Restart Game
				</Button>
				<Button variant="secondary" onClick={showLore}>
					Back to Lore
				</Button>
				<Button
					variant="secondary"
					onClick={() => setShowInventory(true)}
				>
					View Inventory
				</Button>
				<Button variant="secondary" onClick={() => setShowStats(true)}>
					View Stats
				</Button>
			</div>
		);
	}
	// Fighting dragon
	if (state.fighting === 6 && state.monsterStatsVisible) {
		return (
			<div className="flex flex-wrap gap-2">
				<Button onClick={attackDragon}>Attack</Button>
				<Button onClick={dodge}>Dodge</Button>
				<Button onClick={goTown}>Run to town</Button>
				<Button variant="secondary" onClick={goStore}>
					Run to store
				</Button>
				<Button variant="secondary" onClick={goCave}>
					Run to cave
				</Button>
				<Button variant="secondary" onClick={restart}>
					Restart Game
				</Button>
				<Button variant="secondary" onClick={showLore}>
					Back to Lore
				</Button>
				<Button
					variant="secondary"
					onClick={() => setShowInventory(true)}
				>
					View Inventory
				</Button>
				<Button variant="secondary" onClick={() => setShowStats(true)}>
					View Stats
				</Button>
			</div>
		);
	}
	// After defeating monster
	if (
		!state.fighting &&
		!state.monsterStatsVisible &&
		state.gameText.includes("defeated")
	) {
		return (
			<div className="flex gap-2 flex-wrap">
				<Button onClick={goTown}>Go to town square</Button>
				<Button variant="secondary" onClick={goStore}>
					Go to store
				</Button>
				<Button variant="secondary" onClick={goCave}>
					Go to cave
				</Button>
				<Button variant="secondary" onClick={restart}>
					Restart Game
				</Button>
				<Button variant="secondary" onClick={showLore}>
					Back to Lore
				</Button>
				<Button
					variant="secondary"
					onClick={() => setShowInventory(true)}
				>
					View Inventory
				</Button>
				<Button variant="secondary" onClick={() => setShowStats(true)}>
					View Stats
				</Button>
			</div>
		);
	}
	return null;
}
