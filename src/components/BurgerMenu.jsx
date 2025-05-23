import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/BurgerMenu.css";

export default function BurgerMenu() {
  const [toggle, setToggle] = useState(false);
  const menuRef = useRef(null);
  const divO = useRef(null);
  const buttonRef = useRef(null);

  // Функция переключения состояния
  const toggleMenu = () => {
    if (toggle) {
      setToggle(false);
      divO.current.style.display = "none";
    } else {
      setToggle(true);
      divO.current.style.display = "block";
    }
  };

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setToggle(false);
      }
    };

    if (toggle) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [toggle]);

  return (
    <div className="burger-container">
      {/* Кнопка */}
      <button ref={buttonRef} className="burger-menu" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Выдвижное меню */}
      <div ref={menuRef} className={`menu ${toggle ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/login">
              <img className="menu-img" src="/assets/icons/profile.svg" />
              Вход
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/map.svg" />
              <div className="menu-ad">
                Текущий адрес <span>Тимирязева 23</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/list.svg" />
              Мои заказы
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/basket.svg" />
              Моя корзина
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/work.svg" />
              Работа курьера
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/settings.svg" />
              Настройки
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/help.svg" />О нас
            </Link>
          </li>
        </ul>
      </div>
      <div
        ref={divO}
        style={{display:"none", width: "300vh", height: "300vh", background: "#00000060", position:"absolute", top:"-50px", transition: "display 1s linear" }}
        onClick={() => {
          toggleMenu();
          divO.current.style.display = "none";
        }}
      ></div>
    </div>
  );
}
