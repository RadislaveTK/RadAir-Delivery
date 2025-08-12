import React, { useState, useRef, useContext, useEffect, useCallback } from "react";
import Button from "./Button";
import "../styles/GeoModal.css";
import { GeoContext } from "../stores/GeoContext";
import Cookies from "js-cookie";

export default function GeoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [markerCoords, setMarkerCoords] = useState([54.8738652, 69.0780488]);

  const { setAddress, address } = useContext(GeoContext);

  const modalRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const placemarkRef = useRef(null);
  const ymapsLoaded = useRef(false);

  // Загружаем координаты из cookie
  useEffect(() => {
    const cord = Cookies.get("cords");
    if (cord) {
      try {
        const parsed = JSON.parse(cord);
        if (Array.isArray(parsed) && parsed.length === 2) {
          setMarkerCoords(parsed);
        }
      } catch (e) {
        console.error("Ошибка парсинга координат:", e);
      }
    }
  }, []);

  const loadYmaps = useCallback((callback) => {
    if (window.ymaps && ymapsLoaded.current) {
      window.ymaps.ready(callback);
      return;
    }
    if (!document.querySelector("#ymaps-script")) {
      const script = document.createElement("script");
      script.id = "ymaps-script";
      script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
      script.onload = () => {
        ymapsLoaded.current = true;
        window.ymaps.ready(callback);
      };
      document.head.appendChild(script);
    }
  }, []);

  const initMap = useCallback(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
        center: markerCoords,
        zoom: 17,
        controls: [],
      });

      placemarkRef.current = new window.ymaps.Placemark(
        markerCoords,
        { balloonContent: "Вы здесь" },
        { preset: "islands#redIcon", draggable: true }
      );

      placemarkRef.current.events.add("dragend", () => {
        const coords = placemarkRef.current.geometry.getCoordinates();
        setMarkerCoords(coords);
        saveCoords(coords);
      });

      mapInstanceRef.current.geoObjects.add(placemarkRef.current);

      // Убираем копирайты Яндекс
      const observer = new MutationObserver(() => {
        const copyrights = document.querySelector(".ymaps-2-1-79-copyrights-pane");
        if (copyrights) copyrights.remove();
      });
      observer.observe(mapRef.current, { childList: true, subtree: true });
    } else {
      mapInstanceRef.current.setCenter(markerCoords);
      placemarkRef.current.geometry.setCoordinates(markerCoords);
    }
  }, [markerCoords]);

  const saveCoords = (coords) => {
    Cookies.set("cords", JSON.stringify(coords), { expires: 7, sameSite: "Lax" });
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

  const fetchGeocodeData = useCallback(async (query) => {
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
        const components = geo.metaDataProperty.GeocoderMetaData.Address.Components;
        let city = components.find((c) => c.kind === "locality")?.name || "";
        let street = components.find((c) => c.kind === "street")?.name || "";
        let house = components.find((c) => c.kind === "house")?.name || "";
        return { coords, formattedAddress: `${city}, ${street} ${house}`.trim() };
      });

      setSuggestions(results);
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    }
  }, []);

  // Debounce поиск
  useEffect(() => {
    if (!searchText.trim()) return;
    const delay = setTimeout(() => fetchGeocodeData(searchText), 500);
    return () => clearTimeout(delay);
  }, [searchText, fetchGeocodeData]);

  const openModal = () => {
    setIsVisible(true);
    setTimeout(() => setIsOpen(true), 10);
    loadYmaps(initMap);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleSuggestionSelect = (item) => {
    setMarkerCoords(item.coords);
    saveCoords(item.coords);
    setSuggestions([]);
  };

  return (
    <>
      <Button className="geo-btn" onClick={openModal}>
        <img src="/assets/icons/location.svg" alt="location" />
        <div>
          <h3>Мой адрес</h3>
          <h4>{address || "Определить автоматически"}</h4>
        </div>
      </Button>

      {isVisible && (
        <div className={`geo-overlay ${isOpen ? "show" : ""}`} onClick={closeModal}>
          <div className="geo-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Поиск"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
            <Button className="geo-btn-two" onClick={closeModal}>
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
