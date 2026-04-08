import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/profile");
  }, [navigate]);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔍 validations
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!form.gender) {
      setError("Please select your gender.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          gender: form.gender.toLowerCase(),
          age: Number(form.age)
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed.");
      }

      console.log("Signup Response:", result);

      // 🔥 FIX: store BOTH token + userId
      localStorage.setItem("token", result.token);

      if (result.user && result.user._id) {
        localStorage.setItem("userId", result.user._id);
      } else {
        console.warn("User ID missing in response");
      }

      window.dispatchEvent(new Event("auth-changed"));

      navigate("/profile");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[var(--bg)] text-[var(--text-main)] flex items-center justify-center overflow-hidden transition-colors duration-300">
      {/* Mouse Spotlight */}
      <div className="spotlight" style={{ left: pos.x, top: pos.y }} />

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-[var(--primary)]/20 blur-[160px] rounded-full top-[10%] left-[10%]" />
        <div className="absolute w-[500px] h-[500px] bg-[var(--secondary)]/20 blur-[160px] rounded-full bottom-[10%] right-[10%]" />
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-lg p-8 rounded-2xl bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--text-sub)]/20 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-[var(--text-sub)] text-center mb-6">
          Start your transformation today
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="input"
          />

          <div className="flex gap-3">
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
              className="input w-full"
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="input w-full"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="input"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="input"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[var(--primary)] text-black py-3 rounded-lg font-semibold transition hover:scale-[1.03] shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-[var(--text-sub)] text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[var(--primary)] cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
