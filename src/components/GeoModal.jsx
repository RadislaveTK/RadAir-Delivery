import React, { useState, useRef, useContext, useEffect } from "react";
import Button from "./Button";
import "../styles/GeoModal.css";
import { GeoContext } from "../stores/GeoContext";
import Cookies from "js-cookie";

export default function GeoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { setAddress, address } = useContext(GeoContext);

  const modalRef = useRef(null);
  const mapRef = useRef(null);
  const markerCoordsRef = useRef([54.8738652, 69.0780488]);
  const placemarkRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Загружаем координаты из куки
  useEffect(() => {
    const cord = Cookies.get("cords");
    if (cord) {
      try {
        const parsed = JSON.parse(cord);
        if (Array.isArray(parsed) && parsed.length === 2) {
          markerCoordsRef.current = parsed;
        }
      } catch (e) {
        console.error("Ошибка парсинга координат:", e);
      }
    }
  }, []);

  // Инициализация карты один раз
  useEffect(() => {
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
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    const map = new window.ymaps.Map(mapRef.current, {
      center: markerCoordsRef.current,
      zoom: 17,
      controls: [],
    });

    const placemark = new window.ymaps.Placemark(
      markerCoordsRef.current,
      { balloonContent: "Вы здесь" },
      { preset: "islands#redIcon", draggable: true }
    );

    placemark.events.add("dragend", () => {
      const coords = placemark.geometry.getCoordinates();
      markerCoordsRef.current = coords;
      saveCoords(coords);
    });

    map.geoObjects.add(placemark);

    mapInstanceRef.current = map;
    placemarkRef.current = placemark;
  };

  const saveCoords = (coords) => {
    Cookies.set("cords", JSON.stringify(coords), {
      expires: 7,
      sameSite: "Lax",
    });

    if (window.ymaps) {
      window.ymaps.geocode(coords).then((res) => {
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
          const street = firstGeoObject.getThoroughfare() || "";
          const house = firstGeoObject.getPremiseNumber() || "";
          const fullAddress = `${street} ${house}`.trim();
          setAddress(fullAddress);
        }
      });
    }
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

      const results = items.map((item) => {
        const geo = item.GeoObject;
        const coords = geo.Point.pos.split(" ").map(Number).reverse();
        const components =
          geo.metaDataProperty.GeocoderMetaData.Address.Components;

        let city = components.find((c) => c.kind === "locality")?.name || "";
        let street = components.find((c) => c.kind === "street")?.name || "";
        let house = components.find((c) => c.kind === "house")?.name || "";

        return {
          coords,
          formattedAddress: `${city}, ${street} ${house}`.trim(),
        };
      });

      setSuggestions(results);
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    }
  };

  const handleSuggestionSelect = (item) => {
    markerCoordsRef.current = item.coords;
    saveCoords(item.coords);

    if (placemarkRef.current && mapInstanceRef.current) {
      placemarkRef.current.geometry.setCoordinates(item.coords);
      mapInstanceRef.current.setCenter(item.coords, 17);
    }

    setSuggestions([]);
  };

  return (
    <>
      <Button className="geo-btn" onClick={() => { setIsVisible(true); setTimeout(() => setIsOpen(true), 10); }}>
        <img src="/assets/icons/location.svg" alt="location" />
        <div>
          <h3>Мой адрес</h3>
          <h4>{address || "Определить автоматически"}</h4>
        </div>
      </Button>

      {isVisible && (
        <div
          className={`geo-overlay ${isOpen ? "show" : ""}`}
          onClick={() => { setIsOpen(false); setTimeout(() => setIsVisible(false), 300); }}
        >
          <div
            className="geo-modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Поиск"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (e.target.value.trim()) {
                  fetchGeocodeData(e.target.value);
                }
              }}
            />
            {suggestions.length > 0 && (
              <ul className="geo-suggestions">
                {suggestions.map((item, i) => (
                  <li key={i} onClick={() => handleSuggestionSelect(item)}>
                    {item.formattedAddress}
                  </li>
                ))}
              </ul>
            )}
            <div className="map-container" ref={mapRef} />
            <Button className="geo-btn-two" onClick={() => { setIsOpen(false); setTimeout(() => setIsVisible(false), 300); }}>
              <img src="/assets/icons/location.svg" alt="location" width={34} />
              <div>
                <h3>Мой адрес: {address || "Определить автоматически"}</h3>
                <h4>Изменить местоположение</h4>
              </div>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
