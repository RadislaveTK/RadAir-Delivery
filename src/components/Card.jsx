import { useNavigate } from "react-router-dom";
import "../styles/Card.css";

export default function Card({ children, ...props }) {
  const navigate = useNavigate();

  return (
    <button {...props} className="card" onClick={() => navigate(-1)}> 
      {children}
    </button>
  );
}
