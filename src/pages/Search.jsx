import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import CardProduct from "../components/CardProduct";

export default function SearchP() {
  const [value, setValue] = useState("");
  const [products, setProducts] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState("");

  // Отложенное обновление debouncedValue
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value.trim());
    }, 700);

    return () => clearTimeout(timer);
  }, [value]);

  // Один универсальный запрос
  useEffect(() => {
    let url =
      "https://radair-delivery-back-production-21b4.up.railway.app/api/product/search";

    if (debouncedValue !== "") {
      url += `?name=${encodeURIComponent(debouncedValue)}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка при получении данных");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Ошибка:", err);
      });
  }, [debouncedValue]);

  return (
    <>
      <Header />
      <BgDop />

      <Main>
        <div className="search">
          <label htmlFor="inp_search">
            <img src="/assets/icons/search.svg" alt="search" />
          </label>
          <input
            id="inp_search"
            className="inp"
            type="search"
            placeholder="Поиск"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="block">
          <div>
            <h1
              style={{
                fontFamily: "Nunito",
                fontWeight: "bold",
                margin: "15px 0",
              }}
              className="heading"
            >
              Результат поиска:
            </h1>
            <hr />
          </div>

          <div className="card-products">
            {products.map((p) => (
              <CardProduct key={p.id}>
                <img
                  src={`https://radair-delivery-back-production-21b4.up.railway.app/storage/${p.img}`}
                  alt={p.name}
                />
                <h3>{p.name}</h3>
                <p>{p.producer}</p>
                <button><img src="/assets/icons/money.svg" alt="money" />{p.price} тг</button>
              </CardProduct>
            ))}
          </div>
        </div>
      </Main>

      <Fotter />
    </>
  );
}
