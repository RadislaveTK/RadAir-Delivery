import React, { useState, useEffect, useRef } from "react";
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

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const perPage = 12;

  const addProduct = (product) => {
    const cart = JSON.parse(localStorage.getItem("cartProducts")) || [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      cart.push({ ...product, count: 1 });
    }

    localStorage.setItem("cartProducts", JSON.stringify(cart));

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Дебаунс поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts([]);
      setPage(1);
      setHasMore(true);
      setDebouncedValue(value.trim());
    }, 700);

    return () => clearTimeout(timer);
  }, [value]);

  // Загрузка данных
  const fetchProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    let url = `https://radair-delivery-back-production-21b4.up.railway.app/api/product/search?page=${page}&per_page=${perPage}`;
    if (debouncedValue !== "") {
      url += `&name=${encodeURIComponent(debouncedValue)}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Ошибка при получении данных");

      const data = await res.json();
      setProducts((prev) => [...prev, ...data.data]);
      setHasMore(data.current_page < data.last_page);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Ошибка:", err);
    }

    setLoading(false);
  };

  // Загрузка первой страницы
  useEffect(() => {
    fetchProducts();
  }, [debouncedValue]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchProducts();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef.current, debouncedValue]);

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
                <img src={p.img} alt={p.name} />
                <h3>{p.name}</h3>
                <p>{p.producer}</p>
                <button onClick={() => addProduct(p)}>
                  <img src="/assets/icons/money.svg" alt="money" />
                  {p.price} тг
                </button>
              </CardProduct>
            ))}
          </div>

          {loading && <p style={{ textAlign: "center" }}>Загрузка...</p>}
          <div ref={loaderRef} style={{ height: "20px" }}></div>
        </div>
      </Main>

      <div className={`notification ${showNotification ? "show" : ""}`}>
        Товар добавлен в корзину
      </div>
      <Fotter />
    </>
  );
}
