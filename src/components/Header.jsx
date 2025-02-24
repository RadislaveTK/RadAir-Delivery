import React from "react";
import BurgerMenu from "./BurgerMenu";
import { Link } from "react-router-dom";

import "../styles/Header.css";

export default function Header() {
  return (
    <div className="header">
      <header>
        
        <Link className="logo" to="/">
          <img width={155} height={70} src="/assets/name.png" />
        </Link>
      </header>
      <BurgerMenu />
    </div>
  );
}
