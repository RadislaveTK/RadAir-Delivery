// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../stores/AuthContext";

const PrivateRoute = ({ element }) => {
  const { user } = useAuth();

  if (user === null) {
    // Всё ещё загружается
    return <div>Загрузка...</div>;
  }

  if (user === false) {
    // Не авторизован
    return <Navigate to="/login" replace />;
  }

  // Авторизован
  return element;
};

export default PrivateRoute;
