import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    //  Theme setup
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.add(savedTheme);

    //  Auth check
    const token = localStorage.getItem("token");

    // Pages where user should NOT be redirected
    const publicRoutes = ["/signin", "/signup"];

    if (token && publicRoutes.includes(location.pathname)) {
      navigate("/dashboard");
    }

    // Loader timing
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] transition-colors duration-300">
      <Navbar />
      <Outlet />
    </div>
  );
}
