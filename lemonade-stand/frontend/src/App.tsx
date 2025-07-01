import { useEffect, useState } from "react";
import LemonadeStand from "./LemonadeStand";
import NotFound from "./NotFound";

const App = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  });

  return path === "/" ? <LemonadeStand /> : <NotFound />;
};

export default App;
