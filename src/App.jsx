import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(true);
  const savedTheme = localStorage.getItem("theme") || "dark";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.add(savedTheme);

    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] transition-colors duration-300">
      <Navbar />
      <Outlet />
    </div>
  );
}
