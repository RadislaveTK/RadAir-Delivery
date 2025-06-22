import { useNavigate } from "react-router-dom";

export default function CardProduct({ children, ...props }) {
  const navigate = useNavigate();

  return (
    <button {...props} className="card" onClick={() => navigate(-1)}> 
      {children}
    </button>
  );
}
