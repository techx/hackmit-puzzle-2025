export default function TrendingGames() {
  const trendingGames = [
    {
      title: "House Painter",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/house-painter-logo.png.webp?itok=hWHG0jkm",
    },
    {
      title: "House Painter",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/house-painter-logo.png.webp?itok=hWHG0jkm",
    },
    {
      title: "House Painter",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/house-painter-logo.png.webp?itok=hWHG0jkm",
    },
    {
      title: "House Painter",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/house-painter-logo.png.webp?itok=hWHG0jkm",
    },
    {
      title: "House Painter",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/house-painter-logo.png.webp?itok=hWHG0jkm",
    },
  ];
  return (
    <section className="flex flex-col w-full gap-2 h-auto bg-tertiary px-2 py-3 rounded-lg">
      <h1 className="text-lg font-semibold uppercase tracking-wider">
        trending games
      </h1>
      <ul className="flex flex-col">
        {trendingGames.map((game) => (
          <li key={game.title} className="flex gap-2 items-center h-fit">
            <div className="w-20 h-12 border border-accent rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover object-center"
                src={game.image}
                alt={game.title}
              />
            </div>

            <div className="flex flex-col">
              <h2 className="font-semibold text-accent">{game.title}</h2>
              <p className="text-base leading-tight text-white">
                {game.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
