import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const host = "https://radair-delivery-back-production-21b4.up.railway.app";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = не загрузился

  const fetchUser = async () => {
    try {
      // Шаг 1: Получить CSRF cookie
      await fetch(`${host}/sanctum/csrf-cookie`, {
        method: "get",
        credentials: "include",
      });

      let token = Cookies.get("token");
      if (!token) {
        console.warn("Не авторизован");
        setUser(false);
        return;
      }

      // Шаг 2: Запрос текущего пользователя
      const res = await fetch(`${host}/user`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(Cookies.get("XSRF-TOKEN")),
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn("Не авторизован");
        setUser(false);
        return;
      }

      const data = await res.json();
      setUser(data);
      console.log(data);
    } catch (err) {
      console.error("Ошибка при получении пользователя:", err);
      setUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
