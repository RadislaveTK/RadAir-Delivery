import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Cookies from "js-cookie";
import { useAuth } from "../stores/AuthContext";
import "../styles/FormA.css";

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
    let value = e.target.value.replace(/[^0-9+]/g, "");

    if (!value.startsWith("+7")) value = "+7";
    if (value.length > 12) value = value.slice(0, 12);

    setPhone(value);

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
            Accept: "application/json",
          },
          credentials: "include",

          body: JSON.stringify({
            phone: phone,
            password: password,
            req: req,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "error" && data.response_code === 401)
            setError("Неверные данные");
          if (data.status === "success" && data.response_code === 200) {
            setUser(data.user);
          }
        })
        .catch((err) => {
          console.error("Ошибка:", err);
        });
      console.log("Форма отправлена!");
    }
  };

  return (
    <form className="form-a" onSubmit={handleSubmit}>
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
      {error && <p className="error">{error}</p>}
      <div className="auth-input-div">
        <label htmlFor="inp_password">
          <img src="/assets/icons/lock.svg" alt="lock" />
        </label>
        <input
          id="inp_password"
          className={showPassword ? "inp-text" : "inp-password"}
          type="text"
          placeholder="Пароль"
          onChange={(e) => {
            setError(false);
            setPassword(e.target.value);
          }}
          required
          autoComplete="off"
        />
        <button
          className="btn-show-pass"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
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

      <div className="rem-pass">
        <label htmlFor="inp_req">Запомнить пароль</label>
        <input
          id="inp_req"
          type="checkbox"
          onChange={(e) => setReq(e.target.value)}
        />
      </div>

      <p className="login-signup-hint">
        Нет аккаунта? <Link to="/register">Зарегестрироваться</Link>
      </p>

      <Button className="btn-enter" type="submit" disabled={error}>
        Войти
      </Button>
    </form>
  );
}
