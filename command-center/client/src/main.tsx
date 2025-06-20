import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

const theme = {
  fontFamily: "NYT",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
