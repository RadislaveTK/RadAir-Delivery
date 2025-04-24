import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import "../styles/GeoModal.css";

export default function GeoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setSuggestions([]);
  };

  // Получение подсказок из REST API Яндекса
  const fetchSuggestions = async (query) => {
    if (!query) return setSuggestions([]);
    const res = await fetch(
      `https://suggest-maps.yandex.ru/v1/suggest?apikey=cf6f22b4-7b6e-4e3c-bbb3-a682970710ca&text=${encodeURIComponent(
        query
      )}&lang=ru_RU`
    );
    const data = await res.json();
    setSuggestions(data.results || []);
  };

  // Закрытие по клику вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Свайп вниз
  useEffect(() => {
    let startY = 0;
    const handleTouchStart = (e) => (startY = e.touches[0].clientY);
    const handleTouchEnd = (e) => {
      if (e.changedTouches[0].clientY - startY > 100) closeModal();
    };
    const modal = modalRef.current;
    if (modal) {
      modal.addEventListener("touchstart", handleTouchStart);
      modal.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (modal) {
        modal.removeEventListener("touchstart", handleTouchStart);
        modal.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  return (
    <>
      <Button className="geo-btn" onClick={openModal}>
        <img src="/assets/icons/location.svg" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h3 style={{ fontSize: "18px" }}>Мой адрес: {address || "Тимирязева 23"}</h3>
          <h4 style={{ fontSize: "15px", color: "#D4C0B1" }}>Изменить местоположение</h4>
        </div>
      </Button>

      {isOpen && (
        <div className="geo-overlay">
          <div className="geo-modal" ref={modalRef}>
            <h2>Выберите геопозицию</h2>
            <input
              ref={inputRef}
              type="text"
              placeholder="Введите адрес"
              style={{ padding: "10px", width: "100%", fontSize: "16px" }}
              onChange={(e) => fetchSuggestions(e.target.value)}
            />
            {suggestions.length > 0 && (
              <ul className="suggest-list">
                {suggestions.map((sug, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setAddress(sug.title.text);
                      setSuggestions([]);
                      setIsOpen(false);
                    }}
                  >
                    {sug.title.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
