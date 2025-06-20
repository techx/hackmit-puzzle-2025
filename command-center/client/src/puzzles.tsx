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
    name: "Twister",
    icon: (
      <div style={{ width: "28px", height: "28px" }}>
        <Image src="/twister.svg" alt="Twister" />
      </div>
    ),
    largeIcon: (
      <div style={{ width: "64px", height: "64px" }}>
        <Image src="/twister.svg" alt="Twister" />
      </div>
    ),
    color: "#F7DA21",
    url: "https://twister.hackmit.org",
    description: "Use mental math skills to get to the end.",
  },
  {
    name: "Hexhunt",
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
    url: "https://hexhunt.hackmit.org",
    description: "Explore Novel Arrangements By Linking Elements 1-by-1.",
  },
  {
    name: "Library",
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
    url: "https://library.hackmit.org",
    description: "Rank your favorite and least favorite books.",
  },
  {
    name: "Wodou",
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
    url: "https://wodou.hackmit.org",
    description: "Wodou.",
    annieURL: true,
  },
  {
    name: "Curseword",
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
    url: "https://curseword.hackmit.org",
    description: "Find hidden words and uncover the day's theme.",
  },
  {
    name: "😈 Connections 😈",
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
    url: "https://connections.hackmit.org",
    description: "Evil Connections.",
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
