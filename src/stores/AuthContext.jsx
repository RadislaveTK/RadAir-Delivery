import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = не загрузился

  const fetchUser = async () => {
    try {
      // Шаг 1: Получить CSRF cookie
      await fetch("https://radair.local/sanctum/csrf-cookie", {
        credentials: "include",
      });

      // Шаг 2: Запрос текущего пользователя
      const res = await fetch("https://radair.local/api/user", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.warn("Не авторизован");
        setUser(false);
        return;
      }

      const data = await res.json();
      setUser(data);
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
