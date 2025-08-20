import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import Button from "../components/Button";
import BackBtn from "../components/BackBtn";
import { useAuth } from "../stores/AuthContext";
import Cookies from "js-cookie";
import "../styles/Profile.css";

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();

    fetch(
      `https://radair-delivery-back-production-21b4.up.railway.app/sanctum/csrf-cookie`,
      {
        method: "get",
        credentials: "include",
      }
    );

    fetch(
      "https://radair-delivery-back-production-21b4.up.railway.app/logout",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(Cookies.get("XSRF-TOKEN")),
          Accept: "application/json",
        },
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
    // Cookies.remove("token");
    setUser(false);
    navigate("/");
    console.log("Выход..");
  };

  return (
    <>
      <Header />
      <BgDop />

      <Main>
        <BackBtn />
        <h1 style={{ marginBottom: "auto", color: "#963736" }}>{user.name}</h1>
        <div className="profile-block">
          <div className="profile-inp">
            <div>
              <p>Телефон</p>
              <span>{user.phone}</span>
            </div>
            <img src="/assets/icons/phone.svg" alt="phone" />
          </div>
          <div className="profile-inp">
            <div>
              <p>Имя</p>
              <span>{user.name}</span>
            </div>
            <img src="/assets/icons/badge.svg" alt="badge" />
          </div>
          <div className="profile-inp">
            <div>
              <p>Рейтинг</p>
              <span>{user.rating}</span>
            </div>
            <img src="/assets/icons/star.svg" alt="star" />
          </div>
          <Button
            style={{ padding: "10px 15px", fontSize: "15px" }}
            onClick={logout}
          >
            Выйти из аккаунта
          </Button>
        </div>
      </Main>

      <Fotter />
    </>
  );
}
