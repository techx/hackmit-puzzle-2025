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
      className="bg-secondary"
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
                  color: "white"
                }}
              >
                ABOUT COOLHACKGAMES
              </Text>
              <Text
                style={{
                  fontFamily: "NYT-cheltenham",
                  fontSize: "20px",
                  color: "white"
                }}
              >
                Since the launch of HackMIT in 2013, CoolHackGames has been the most
                popular gaming site for hackers both young and old. 
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
                  color: "white"
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
                        color: "white"
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
                  color: "white"
                }}
              >
                ABOUT COOLHACKGAMES
              </Text>
              <Text
                style={{
                  fontFamily: "NYT-cheltenham",
                  fontSize: "20px",
                  color: "white"
                }}
              >
                Since the launch of HackMIT in 2013, CoolHackGames has been the most
                popular gaming site for hackers both young and old. 
              </Text>
              <Text
                mt="50px"
                mb="md"
                style={{
                  fontSize: "14px",
                  fontFamily: "NYT-700",
                  color: "white"
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
