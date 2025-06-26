import { puzzles } from "../puzzles";

export default function HotGames() {
  return (
    <section className="flex flex-col w-full gap-2 h-auto">
      <h1 className="text-xl px-4 py-1 bg-[#e14603] rounded-lg font-semibold uppercase tracking-wider">
        top 10 games
      </h1>
      <ul className="flex flex-col">
        {puzzles.map((puzzle) => (
          <li key={puzzle.title} className="flex gap-2 items-center h-fit">
            <div className="w-20 h-12 border border-[#e14603] rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover object-center"
                src={puzzle.image}
                alt={puzzle.title}
              />
            </div>

            <div className="flex flex-col">
              <h2 className="font-semibold text-[#ffaa23]">{puzzle.title}</h2>
              <p className="text-base leading-tight text-white">
                {puzzle.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
