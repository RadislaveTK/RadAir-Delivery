import FormLogin from "../components/FormLogin";
import "../styles/Auth.css";

export default function Auth() {
  return (
    <main className="auth">
      <div className="auth-block">
        <img className="icon" src="/assets/Icon.png" alt="Icon" />
        <h1 className="title">Авторизация</h1>
        <FormLogin />
      </div>
    </main>
  );
}
