import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const GeoContext = createContext();

export const GeoProvider = ({ children }) => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const cords = Cookies.get("cords");
    if (!cords) return;

    try {
      const coords = JSON.parse(cords);

      if (window.ymaps) {
        window.ymaps.ready(() => {
          window.ymaps.geocode(coords).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject) {
              const street = firstGeoObject.getThoroughfare() || "";
              const house = firstGeoObject.getPremiseNumber() || "";
              const fullAddress = `${street} ${house}`.trim();
              setAddress(fullAddress);
            }
          });
        });
      }
    } catch (e) {
      console.warn("Ошибка при обработке координат из cookie:", e);
    }
  }, []);

  return (
    <GeoContext.Provider value={{ address, setAddress }}>
      {children}
    </GeoContext.Provider>
  );
};
