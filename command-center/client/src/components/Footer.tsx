import { Container, Grid, Text, Group, Stack } from "@mantine/core";
import { puzzles } from "../puzzles";
import { useMediaQuery } from "@mantine/hooks";
import { getURLFromPuzzle } from "../puzzles";

const Footer = ({
  loggedIn,
  user_id,
}: {
  loggedIn: boolean;
  user_id: string;
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 900px)");

  return (
    <Container
      w="100%"
      maw="100vw"
      p="0"
      pb="xl"
      style={{ backgroundColor: "#f8f8f8" }}
    >
      <Group w="100%" justify="center">
        <Grid w="80vw" mt="24px">
          {!isSmallScreen && (
            <Grid.Col span={8} p="md">
              <Text
                mb="md"
                style={{
                  fontSize: "14px",
                  fontFamily: "NYT-700",
                }}
              >
                ABOUT COOLHACKGAMES GAMES
              </Text>
              <Text
                style={{
                  fontFamily: "NYT-cheltenham",
                  fontSize: "20px",
                }}
              >
                Since the launch of HackMIT in 2013, COOLHACKGAMES has captivated
                solvers by providing engaging word and logic puzzles. In 2022,
                we introduced HackScope — followed by bakery, VMHack, and
                HackxGPT. In early 2023, we proudly added Xd to our collection.
                We strive to offer puzzles for all skill levels that everyone
                can enjoy playing every day.
              </Text>
            </Grid.Col>
          )}
          {!isSmallScreen && (
            <Grid.Col span={4} p="md">
              <Text
                mb="md"
                style={{
                  fontSize: "14px",
                  fontFamily: "NYT-700",
                }}
              >
                COOLHACKGAMES
              </Text>
              <Stack>
                {puzzles.map((puzzle) => (
                  <Group key={puzzle.name}>
                    {puzzle.icon}
                    <Text
                      component="div"
                      ml={-4}
                      style={{
                        fontFamily: "NYT-500",
                      }}
                    >
                      {loggedIn ? (
                        <a
                          href={getURLFromPuzzle(puzzle, user_id)}
                          className="hover:underline"
                        >
                          {puzzle.name}
                        </a>
                      ) : (
                        <div>{puzzle.name}</div>
                      )}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Grid.Col>
          )}
          {isSmallScreen && (
            <Grid.Col span={12} p="md">
              <Text
                mb="md"
                style={{
                  fontSize: "14px",
                  fontFamily: "NYT-700",
                }}
              >
                ABOUT COOLHACKGAMES
              </Text>
              <Text
                style={{
                  fontFamily: "NYT-cheltenham",
                  fontSize: "20px",
                }}
              >
                Since the launch of HackMIT in 2013, HackTimes has captivated
                solvers by providing engaging word and logic puzzles. In 2022,
                we introduced HackScope — followed by bakery, VMHack, and
                HackxGPT. In early 2023, we proudly added Xd to our collection.
                We strive to offer puzzles for all skill levels that everyone
                can enjoy playing every day.
              </Text>
              <Text
                mt="50px"
                mb="md"
                style={{
                  fontSize: "14px",
                  fontFamily: "NYT-700",
                }}
              >
                COOLHACKGAMES
              </Text>
              <Stack>
                {puzzles.map((puzzle) => (
                  <Group key={puzzle.name}>
                    {puzzle.icon}
                    <Text
                      component="div"
                      ml={-4}
                      style={{
                        fontFamily: "NYT-500",
                      }}
                    >
                      {loggedIn ? (
                        <a
                          href={getURLFromPuzzle(puzzle, user_id)}
                          className="hover:underline"
                        >
                          {puzzle.name}
                        </a>
                      ) : (
                        <div>{puzzle.name}</div>
                      )}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Grid.Col>
          )}
        </Grid>
      </Group>
    </Container>
  );
};

export default Footer;
