import { useEffect, useState } from "react";
import { Stack, Title, Group, Text, Card, Anchor } from "@mantine/core";

type LeaderboardEntry = {
  username: string;
  total_score: number | null;
};

const MiniLeaderboard = () => {
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/puzzle/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.leaderboard)) {
          let topUsers: LeaderboardEntry[] = data.leaderboard
            .filter((entry: any) => entry.username && entry.total_score !== null)
            .slice(0, 5)
            .map((entry: any) => ({
              username: entry.username ?? "(unknown)",
              total_score: entry.total_score ?? 0,
            }));

          // Insert personal user score if available
          if (data.personal_user_score?.username) {
            topUsers.unshift({
              username: data.personal_user_score.username,
              total_score: data.personal_user_score.total_score ?? 0,
            });
          }

          setUsers(topUsers);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch leaderboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Text>Loading leaderboard...</Text>;

  return (
    <Stack spacing="xs">
      <Group w="100%" justify="center">
        <Title order={1} pb="xs">
          Conditions
        </Title>
      </Group>
      <Title order={3} fz="18px">
        The top ~50 eligible puzzle solvers are automatically admitted to
        HackMIT. To be eligible for this, we ask that you still submit an
        application, and that you also enter the email that you used to
        apply for HackMIT in your profile card on the{" "}
        <Anchor href="/" fz="18px">
          front page
        </Anchor>
        .
      </Title>
      <Title order={4} c="white">
        LEADERBOARDS
      </Title>
      {users.map((user, idx) => (
        <Card
          key={idx}
          shadow="sm"
          padding="sm"
          withBorder
          style={{ backgroundColor: "#1e2a3a", color: "white" }}
        >
          <Group justify="space-between">
            <Text>
              {idx + 1}. {user.username}
            </Text>
            <Text>{user.total_score}</Text>
          </Group>
        </Card>
      ))}
    </Stack>
  );
};

export default MiniLeaderboard;
