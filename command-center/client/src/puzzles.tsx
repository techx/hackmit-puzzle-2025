import { IconPuzzle } from "@tabler/icons-react";
import { CiTrophy } from "react-icons/ci";
import { IconHome } from "@tabler/icons-react";
import { FaDiscord } from "react-icons/fa";
import { Image } from "@mantine/core";

export type Puzzle = {
  name: string;
  icon: React.ReactNode;
  largeIcon: React.ReactNode;
  color: string;
  url: string;
  description: string | React.ReactNode;
  vishyURL?: boolean;
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
        <Image src="/twister.svg" alt="Papas Cipheria" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/twister.svg" alt="Papas Cipheria" />
      </div>
    ),
    color: "#F7DA21",
    url: "https://papas.hackmit.org",
    description: "Learn to operate your brand new cipheria!",
  },
  {
    name: "Chess",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/hexhunt.svg" alt="Hexhunt" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/hexhunt.svg" alt="Hexhunt" />
      </div>
    ),
    color: "#B5E352",
    url: "https://chess.hackmit.org",
    description: "Play chess with the best!",
  },
  {
    name: "Lemonade Stand",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/library.svg" alt="Library" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/library.svg" alt="Library" />
      </div>
    ),
    color: "#00A2B3",
    url: "https://lemonadestand.hackmit.org",
    description: "Got any grapes?",
  },
  {
    name: "Triple Tile",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/wodou.svg" alt="Wodou" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/wodou.svg" alt="Wodou" />
      </div>
    ),
    color: "#E3E3E1",
    url: "https://tripletile.hackmit.org",
    description: "Triple the fun!",
    annieURL: true,
  },
  {
    name: "Sly High",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/curseword.svg" alt="Curseword" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/curseword.svg" alt="Curseword" />
      </div>
    ),
    color: "#FB9B00",
    url: "https://slyhigh.hackmit.org",
    description: "Sly high",
  },
  {
    name: "ROM Hack",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/connections.svg" alt="Connections" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/connections.svg" alt="Connections" />
      </div>
    ),
    color: "#B4A8FF",
    url: "https://romhack.hackmit.org",
    description: "Gotta catch them all!",
    vishyURL: true,
  },
];

export const puzzles = unshuffledPuzzles.sort(() => Math.random() - 0.5);

export const getURLFromPuzzle = (puzzle: Puzzle, user_id: string) => {
  if (puzzle.vishyURL) {
    return `${puzzle.url}/?u=${user_id}`;
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
  url: "https://discord.gg/94dGUZPSKF",
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
