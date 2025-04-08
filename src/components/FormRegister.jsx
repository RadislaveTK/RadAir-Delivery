import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function FormRegister() {
  const [phone, setPhone] = useState("+7");
  const [password, setPassword] = useState("");
  const [passwordV, setPasswordV] = useState("");
  const [req, setReq] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  const handlePhoneChange = (e) => {
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
      console.log("Форма отправлена!");
    }
  };

  return (
    <form style={{width:"100%"}} onSubmit={handleSubmit}>
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
            onChange={(e) => setPassword(e.target.value)}
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
              width:"22px",
              height:"22px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <img width={"22px"} height={"22px"} src={showPassword ? "/assets/icons/eye-off.svg" : "/assets/icons/eye.svg"} alt="toggle password" />
          </button>
        </div>
        <div className="auth-input-div">
          <label htmlFor="inp_password">
            <img src="/assets/icons/lock.svg" alt="lock" />
          </label>
          <input
            id="inp_password"
            className={showPassword ? "inp-text" : "inp-password"}
            type="text" // Изменение типа инпута
            placeholder="Подтверждение пароля"
            // value={password}
            onChange={(e) => {
              e.target.value
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
              width:"22px",
              height:"22px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <img width={"22px"} height={"22px"} src={showPassword ? "/assets/icons/eye-off.svg" : "/assets/icons/eye.svg"} alt="toggle password" />
          </button>
        </div>

        <p style={{ color: "#963736", fontWeight: "bold", marginTop: "15px" }}>
          Есть аккаунт? <Link style={{color:"#FF9800"}} to="/login">Войдите</Link>
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
          Зарегестрироваться
        </Button>
      </div>
    </form>
  );
}
