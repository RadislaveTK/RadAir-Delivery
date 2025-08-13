import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import { useState } from "react";

export default function Cart() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Товар 1",
      producer: "Производитель",
      price: 1500,
      img: "example.jpg",
      quantity: 1,
      selected: false,
    },
    {
      id: 2,
      name: "Товар 2",
      producer: "Производитель",
      price: 2000,
      img: "example2.jpg",
      quantity: 1,
      selected: false,
    },
    {
      id: 3,
      name: "Товар 2",
      producer: "Производитель",
      price: 2000,
      img: "example2.jpg",
      quantity: 1,
      selected: false,
    },
  ]);

  // Выбрать / снять выбор со всех
  const toggleSelectAll = (checked) => {
    setProducts(products.map((p) => ({ ...p, selected: checked })));
  };

  // Выбор одного товара
  const toggleSelectOne = (id) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  // Изменить количество
  const changeQuantity = (id, delta) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };

  // Подсчёт итогов
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
          {/* Чекбокс "Выбрать все" */}
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

          {/* Список товаров */}
          <div className="card-products-cart">
            {products.map((p) => (
              <div key={p.id} className="card-product">
                {/* Чекбокс выбора */}
                <input
                  type="checkbox"
                  checked={p.selected}
                  onChange={() => toggleSelectOne(p.id)}
                  className="check"
                  style={{ width: "18px", height: "18px" }}
                />

                {/* Изображение */}
                <img
                  src={`https://radair-delivery-back-production-21b4.up.railway.app/storage/${p.img}`}
                  alt={p.name}
                />

                {/* Инфо */}
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

                {/* Счётчик */}
                <div className="card-pr-b">
                  <button onClick={() => changeQuantity(p.id, -1)}>-</button>
                  <span>{p.quantity}</span>
                  <button onClick={() => changeQuantity(p.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Итог */}
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
