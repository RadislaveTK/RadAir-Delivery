// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../stores/AuthContext";

const LoginRoute = ({ element }) => {
  const { user } = useAuth();

  if (user === null) {
    // Всё ещё загружается
    return <div>Загрузка...</div>;
  }

  if (user === true) {
    // Авторизован
    return <Navigate to="/" replace />;
  }

  // Авторизован
  return element;
};

export default LoginRoute;
