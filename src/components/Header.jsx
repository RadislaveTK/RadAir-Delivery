import React from "react";
import BurgerMenu from "./BurgerMenu";
import { Link } from "react-router-dom";

import "../styles/Header.css";

export default function Header() {
  return (
    <div
      style={{
        width: "100%",
        // position: "fixed",
        // left: 0,
        // top: 0,
        zIndex: 20,
        height: "80px",
        maxHeight: "80px",
        minHeight: "80px",
      }}
    >
      <header>
        <Link className="logo" to="/">
          <img width={155} height={70} src="/assets/name.png" alt="Icon" />
        </Link>
      </header>
      <BurgerMenu />
    </div>
  );
}
