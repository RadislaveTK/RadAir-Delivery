import { useState } from "react";
import "../styles/ProductModal.css";

export default function CardProduct({ product, children, ...props }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div {...props} className="card" onClick={openModal}>
        {children}
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // чтобы клик внутри окна не закрывал модалку
          >
            <button className="modal-close" onClick={closeModal}>
              ✖
            </button>
            <img src={product.img} alt={product.name} className="modal-img" />
            <h2>{product.name}</h2>
            <p><b>Производитель:</b> {product.producer}</p>
            <p><b>Страна:</b> {product.country}</p>
            <p><b>Описание:</b> {product.desc}</p>
            <p><b>Цена:</b> {product.price} тг</p>
          </div>
        </div>
      )}
    </>
  );
}
