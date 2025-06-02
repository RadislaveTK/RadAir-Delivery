import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import "../styles/GeoModal.css";
import { useContext } from "react";
import { GeoContext } from "../stores/GeoContext";

export default function GeoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [markerCoords, setMarkerCoords] = useState(null);

  const { setAddress, address } = useContext(GeoContext);

  const modalRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const placemarkRef = useRef(null);
  const touchStartYRef = useRef(null);
  const [swipeDistance, setSwipeDistance] = useState(0);

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

      const results = items.map((item) => {
        const geo = item.GeoObject;
        const coords = geo.Point.pos.split(" ").map(Number).reverse();
        return {
          name: geo.name,
          description: geo.description,
          coords,
        };
      });

      setSuggestions(results);
    } catch (error) {
      console.error("Ошибка при запросе:", error);
    }
  };

  const handleSuggestionSelect = (item) => {
    setShouldFetch(false); // отключаем fetch
    setSearchText(`${item.description}, ${item.name}`);
    setSuggestions([]);
    setMarkerCoords(item.coords);

    setAddress(`${item.description}, ${item.name}`);
  };

  useEffect(() => {
    if (!searchText.trim() || !shouldFetch) return;

    const delayDebounce = setTimeout(() => {
      fetchGeocodeData(searchText);
    }, 700);

    return () => clearTimeout(delayDebounce);
  }, [searchText, shouldFetch]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setMarkerCoords([54.861865, 69.139635]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setMarkerCoords([pos.coords.latitude, pos.coords.longitude]),
      () => setMarkerCoords([54.861865, 69.139635])
    );
  }, []);

  useEffect(() => {
    if (!isOpen || !mapRef.current || !markerCoords) return;

    const initMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }

      const map = new window.ymaps.Map(mapRef.current, {
        center: markerCoords,
        zoom: 17,
        controls: [],
      });

      const placemark = new window.ymaps.Placemark(
        markerCoords,
        {
          balloonContent: `Вы здесь`,
        },
        {
          preset: "islands#redIcon",
          draggable: true,
        }
      );
      console.log(placemark);

      placemark.events.add("dragend", () => {
        const coords = placemark.geometry.getCoordinates();
        setMarkerCoords(coords);
      });

      map.geoObjects.add(placemark);
      map.events.add("click", (e) => {
        const coords = e.get("coords");
        setMarkerCoords(coords);
      });

      mapInstanceRef.current = map;
      placemarkRef.current = placemark;
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
  }, [isOpen, markerCoords]);

  useEffect(() => {
    window.ymaps.ready(() => {
      window.ymaps
        .geocode(markerCoords)
        .then((res) => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            const address = `${firstGeoObject.getThoroughfare()} ${
              firstGeoObject.getPremiseNumber()
                ? firstGeoObject.getPremiseNumber()
                : ""
            }`;

            setAddress(address);
          }
        })
        .catch((err) => {
          console.error("Ошибка при геокодировании:", err);
        });

      document.getElementsByClassName("ymaps-2-1-79-copyrights-pane")[0].remove();
    });
  }, [markerCoords]);

  const handleTouchStart = (e) => {
    if (mapRef.current && mapRef.current.contains(e.target)) {
      touchStartYRef.current = null; // игнорировать свайп
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
            <label htmlFor="inp_geo_search">
              <h2>Введите адрес</h2>
            </label>
            <input
              id="inp_geo_search"
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShouldFetch(true);
              }}
            />
            {suggestions.length > 0 && (
              <ul className="geo-suggestions">
                {suggestions.map((item, index) => (
                  <li key={index} onClick={() => handleSuggestionSelect(item)}>
                    {item.description}, {item.name}
                  </li>
                ))}
              </ul>
            )}

            <h3>Мое местоположение</h3>
            <div className="map-container" ref={mapRef} />
          </div>
        </div>
      )}
    </>
  );
}
