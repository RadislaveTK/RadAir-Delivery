import { useNavigate } from "react-router-dom";
import "../styles/Card.css";

export default function Card({ children, url, ...props }) {
  const navigate = useNavigate();

  return (
    <button {...props} className="card" onClick={() => navigate(url)}> 
      {children}
    </button>
  );
}
