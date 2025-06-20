import { AppShell, Burger, Group, Stack, Button, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMediaQuery } from "@mantine/hooks";
import { useState, useEffect } from "react";
import Games from "./components/Games";
import Footer from "./components/Footer";
import { puzzles, leaderboard, home, discord } from "./puzzles";
import NavbarCard from "./components/NavbarCard";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";

export default function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [user_id, setUserId] = useState("");

  // scuffed but fine
  const url = window.location.pathname;
  const isLeaderboard = url === "/leaderboard";

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
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 350,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
            // this causes a console error
            lineSize={3}
            px="lg"
            style={{
              zIndex: 1000,
            }}
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
            // this causes a console error
            lineSize={3}
            px="lg"
            style={{
              zIndex: 1000,
            }}
          />
          <Group
            justify={isSmallScreen ? "center" : "flex-start"}
            style={{
              position: isSmallScreen ? "absolute" : "relative",
              width: isSmallScreen ? "calc(max(100%, 250px))" : "auto",
              paddingLeft: isSmallScreen ? "0" : "10px",
            }}
          >
            <Group>
              <svg
                width="138"
                height="25"
                viewBox="0 0 138 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="138" height="25" fill="white"></rect>
                <path
                  d="M25.9544 1.46704H25.3601V24.0372H25.9544V1.46704Z"
                  fill="black"
                ></path>
                <path
                  d="M19.2574 15.4535C18.8889 16.497 18.3042 17.4509 17.5416 18.2527C16.7789 19.0546 15.8555 19.6863 14.8318 20.1066V15.4535L17.3607 13.1586L14.8318 10.8952V7.69619C15.8763 7.67489 16.8715 7.24792 17.6067 6.50567C18.3419 5.76342 18.7593 4.76418 18.7706 3.71953C18.7706 0.975708 16.1532 0.00209168 14.6675 0.00209168C14.2653 -0.0102783 13.8633 0.0322617 13.4726 0.128535V0.261301C13.6686 0.261301 13.9594 0.22969 14.0542 0.22969C15.0847 0.22969 15.8624 0.716498 15.8624 1.65218C15.8562 1.85411 15.809 2.05266 15.7235 2.23571C15.638 2.41875 15.5161 2.58244 15.3652 2.71677C15.2143 2.85109 15.0376 2.95323 14.8459 3.01695C14.6542 3.08066 14.4515 3.1046 14.2502 3.08732C11.7213 3.08732 8.693 1.01996 5.43075 1.01996C2.52255 1.00732 0.537385 3.17583 0.537385 5.36962C0.537385 7.56342 1.80182 8.24622 3.12316 8.7267L3.15477 8.60026C2.91743 8.45028 2.72511 8.23886 2.59822 7.98842C2.47133 7.73797 2.41459 7.45785 2.43404 7.17777C2.4493 6.92796 2.51386 6.68363 2.62398 6.45888C2.73411 6.23414 2.88763 6.03341 3.07569 5.86826C3.26375 5.70312 3.48264 5.57683 3.71973 5.49668C3.95683 5.41652 4.20745 5.38408 4.45714 5.40124C7.20096 5.40124 11.6265 7.69619 14.3766 7.69619H14.6359V10.9268L12.107 13.1586L14.6359 15.4535V20.1572C13.5788 20.533 12.4638 20.7192 11.342 20.7072C7.07452 20.7072 4.38759 18.1215 4.38759 13.8287C4.37897 12.8127 4.51955 11.8009 4.80486 10.8257L6.93543 9.88999V19.3733L11.2661 17.4766V7.75941L4.88072 10.6044C5.17861 9.73458 5.646 8.93247 6.25588 8.24446C6.86575 7.55645 7.606 6.99621 8.43379 6.59613L8.40218 6.5013C4.13471 7.43698 0 10.6739 0 15.5167C0 21.1055 4.71635 25 10.2103 25C16.0267 25 19.3206 21.1245 19.3522 15.4725L19.2574 15.4535Z"
                  fill="black"
                ></path>
              </svg>
              <div
                style={{
                  marginTop: "3px",
                  marginLeft: "-120px",
                  fontFamily: "NYT-Header",
                  fontSize: "32px",
                }}
              >
                HackTimes
              </div>
            </Group>
          </Group>
          <Group
            justify="flex-end"
            style={{
              position: isSmallScreen ? "absolute" : "absolute",
              width: "100%",
              paddingRight: "10px",
              visibility: isSmallScreen ? "hidden" : "visible",
            }}
          >
            {!loggedIn ? (
              <Button
                variant="outline"
                color="rgba(0, 0, 0, 1)"
                mr="16px"
                px="33px"
                fz={12}
                className="hover:!bg-black hover:!text-white"
                style={{
                  fontFamily: "NYT-700",
                }}
                onClick={handleLogin}
              >
                LOG IN
              </Button>
            ) : (
              <Group>
                <Text>{username}</Text>
                <Button
                  variant="outline"
                  color="rgba(0, 0, 0, 1)"
                  mr="16px"
                  px="33px"
                  fz={12}
                  className="hover:!bg-black hover:!text-white"
                  style={{
                    fontFamily: "NYT-700",
                  }}
                  onClick={handleLogout}
                >
                  LOG OUT
                </Button>
              </Group>
            )}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Stack p="0" gap="0" w="100%">
          <div className="mt-3">
            <NavbarCard
              key={home.name}
              puzzle={home}
              user_id={user_id}
              isLoggedIn={true}
            />
          </div>
          <Text
            pl="16px"
            mt="md"
            mb="sm"
            fz={14}
            style={{
              fontFamily: "NYT-700",
            }}
          >
            HACKTIMES GAMES
          </Text>
          {puzzles.map((puzzle) => (
            <NavbarCard
              key={puzzle.name}
              puzzle={puzzle}
              user_id={user_id}
              isLoggedIn={loggedIn}
            />
          ))}
          <Text
            pl="16px"
            mt="md"
            mb="sm"
            fz={14}
            style={{
              fontFamily: "NYT-700",
            }}
          >
            DISCORD
          </Text>
          <NavbarCard
            key={discord.name}
            puzzle={discord}
            user_id={user_id}
            isLoggedIn={true}
          />
          <Text
            pl="16px"
            mt="md"
            mb="sm"
            fz={14}
            style={{
              fontFamily: "NYT-700",
            }}
          >
            LEADERBOARD
          </Text>
          <NavbarCard
            key={leaderboard.name}
            puzzle={leaderboard}
            user_id={user_id}
            isLoggedIn={true}
          />
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main px="0" pt="60px" pb="0">
        {!isLeaderboard && <Profile />}
        {!isLeaderboard && <Games loggedIn={loggedIn} user_id={user_id} />}
        {isLeaderboard && <Leaderboard username={username} user_id={user_id} />}
        <Footer loggedIn={loggedIn} user_id={user_id} />
      </AppShell.Main>
    </AppShell>
  );
}
