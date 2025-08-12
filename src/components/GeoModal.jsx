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
  const prevCoords = useRef(null);

  const { setAddress, address } = useContext(GeoContext);

  const modalRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const placemarkRef = useRef(null);
  const touchStartYRef = useRef(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

  // Получение координат из cookie
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
        console.error("Ошибка при парсинге координат из cookie:", e);
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

      // Обработка предложений
      const results = items.map((item) => {
        const geo = item.GeoObject;
        const coords = geo.Point.pos.split(" ").map(Number).reverse();

        // Получаем компоненты адреса
        const components =
          geo.metaDataProperty.GeocoderMetaData.Address.Components;

        let city =
          components.find((comp) => comp.kind === "locality")?.name || "";
        let street =
          components.find((comp) => comp.kind === "street")?.name || "";
        let house =
          components.find((comp) => comp.kind === "house")?.name || "";

        // Формируем строку адреса
        const formattedAddress = `${city}, ${street} ${house}`.trim();

        return {
          name: geo.name,
          description: geo.description,
          coords,
          formattedAddress, // Добавляем форматированный адрес
        };
      });

      setSuggestions(results); // Обновляем состояние
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    }
  };

  const handleSuggestionSelect = (item) => {
    setShouldFetch(false);
    setSearchText(`${item.name}`);
    setSuggestions([]);
    setMarkerCoords(item.coords);
    setAddress(`${item.formattedAddress}`);
  };

  // Подсказки
  useEffect(() => {
    if (!searchText.trim() || !shouldFetch) return;
    const delay = setTimeout(() => fetchGeocodeData(searchText), 700);
    return () => clearTimeout(delay);
  }, [searchText, shouldFetch]);

  // Геолокация браузера
  useEffect(() => {
    if (!navigator.geolocation || Cookies.get("cords")) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setMarkerCoords(coords);
      },
      (error) => {
        console.warn("Ошибка геолокации:", error.message);
      }
    );
  }, []); // пустой массив, эффект отработает только при монтировании

  useEffect(() => {
    if (!mapInstanceRef.current || !placemarkRef.current || !markerCoords)
      return;

    mapInstanceRef.current.setCenter(markerCoords);
    placemarkRef.current.geometry.setCoordinates(markerCoords);
  }, [markerCoords]);

  // Инициализация карты
  useEffect(() => {
    if (!isOpen || !mapRef.current || !markerCoords) return;

    const initMap = () => {
      if (mapInstanceRef.current) mapInstanceRef.current.destroy();

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
        const coords = placemark.geometry.getCoordinates();
        setMarkerCoords(coords);
      });

      map.geoObjects.add(placemark);
      // map.events.add("click", (e) => setMarkerCoords(e.get("coords")));

      mapInstanceRef.current = map;
      placemarkRef.current = placemark;

      const copyrights = document.querySelector(
        ".ymaps-2-1-79-copyrights-pane"
      );
      if (copyrights) copyrights.remove();
    };

    if (!window.ymaps) {
      const script = document.createElement("script");
      script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
      script.onload = () => window.ymaps.ready(initMap);
      document.head.appendChild(script);
    } else {
      window.ymaps.ready(initMap);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Геокодирование координат
  useEffect(() => {
    if (
      !markerCoords ||
      JSON.stringify(markerCoords) === JSON.stringify(prevCoords.current)
    )
      return;
    prevCoords.current = markerCoords;

    window.ymaps.ready(() => {
      window.ymaps.geocode(markerCoords).then((res) => {
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
          const street = firstGeoObject.getThoroughfare() || "";
          const house = firstGeoObject.getPremiseNumber() || "";
          const fullAddress = `${street} ${house}`.trim();
          setAddress(fullAddress);
          Cookies.set("cords", JSON.stringify(markerCoords), {
            expires: 7,
            sameSite: "Lax",
          });
        }
      });
    });
  }, [markerCoords]);

  // Свайп вниз для закрытия
  const handleTouchStart = (e) => {
    if (mapRef.current && mapRef.current.contains(e.target)) {
      touchStartYRef.current = null;
      return;
    }
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartYRef.current === null) return;
    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartYRef.current;
    if (distance > 0) {
      setSwipeDistance(distance);
      modalRef.current.style.transform = `translateY(${distance}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (swipeDistance > 100) {
      closeModal();
    } else {
      modalRef.current.style.transform = "";
    }
    touchStartYRef.current = null;
    setSwipeDistance(0);
  };

  return (
    <>
      <Button className="geo-btn" onClick={openModal}>
        <img src="/assets/icons/location.svg" alt="location" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h3 style={{ fontSize: "18px" }}>Мой адрес</h3>
          <h4 style={{ fontSize: "15px", color: "#D4C0B1" }}>
            {address ? address : "Определить автоматически"}
          </h4>
        </div>
      </Button>

      {isVisible && (
        <div
          className={`geo-overlay ${isOpen ? "show" : ""}`}
          onClick={closeModal}
        >
          <div
            className="geo-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* <label htmlFor="inp_geo_search"><h2>Введите адрес</h2></label> */}
            <input
              id="inp_geo_search"
              type="text"
              placeholder="Поиск"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShouldFetch(true);
              }}
              onKeyDown={(e) => {
                if (e.code == "Enter") {
                  console.log(e);
                  setSearchText(e.target.value);
                  setShouldFetch(true);
                }
              }}
            />
            {suggestions.length > 0 && (
              <ul className="geo-suggestions">
                {suggestions.map((item, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => handleSuggestionSelect(item)}
                    >
                      {item.formattedAddress}
                    </li>
                  );
                })}
              </ul>
            )}
            {/* <h3>Мое местоположение</h3> */}
            <div className="map-container" ref={mapRef} />

            <Button className="geo-btn-two" onClick={closeModal}>
              <img src="/assets/icons/location.svg" alt="location" width={34} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginLeft: "5px",
                }}
              >
                <h3 style={{ fontSize: "15px" }}>
                  Мой адрес: {address ? address : "Определить автоматически"}
                </h3>
                <h4 style={{ fontSize: "13px", color: "#D4C0B1" }}>
                  Изменить местоположение
                </h4>
              </div>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
