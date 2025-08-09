import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import './index.css';
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import PrivateRoute from "./stores/PrivateRoute";
import LoginRoute from "./stores/LoginRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" lement={<LoginRoute element={<Auth />} />}  />
        <Route path="/register" lement={<LoginRoute element={<Register />} />}  />
        <Route path="/search" element={<PrivateRoute element={<Search />} />} />
        <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
