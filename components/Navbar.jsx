import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const toggleTheme = () => {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center border-b border-[var(--text-sub)]/20 bg-[var(--bg)] sticky top-0 backdrop-blur-md z-50">
      {/* Logo */}
      <h1 className="text-xl font-bold">
        Fitness<span className="text-[var(--primary)]">2099</span>
      </h1>

      {/* Nav Links */}
      <div className="hidden md:flex gap-6 items-center">
        <Link
          to="/"
          className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
        >
          Home
        </Link>

        <Link
          to="/programs"
          className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
        >
          Programs
        </Link>

        <Link
          to="/pricing"
          className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
        >
          Pricing
        </Link>

        <Link
          to="/contact"
          className="px-3 py-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--primary)] hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
        >
          Contact
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Login */}
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg border border-[var(--text-sub)]/30 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
        >
          Login
        </Link>

        {/* Signup */}
        <Link
          to="/signup"
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:scale-105 transition-all duration-200"
        >
          Sign Up
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
}
