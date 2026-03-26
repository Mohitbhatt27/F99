import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import LandingPage from "../pages/LandingPage";
import "./App.css";
import Profile from "../components/Profile";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <Loader /> : <LandingPage />;
}

function Loader() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0B0F14] text-[#E6EDF3]">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-[#00D1FF]/20 rounded-full"></div>
        <div className="bg-[#121821] rounded-full px-8 py-4 flex items-center gap-3 shadow-2xl border border-[#1f2933]">
          <div className="w-3 h-3 bg-[#00D1FF] rounded-full animate-ping"></div>
          <p className="text-[#8B98A5] tracking-wide">Fitness redefined...</p>
        </div>
      </div>
    </div>
  );
}
