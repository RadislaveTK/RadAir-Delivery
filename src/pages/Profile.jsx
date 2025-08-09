import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import Button from "../components/Button";
import BackBtn from "../components/BackBtn";
import { useAuth } from "../stores/AuthContext";
// import Cookies from "js-cookie";

export default function NotFound() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();

    await fetch(
      "https://radair-delivery-back-production-21b4.up.railway.app/sanctum/csrf-cookie",
      {
        credentials: "include",
      }
    );

    fetch(
      "https://radair-delivery-back-production-21b4.up.railway.app/api/user",
      {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "error" && data.response_code === 401)
          console.log("Error");

        if (data.status === "success" && data.response_code === 200) {
          // Cookies.remove("token");
          // setUser(false);
          console.log(data);
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Ошибка:", err);
      });

    console.log("Выход..");
  };

  return (
    <>
      <Header />
      <BgDop />

      <Main>
        <BackBtn />
        <h1 style={{ marginTop: "20%", color: "#963736" }}>{user.name}</h1>
        <div>
          <div>
            <span>{user.phone}</span>
            <p>Телефон</p>
          </div>
          <div>
            <span>{user.name}</span>
            <p>Имя</p>
          </div>
          <div>
            <span>{user.rating}</span>
            <p>Рейтинг</p>
          </div>
        </div>
        <Button
          style={{ padding: "10px 15px", fontSize: "15px" }}
          onClick={logout}
        >
          Выйти из аккаунта
        </Button>
      </Main>

      <Fotter />
    </>
  );
}
