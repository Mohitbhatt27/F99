import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [pos, setPos] = useState({ x: 0, y: 0 });

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // ✅ handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://connectusonfitness.onrender.com/api/v1/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ store token
      localStorage.setItem("token", data.token);

      // ✅ redirect to profile/dashboard
      navigate("/profile");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[var(--bg)] text-[var(--text-main)] flex items-center justify-center overflow-hidden transition-colors duration-300">
      {/* Mouse Spotlight */}
      <div className="spotlight" style={{ left: pos.x, top: pos.y }} />

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-[var(--primary)]/20 blur-[160px] rounded-full top-[10%] left-[10%]"></div>
        <div className="absolute w-[500px] h-[500px] bg-[var(--secondary)]/20 blur-[160px] rounded-full bottom-[10%] right-[10%]"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--text-sub)]/20 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>

        <p className="text-[var(--text-sub)] text-center mb-6">
          Continue your transformation
        </p>

        {/* ✅ CONNECTED FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] transition"
          />

          <button
            type="submit"
            className="mt-2 bg-[var(--primary)] text-black py-3 rounded-lg font-semibold transition hover:scale-[1.03] shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>

        <p className="text-center text-[var(--text-sub)] text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[var(--secondary)] cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
