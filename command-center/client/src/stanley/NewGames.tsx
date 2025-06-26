import { Puzzle } from "../puzzles";

export default function NewGames() {
  return (
    <section className="flex flex-col w-full gap-2 h-auto">
      <h1 className="text-xl px-2 py-1 bg-secondary rounded-lg font-semibold uppercase tracking-wider">
        new games
      </h1>
      <ul className="flex flex-col gap-1">
        {puzzles.map((puzzle) => (
          <li key={puzzle.name} className="flex gap-2 items-center h-fit">
            <div className="w-20 h-12 border border-accent rounded-lg overflow-hidden">
              {/* <img
                className="w-full h-full object-cover object-center"
                src={puzzle.largeIcon}
                alt={puzzle.name}
              /> */}
              <div className="w-full h-full object-cover object-center">
                {puzzle.largeIcon}
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="font-semibold text-accent">{puzzle.name}</h2>
              <p className="text-base leading-tight text-white">
                {puzzle.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <button className="uppercase w-fit text-accent underline font-semibold">
        more new games &gt;
      </button>
    </section>
  );
}
