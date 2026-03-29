import { useState, useEffect } from "react";
import LandingPage from "../pages/LandingPage";
import Navbar from "../components/Navbar";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
      <Navbar />
      <LandingPage />
    </div>
  );
}
