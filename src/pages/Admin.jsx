import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";

export default function Admin() {
  return (
    <>
      <Header />
      <BgDop />

      <Main>
        <form>
            <input placeholder="Название товара" />
            <input placeholder="Описание" />
            <input placeholder="Обьем" />
            <input placeholder="Количество" />
            <input placeholder="Цена" />
            <input placeholder="Производитель" />
            <input placeholder="Страна производства" />
            
        </form>
      </Main>

      <Fotter />
    </>
  );
}
