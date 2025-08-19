import { useNavigate } from "react-router-dom";
import "../styles/CardCategory.css";

export default function CardCategory({ children, url, ...props }) {
  const navigate = useNavigate();

  return (
    <button {...props} className="card-category" onClick={() => navigate(url)}> 
      {children}
    </button>
  );
}
