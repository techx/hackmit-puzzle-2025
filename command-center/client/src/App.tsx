import NewGames from "./stanley/NewGames";
import TrendingGames from "./stanley/TrendingGames";

export default function App() {
  return (
    <>
      <nav className="flex bg-secondary justify-center items-center w-full p-1.5">
        <img
          className="w-auto h-10"
          src="https://www.coolmathgames.com/themes/custom/coolmath/assets/images/logo-mobile.svg"
        />
      </nav>
      <body className="flex flex-col w-full min-h-screen bg-primary text-white px-6 py-4 gap-6">
        <NewGames />
        <TrendingGames />
      </body>
    </>
  );
}
