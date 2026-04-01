import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import "./App.css";

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
        const res = await fetch(
          "https://connectusonfitness.onrender.com/api/v1/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // If token invalid → logout
        if (!res.ok) {
          localStorage.removeItem("token");
        }
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
