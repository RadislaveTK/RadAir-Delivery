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

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  // debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value.trim());
      setPage(1); 
      setProducts([]); 
      setHasMore(true);
    }, 700);

    return () => clearTimeout(timer);
  }, [value]);

  const loadProducts = () => {
    if (!hasMore) return;

    let url = `https://radair-delivery-back-production-21b4.up.railway.app/api/product/search?page=${page}`;
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
        const newProducts = data.data || [];
        setProducts((prev) => [...prev, ...newProducts]);
        setHasMore(data.next_page_url !== null);
      })
      .catch((err) => {
        console.error("Ошибка:", err);
      });
  };

  useEffect(() => {
    loadProducts();
  }, [debouncedValue, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        </div>
      </Main>

      <div className={`notification ${showNotification ? "show" : ""}`}>
        Товар добавлен в корзину
      </div>

      <Fotter />
    </>
  );
}
