import { Container, Grid, Group, Text, Stack, Anchor } from "@mantine/core";
import { puzzles } from "../puzzles";
import GameCard from "./GameCard";
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
            {loggedIn ? (
              "Games"
            ) : isSmallScreen ? (
              <Anchor fz={20} c="black" href="/api/auth/login">
                Log in to play
              </Anchor>
            ) : (
              "Log in to play"
            )}
          </Text>
        </Group>
        <Grid w="calc(min(1000px, 100%))" mt="0px" mb="lg" px="lg">
          {puzzles.map((puzzle) => (
            <Grid.Col key={puzzle.name} span={isSmallScreen ? 6 : 4}>
              <GameCard puzzle={puzzle} loggedIn={loggedIn} user_id={user_id} />
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
