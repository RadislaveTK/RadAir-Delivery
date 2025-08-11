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

  const userInteractingRef = useRef(false);
  const panRequestedRef = useRef(false);

  // refs to store handler functions so we can remove them on destroy
  const actionBeginHandlerRef = useRef(null);
  const actionEndHandlerRef = useRef(null);
  const dragendHandlerRef = useRef(null);

  const touchStartYRef = useRef(null);

  const { setAddress, address } = useContext(GeoContext);

  // Инициализация координат из cookie (только один раз)
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
    // координаты по умолчанию
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

  // Подсказки (геокод)
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
      const items = data.response.GeoObjectCollection.featureMember || [];

      const results = items.map((item) => {
        const geo = item.GeoObject;
        const coords = geo.Point.pos.split(" ").map(Number).reverse();
        const components =
          geo.metaDataProperty.GeocoderMetaData.Address.Components || [];

        const city =
          components.find((c) => c.kind === "locality")?.name || "";
        const street =
          components.find((c) => c.kind === "street")?.name || "";
        const house =
          components.find((c) => c.kind === "house")?.name || "";

        return {
          name: geo.name,
          description: geo.description,
          coords,
          formattedAddress: `${city}, ${street} ${house}`.trim(),
        };
      });

      setSuggestions(results);
    } catch (error) {
      console.error("Ошибка при запросе подсказок:", error);
    }
  };

  const handleSuggestionSelect = (item) => {
    setShouldFetch(false);
    setSearchText(item.name);
    setSuggestions([]);
    // при выборе из подсказок считаем, что нужно подцентровать карту
    panRequestedRef.current = true;
    setMarkerCoords(item.coords);
    setAddress(item.name);
  };

  useEffect(() => {
    if (!searchText.trim() || !shouldFetch) return;
    const id = setTimeout(() => fetchGeocodeData(searchText), 700);
    return () => clearTimeout(id);
  }, [searchText, shouldFetch]);

  // Автогеолокация единоразово
  useEffect(() => {
    if (!navigator.geolocation || Cookies.get("cords")) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setMarkerCoords((prev) => {
          if (!prev || prev[0] !== coords[0] || prev[1] !== coords[1]) {
            // при автопозиции хотим подцентровать карту
            panRequestedRef.current = true;
            return coords;
          }
          return prev;
        });
      },
      (error) => {
        console.warn("Ошибка геолокации:", error.message);
      }
    );
  }, []);

  // Уничтожаем карту при закрытии модалки или размонтировании
  useEffect(() => {
    if (!isOpen && mapInstanceRef.current) {
      try {
        // удаляем слушатели с метки
        if (placemarkRef.current && dragendHandlerRef.current) {
          placemarkRef.current.events.remove("dragend", dragendHandlerRef.current);
        }
        // удаляем слушатели с карты
        if (mapInstanceRef.current) {
          if (actionBeginHandlerRef.current) {
            mapInstanceRef.current.events.remove("actionbegin", actionBeginHandlerRef.current);
          }
          if (actionEndHandlerRef.current) {
            mapInstanceRef.current.events.remove("actionend", actionEndHandlerRef.current);
          }
        }

        mapInstanceRef.current.destroy();
      } catch (e) {
        // игнорируем ошибки destroy
      } finally {
        mapInstanceRef.current = null;
        placemarkRef.current = null;
        actionBeginHandlerRef.current = null;
        actionEndHandlerRef.current = null;
        dragendHandlerRef.current = null;
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          if (placemarkRef.current && dragendHandlerRef.current) {
            placemarkRef.current.events.remove("dragend", dragendHandlerRef.current);
          }
          if (mapInstanceRef.current) {
            if (actionBeginHandlerRef.current) {
              mapInstanceRef.current.events.remove("actionbegin", actionBeginHandlerRef.current);
            }
            if (actionEndHandlerRef.current) {
              mapInstanceRef.current.events.remove("actionend", actionEndHandlerRef.current);
            }
          }
          mapInstanceRef.current.destroy();
        } catch (e) {}
        mapInstanceRef.current = null;
        placemarkRef.current = null;
      }
    };
  }, [isOpen]);

  // Инициализация/обновление карты (реактор + предотвращение конфликтов с пользователем)
  useEffect(() => {
    if (!isOpen || !mapRef.current || !markerCoords) return;

    const initOrUpdate = () => {
      // Если карта уже создана, просто обновляем метку и (при необходимости) центр
      if (mapInstanceRef.current) {
        try {
          if (placemarkRef.current) {
            placemarkRef.current.geometry.setCoordinates(markerCoords);
          }
          // Центрируем карту только если пользователь не взаимодействует или специально запрошено
          if (!userInteractingRef.current || panRequestedRef.current) {
            // setCenter без анимации (duration:0) — чтобы не дергать
            mapInstanceRef.current.setCenter(markerCoords, null, { duration: 0 });
            panRequestedRef.current = false;
          }
        } catch (e) {
          console.warn("Ошибка при обновлении карты:", e);
        }
        return;
      }

      // Создаём карту и метку
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

      // dragend: помечаем, что нужно паннуть и обновляем coords
      const dragHandler = () => {
        const coords = placemark.geometry.getCoordinates();
        panRequestedRef.current = true;
        setMarkerCoords(coords);
      };
      dragendHandlerRef.current = dragHandler;
      placemark.events.add("dragend", dragendHandlerRef.current);

      map.geoObjects.add(placemark);

      // слушатели actionbegin/actionend чтобы понять, взаимодействует ли пользователь
      const beginHandler = () => {
        userInteractingRef.current = true;
      };
      const endHandler = () => {
        // небольшая задержка, чтобы убедиться, что действие завершилось
        setTimeout(() => {
          userInteractingRef.current = false;
        }, 50);
      };
      actionBeginHandlerRef.current = beginHandler;
      actionEndHandlerRef.current = endHandler;
      map.events.add("actionbegin", actionBeginHandlerRef.current);
      map.events.add("actionend", actionEndHandlerRef.current);

      mapInstanceRef.current = map;
      placemarkRef.current = placemark;
    };

    // Подгружаем скрипт (один раз) и затем вызываем initOrUpdate
    if (!window.ymaps) {
      if (!document.querySelector("script[data-ymaps-loaded]")) {
        const script = document.createElement("script");
        script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
        script.setAttribute("data-ymaps-loaded", "1");
        script.onload = () => window.ymaps.ready(initOrUpdate);
        document.head.appendChild(script);
      } else {
        window.ymaps && window.ymaps.ready(initOrUpdate);
      }
    } else {
      window.ymaps.ready(initOrUpdate);
    }
  }, [isOpen, markerCoords]);

  // Геокодирование координат — дебаунс, чтобы не делать тонну запросов при быстрых изменениях
  useEffect(() => {
    if (
      !markerCoords ||
      JSON.stringify(markerCoords) === JSON.stringify(prevCoords.current)
    )
      return;

    prevCoords.current = markerCoords;

    const id = setTimeout(() => {
      if (!window.ymaps) return;
      window.ymaps.geocode(markerCoords).then((res) => {
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
          const street = firstGeoObject.getThoroughfare() || "";
          const house = firstGeoObject.getPremiseNumber() || "";
          const fullAddress = `${street} ${house}`.trim();
          setAddress(fullAddress);
          // сохраняем coords в cookie (или localStorage, если нужно)
          try {
            Cookies.set("cords", JSON.stringify(markerCoords), { expires: 7, sameSite: "Lax" });
          } catch (e) {
            // безопасный fallback
            localStorage.setItem("cords", JSON.stringify(markerCoords));
          }
        }
      });
    }, 350); // <- регулировать задержку: 350ms — обычно хороший компромисс

    return () => clearTimeout(id);
  }, [markerCoords, setAddress]);

  // Свайп вниз для закрытия (оставил как у тебя)
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
      if (modalRef.current) modalRef.current.style.transform = `translateY(${distance}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (swipeDistance > 100) {
      closeModal();
    } else if (modalRef.current) {
      modalRef.current.style.transform = "";
    }
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
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  setShouldFetch(true);
                }
              }}
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
