import StanLeaderboard from "./components/MiniLeaderboard";
import Conditions from "./components/Conditions";
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
import { useNavigate } from "react-router-dom"; 
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

  const handleHome = () => {
    window.location.href = "/";
  };

  return (
    <>
      <div className="min-h-screen bg-primary text-white flex flex-col px-0 pt-0 pb-8">
        <nav className="flex bg-secondary justify-between items-center w-full mb-4 px-6 py-2">
          <img className="h-10" src="/coolhackgames.svg" alt="CoolHackGames" onClick={handleHome}/>
          {loggedIn ? (
            <Menu shadow="md" width={180} position="bottom-end">
              <Menu.Target>
                <UnstyledButton>
                  <Avatar src={`https://github.com/${username}.png`} alt="User" radius="xl" />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUser size={16} />} onClick={() => navigate("/profile")}>
                  Profile
                </Menu.Item>
                <Menu.Item leftSection={<IconLogout size={16} />} onClick={handleLogout}>
                  Log Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button onClick={handleLogin}>Log in</Button>
          )}
        </nav>

        {isLeaderboard && <Leaderboard username={username} user_id={user_id} />}
        {isProfile && <Profile />}

        {!isLeaderboard && !isProfile && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-7xl mx-auto w-full px-6">
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
                <div className="h-6" /> 
                <h1 className="text-xl px-2 py-1 bg-secondary rounded-lg font-semibold uppercase tracking-wider">
                  Popular Categories
                </h1>
                <div className="mt-3">
                  <NavbarCard key={home.name} puzzle={home} user_id={user_id} isLoggedIn={true} />
                </div>
                <NavbarCard key={discord.name} puzzle={discord} user_id={user_id} isLoggedIn={true} />
                <NavbarCard key={leaderboard.name} puzzle={leaderboard} user_id={user_id} isLoggedIn={true} />
                {/* <NavbarCard key={solved.name} puzzle={solved} user_id={user_id} isLoggedIn={true} /> */}
              </Stack>
            </div>

            <div className="flex flex-col gap-4">
              <Games loggedIn={loggedIn} user_id={user_id} />
            </div>

            <div className="flex flex-col gap-6 max-w-[300px]">
              <Conditions />
              <StanLeaderboard />
            </div>
          </div>
        )}
      </div>
      <Footer loggedIn={loggedIn} user_id={user_id} />
    </>
  );
}
