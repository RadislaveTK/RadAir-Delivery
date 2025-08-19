import FormRegister from "../components/FormRegister";
import "../styles/Auth.css";

export default function Register() {
  return (
    <main className="auth">
      <div className="auth-block">
        <img src="/assets/Icon.png" className="icon" alt="Icon" />
        <h1 className="title">Регистрация</h1>
        <FormRegister />
      </div>
    </main>
  );
}
