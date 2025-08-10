import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Cookies from "js-cookie";
import { useAuth } from "../stores/AuthContext";

export default function FormLogin() {
  const [phone, setPhone] = useState("+7");
  const [password, setPassword] = useState("");
  const [req, setReq] = useState("");
  const [error, setError] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    e.preventDefault();
    let value = e.target.value.replace(/[^0-9+]/g, ""); // Оставляем только цифры и "+"

    if (!value.startsWith("+7")) value = "+7"; // Всегда начинаем с +7
    if (value.length > 12) value = value.slice(0, 12); // Ограничение длины

    setPhone(value);

    // Проверяем, правильный ли формат
    const phoneRegex = /^\+7\d{10}$/;
    setError(phoneRegex.test(value) ? "" : "Введите корректный номер");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error) {
      fetch(
        `https://radair-delivery-back-production-21b4.up.railway.app/sanctum/csrf-cookie`,
        {
          method: "get",
          credentials: "include",
        }
      );

      fetch(
        "https://radair-delivery-back-production-21b4.up.railway.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": decodeURIComponent(Cookies.get("XSRF-TOKEN")),
            'Accept': 'application/json',
          },
          credentials: "include", // обязательно, если используешь sanctum
          
          body: JSON.stringify({
            phone: phone,
            password: password,
            req: req,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Успех:", data);
          if (data.status === "error" && data.response_code === 401)
            setError("Неверные данные");
          if (data.status === "success" && data.response_code === 200) {
            // Cookies.set("token", data.token);
            setUser(data.user);
            navigate("/"); // редирект после регистрации
          }
          // setUser
          // fetchUser(); // загрузим текущего пользователя
        })
        .catch((err) => {
          console.error("Ошибка:", err);
        });
      console.log("Форма отправлена!");
    }
  };

  return (
    <form style={{ width: "100%" }} onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {/* Поле ввода телефона */}
        <div className="auth-input-div">
          <label htmlFor="inp_login">
            <img src="/assets/icons/call.svg" alt="phone" />
          </label>
          <input
            id="inp_login"
            type="tel"
            inputMode="numeric"
            placeholder="+7XXXXXXXXXX"
            value={phone}
            onChange={handlePhoneChange}
            required
          />
        </div>
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        {/* Поле ввода пароля */}
        <div className="auth-input-div">
          <label htmlFor="inp_password">
            <img src="/assets/icons/lock.svg" alt="lock" />
          </label>
          <input
            id="inp_password"
            className={showPassword ? "inp-text" : "inp-password"}
            type="text" // Изменение типа инпута
            placeholder="Пароль"
            // value={password}
            onChange={(e) => {
              setError(false);
              setPassword(e.target.value);
            }}
            required
            autoComplete="off"
          />
          {/* Кнопка показать пароль */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "22px",
              height: "22px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <img
              width={"22px"}
              height={"22px"}
              src={
                showPassword
                  ? "/assets/icons/eye-off.svg"
                  : "/assets/icons/eye.svg"
              }
              alt="toggle password"
            />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <label
            style={{
              color: "#963736",
              fontWeight: "bold",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
            htmlFor="inp_req"
          >
            Запомнить пароль
          </label>
          <input
            id="inp_req"
            type="checkbox"
            onChange={(e) => setReq(e.target.value)}
          />
        </div>

        <p style={{ color: "#963736", fontWeight: "bold" }}>
          Нет аккаунта?{" "}
          <Link style={{ color: "#FF9800" }} to="/register">
            Зарегестрироваться
          </Link>
        </p>

        {/* Кнопка отправки */}
        <Button
          type="submit"
          disabled={error}
          style={{
            width: "250px",
            height: "50px",
            fontSize: "20px",
            marginTop: "20px",
          }}
        >
          Войти
        </Button>
      </div>
    </form>
  );
}
