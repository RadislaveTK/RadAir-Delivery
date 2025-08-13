import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import { useState, useEffect } from "react";

export default function Cart() {
  const [products, setProducts] = useState([]);

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
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };

  const selectedProducts = products.filter((p) => p.selected);
  const totalQuantity = selectedProducts.reduce(
    (sum, p) => sum + p.quantity,
    0
  );
  const totalPrice = selectedProducts.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  const allSelected = products.length > 0 && products.every((p) => p.selected);

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
            <h3
              className="text"
              style={{
                color: "#963736",
                textShadow: "2px 2px 0 0 #ff9800, 4px 4px 4px 0 #00000040",
                marginLeft: "10px",
              }}
            >
              Выбрать все
            </h3>
          </label>
          <hr />

          <div className="card-products-cart">
            {products.map((p) => (
              <div key={p.id} className="card-product">
                <input
                  type="checkbox"
                  checked={p.selected}
                  onChange={() => toggleSelectOne(p.id)}
                  className="check"
                  style={{ width: "18px", height: "18px" }}
                />

                <img
                  src={`https://radair-delivery-back-production-21b4.up.railway.app/storage/${p.img}`}
                  alt={p.name}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h3>{p.name}</h3>
                  <p>{p.producer}</p>
                </div>

                <div className="card-pr-b">
                  <button onClick={() => changeQuantity(p.id, -1)}>-</button>
                  <span>{p.quantity}</span>
                  <button onClick={() => changeQuantity(p.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "80vw",
            marginTop: "15px",
            padding: "5px 0px",
          }}
          className="btn"
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            К оплате
          </span>
          <span>
            {totalQuantity} шт, {totalPrice} тг
          </span>
        </div>
      </Main>

      <Fotter />
    </>
  );
}
