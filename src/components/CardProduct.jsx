import { useNavigate } from "react-router-dom";

export default function CardProduct({ children, ...props }) {
  const navigate = useNavigate();

  return (
    <div {...props} className="card" onClick={() => navigate(-1)}> 
      {children}
    </div>
  );
}
