import { useState, useEffect } from "react";

function Login() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#0B0F14] text-[#E6EDF3] flex items-center justify-center overflow-hidden">
      {/* 🔥 Mouse Spotlight */}
      <div className="spotlight" style={{ left: pos.x, top: pos.y }} />

      {/* 🔥 Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-[#00D1FF]/20 blur-[160px] rounded-full top-[10%] left-[10%] animate-glow"></div>
        <div className="absolute w-[500px] h-[500px] bg-[#7C5CFF]/20 blur-[160px] rounded-full bottom-[10%] right-[10%] animate-glow-reverse"></div>
      </div>

      {/* 🔥 Login Card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#121821]/70 backdrop-blur-2xl border border-[#1f2933] shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-[#8B98A5] text-center mb-6">
          Continue your transformation
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="bg-[#0B0F14] border border-[#1f2933] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00D1FF] focus:ring-1 focus:ring-[#00D1FF] transition"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="bg-[#0B0F14] border border-[#1f2933] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#7C5CFF] transition"
          />

          {/* Button */}
          <button
            type="submit"
            className="mt-2 bg-[#00D1FF] text-black py-3 rounded-lg font-semibold transition hover:scale-[1.03] shadow-[0_0_30px_#00D1FF] hover:shadow-[0_0_50px_#00D1FF]"
          >
            Login
          </button>
        </form>

        {/* Extra */}
        <p className="text-center text-[#8B98A5] text-sm mt-6">
          Don’t have an account?{" "}
          <span className="text-[#7C5CFF] cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
