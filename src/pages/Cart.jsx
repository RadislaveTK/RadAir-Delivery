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
        <h1 className="heading" style={{ marginBottom: "15px" }}>
          Корзина
        </h1>

        <div className="block bl">
          <label className="check_l">
            <input
              type="checkbox"
              className="check"
              name="select_all"
              id="select_all"
            />
            <h3
              className="text"
              style={{
                color: "#963736",
                textShadow: "2px 2px 0 0 #ff9800, 4px 4px 4px 0 #00000040",
                marginLeft: "10px",
              }}
            >
              Выбрать все
            </h3>
          </label>
          <hr />
          <div className="card-products"></div>
        </div>
      </Main>

      <Fotter />
    </>
  );
}
