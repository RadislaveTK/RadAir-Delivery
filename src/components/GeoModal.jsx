import React, { useState, useEffect, useRef, useContext } from "react";
import Button from "./Button";
import "../styles/GeoModal.css";
import { GeoContext } from "../stores/GeoContext";
import Cookies from "js-cookie";

export default function GeoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const prevCoords = useRef(null);
  const modalRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const placemarkRef = useRef(null);
  const touchStartYRef = useRef(null);

  const { setAddress, address } = useContext(GeoContext);

  // Инициализация координат из cookies
  useEffect(() => {
    const cord = Cookies.get("cords");
    if (cord) {
      try {
        const parsed = JSON.parse(cord);
        if (Array.isArray(parsed) && parsed.length === 2) {
          setMarkerCoords(parsed);
          return;
        }
      } catch (e) {
        console.error("Ошибка парсинга координат из cookie:", e);
      }
    }
    setMarkerCoords([54.8738652, 69.0780488]);
  }, []);

  const openModal = () => {
    setIsVisible(true);
    setTimeout(() => setIsOpen(true), 10);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  // Получение подсказок
  const fetchGeocodeData = async (query) => {
    const apiKey = "1384d8ed-dc59-4f30-bdc1-a6bec8a966eb";
    const bbox = "69.098888,54.840701~69.235726,54.906668";
    const url = `https://geocode-maps.yandex.ru/v1/?apikey=${apiKey}&geocode=${encodeURIComponent(
      query
    )}&format=json&bbox=${bbox}&rspn=1`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
      const data = await response.json();
      const items = data.response.GeoObjectCollection.featureMember;

      setSuggestions(
        items.map((item) => {
          const geo = item.GeoObject;
          const coords = geo.Point.pos.split(" ").map(Number).reverse();
          const components =
            geo.metaDataProperty.GeocoderMetaData.Address.Components;

          const city =
            components.find((c) => c.kind === "locality")?.name || "";
          const street =
            components.find((c) => c.kind === "street")?.name || "";
          const house =
            components.find((c) => c.kind === "house")?.name || "";

          return {
            name: geo.name,
            coords,
            formattedAddress: `${city}, ${street} ${house}`.trim(),
          };
        })
      );
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    }
  };

  const handleSuggestionSelect = (item) => {
    setShouldFetch(false);
    setSearchText(item.name);
    setSuggestions([]);
    setMarkerCoords(item.coords);
    setAddress(item.name);
  };

  useEffect(() => {
    if (!searchText.trim() || !shouldFetch) return;
    const delay = setTimeout(() => fetchGeocodeData(searchText), 700);
    return () => clearTimeout(delay);
  }, [searchText, shouldFetch]);

  // Автогеолокация
  useEffect(() => {
    if (!navigator.geolocation || Cookies.get("cords")) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setMarkerCoords((prev) => {
          if (!prev || prev[0] !== coords[0] || prev[1] !== coords[1]) {
            return coords;
          }
          return prev;
        });
      },
      (error) => console.warn("Ошибка геолокации:", error.message)
    );
  }, []);

  // Уничтожение карты при закрытии
  useEffect(() => {
    if (!isOpen && mapInstanceRef.current) {
      mapInstanceRef.current.destroy();
      mapInstanceRef.current = null;
      placemarkRef.current = null;
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
        placemarkRef.current = null;
      }
    };
  }, [isOpen]);

  // Инициализация/обновление карты
  useEffect(() => {
    if (!isOpen || !mapRef.current || !markerCoords) return;

    const initOrUpdate = () => {
      if (mapInstanceRef.current) {
        placemarkRef.current?.geometry.setCoordinates(markerCoords);
        mapInstanceRef.current.setCenter(markerCoords);
        return;
      }

      const map = new window.ymaps.Map(mapRef.current, {
        center: markerCoords,
        zoom: 17,
        controls: [],
      });

      const placemark = new window.ymaps.Placemark(
        markerCoords,
        { balloonContent: "Вы здесь" },
        { preset: "islands#redIcon", draggable: true }
      );

      placemark.events.add("dragend", () => {
        setMarkerCoords(placemark.geometry.getCoordinates());
      });

      map.geoObjects.add(placemark);
      mapInstanceRef.current = map;
      placemarkRef.current = placemark;
    };

    if (!window.ymaps) {
      if (!document.querySelector("script[data-ymaps-loaded]")) {
        const script = document.createElement("script");
        script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
        script.setAttribute("data-ymaps-loaded", "1");
        script.onload = () => window.ymaps.ready(initOrUpdate);
        document.head.appendChild(script);
      } else {
        window.ymaps.ready(initOrUpdate);
      }
    } else {
      window.ymaps.ready(initOrUpdate);
    }
  }, [isOpen, markerCoords]);

  // Геокодирование координат
  useEffect(() => {
    if (!markerCoords || JSON.stringify(markerCoords) === JSON.stringify(prevCoords.current)) return;
    prevCoords.current = markerCoords;

    window.ymaps.ready(() => {
      window.ymaps.geocode(markerCoords).then((res) => {
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
          const street = firstGeoObject.getThoroughfare() || "";
          const house = firstGeoObject.getPremiseNumber() || "";
          const fullAddress = `${street} ${house}`.trim();
          setAddress(fullAddress);
          Cookies.set("cords", JSON.stringify(markerCoords), { expires: 7, sameSite: "Lax" });
        }
      });
    });
  }, [markerCoords, setAddress]);

  // Свайп вниз
  const handleTouchStart = (e) => {
    if (mapRef.current?.contains(e.target)) {
      touchStartYRef.current = null;
      return;
    }
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartYRef.current === null) return;
    const distance = e.touches[0].clientY - touchStartYRef.current;
    if (distance > 0) {
      setSwipeDistance(distance);
      modalRef.current.style.transform = `translateY(${distance}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (swipeDistance > 100) closeModal();
    else modalRef.current.style.transform = "";
    touchStartYRef.current = null;
    setSwipeDistance(0);
  };

  return (
    <>
      <Button className="geo-btn" onClick={openModal}>
        <img src="/assets/icons/location.svg" alt="location" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h3 style={{ fontSize: "18px" }}>Мой адрес</h3>
          <h4 style={{ fontSize: "15px", color: "#D4C0B1" }}>
            {address || "Определить автоматически"}
          </h4>
        </div>
      </Button>

      {isVisible && (
        <div className={`geo-overlay ${isOpen ? "show" : ""}`} onClick={closeModal}>
          <div
            className="geo-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <input
              id="inp_geo_search"
              type="text"
              placeholder="Поиск"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShouldFetch(true);
              }}
              onKeyDown={(e) => e.code === "Enter" && setShouldFetch(true)}
            />
            {suggestions.length > 0 && (
              <ul className="geo-suggestions">
                {suggestions.map((item, index) => (
                  <li key={index} onClick={() => handleSuggestionSelect(item)}>
                    {item.formattedAddress}
                  </li>
                ))}
              </ul>
            )}

            <div className="map-container" ref={mapRef} />

            <Button className="geo-btn-two" onClick={closeModal}>
              <img src="/assets/icons/location.svg" alt="location" width={34} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: "5px" }}>
                <h3 style={{ fontSize: "15px" }}>
                  Мой адрес: {address || "Определить автоматически"}
                </h3>
                <h4 style={{ fontSize: "13px", color: "#D4C0B1" }}>Изменить местоположение</h4>
              </div>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
