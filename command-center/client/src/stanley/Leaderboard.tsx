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
        index % 2 === 0 && "bg-secondary"
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
  // can replace with real data
  const leaderboard = [
    { rank: 1, username: "John Doe", score: 100 },
    { rank: 2, username: "Jane Doe", score: 90 },
    { rank: 3, username: "Jim Doe", score: 80 },
  ];
  return (
    <section className="flex flex-col w-full gap-4 h-auto">
      <h1 className="text-xl font-semibold uppercase tracking-wider">
        leaderboards
      </h1>
      <ul>
        {leaderboard.map((user, index) => (
          <LeaderboardItem
            key={user.username + index}
            rank={user.rank}
            username={user.username}
            score={user.score}
            index={index}
          />
        ))}
      </ul>
    </section>
  );
}
