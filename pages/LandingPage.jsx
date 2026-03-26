import { useEffect, useState } from "react";

function LandingPage() {
  return (
    <div className="w-screen min-h-screen bg-[#0B0F14] text-[#E6EDF3] overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#7C5CFF]/20 blur-[120px] rounded-full"></div>

      {/* Navbar */}
      <nav className="relative z-10 w-full flex justify-between items-center px-6 md:px-12 py-6">
        <h1 className="text-xl font-bold text-[#00D1FF] tracking-wide">
          FIT2099
        </h1>

        <div className="flex gap-8 text-[#8B98A5] text-sm">
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
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center mt-28 px-6">
        <h2 className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl">
          Redefine Your
          <span className="bg-gradient-to-r from-[#00D1FF] to-[#7C5CFF] bg-clip-text text-transparent">
            {" "}
            Physique
          </span>
        </h2>

        <p className="text-[#8B98A5] mt-6 max-w-xl text-lg">
          Precision training. Intelligent tracking. Elite transformation.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="relative bg-[#00D1FF] text-black px-8 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-[0_0_25px_#00D1FF]">
            Get Started
          </button>

          <button className="border border-[#7C5CFF] text-[#7C5CFF] px-8 py-3 rounded-xl hover:bg-[#7C5CFF]/10 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 w-full mt-32 px-6 md:px-12 grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="group bg-[#121821]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#1f2933] hover:border-[#00D1FF]/40 transition hover:scale-[1.03]"
          >
            <div className="text-3xl mb-4" style={{ color: f.color }}>
              {f.icon}
            </div>

            <h3 className="text-xl font-semibold group-hover:text-white">
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

        <button className="mt-8 bg-[#00FF88] text-black px-10 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-[0_0_25px_#00FF88]">
          Join Now
        </button>
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
