import Header from "../components/Header";
import BgDop from "../components/BgDop";
import Fotter from "../components/Fotter";
import Main from "../components/Main";
import { useState } from "react";

export default function Admin() {
  const [form, setForm] = useState({
    name: "",
    desc: "",
    volume: "",
    count: "",
    price: "",
    producer: "",
    country: "",
    category: "",
    img: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      setForm({ ...form, img: files[0] }); // файл
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    for (let key in form) {
      fd.append(key, form[key]);
    }

    try {
      const res = await fetch(
        "https://radair-delivery-back-production-21b4.up.railway.app/api/product/create_product",
        {
          method: "GET",
          body: fd, // не ставим Content-Type, fetch сам проставит multipart/form-data
        }
      );

      const data = await res.json();
      console.log(data);
      alert("Товар добавлен");
    } catch (err) {
      console.error("Ошибка при загрузке:", err);
    }
  };

  return (
    <>
      <Header />
      <BgDop />

      <Main>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Название" onChange={handleChange} />
          <input name="desc" placeholder="Описание" onChange={handleChange} />
          <input name="volume" placeholder="Объём" onChange={handleChange} />
          <input
            name="count"
            placeholder="Количество"
            onChange={handleChange}
          />
          <input name="price" placeholder="Цена" onChange={handleChange} />
          <input
            name="producer"
            placeholder="Производитель"
            onChange={handleChange}
          />
          <input
            name="country"
            placeholder="Страна производства"
            onChange={handleChange}
          />
          <select name="category" onChange={handleChange}>
            <option value="">Выбери категорию</option>
            <option value="fastfood">Fast Food</option>
            <option value="restouran">Ресторан</option>
            <option value="products">Продукты</option>
          </select>
          <input
            type="file"
            name="img"
            accept="image/*"
            onChange={handleChange}
          />
          <button type="submit">Добавить товар</button>
        </form>
      </Main>

      <Fotter />
    </>
  );
}
