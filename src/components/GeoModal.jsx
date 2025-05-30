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

  const [markerCoords, setMarkerCoords] = useState(null);
  const { setAddress, setCoords } = useContext(GeoContext);

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
    const url = `https://geocode-maps.yandex.ru/v1/?apikey=${apiKey}&geocode=${encodeURIComponent(query)}&format=json`;

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
    setSearchText(`${item.description}, ${item.name}`);
    setSuggestions([]);
    setMarkerCoords(item.coords);
  };

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
    if (!searchText.trim()) return;
    const delay = setTimeout(() => fetchGeocodeData(searchText), 700);
    return () => clearTimeout(delay);
  }, [searchText]);

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
    if (!markerCoords || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    map.geoObjects.removeAll();

    const placemark = new window.ymaps.Placemark(
      markerCoords,
      {
        balloonContent: `Вы выбрали точку: ${markerCoords[0].toFixed(5)}, ${markerCoords[1].toFixed(5)}`,
      },
      {
        preset: "islands#blueIcon",
        draggable: true,
      }
    );

    placemark.events.add("dragend", () => {
      const coords = placemark.geometry.getCoordinates();
      setMarkerCoords(coords);
    });

    map.geoObjects.add(placemark);
    map.setCenter(markerCoords, 17);
    placemarkRef.current = placemark;

  }, [markerCoords]);



  useEffect(() => {
    console.log(markerCoords);
    window.ymaps.ready(() => {
      window.ymaps.geocode(markerCoords)
        .then((res) => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            const address = firstGeoObject.getAddressLine();
            console.log("Адрес по координатам:", address);
          }
        })
        .catch((err) => {
          console.error("Ошибка при геокодировании:", err);
        });
    });


  }, [markerCoords]);




  const handleTouchStart = (e) => {
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h3 style={{ fontSize: "18px" }}>Мой адрес</h3>
          <h4 style={{ fontSize: "15px", color: "#D4C0B1" }}>
            Определить автоматически
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
              <h2>Введите адресс</h2>
            </label>
            <input
              id="inp_geo_search"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
