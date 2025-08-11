import React, { useState, useEffect } from "react";
import Header from "../components/Header";
// import Search from "../components/Search";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import CardProduct from "../components/CardProduct";

export default function SearchP() {
  const [value, setValue] = useState("");
  const [products, setProducts] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState("");

  // 👇 Отложенное обновление debouncedValue
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 700); // задержка 500 мс

    return () => clearTimeout(timer); // очистка при следующем вводе
  }, [value]);

  useEffect(()=>{
    fetch(
    `https://radair-delivery-back-production-21b4.up.railway.app/api/product/search`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Ошибка при получении данных");
      }
      return res.json();
    })
    .then((data) => {
      //   console.log("Результаты поиска:", data);
      setProducts(data); // если нужно отрисовать
    })
    .catch((err) => {
      console.error("Ошибка:", err);
    });
  })

  // 👇 Запрос срабатывает только когда debouncedValue изменяется
  useEffect(() => {
    if (debouncedValue.trim() === "") return;

    fetch(
      `https://radair-delivery-back-production-21b4.up.railway.app/api/product/search?name=${encodeURIComponent(
        debouncedValue
      )}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка при получении данных");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Результаты поиска:", data);
        setProducts(data); // если нужно отрисовать
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
          <h1
            style={{ fontFamily: "Nunito", fontWeight: "bold" }}
            className="heading"
          >
            Результат поиска:
          </h1>

          <hr />

          {/* Пример отрисовки результатов */}
          <ul>
            {products.map((p) => (
              <CardProduct key={p.id}>
                <img
                  src={`https://radair-delivery-back-production-21b4.up.railway.app/storage/${p.img}`}
                  alt="Icon"
                />
                {p.name}
              </CardProduct>
            ))}
          </ul>
        </div>
      </Main>

      <Fotter />
    </>
  );
}
