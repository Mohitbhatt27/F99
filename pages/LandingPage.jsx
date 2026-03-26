import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#0B0F14] text-[#E6EDF3] overflow-x-hidden">
      {/* Spotlight */}
      <div className="spotlight" style={{ left: pos.x, top: pos.y }} />

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[700px] h-[700px] bg-[#00D1FF]/20 blur-[160px] rounded-full top-[5%] left-[5%] animate-glow"></div>
        <div className="absolute w-[600px] h-[600px] bg-[#7C5CFF]/20 blur-[160px] rounded-full bottom-[5%] right-[5%] animate-glow-reverse"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full flex justify-between items-center px-6 md:px-12 py-6 backdrop-blur-xl bg-[#0B0F14]/40 border-b border-[#1f2933]">
        <h1 className="text-xl font-bold text-[#00D1FF] tracking-wider">
          FIT2099
        </h1>

        <div className="hidden md:flex gap-6 items-center text-[#8B98A5] text-sm">
          <a href="#" className="hover:text-white transition">
            Home
          </a>
          <a href="#" className="hover:text-white transition">
            Programs
          </a>
          <a href="#" className="hover:text-white transition">
            Pricing
          </a>
          <a href="#" className="hover:text-white transition">
            Contact
          </a>

          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-[#1f2933] hover:border-[#00D1FF] hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-lg bg-[#00D1FF] text-black font-semibold shadow-[0_0_20px_#00D1FF] hover:shadow-[0_0_40px_#00D1FF] transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center mt-32 px-6">
        <h2 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl">
          Redefine Your{" "}
          <span className="bg-gradient-to-r from-[#00D1FF] via-[#7C5CFF] to-[#00D1FF] bg-clip-text text-transparent">
            Physique
          </span>
        </h2>

        <p className="text-[#8B98A5] mt-6 max-w-xl text-lg">
          Precision training. Intelligent tracking. Elite transformation.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <Link
            to="/signup"
            className="bg-[#00D1FF] text-black px-8 py-3 rounded-xl font-semibold transition hover:scale-105 shadow-[0_0_40px_#00D1FF]"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-[#7C5CFF] text-[#7C5CFF] px-8 py-3 rounded-xl hover:bg-[#7C5CFF]/10 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 w-full mt-32 px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="group bg-[#121821]/70 backdrop-blur-2xl p-6 rounded-2xl border border-[#1f2933] hover:border-[#00D1FF]/40 transition duration-300 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(0,209,255,0.2)]"
          >
            <div className="text-3xl mb-4" style={{ color: f.color }}>
              {f.icon}
            </div>

            <h3 className="text-xl font-semibold group-hover:text-white transition">
              {f.title}
            </h3>

            <p className="text-[#8B98A5] mt-2">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="relative z-10 mt-32 text-center px-6">
        <h3 className="text-4xl font-bold">Start Your Evolution</h3>

        <p className="text-[#8B98A5] mt-4">
          Join the next generation of fitness.
        </p>

        <Link
          to="/signup"
          className="mt-8 inline-block bg-[#00FF88] text-black px-10 py-3 rounded-xl font-semibold transition hover:scale-105 shadow-[0_0_40px_#00FF88]"
        >
          Join Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full mt-24 py-6 text-center text-[#8B98A5] text-sm border-t border-[#1f2933]">
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
    color: "#00D1FF",
  },
  {
    title: "AI Coaching",
    desc: "Adaptive training plans based on your performance.",
    icon: "🤖",
    color: "#7C5CFF",
  },
  {
    title: "Elite Physique",
    desc: "Designed for aesthetics, strength, and longevity.",
    icon: "🔥",
    color: "#FF3B3B",
  },
];

export default LandingPage;
