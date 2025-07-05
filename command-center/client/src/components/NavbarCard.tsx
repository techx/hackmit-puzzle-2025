import { Puzzle } from "../puzzles";
import { useState } from "react";
import { Group, Text } from "@mantine/core";
import { getURLFromPuzzle } from "../puzzles";

const NavbarCard = ({
  puzzle,
  isLoggedIn,
  user_id,
}: {
  puzzle: Puzzle;
  isLoggedIn: boolean;
  user_id: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Group
      p="0"
      h="42px"
      pl="16px"
      w="100%"
      className={`hover:bg-gray-100 hover:border-l-2 ${
        isLoggedIn ? "hover:cursor-pointer" : ""
      }`}
      style={{
        borderLeft: isHovered
          ? `4px solid ${puzzle.color}`
          : "4px solid transparent",
      }}
      
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (!isLoggedIn) return;
        setIsHovered(false);
        if (puzzle.name === "Leaderboard") {
          window.location.href = `/leaderboard`;
        } else if (puzzle.name === "Home") {
          window.location.href = `/`;
        } else if (puzzle.name === "Discord") {
          window.location.href = `${puzzle.url}`;
        } else if (puzzle.name === "Solved Puzzles") {
          window.location.href = `/profile`;
        } else {
          window.location.href = getURLFromPuzzle(puzzle, user_id);
        }
      }}
    >
      {puzzle.icon}
      <Text
        ml={-4}
        fz={16}
        style={{
          fontFamily: "NYT-500",
        }}
      >
        {puzzle.name}
      </Text>
    </Group>
  );
};

export default NavbarCard;