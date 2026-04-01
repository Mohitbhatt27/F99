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
    confirmPassword: "",
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

  // ✅ handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "https://connectusonfitness.onrender.com/api/v1/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            gender: form.gender.toLowerCase(),
            age: Number(form.age),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      //  store token
      localStorage.setItem("token", data.token);

      //  go to profile
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

      {/* Signup Card */}
      <div className="w-full max-w-lg p-8 rounded-2xl bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--text-sub)]/20 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>

        <p className="text-[var(--text-sub)] text-center mb-6">
          Start your transformation today
        </p>

        {/* ✅ FORM CONNECTED */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
            className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
            required
          />

          {/* Age + Sex */}
          <div className="flex gap-3">
            <input
              name="age"
              type="number"
              placeholder="Age"
              onChange={handleChange}
              className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
              required
            />

            <select
              name="gender"
              onChange={handleChange}
              className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
              required
            >
              <option value="">Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Height + Weight (UI only, not sent yet) */}
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Height (cm) - optional"
              className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm w-full"
            />

            <input
              type="number"
              placeholder="Weight (kg) - optional"
              className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm w-full"
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm"
            required
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm"
            required
          />

          <button
            type="submit"
            className="mt-2 bg-[var(--primary)] text-black py-3 rounded-lg font-semibold transition hover:scale-[1.03] shadow-lg hover:shadow-xl"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-[var(--text-sub)] text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-[var(--secondary)] cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
