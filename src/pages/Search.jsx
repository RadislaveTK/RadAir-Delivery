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
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

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

  // Делаем debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value.trim());
      setPage(1); // сброс страницы при новом поиске
      setProducts([]); 
    }, 700);
    return () => clearTimeout(timer);
  }, [value]);

  // Загружаем первую страницу при изменении поиска
  useEffect(() => {
    if (debouncedValue === "" && page !== 1) return; // предотвращаем двойной вызов

    let url =
      "https://radair-delivery-back-production-21b4.up.railway.app/api/product/search";
    const params = [];
    if (debouncedValue)
      params.push(`name=${encodeURIComponent(debouncedValue)}`);
    params.push(`page=1`);
    url += "?" + params.join("&");

    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки");
        return res.json();
      })
      .then((data) => {
        setProducts(data.data);
        setNextPageUrl(data.next_page_url);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]); // очищаем товары если ошибка
      })
      .finally(() => setLoading(false));
  }, [debouncedValue]);

  // Загружаем следующую страницу при изменении page
  useEffect(() => {
    if (page === 1) return; // первая страница уже загружена
    if (!nextPageUrl) return;

    setLoading(true);
    fetch(
      "https://radair-delivery-back-production-21b4.up.railway.app/api/product/search?page=" +
        page
    )
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки");
        return res.json();
      })
      .then((data) => {
        setProducts((prev) => [...prev, ...data.data]);
        setNextPageUrl(data.next_page_url);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]); // очищаем товары если ошибка
      })
      .finally(() => setLoading(false));
  }, [page]);

  // Ловим скролл внутри контейнера
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 40) {
        if (nextPageUrl && !loading) {
          setPage((prev) => prev + 1);
        }
      }
    };
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [nextPageUrl, loading]);

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

          <div
            className="card-products"
            ref={containerRef}
            style={{
              maxHeight: "70vh",
              overflowY: "auto",
              border: "1px solid #ddd",
              padding: "10px",
            }}
          >
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
            {!loading && products.length === 0 && (
              <p style={{ textAlign: "center" }}>Ничего не найдено</p>
            )}
            {loading && <p style={{ textAlign: "center" }}>Загрузка...</p>}
          </div>
        </div>
      </Main>

      <div className={`notification ${showNotification ? "show" : ""}`}>
        Товар добавлен в корзину
      </div>

      <Fotter />
    </>
  );
}
