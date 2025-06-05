import Header from "../components/Header";
import Search from "../components/Search";
import Card from "../components/Card";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import GeoModal from "../components/GeoModal";

export default function Home() {
  return (
    <>
      <Header />
      <BgDop />

      <Main>
        <Search />
        <div className="block">
          <h1 className="heading">Заказать</h1>
          <p className="heading-p">
            Выберите категорию
            <br />и начните заказ прямо сейчас.
          </p>
          <div className="card-container">
            <Card style={{ gridArea: "ff" }}>
              <img src="/assets/product/fastfood.png" alt="Icon"/>
              Фаст-Фуд
            </Card>
            <Card style={{ gridArea: "rr" }}>
              <img src="/assets/product/restouran.png" alt="Icon"/>
              Ресторан
            </Card>
            <Card style={{ gridArea: "pt", fontSize: "20px" }}>
              <img src="/assets/product/products.png" alt="Icon"/>
              Продукты
            </Card>
          </div>
        </div>

        <GeoModal />
      </Main>

      <Fotter />
    </>
  );
}
