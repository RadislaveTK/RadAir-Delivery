import React from "react";
import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import BackBtn from "../components/BackBtn";
import { useAuth } from "../stores/AuthContext";

export default function NotFound() {
  const { user } = useAuth();
  return (
    <>
      <Header />
      <BgDop />

      <Main>
        <BackBtn />
        <h1 style={{ marginTop: "20%", color: "#963736" }}>{user.name}</h1>
              <div>
                  <div>
                      <span>{user.phone}</span>
                      <p>Телефон</p>
                  </div>
                  <div>
                      <span>{user.name}</span>
                      <p>Имя</p>
                  </div>
                  <div>
                      <span>{user.rating}</span>
                      <p>Рейтинг</p>
                  </div>
        </div>
      </Main>

      <Fotter />
    </>
  );
}
