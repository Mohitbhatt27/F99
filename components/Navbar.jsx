import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../src/utils/api";
import ThemeToggle from "./ThemeToggle";
import logo from "../src/assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const check = () => setIsLoggedIn(!!localStorage.getItem("token"));
    check();

    window.addEventListener("storage", check);
    window.addEventListener("auth-changed", check);

    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("auth-changed", check);
    };
  }, [location.pathname]);

  const clearBrowserCookies = () => {
    const cookies = document.cookie ? document.cookie.split(";") : [];

    cookies.forEach((cookie) => {
      const separatorIndex = cookie.indexOf("=");
      const cookieName =
        separatorIndex > -1
          ? cookie.slice(0, separatorIndex).trim()
          : cookie.trim();

      if (!cookieName) return;

      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
    });
  };

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if API call fails, clear token and redirect
    } finally {
      localStorage.clear();
      clearBrowserCookies();
      window.dispatchEvent(new Event("auth-changed"));
      setIsLoggedIn(false);
      setLoggingOut(false);
      navigate("/");
    }
  }

  return (
    <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center border-b border-[var(--text-sub)]/20 bg-[var(--bg)]/80 backdrop-blur-md sticky top-0 z-50">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center cursor-pointer"
      >
        <img
          src={logo}
          alt="Fitness2099"
          className="h-10 w-10 object-contain scale-[5] hover:scale-[5.6] transition-transform duration-200 ml-10"
        />
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex gap-6 items-center">
        <Link
          to="/"
          className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-white/10 transition-all duration-200"
        >
          Home
        </Link>
        <Link
          to="/programs"
          className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-white/10 transition-all duration-200"
        >
          Programs
        </Link>
        <Link
          to="/contact"
          className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-white/10 transition-all duration-200"
        >
          Contact
        </Link>
        {isLoggedIn && (
          <>
            <Link
              to="/profile"
              className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-white/10 transition-all duration-200"
            >
              Profile
            </Link>
            <Link
              to="/progress-photos"
              className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-white/10 transition-all duration-200"
            >
              Progress
            </Link>
            <Link
              to="/llogs"
              className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-white/10 transition-all duration-200"
            >
              Logs
            </Link>
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-[var(--text-sub)]/30 hover:bg-white/10 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-black hover:scale-105 hover:shadow-[0_0_20px_var(--primary)] transition-all duration-200"
            >
              Sign Up
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
