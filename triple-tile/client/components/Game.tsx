"use client";
import React, { useEffect, useState } from "react";
import styles from "./Game.module.css";
import MorseBuilding from "./Building";
import Rules from "./Rules";
import Flag from "./Flag";

interface Tile {
  id: string;
  x: number;
  y: number;
  status: number; // 0 = unpicked, 1 = in queue
  iconName: string;
}

const CELL_SIZE = 100;
const ICONS = ["🍀", "🌈", "⚙️", "🐏", "🐯", "🐤", "📚", "🧠", "💻", "🐼"];

const morseMap: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
  O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
  V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--.."
};

const FLAG = "FORESTTMPL";

const PuzzleGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [initialTiles, setInitialTiles] = useState<Tile[]>([]);
  const [queue, setQueue] = useState<Tile[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [flagStatus, setFlagStatus] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    fetch("/scene.json")
      .then((res) => res.json())
      .then((data: Tile[]) => {
        setTiles(data);
        setInitialTiles(data);
      });
  }, []);

  // Tile click handler
  const handleClick = (tile: Tile) => {
    if (queue.length >= 7) return;

    const newQueue = [...queue, tile];
    const sameTiles = newQueue.filter((t) => t.iconName === tile.iconName);

    // If 3 same tiles exist, remove them
    if (sameTiles.length === 3) {
      const filteredQueue = newQueue.filter(
        (t) => t.iconName !== tile.iconName
      );
      setQueue(filteredQueue);
      // Morse logic
      const newCount = matchCount + 1;
      setMatchCount(newCount);

      if (newCount % 5 === 0 && revealedLetters.length < FLAG.length) {
        const currentLetter = FLAG[revealedLetters.length];
        setRevealedLetters((prev) => [...prev, currentLetter]);
      }
    } else {
      setQueue(newQueue);

      // Check for loss: 7 full, and no 3 of a kind
      if (newQueue.length === 7) {
        const counts: Record<string, number> = {};
        newQueue.forEach((t) => {
          counts[t.iconName] = (counts[t.iconName] || 0) + 1;
        });
        const hasTriple = Object.values(counts).some((count) => count >= 3);
        if (!hasTriple) {
          setGameOver(true);
        }
      }
    }

    // Remove the tile from the board
    setTiles((t) => t.filter((x) => x.id !== tile.id));
  };

  // returns true if tile at `idx` is overlapped by any later (higher) tile still in play
  const isCovered = (idx: number) => {
    const cur = tiles[idx];
    if (cur.status !== 0) return false;
    for (let j = idx + 1; j < tiles.length; j++) {
      const other = tiles[j];
      if (other.status !== 0) continue;
      // bounding‐box overlap?
      if (
        !(
          cur.x + CELL_SIZE <= other.x ||
          other.x + CELL_SIZE <= cur.x ||
          cur.y + CELL_SIZE <= other.y ||
          other.y + CELL_SIZE <= cur.y
        )
      ) {
        return true;
      }
    }
    return false;
  };

  // Flag guess submission logic
  const handleFlagSubmit = (guess: string) => {
    const cleaned = guess.trim().toUpperCase();
    if (cleaned === FLAG) {
      setFlagStatus("correct");
    } else {
      setFlagStatus("incorrect");
    }
    setShowFlagInput(false);
  };

  // Get icon path
  const getIconPath = (iconName: string) => {
    const extMap: Record<string, string> = {
      icons0: "svg",
      icons1: "png",
      icons2: "png",
      icons3: "png",
      icons4: "svg",
      icons5: "jpg",
      icons6: "jpg",
      icons7: "jpg",
      icons8: "svg",
      icons9: "svg",
    };
    return `/icons/${iconName}.${extMap[iconName] || "png"}`;
  };


  return (
    <>
      <div className={styles.gameContainer}>
        {gameOver && (
          <div className={styles.popupOverlay}>
            <div className={styles.popup}>
              <h1>You Lose</h1>
              <button
                onClick={() => {
                  setTiles(initialTiles);
                  setQueue([]);
                  setGameOver(false);
                  setRevealedLetters([]);
                  setMatchCount(0);
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        {/* Tile board */}
        <div className={styles.tileBoard}>
          {tiles.map((tile, idx) => {
            // inactive if picked OR if covered by any tile with a higher array-index
            const inactive = tile.status !== 0 || isCovered(idx);

            return (
              <div
                key={tile.id}
                className={`${styles.tile} ${inactive ? styles.inactive : ""}`}
                style={{
                  left: tile.x,
                  top: tile.y,
                  zIndex: idx, // ensures later array items actually draw on top
                }}
                onClick={() => {
                  if (!inactive && queue.length < 7) handleClick(tile);
                }}
              >
                <img
                  src={getIconPath(tile.iconName)}
                  alt={tile.iconName}
                  className={styles.tileInner}
                />
              </div>
            );
          })}
        </div>

        {/* Queue bar */}
        <div className={styles.queueBar}>
          {queue.map((t) => (
            <div key={t.id} className={styles.queueTile}>
              <img
                src={getIconPath(t.iconName)}
                alt={t.iconName}
                className={styles.tileInner}
                style={{ filter: "none", opacity: 1 }}
              />
            </div>
          ))}
          {Array.from({ length: 7 - queue.length }).map((_, i) => (
            <div key={i} className={styles.queueTile} />
          ))}
        </div>

        {/* Morse buildings */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "20px 0" }}>
          {Array.from({ length: FLAG.length }).map((_, idx) => {
            const letter = revealedLetters[idx];
            const morse = letter ? morseMap[letter] : null;

            return (
              <MorseBuilding
                key={idx}
                morseCode={morse}
                triggerKey={idx} // this ensures each building re-renders only when unlocked
              />
            );
          })}
        </div>
      </div>

      {/* Rules overlay */}
      {showRules && <Rules onClose={() => setShowRules(false)} />}

      {/* Flag button (bottom-right corner) */}
      <button
        onClick={() => setShowFlagInput(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          fontSize: "24px",
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer"
        }}
        title="Submit Flag"
      >
        🚩
      </button>

      {showFlagInput && (
        <Flag
          onClose={() => setShowFlagInput(false)}
          onSubmit={handleFlagSubmit}
        />
      )}

      {/* Optional: Result message */}
      {flagStatus === "correct" && (
        <div style={{ color: "lightgreen", textAlign: "center", marginTop: "10px" }}>
          ✅ Correct flag!
        </div>
      )}
      {flagStatus === "incorrect" && (
        <div style={{ color: "salmon", textAlign: "center", marginTop: "10px" }}>
          ❌ Incorrect. Try again.
        </div>
      )}
    </>
  );
};

export default PuzzleGame;
