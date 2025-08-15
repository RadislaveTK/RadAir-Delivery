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

  const [page, setPage] = useState(1); // текущая страница
  const [hasMore, setHasMore] = useState(true); // есть ли ещё данные
  const [isLoading, setIsLoading] = useState(false);

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
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
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

  // Функция загрузки данных
  const fetchProducts = (pageNum, append = false) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    let url = `https://radair-delivery-back-production-21b4.up.railway.app/api/product/search?page=${pageNum}`;

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
        const newItems = data.data || data; // paginate возвращает data[]
        setProducts((prev) => (append ? [...prev, ...newItems] : newItems));

        // Проверяем, есть ли ещё страницы
        if (data.current_page >= data.last_page) {
          setHasMore(false);
        }
      })
      .catch((err) => {
        console.error("Ошибка:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Загружаем первую страницу при изменении поиска
  useEffect(() => {
    if (debouncedValue !== "" || value === "") {
      fetchProducts(1, false);
    }
  }, [debouncedValue]);

  // Обработчик скролла
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.scrollHeight
      ) {
        if (hasMore && !isLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProducts(nextPage, true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, isLoading]);

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

          {isLoading && <p style={{ textAlign: "center" }}>Загрузка...</p>}
          {!hasMore && <p style={{ textAlign: "center" }}>Больше товаров нет</p>}
        </div>
      </Main>

      <div className={`notification ${showNotification ? "show" : ""}`}>
        Товар добавлен в корзину
      </div>

      <Fotter />
    </>
  );
}
