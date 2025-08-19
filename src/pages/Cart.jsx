import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import { useState, useEffect } from "react";
import "../styles/SearchP.css";
import "../styles/Cart.css";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // Загружаем данные из localStorage при старте
  useEffect(() => {
    const storedProducts = localStorage.getItem("cartProducts");
    if (storedProducts) setProducts(JSON.parse(storedProducts));
  }, []);

  // Сохраняем данные в localStorage при каждом изменении products
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("cartProducts", JSON.stringify(products));
    }
  }, [products]);

  const toggleSelectAll = (checked) => {
    setProducts(products.map((p) => ({ ...p, selected: checked })));
  };

  const toggleSelectOne = (id) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const changeQuantity = (id, delta) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, count: Math.max(1, p.count + delta) } : p
      )
    );
  };

  const selectedProducts = products.filter((p) => p.selected);
  const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.count, 0);
  const totalPrice = selectedProducts.reduce(
    (sum, p) => sum + p.count * p.price,
    0
  );

  const allSelected = products.length > 0 && products.every((p) => p.selected);

  const removeProduct = (id) => {
    // Получаем текущую корзину
    const cart = JSON.parse(localStorage.getItem("cartProducts")) || [];

    // Фильтруем, убирая товар с нужным id
    const updatedCart = cart.filter((item) => item.id !== id);

    // Сохраняем в LocalStorage
    localStorage.setItem("cartProducts", JSON.stringify(updatedCart));

    // Обновляем state, если он у тебя есть для отображения корзины
    setProducts(updatedCart);

    // Можно показать уведомление
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  return (
    <>
      <Header />
      <BgDop />

      <Main>
        <h1 className="heading" style={{ marginBottom: "15px" }}>
          Корзина
        </h1>

        <div className="block bl">
          <label className="check_l">
            <input
              type="checkbox"
              className="check"
              checked={allSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
            <h3>Выбрать все</h3>
          </label>
          <hr />

          <div className="card-products-cart">
            {products.map((p) => (
              <div key={p.id} className="card-product-cart">
                <div className="zone-fun">
                  <input
                    type="checkbox"
                    checked={p.selected}
                    onChange={() => toggleSelectOne(p.id)}
                    className="check"
                  />
                  <button onClick={() => removeProduct(p.id)}>
                    <img
                      src="/assets/icons/delete.svg"
                      width="100%"
                      height="100%"
                      alt="delete"
                    />
                  </button>
                </div>

                <img src={p.img} alt={p.name} />

                <div className="zone-des">
                  <h3 className="t-o">{p.name}</h3>
                  <p>{p.producer}</p>
                </div>

                <div className="btn-volume">
                  <button onClick={() => changeQuantity(p.id, -1)}>-</button>
                  <span>{p.count}</span>
                  <button onClick={() => changeQuantity(p.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="btn pay">
          <span>К оплате</span>
          <p>
            {totalQuantity} шт, {totalPrice} тг
          </p>
        </div>
      </Main>

      <div className={`notification ${showNotification ? "show" : ""}`}>
        Товар удален из корзины
      </div>

      <Fotter />
    </>
  );
}
