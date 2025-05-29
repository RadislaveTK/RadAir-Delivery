import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GeoProvider } from "./stores/GeoContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GeoProvider>
    <App />
  </GeoProvider>
);
