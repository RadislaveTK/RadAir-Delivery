import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import PrivateRoute from "./stores/PrivateRoute";
import LoginRoute from "./stores/LoginRoute";
import Cart from "./pages/Cart";
import CategorySP from "./pages/CategorySP";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRoute element={<Auth />} />} />
        <Route
          path="/register"
          element={<LoginRoute element={<Register />} />}
        />
        <Route path="/search" element={<PrivateRoute element={<Search />} />} />
        <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
        {/* <Route path="/cart" element={<PrivateRoute element={<Cart />} />} /> */}
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} />}
        />
        <Route
          path="/fastfood"
          element={<CategorySP category="fastfood" />}
        />
        <Route
          path="/restouran"
          element={<CategorySP category="restouran" />}
        />
        <Route
          path="/products"
          element={<CategorySP category="products" />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
