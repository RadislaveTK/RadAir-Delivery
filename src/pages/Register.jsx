import React from "react";
import FormRegister from "../components/FormRegister";

export default function Register() {
  return (
    <main className="auth">
      <div className="auth-block">
        <img src="/assets/Icon.png" style={{ width: "120px" }} />
        <h1
          style={{
            color: "#963736",
            textShadow: "2px 2px 0px #ff9800, 0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          Регистрация
        </h1>
        <FormRegister />
      </div>
    </main>
  );
}
