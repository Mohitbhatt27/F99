import { useState, useEffect } from "react";

function Signup() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[var(--bg)] text-[var(--text-main)] flex items-center justify-center overflow-hidden transition-colors duration-300">
      {/*  Mouse Spotlight */}
      <div className="spotlight" style={{ left: pos.x, top: pos.y }} />

      {/*  Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-[var(--primary)]/20 blur-[160px] rounded-full top-[10%] left-[10%]"></div>
        <div className="absolute w-[500px] h-[500px] bg-[var(--secondary)]/20 blur-[160px] rounded-full bottom-[10%] right-[10%]"></div>
      </div>

      {/*  Signup Card */}
      <div className="w-full max-w-lg p-8 rounded-2xl bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--text-sub)]/20 shadow-xl">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>

        <p className="text-[var(--text-sub)] text-center mb-6">
          Start your transformation today
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
          />

          {/* Age + Sex */}
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Age"
              className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
            />

            <select className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition">
              <option value="">Sex</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Height + Weight */}
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Height (cm) - optional"
              className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
            />

            <input
              type="number"
              placeholder="Weight (kg) - optional"
              className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] transition"
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] transition"
          />

          {/* Button */}
          <button
            type="submit"
            className="mt-2 bg-[var(--primary)] text-black py-3 rounded-lg font-semibold transition hover:scale-[1.03] shadow-lg hover:shadow-xl"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[var(--text-sub)] text-sm mt-6">
          Already have an account?{" "}
          <span className="text-[var(--secondary)] cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
