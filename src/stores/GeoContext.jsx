import React, { createContext, useState } from "react";

export const GeoContext = createContext();

export const GeoProvider = ({ children }) => {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");

  return (
    <GeoContext.Provider value={{ coords, setCoords, address, setAddress }}>
      {children}
    </GeoContext.Provider>
  );
};
