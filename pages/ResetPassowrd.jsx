import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const token = searchParams.get("token");

  // If no token in URL, redirect to forgot password
  useEffect(() => {
    if (!token) navigate("/forgot-password");
  }, [token, navigate]);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: form.password,
      });
      setStatus("success");
    } catch (err) {
      setError(err.message || "Reset failed. Your link may have expired.");
      setStatus("error");
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-[var(--bg)] text-[var(--text-main)] flex items-center justify-center overflow-hidden transition-colors duration-300">
      <div className="spotlight" style={{ left: pos.x, top: pos.y }} />

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-[var(--primary)]/20 blur-[160px] rounded-full top-[10%] left-[10%]" />
        <div className="absolute w-[500px] h-[500px] bg-[var(--secondary)]/20 blur-[160px] rounded-full bottom-[10%] right-[10%]" />
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--text-sub)]/20 shadow-xl">
        {status === "success" ? (
          /* ── Success state ── */
          <div className="text-center space-y-4">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold">Password reset!</h2>
            <p className="text-[var(--text-sub)] text-sm">
              Your password has been updated successfully. You can now log in
              with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full bg-[var(--primary)] text-black py-3 rounded-lg font-semibold hover:scale-[1.03] transition"
            >
              Go to Login
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <h2 className="text-3xl font-bold text-center mb-2">
              Reset Password
            </h2>
            <p className="text-[var(--text-sub)] text-center mb-6 text-sm">
              Enter your new password below.
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
                {error.toLowerCase().includes("expired") && (
                  <span
                    onClick={() => navigate("/forgot-password")}
                    className="block mt-1 underline cursor-pointer"
                  >
                    Request a new link
                  </span>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="password"
                type="password"
                placeholder="New password (min 8 characters)"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
              />

              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 bg-[var(--primary)] text-black py-3 rounded-lg font-semibold transition hover:scale-[1.03] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status === "loading" ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
