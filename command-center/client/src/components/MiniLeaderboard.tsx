import { useEffect, useState } from "react";
import { Group, Stack, Text } from "@mantine/core";

const LeaderboardItem = ({
  rank,
  username,
  score,
  index,
}: {
  rank: number;
  username: string;
  score: number;
  index: number;
}) => {
  return (
    <li
      className={`w-full px-3 py-4 flex items-center justify-between rounded-xl ${
        index % 2 === 0 ? "bg-[#1e2a3a]" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">{rank}.</span>
        <span>{username}</span>
      </div>
      <span className="text-[#fee506] text-xl font-bold">{score}</span>
    </li>
  );
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/puzzle/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.leaderboard)) {
          let topUsers = data.leaderboard
            .filter((entry: any) => entry.username && entry.total_score !== null)
            .map((entry: any, idx: number) => ({
              rank: idx + 1,
              username: entry.username ?? "(unknown)",
              score: entry.total_score ?? 0,
              isPersonal: false,
            }));

          const personal = data.personal_user_score;
          if (personal?.username) {
            const personalEntry = {
              rank: personal.rank ?? topUsers.length + 1,
              username: personal.username,
              score: personal.total_score ?? 0,
              isPersonal: true,
            };
            const exists = topUsers.find(
              (u: any) => u.username === personalEntry.username
            );
            if (!exists) {
              topUsers.push(personalEntry);
              topUsers.sort((a, b) => a.rank - b.rank);
            }
          }

          const finalEntries = topUsers.slice(0, 3);
          setEntries(finalEntries);
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
    <section className="flex flex-col w-full gap-4 h-auto">
      <h1 className="text-xl font-semibold uppercase tracking-wider text-white">
        Leaderboards
      </h1>
      {entries.length === 0 ? (
        <Text className="text-white">No leaderboard data available.</Text>
      ) : (
        <ul>
          {entries.map((user, index) => (
            <LeaderboardItem
              key={user.username + index}
              rank={user.rank}
              username={user.username}
              score={user.score}
              index={index}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
