import React, { createContext, useState, useEffect } from "react";

export const GeoContext = createContext();

export function GeoProvider({ children }) {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Геолокация не поддерживается");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords([latitude, longitude]);
      },
      (err) => {
        console.error("Ошибка получения геолокации:", err.message);
      }
    );
  }, []);

  useEffect(() => {
    if (!coords) return;

    if (!window.ymaps) {
      console.error("ymaps не загружен");
      return;
    }

    window.ymaps.ready(() => {
      window.ymaps.geocode(coords).then(
        (res) => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            const formattedAddress = firstGeoObject.getAddressLine();
            setAddress(formattedAddress);
            console.log("Адрес по координатам:", formattedAddress);
          } else {
            setAddress("Адрес не найден");
          }
        },
        (error) => {
          console.error("Ошибка геокодирования:", error);
          setAddress("Ошибка при определении адреса");
        }
      );
    });
  }, [coords]);

  return (
    <GeoContext.Provider value={{ coords, address }}>
      {children}
    </GeoContext.Provider>
  );
}
