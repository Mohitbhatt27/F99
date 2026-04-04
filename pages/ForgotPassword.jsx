import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../src/utils/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [error, setError] = useState("");

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      setStatus("sent");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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
        {status === "sent" ? (
          /* ── Success state ── */
          <div className="text-center space-y-4">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-2xl font-bold">Check your email</h2>
            <p className="text-[var(--text-sub)] text-sm leading-relaxed">
              If an account exists for{" "}
              <span className="text-[var(--text-main)]">{email}</span>, we've
              sent a password reset link. It expires in 1 hour.
            </p>
            <p className="text-[var(--text-sub)] text-xs">
              Didn't get it? Check your spam folder.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full bg-[var(--primary)] text-black py-3 rounded-lg font-semibold hover:scale-[1.03] transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <h2 className="text-3xl font-bold text-center mb-2">
              Forgot Password
            </h2>
            <p className="text-[var(--text-sub)] text-center mb-6 text-sm">
              Enter your email and we'll send you a reset link.
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                className="bg-[var(--bg)] border border-[var(--text-sub)]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 bg-[var(--primary)] text-black py-3 rounded-lg font-semibold transition hover:scale-[1.03] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status === "loading" ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="text-center text-[var(--text-sub)] text-sm mt-6">
              Remember your password?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[var(--primary)] cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
