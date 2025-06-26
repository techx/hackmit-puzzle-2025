import NewGames from "./stanley/NewGames";
import TrendingGames from "./stanley/HotGames";
import StanLeaderboard from "./stanley/Leaderboard";
import Conditions from "./stanley/Conditions";
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
import GameCard from "./components/GameCard";
import Games from "./components/Games";


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

  return (
    <>
    <div className="min-h-screen bg-primary text-white flex flex-col px-6 pt-2 pb-8">
      {/* Top Bar: Logo left + Profile right */}
      <nav className="flex justify-between items-center w-full mb-4">
        <img
          className="h-10"
          src="https://www.coolmathgames.com/themes/custom/coolmath/assets/images/logo-mobile.svg"
          alt="CoolMathGames"
        />
        {loggedIn ? (
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
              <Menu.Item icon={<IconUser size={16} />} onClick={() => navigate("/profile")}>
                Profile
              </Menu.Item>
              <Menu.Item icon={<IconLogout size={16} />} onClick={handleLogout}>
                Log Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button onClick={handleLogin}>Log in</Button>
        )}
      </nav>

      {/* Grid: 3-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
        {/* Column 1: Games + navbar buttons */}
        <div className="flex flex-col">
          <Stack p="0" gap="0" w="100%">
            <h1 className="text-xl px-2 py-1 bg-secondary rounded-lg font-semibold uppercase tracking-wider">
              New Games
            </h1>
            {puzzles.map((puzzle) => (
              <NavbarCard
                key={puzzle.name}
                puzzle={puzzle}
                user_id={user_id}
                isLoggedIn={loggedIn}
              />
            ))}
            <div className="h-6" /> {/* Add space between sections */}
            <h1 className="text-xl px-2 py-1 bg-secondary rounded-lg font-semibold uppercase tracking-wider">
              Popular Categories
            </h1>
            <div className="mt-3">
              <NavbarCard
                key={home.name}
                puzzle={home}
                user_id={user_id}
                isLoggedIn={true}
              />
            </div>
            <NavbarCard
              key={discord.name}
              puzzle={discord}
              user_id={user_id}
              isLoggedIn={true}
            />
            <NavbarCard
              key={leaderboard.name}
              puzzle={leaderboard}
              user_id={user_id}
              isLoggedIn={true}
            />
          </Stack>
        </div>

        {/* Column 2: Top Games */}
        <div className="flex flex-col gap-4">
          {!isLeaderboard && <Games loggedIn={loggedIn} user_id={user_id} />}
        </div>

        {/* Column 3: Conditions + Leaderboard */}
        <div className="flex flex-col gap-6 max-w-[300px]">
          <Conditions />
          <StanLeaderboard />
        </div>
      </div>

      {/* Page routing */}
      {isLeaderboard && <Leaderboard username={username} user_id={user_id} />}
      {isProfile && <Profile />}
    </div>
    {/*
    <AppShell
      padding="md"
      header={{ height: 60 }}
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
              </Grid.Col>
            </Grid>
          </>
        )}
      </AppShell.Main>
    </AppShell>
    */}
  </>
)};