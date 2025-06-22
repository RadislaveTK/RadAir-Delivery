import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/BurgerMenu.css";
import { GeoContext } from "../stores/GeoContext";

export default function BurgerMenu() {
  const [toggle, setToggle] = useState(false);
  const menuRef = useRef(null);
  const divO = useRef(null);
  const buttonRef = useRef(null);
  const {address} = useContext(GeoContext);

  // useEffect(()=>{
  //   console.log(address);
    
  // }, []);

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
              <img className="menu-img" src="/assets/icons/profile.svg" alt="img"/>
              Вход
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/map.svg" alt="img"/>
              <div className="menu-ad">
                Текущий адрес <span>{address ? address : "Определение адреса..."}</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/list.svg" alt="img"/>
              Мои заказы
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/basket.svg" alt="img"/>
              Моя корзина
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/work.svg" alt="img"/>
              Работа курьера
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/settings.svg" alt="img"/>
              Настройки
            </Link>
          </li>
          <li>
            <Link to="/">
              <img className="menu-img" src="/assets/icons/help.svg" alt="img"/>О нас
            </Link>
          </li>
        </ul>
      </div>
      <div
        ref={divO}
        style={{ display: "none", width: "300vh", height: "300vh", background: "#00000060", position: "absolute", top: "-50px", transition: "display 1s linear" }}
        onClick={() => {
          toggleMenu();
          divO.current.style.display = "none";
        }}
      ></div>
    </div>
  );
}
