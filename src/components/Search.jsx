import React, { useState } from "react";

export default function Search() {
  const [value, setValue] = useState("");

  const handleSearch = (e) => {
    setValue(e.target.value);
  }

  return (
    <div className="search">
      <label htmlFor="inp_search">
        <img src="/assets/icons/search.svg" alt="search" />
      </label>
      <input
        id="inp_search"
        className="inp"
        type="search"
        placeholder="Поиск"
        value={value}
        onChange={handleSearch}
      />
    </div>
  );
}
