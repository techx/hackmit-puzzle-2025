import {
  AppShell,
  Group,
  Stack,
  Button,
  Text,
  Title,
  Grid,
  Card,
  Divider,
  ScrollArea,
  Box,
  Menu,
  Avatar,
  UnstyledButton,
  Anchor,
} from "@mantine/core";
import { IconUser, IconLogout } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { puzzles, leaderboard, home, discord } from "./puzzles";
import NavbarCard from "./components/NavbarCard";
import Footer from "./components/Footer";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import MiniLeaderboard from "./components/MiniLeaderboard";
import { useNavigate } from "react-router-dom"; 


export default function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [user_id, setUserId] = useState("");

  const url = window.location.pathname;
  const isLeaderboard = url === "/leaderboard";
  const isProfile = url === "/profile";

  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("/api/auth/whoami").then((res) => {
      res.json().then((body) => {
        setLoggedIn(body["loggedIn"]);
        setUsername(body["user"]);
        setUserId(body["user_id"]);
      });
    });
  }, []);

  const isSmallScreen = useMediaQuery("(max-width: 900px)");

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  const handleProfile = () => {
    window.location.href = "api/auth/profile";
  };

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      // navbar={{ width: 0, breakpoint: "sm", collapsed: { mobile: true } }}
      style={{ backgroundColor: "#16202c", color: "white" }}
    >
      <AppShell.Header style={{ backgroundColor: "#16202c", color: "white" }}>
        <Group h="100%" justify="space-between" px="md">
          <Title order={2} style={{ color: "white" }}>
            CoolHackGames
          </Title>
          <Group>
            {!loggedIn ? (
              <Button onClick={handleLogin}>Log in</Button>
            ) : (
              <Menu shadow="md" width={180} position="bottom-end">
                <Menu.Target>
                  <UnstyledButton>
                    <Avatar
                      src={`https://github.com/${username}.png`}
                      alt="User"
                      radius="xl"
                    />
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  {/* <Menu.Item icon={<IconUser size={16} onClick={handleProfile}/>}> */}
                    {/* <Anchor href="/profile">
                      Profile
                    </Anchor> */}
                    {/* <Text>Profile</Text> */}
                  {/* </Menu.Item> */}
                  <Menu.Item
                    icon={<IconUser size={16} />}
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item icon={<IconLogout size={16} />} onClick={handleLogout}>
                    Log Out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {isLeaderboard ? (
          <Leaderboard username={username} user_id={user_id} />
        ) : isProfile ? (
          <Profile />
        ) : (
          <>
            <Grid>
              <Grid.Col span={3}>
                <Stack>
                  <Title order={4} style={{ color: "white" }}>
                    NEW GAMES
                  </Title>
                  {puzzles.slice(0, 5).map((puzzle) => (
                    <NavbarCard
                      key={puzzle.name}
                      puzzle={puzzle}
                      user_id={user_id}
                      isLoggedIn={loggedIn}
                    />
                  ))}
                  <Divider my="sm" />
                  {/* <Title order={4} style={{ color: "white" }}>
                    TRENDING GAMES
                  </Title> */}
                  <Stack>
                    {[home, discord, leaderboard].map((item) => (
                      <NavbarCard
                        key={item.name}
                        puzzle={item}
                        user_id={user_id}
                        isLoggedIn={true}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Grid.Col>

              <Grid.Col span={6}>
                <Title order={4} style={{ color: "orange", marginBottom: "8px" }}>
                  TOP GAMES
                </Title>
                <ScrollArea h={600}>
                  <Stack>
                    {puzzles.map((puzzle, idx) => (
                      <Card
                        shadow="sm"
                        key={puzzle.name}
                        withBorder
                        style={{ backgroundColor: "#1e2a3a", color: "white" }}
                      >
                        <Text style={{ color: "white" }}>
                          {idx + 1}. {puzzle.name}
                        </Text>
                      </Card>
                    ))}
                  </Stack>
                </ScrollArea>
              </Grid.Col>
              <Grid.Col span={3}>

                <MiniLeaderboard username={username} user_id={user_id} />
                {/* <Leaderboard username={username} user_id={user_id} /> */}
              </Grid.Col>
            </Grid>

            {/* <Footer loggedIn={loggedIn} user_id={user_id} /> */}
          </>
        )}
      </AppShell.Main>

    </AppShell>
  );
}
