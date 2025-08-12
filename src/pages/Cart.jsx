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

        <h1 style={{ marginTop: "20%", color: "#963736" }}>Корзина</h1>

        <hr />

        <div className="block">
            
        </div>
      </Main>

      <Fotter />
    </>
  );
}
