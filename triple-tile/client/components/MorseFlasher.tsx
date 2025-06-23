"use client";
import React, { useEffect, useState } from "react";
import styles from "./MorseFlasher.module.css";

interface MorseFlasherProps {
  morse: string | null;
}

const UNIT = 300; // base duration for a dot

const MorseFlasher: React.FC<MorseFlasherProps> = ({ morse }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [flashStyle, setFlashStyle] = useState({});

  useEffect(() => {
    if (!morse) return;

    const sequence: number[] = [];

    for (let i = 0; i < morse.length; i++) {
      if (morse[i] === ".") {
        sequence.push(UNIT); // dot
      } else if (morse[i] === "-") {
        sequence.push(UNIT * 3); // dash
      }

      if (i < morse.length - 1) {
        sequence.push(UNIT); // gap between symbols
      }
    }

    let index = 0;
    const flash = () => {
      setIsVisible(true);
      setFlashStyle({ opacity: 1 });

      setTimeout(() => {
        setIsVisible(false);
        setFlashStyle({ opacity: 0 });

        index += 1;
        if (index < sequence.length) {
          setTimeout(flash, sequence[index]);
          index += 1;
        } else {
          // Loop after pause
          setTimeout(() => {
            index = 0;
            flash();
          }, UNIT * 7);
        }
      }, sequence[index]);
    };

    flash();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morse]);

  return <div className={styles.flasher} style={flashStyle} />;
};

export default MorseFlasher;