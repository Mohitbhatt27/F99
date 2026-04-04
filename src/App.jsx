import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import "./App.css";
import { api } from "../utils/api";
export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //  Theme setup
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.add(savedTheme);

    // OPTIONAL: verify token (real auth)
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await api.get("/profile");
      } catch {
        localStorage.removeItem("token");
      }
    };

    verifyUser();

    //  Loader timing
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] transition-colors duration-300">
      <Navbar />
      <Outlet />
    </div>
  );
}
