import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GeoProvider } from "./stores/GeoContext";
import { AuthProvider } from "./stores/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <GeoProvider>
      <App />
    </GeoProvider>
  </AuthProvider>
);
