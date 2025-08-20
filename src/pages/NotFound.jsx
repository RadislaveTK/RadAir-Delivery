import React from "react";
import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import BackBtn from "../components/BackBtn";

export default function NotFound() {
  return (
    <>
      <Header />
      <BgDop />

      <Main>
        <BackBtn />
        <h1 style={{ textAlign: "center", fontWeight: 700, color: "#963736", marginBottom: "auto",}}>
          404
          <br />
          Не найдено
        </h1>
      </Main>

      <Fotter />
    </>
  );
}
