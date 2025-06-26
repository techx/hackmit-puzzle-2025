import NewGames from "./stanley/NewGames";
import TrendingGames from "./stanley/HotGames";
import Leaderboard from "./stanley/Leaderboard";
import Conditions from "./stanley/Conditions";

export default function App() {
  return (
    <>
      <nav className="flex bg-secondary justify-center items-center w-full p-1.5">
        <img
          className="w-auto h-10"
          src="https://www.coolmathgames.com/themes/custom/coolmath/assets/images/logo-mobile.svg"
        />
      </nav>
      <body className="flex flex-col items-center w-full min-h-screen bg-primary text-white px-6 py-4 gap-6">
        <div className="max-w-5xl flex flex-col gap-6 sm:grid grid-cols-3">
          <NewGames />
          <TrendingGames />
          <div className="w-full flex flex-col gap-4 max-w-[300px]">
            <Conditions />
            <Leaderboard />
          </div>
        </div>
      </body>
    </>
  );
}
