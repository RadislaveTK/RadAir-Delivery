import React from "react";
import Header from "../components/Header";
import Search from "../components/Search";

export default function Home() {
  return (
    <>
      <Header />
      <Search />
      <div className="block">
        <h1 className="heading">Заказать</h1>
        <p className="heading-p">Выберите категорию<br />и начните заказ прямо сейчас.</p>
        <div className="card-container">
          
        </div>
      </div>
    </>
  );
}
