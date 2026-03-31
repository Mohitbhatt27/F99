import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import logo from "../src/assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center border-b border-[var(--text-sub)]/20 bg-[var(--bg)]/80 backdrop-blur-md sticky top-0 z-50">
      {/*  Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center cursor-pointer"
      >
        <img
          src={logo}
          alt="Fitness2099"
          className="scale-550 h-10 w-10 object-contain hover:scale-600 transition-transform duration-200 ml-10"
        />
      </div>

      {/*  Nav Links */}
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
          to="/pricing"
          className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-white/10 transition-all duration-200"
        >
          Pricing
        </Link>

        <Link
          to="/contact"
          className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-white/10 transition-all duration-200"
        >
          Contact
        </Link>
      </div>

      {/*  Right Section */}
      <div className="flex items-center gap-3">
        {/* Login */}
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg border border-[var(--text-sub)]/30 hover:bg-white/10 transition-all duration-200"
        >
          Login
        </Link>

        {/* Signup */}
        <Link
          to="/signup"
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:scale-105 hover:shadow-[0_0_20px_var(--primary)] transition-all duration-200"
        >
          Sign Up
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
}
