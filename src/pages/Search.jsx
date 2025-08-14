import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import CardProduct from "../components/CardProduct";
import "../styles/SearchP.css";

export default function SearchP() {
  const [value, setValue] = useState("");
  const [products, setProducts] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const addProduct = (product) => {
    const cart = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      cart.push({ ...product, count: 1 });
    }

    localStorage.setItem("cartProducts", JSON.stringify(cart));

    // Показ уведомления
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

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
              <CardProduct key={p.id} style={{ height: "220px" }}>
                <img
                  src={p.img}
                  alt={p.name}
                />
                <h3>{p.name}</h3>
                <p>{p.producer}</p>
                <button onClick={() => addProduct(p)}>
                  <img src="/assets/icons/money.svg" alt="money" />
                  {p.price} тг
                </button>
              </CardProduct>
            ))}
          </div>
        </div>
      </Main>

      {/* Уведомление */}
      <div className={`notification ${showNotification ? "show" : ""}`}>
        Товар добавлен в корзину
      </div>

      <Fotter />
    </>
  );
}
