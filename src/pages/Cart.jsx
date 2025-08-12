
import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import Button from "../components/Button";
import BackBtn from "../components/BackBtn";

export default function Cart() {
  
  return (
    <>
      <Header />
      <BgDop />

      <Main>
        <BackBtn />
        {/* <h1 style={{ marginTop: "20%", color: "#963736" }}>{user.name}</h1> */}
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
