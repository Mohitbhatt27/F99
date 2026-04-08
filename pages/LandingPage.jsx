import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function LandingPage() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);
    window.addEventListener("auth-changed", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
      window.removeEventListener("auth-changed", checkAuth);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[var(--bg)] text-[var(--text-main)] overflow-x-hidden">
      {/* Spotlight */}
      <div className="spotlight" style={{ left: pos.x, top: pos.y }} />
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[700px] h-[700px] bg-[var(--primary)]/20 blur-[160px] rounded-full top-[5%] left-[5%] animate-glow"></div>
        <div className="absolute w-[600px] h-[600px] bg-[var(--secondary)]/20 blur-[160px] rounded-full bottom-[5%] right-[5%] animate-glow-reverse"></div>
      </div>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center mt-32 px-6">
        <h2 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl">
          Redefine Your{" "}
          <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">
            Physique
          </span>
        </h2>

        <p className="text-[var(--text-sub)] mt-6 max-w-xl text-lg">
          Precision training. Intelligent tracking. Elite transformation.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-semibold transition hover:scale-105 shadow-lg"
              >
                Go to Profile
              </Link>

              <Link
                to="/programs"
                className="border border-[var(--secondary)] text-[var(--secondary)] px-8 py-3 rounded-xl hover:bg-[var(--secondary)]/10 transition"
              >
                Explore Programs
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl font-semibold transition hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="border border-[var(--secondary)] text-[var(--secondary)] px-8 py-3 rounded-xl hover:bg-[var(--secondary)]/10 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>
      {/* Features */}
      <section className="relative z-10 w-full mt-32 px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="group bg-[var(--card)]/70 backdrop-blur-2xl p-6 rounded-2xl border border-[var(--text-sub)]/20 hover:border-[var(--primary)]/40 transition duration-300 hover:scale-[1.05]"
          >
            <div className="text-3xl mb-4" style={{ color: f.color }}>
              {f.icon}
            </div>

            <h3 className="text-xl font-semibold group-hover:text-[var(--text-main)] transition">
              {f.title}
            </h3>

            <p className="text-[var(--text-sub)] mt-2">{f.desc}</p>
          </div>
        ))}
      </section>
      {/* CTA */}
      <section className="relative z-10 mt-32 text-center px-6">
        <h3 className="text-4xl font-bold">
          {isLoggedIn ? "Keep Your Momentum" : "Start Your Evolution"}
        </h3>

        <p className="text-[var(--text-sub)] mt-4">
          {isLoggedIn
            ? "Jump back in and log your next session."
            : "Join the next generation of fitness."}
        </p>

        <Link
          to={isLoggedIn ? "/workout" : "/signup"}
          className="mt-8 inline-block bg-[var(--success)] text-black px-10 py-3 rounded-xl font-semibold transition hover:scale-105 shadow-lg"
        >
          {isLoggedIn ? "Open Workout" : "Join Now"}
        </Link>
      </section>
      {/* Footer */}
      <footer className="relative z-10 w-full mt-24 py-6 text-center text-[var(--text-sub)] text-sm border-t border-[var(--text-sub)]/20">
        © 2026 FIT2099. Built for dominance.
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Smart Tracking",
    desc: "Track calories, workouts, and progress with precision.",
    icon: "📊",
    color: "#00D1FF"
  },
  {
    title: "AI Coaching",
    desc: "Adaptive training plans based on your performance.",
    icon: "🤖",
    color: "#7C5CFF"
  },
  {
    title: "Elite Physique",
    desc: "Designed for aesthetics, strength, and longevity.",
    icon: "🔥",
    color: "#FF3B3B"
  }
];

export default LandingPage;
