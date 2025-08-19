import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/FormA.css";

export default function FormRegister() {
  const [phone, setPhone] = useState("+7");
  const [name, setName] = useState("No name");
  const [password, setPassword] = useState("");
  const [passwordV, setPasswordV] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
        "https://radair-delivery-back-production-21b4.up.railway.app/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": decodeURIComponent(Cookies.get("XSRF-TOKEN")),
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: name,
            phone: phone,
            password: password,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Успех:", data);
          navigate("/login");
        })
        .catch((err) => {
          console.error("Ошибка:", err);
        });
      console.log("Форма отправлена!");
    }
  };

  useEffect(() => {
    if (password !== passwordV) {
      setError("Пароли не совпадают");
    } else if (name.length <= 1 || /^[A-Za-zА-Яа-я\s]*$/.test(name) === false) {
      setError("Введите корректное имя и фамилию");
    } else setError(false);
  }, [password, passwordV, name]);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9+]/g, "");

    if (!value.startsWith("+7")) value = "+7";
    if (value.length > 12) value = value.slice(0, 12);

    setPhone(value);

    const phoneRegex = /^\+7\d{10}$/;
    setError(phoneRegex.test(value) ? "" : "Введите корректный номер");
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
      <div className="auth-input-div">
        <label htmlFor="inp_name">
          <img src="/assets/icons/badge.svg" alt="name" />
        </label>
        <input
          id="inp_name"
          type="text"
          inputMode="text"
          placeholder="Имя Фамилия"
          required
          onChange={(e) => {
            setName(e.target.value);
            setError(name.length > 1 ? "" : "Введите корректное имя и фамилию");
          }}
        />
      </div>

      <div className="auth-input-div">
        <label htmlFor="inp_password">
          <img src="/assets/icons/lock.svg" alt="lock" />
        </label>
        <input
          id="inp_password"
          className={showPassword ? "inp-text" : "inp-password"}
          type="text"
          placeholder="Пароль"
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="btn-show-pass"
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
      <div className="auth-input-div">
        <label htmlFor="inp_password">
          <img src="/assets/icons/lock.svg" alt="lock" />
        </label>
        <input
          id="inp_password"
          className={showPassword ? "inp-text" : "inp-password"}
          type="text"
          placeholder="Подтверждение пароля"
          onChange={(e) => {
            setPasswordV(e.target.value);
          }}
          required
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="btn-show-pass"
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
      {error && <p className="error">{error}</p>}
      <p className="login-signup-hint">
        Есть аккаунт? <Link to="/login">Войдите</Link>
      </p>

      <Button type="submit" disabled={error} className="btn-enter">
        Зарегестрироваться
      </Button>
    </form>
  );
}
