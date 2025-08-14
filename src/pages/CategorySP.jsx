import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import CardProduct from "../components/CardProduct";
import "../styles/SearchP.css";

export default function CategorySP({ category }) {
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
    let url = `https://radair-delivery-back-production-21b4.up.railway.app/api/product/search?category=${category}`;

    if (debouncedValue !== "") {
      url += `&name=${encodeURIComponent(debouncedValue)}`;
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
        {category === "fastfood" ? <h1 className="heading">Фаст-Фуд</h1> : ""}
        {category === "products" ? <h1 className="heading">Продукты</h1> : ""}
        {category === "restouran" ? <h1 className="heading">Ресторан</h1> : ""}
        <div className="block bl">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <div
              className="search"
              style={{ width: "80%", marginBottom: "10px", height: "80%," }}
            >
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
            <hr />
          </div>

          <div className="card-products">
            {products.map((p) => (
              <CardProduct key={p.id} style={{ height: "220px" }}>
                <img
                  src={`https://radair-delivery-back-production-21b4.up.railway.app/storage/${p.img}`}
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
