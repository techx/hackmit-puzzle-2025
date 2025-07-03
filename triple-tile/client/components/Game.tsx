"use client";
import React, { useEffect, useState } from "react";
import styles from "./Game.module.css";
import MorseBuilding from "./Building";
import Rules from "./Rules";
import Flag from "./Flag";
import MorseFlasher from "./MorseFlasher";

interface Tile {
  id: string;
  x: number;
  y: number;
  status: number;
  iconName: string;
}

const morseMap: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
};

const PuzzleGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [initialTiles, setInitialTiles] = useState<Tile[]>([]);
  const [queue, setQueue] = useState<Tile[]>([]);
  const [matchCount, setMatchCount] = useState(0);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [flagStatus, setFlagStatus] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [hashedFlag, setHashedFlag] = useState(null);
  const [word, setWord] = useState<string>("");
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    fetch("/scene.json")
      .then((res) => res.json())
      .then((data: Tile[]) => {
        setTiles(data);
        setInitialTiles(data);
      });
  }, []);

  useEffect(() => {
    const userId = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/get_triple_flag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.flag) setWord(data.flag.toUpperCase());
      })
      .catch((err) => console.error("Failed to load flag word:", err));
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

      if (newCount % 5 === 0 && revealedLetters.length < word.length) {
        const currentLetter = word[revealedLetters.length];
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
    // Each unit = 100% of tile width (one cell)
    const cellUnits = 100;
    for (let j = idx + 1; j < tiles.length; j++) {
      const other = tiles[j];
      if (other.status !== 0) continue;
      // bounding‐box overlap in tile‐units
      if (
        !(
          cur.x + cellUnits <= other.x ||
          other.x + cellUnits <= cur.x ||
          cur.y + cellUnits <= other.y ||
          other.y + cellUnits <= cur.y
        )
      ) {
        return true;
      }
    }
    return false;
  };

    // Flag guess submission logic
  const handleFlagSubmit = (guess: string) => {
    const cleaned = guess.trim().toLowerCase();
    const userId = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, flag: cleaned }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.solved) {
          setFlagStatus("correct");
          setHashedFlag(data.message); // dynamic backend message with hashed flag
        } else {
          setFlagStatus("incorrect");
        }
      })
      .catch((err) => {
        console.error("Submission error:", err);
        setFlagStatus("incorrect");
      });

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

  // useEffect(() => {
  //   if (flagStatus === "correct" && !hashedFlag) {
  //     const userId = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);

  //     fetch("/api/getFlag", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ userId }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("Flag response:", data);
  //         setHashedFlag(data.flag);
  //       })
  //       .catch((err) => console.error("Fetch error:", err));
  //   }
  // }, [flagStatus, hashedFlag]);

  return (
    <>
      <div className={styles.starsWrapper}>
        <img src="/buildings/stars.svg" className={styles.starsImg} alt="Stars" />
      </div>
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
        {tiles.length === 0 && (
          <div className={styles.popupOverlay}>
            <div className={styles.popup}>
              {hashedFlag && (
                <div style={{ marginTop: "0.5em" }}>
                  <span dangerouslySetInnerHTML={{ __html: hashedFlag }} />
                </div>
              )}
              <button
                onClick={() => {
                  setTiles(initialTiles);
                  setQueue([]);
                  setGameOver(false);
                  setRevealedLetters([]);
                  setMatchCount(0);
                }}
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        
        <div className={styles.cityBackground}>
          <div className={styles.flickerWrapper}>
            {/* Base layer: always visible unlit buildings */}
            <img
              src="/buildings/final_buildings_unlit.svg"
              className={styles.staticImg}
              alt="Unlit city backdrop"
            />

            {/* Animated layer: lit windows flicker in and out */}
            <img
              src="/buildings/final_buildings_lit.svg"
              className={styles.flickerImg}
              alt="Lit city flicker"
            />
          </div>
          {revealedLetters.map((letter, idx) => {
            const morse = morseMap[letter];
            const positions = [
              { top: "20.87%", left: "25.7%" },   // 1st building (F)
              { top: "14.73%", left: "92.45%" },  // 2nd building (O)
              { top: "28.6%", left: "44.1%" },  // 3rd building (R)
              { top: "15.8%", left: "52.05%" },  // 4th building (E)
              { top: "24.05%", left: "69.4%" },  // 5th building (S)
              { top: "20.69%", left: "7.0%" },  // 6th building (T)
              { top: "16.9%", left: "63.2%" },  // 7th building (T)
              { top: "25.9%", left: "13.72%" },  // 8th building (M)
              { top: "16.64%", left: "37.31%" },  // 9th building (P)
              { top: "13.675%", left: "81.1%" },  // 10th building (L)
            ];
            const pos = positions[idx] || { top: "42%", left: "0%" };

            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  top: pos.top,
                  left: pos.left,
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              >
                <MorseFlasher morse={morse} />
              </div>
            );
          })}
        </div>

        {/* Tile board */}
        <div className={styles.tileBoard}>
          {tiles.map((tile, idx) => {
            const inactive = tile.status !== 0 || isCovered(idx);
            return (
              <div
                key={tile.id}
                className={`${styles.tile} ${inactive ? styles.inactive : ""}`}
                style={{
                  transform: `translateX(${tile.x}%) translateY(${tile.y}%)`,
                  zIndex: idx,
                }}
                onClick={() => {
                  if (!inactive && queue.length < 7) {
                    handleClick(tile);
                  }
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

       
      </div>

      {/* Rules overlay */}
      {showRules && <Rules onClose={() => setShowRules(false)} />}

      {/* Export and Flag buttons (bottom-right corner) */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        gap: "10px"
      }}>
        <button
          onClick={() => {
            fetch("/scene.json")
              .then(res => res.json())
              .then(data => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "scene.json";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              });
          }}
          style={{
            fontSize: "17px",
            background: "#7A9CFF",
            border: "none",
            color: "white",
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: "bold",
          }}
          title="Export Scene"
        >
          <span style={{ fontSize: "20px" }}>💾</span>
          Export Puzzle
        </button>
        {/* {matchCount >= 0 && ( */}
          <button
            onClick={() => setShowFlagInput(true)}
            style={{
              fontSize: "24px",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            title="Submit Flag"
          >
            🚩
          </button>
        {/* )} */}
      </div>

      {showFlagInput && (
        <Flag
          onClose={() => setShowFlagInput(false)}
          onSubmit={handleFlagSubmit}
        />
      )}

      {/* Optional: Result message */}
      {flagStatus === "correct" && (
      <div style={{ marginTop: "0.5em", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.7em", flexWrap: "wrap" }}>
        <code
          style={{
            background: "#222",
            color: "#b5fcb5",
            padding: "0.35em 0.6em",
            borderRadius: "6px",
            fontSize: "1.1em",
            wordBreak: "break-all"
          }}
        >
          {hashedFlag}
        </code>
        <button
          className={styles.copybtn}
          onClick={() => {
            if (hashedFlag) {
              navigator.clipboard.writeText(hashedFlag);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000); // hide after 2s
            }
          }}
        >
          Copy Text
        </button>
        {copied && (
          <div style={{ color: "lightgreen", fontWeight: "bold", marginTop: "0.3em" }}>
            Copied!
          </div>
        )}
      </div>

      )}
      {flagStatus === "incorrect" && (
        <div
          style={{ color: "salmon", textAlign: "center", marginTop: "10px" }}
        >
          ❌ Incorrect. Try again.
        </div>
      )}
    </>
  );
};

export default PuzzleGame;
