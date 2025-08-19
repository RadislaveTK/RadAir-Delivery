import { useNavigate } from "react-router-dom";
import "../styles/BackBtn.css";

export default function BackBtn() {
  const navigate = useNavigate();

  return (
    <button className="back-btn" onClick={() => navigate(-1)}>
      <img src="/assets/icons/undo.svg" width={20} alt="img" />
      Назад
    </button>
  );
}
