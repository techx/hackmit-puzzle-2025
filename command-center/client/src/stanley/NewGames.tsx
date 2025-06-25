export default function NewGames() {
  const newGames = [
    {
      title: "Mini Switcher DX",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/mini-switcher-dx-logo.png.webp?itok=P7pxbwtU",
    },
    {
      title: "Mini Switcher DX",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/mini-switcher-dx-logo.png.webp?itok=P7pxbwtU",
    },
    {
      title: "Mini Switcher DX",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/mini-switcher-dx-logo.png.webp?itok=P7pxbwtU",
    },
    {
      title: "Mini Switcher DX",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/mini-switcher-dx-logo.png.webp?itok=P7pxbwtU",
    },
    {
      title: "Mini Switcher DX",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/mini-switcher-dx-logo.png.webp?itok=P7pxbwtU",
    },
    {
      title: "Mini Switcher DX",
      description: "Switch up gravity to reach the flag!",
      image:
        "https://www.coolmathgames.com/sites/default/files/styles/thumbnail_small/public/game_thumbnail/mini-switcher-dx-logo.png.webp?itok=P7pxbwtU",
    },
  ];
  return (
    <section className="flex flex-col w-full gap-2 h-auto bg-tertiary px-2 py-3 rounded-lg">
      <h1 className="text-lg font-semibold uppercase tracking-wider">
        new games
      </h1>
      <ul className="flex flex-col">
        {newGames.map((game) => (
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
      <button className="flex justify-center items-center uppercase w-full h-12 bg-accent text-primary font-semibold rounded-lg">
        more new games &gt;
      </button>
    </section>
  );
}
