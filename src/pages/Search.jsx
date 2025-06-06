// import React, { useEffect } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import { GeoContext } from "../stores/GeoContext";

export default function Auth() {
  return (
    <>
    <Header />
    <BgDop />

    <Main>
      <Search />
      <div className="block">
        <h1 className="heading">Заказать</h1>

        
      </div>

    </Main>

    <Fotter />
  </>
  );
}
