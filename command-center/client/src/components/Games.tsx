import { Container, Grid, Group, Text, Stack, Anchor } from "@mantine/core";
import { puzzles } from "../puzzles";
import CoolGameCard from "./CoolGameCard";
import { useMediaQuery } from "@mantine/hooks";

export default function Games({
  loggedIn,
  user_id,
}: {
  loggedIn: boolean;
  user_id: string;
}) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <Container
      w="100%"
      maw="100vw"
      p="0"
      pb="xl"
      mt={isSmallScreen ? "0" : "xl"}
    >
      <Stack justify="center" align="center">
        <Group
          justify="center"
          mt="24px"
          style={{
            fontFamily: "NYT-700",
          }}
        >
          <Text
            fz={20}
            style={{
              fontFamily: "NYT-stymie",
            }}
          >
            {/* {loggedIn ? (
        <div className="flex flex-col gap-4">
          <h2 className="bg-[#e14603] px-3 py-2 rounded text-white font-bold text-sm uppercase">
            Top 10 Games
          </h2>
          </div>
            ) : isSmallScreen ? (
              <Anchor fz={20} c="black" href="/api/auth/login">
                Log in to play
              </Anchor>
            ) : (
              "Log in to play"
            )} */}
          </Text>
        </Group>
        <Stack spacing="md" px="lg" w="100%" maw={1000} mx="auto">
          <h2 className="bg-[#e14603] px-3 py-2 rounded text-white font-bold text-sm uppercase">
            Top Games
          </h2>
          {puzzles.map((puzzle) => (
            <CoolGameCard
              key={puzzle.name}
              puzzle={puzzle}
              loggedIn={loggedIn}
              user_id={user_id}
            />
          ))}
          <button className="uppercase w-fit text-accent underline font-semibold">
            more new games &gt;
          </button>
        </Stack>
      </Stack>
    </Container>
  );
}
