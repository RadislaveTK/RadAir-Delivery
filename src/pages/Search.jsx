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
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

  // debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value.trim());
      setPage(1); // сброс страницы
    }, 700);
    return () => clearTimeout(timer);
  }, [value]);

  // загрузка данных
  useEffect(() => {
    if (!debouncedValue) {
      setProducts([]);
      setHasMore(false);
      return;
    }

    const url = `https://radair-delivery-back-production-21b4.up.railway.app/api/product/search?name=${encodeURIComponent(
      debouncedValue
    )}&page=${page}`;

    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка сети");
        return res.json();
      })
      .then((data) => {
        if (page === 1) {
          setProducts(data.data || []);
        } else {
          setProducts((prev) => [...prev, ...(data.data || [])]);
        }
        setHasMore(!!data.next_page_url);
      })
      .catch((err) => {
        console.error("Ошибка загрузки:", err);
      })
      .finally(() => setLoading(false));
  }, [debouncedValue, page]);

  // скролл
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        if (hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      }
    };
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

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
            {loading && <p style={{ textAlign: "center" }}>Загрузка...</p>}
            {!loading && products.length === 0 && debouncedValue && (
              <p style={{ textAlign: "center" }}>Ничего не найдено</p>
            )}
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
