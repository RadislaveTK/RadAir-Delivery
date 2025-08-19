import Header from "../components/Header";
import Search from "../components/Search";
import CardCategory from "../components/CardCategory";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import GeoModal from "../components/GeoModal";
import "../styles/Home.css"

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
            <CardCategory url="/fastfood" style={{ gridArea: "ff" }}>
              <img src="/assets/product/fastfood.png" alt="Icon"/>
              Фаст-Фуд
            </CardCategory>
            <CardCategory url="/restouran" style={{ gridArea: "rr" }}>
              <img src="/assets/product/restouran.png" alt="Icon"/>
              Ресторан
            </CardCategory>
            <CardCategory url="/products" style={{ gridArea: "pt", fontSize: "20px" }}>
              <img src="/assets/product/products.png" alt="Icon"/>
              Продукты
            </CardCategory>
          </div>
        </div>

        <GeoModal />
      </Main>

      <Fotter />
    </>
  );
}
