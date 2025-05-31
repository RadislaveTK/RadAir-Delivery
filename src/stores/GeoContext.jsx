import React, { createContext, useState } from "react";

export const GeoContext = createContext();

export const GeoProvider = ({ children }) => {
  const [address, setAddress] = useState("Петропавловск");

  return (
    <GeoContext.Provider value={{ address, setAddress }}>
      {children}
    </GeoContext.Provider>
  );
};
