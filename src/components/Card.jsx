import { useNavigate } from "react-router-dom";

export default function Card() {
  const navigate = useNavigate();

  return (
    <button className="card" onClick={() => navigate(-1)}>
      <img src="/assets/icons/undo.svg" width={25} />
      Назад
    </button>
  );
}
