import { useEffect, useState } from "react";

interface MorseBuildingProps {
  morseCode: string | null;
  triggerKey: number;
}

export default function MorseBuilding({ morseCode, triggerKey }: MorseBuildingProps) {
  const [isLit, setIsLit] = useState(false);

  useEffect(() => {
    if (!morseCode) return;

    const UNIT = 300;
    const sequence = morseCode.split("");
    let index = 0;
    let timeouts: NodeJS.Timeout[] = [];

    function flashNext() {
        if (index >= sequence.length) {
        index = 0;
        timeouts.push(setTimeout(flashNext, UNIT * 3)); // wait before looping again
        return;
        }

        setIsLit(true);
        const duration = sequence[index] === "." ? UNIT : UNIT * 3;

        timeouts.push(setTimeout(() => {
        setIsLit(false);
        timeouts.push(setTimeout(() => {
            index++;
            flashNext();
        }, UNIT));
        }, duration));
    }

    flashNext();

    return () => timeouts.forEach(clearTimeout);
    }, [morseCode]);

  return (
    <div style={{
      width: "60px",
      height: "150px",
      backgroundColor: "#555", // medium gray building
      borderRadius: "6px",
      margin: "10px",
      opacity: 0.9,
      position: "relative",
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.3)",
    }}>
      <div style={{
        width: "20px",
        height: "20px",
        backgroundColor: "#fff", // white window for flashing
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "4px",
        opacity: isLit ? 1 : 0.15,
        transition: "opacity 0.2s ease-in-out",
        boxShadow: isLit ? "0 0 8px 2px white" : "none",
      }} />
    </div>
  );
}