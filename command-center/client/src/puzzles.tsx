// import { IconPuzzle } from "@tabler/icons-react";
import { CiTrophy } from "react-icons/ci";
import { IconHome } from "@tabler/icons-react";
import { FaDiscord } from "react-icons/fa";
// import { IconCheck } from "@tabler/icons-react";
import { Image } from "@mantine/core";

export type Puzzle = {
  name: string;
  icon: React.ReactNode;
  largeIcon: React.ReactNode;
  color: string;
  url: string;
  description: string | React.ReactNode;
  kosiURL?: boolean;
  annieURL?: boolean;
};

const largeIconStyle = {
  width: "64px",
  height: "64px",
};

// check that the icons look good in three places:
// cards, navbar, footer
const unshuffledPuzzles: Puzzle[] = [
  {
    name: "Papas Cipheria",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/papascipheria.svg" alt="Papas Cipheria" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/papascipheria.svg" alt="Papas Cipheria" />
      </div>
    ),
    color: "#F7DA21",
    url: "https://papas.hackmit.org",
    description: "Learn to operate your brand new cipheria!",
    annieURL: false,
  },
  {
    name: "Chess",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/chess.svg" alt="Chess" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/chess.svg" alt="Chess" />
      </div>
    ),
    color: "#B5E352",
    url: "https://chess.hackmit.org",
    description: "Play chess with the best!",
    annieURL: false,
  },
  {
    name: "Lemonade Stand",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/lemonade.svg" alt="Lemonade Stand" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/lemonade.svg" alt="Lemonade Stand" />
      </div>
    ),
    color: "#00A2B3",
    url: "https://lemonade.hackmit.org",
    description: "Got any grapes?",
    annieURL: false,
  },
  {
    name: "Triple Tile",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/tripletile.ico" alt="Triple Tile" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/tripletile.ico" alt="Triple Tile" />
      </div>
    ),
    color: "#E3E3E1",
    url: "https://tripletile.hackmit.org",
    description: "Triple the fun!",
    annieURL: true,
  },
  {
    name: "Jailbreak",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/jailbreak.svg" alt="Jailbreak" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/jailbreak.svg" alt="Jailbreak" />
      </div>
    ),
    color: "#FB9B00",
    url: "https://jailbreak.hackmit.org",
    description: "Can you escape??",
    annieURL: false,
  },
  {
    name: "ROM Hack",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/romhackbg.svg" alt="ROMHack" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/romhackbg.svg" alt="ROMHack" />
      </div>
    ),
    color: "#B4A8FF",
    url: "https://romhack.hackmit.org",
    description: "Gotta catch them all!",
    annieURL: false,
    kosiURL: true
  },
];

export const puzzles = unshuffledPuzzles.sort(() => Math.random() - 0.5);

export const getURLFromPuzzle = (puzzle: Puzzle, user_id: string) => {
  if (puzzle.kosiURL) {
    return `${puzzle.url}`;
  }
  if (puzzle.annieURL) {
    return `${puzzle.url}/${user_id}`;
  }
  return `${puzzle.url}/u/${user_id}`;
};

export const getURLFromPuzzleLeaderboard = (url: string, user_id: string) => {
  if (user_id === "") {
    return url;
  }
  const puzzleobj = puzzles.find((puzzle) => puzzle.url === url);
  return getURLFromPuzzle(puzzleobj, user_id);
};

export const leaderboard: Puzzle = {
  name: "Leaderboard",
  icon: <CiTrophy />,
  largeIcon: <CiTrophy style={largeIconStyle} />,
  color: "#F7DA21",
  url: "/leaderboard",
  description: "",
};

export const discord: Puzzle = {
  name: "Discord",
  icon: <FaDiscord />,
  largeIcon: <FaDiscord style={largeIconStyle} />,
  color: "#5865F2",
  url: "https://discord.gg/9UCMPrSV",
  description: "",
};

export const home: Puzzle = {
  name: "Home",
  icon: <IconHome />,
  largeIcon: <IconHome style={largeIconStyle} />,
  color: "#000000",
  url: "/",
  description: "",
};

// export const solved: Puzzle = {
//   name: "Solved Puzzles",
//   icon: <IconCheck />,
//   largeIcon: <IconCheck style={largeIconStyle} />,
//   color: "#00C851",
//   url: "/profile",
//   description: "",
// };
