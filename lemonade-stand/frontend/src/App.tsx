import { useEffect, useState } from "react";
import LemonadeStand from "./LemonadeStand";
import NotFound from "./NotFound";
import Unauthorized from "./Unauthorized";

const AUTH_PATH_REGEX = /^\/u\/([^/]+)$/;

const LemonadeStandAuthWrapper = ({
  navigate,
}: {
  navigate: (url: string) => void;
}) => {
  const user_id = localStorage.getItem("user_id")?.trim();

  if (
    typeof user_id !== "string" ||
    !user_id ||
    user_id.indexOf("\n") != -1 ||
    user_id.indexOf(" ") != -1 ||
    user_id.indexOf("\r") != -1
  ) {
    navigate("/unauthorized");
    return <div>Loading...</div>;
  }

  return <LemonadeStand userId={user_id} />;
};

const App = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => {
      console.log("popstate");
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  });

  const navigate = (url: string) => {
    if (typeof history?.pushState === "function") {
      history.pushState(null, "", url);
      setPath(url);
    } else {
      window.location.href = url;
    }
  };

  useEffect(() => {
    console.log("hi");
    const match = path.match(AUTH_PATH_REGEX);
    if (match) {
      console.log({ match });
      const user_id = match[1];
      localStorage.setItem("user_id", user_id);
      navigate("/");
    }
  }, [path]);

  return path === "/" ? (
    <LemonadeStandAuthWrapper navigate={navigate} />
  ) : path === "/unauthorized" ? (
    <Unauthorized />
  ) : path.match(AUTH_PATH_REGEX) !== null ? (
    <div>Loading...</div>
  ) : (
    <NotFound />
  );
};

export default App;
