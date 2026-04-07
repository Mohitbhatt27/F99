import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../src/utils/api";

const EXPERIENCE_OPTIONS = ["beginner", "intermediate", "advanced"];
const AIM_OPTIONS = [
  "lose weight",
  "build muscle",
  "maintain weight",
  "improve endurance",
  "increase strength",
];

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    bodyFat: "",
    trainingExperience: "",
    aim: "",
    targets: {
      calories: "",
      protein: "",
      water: "",
    },
  });

  // Load existing profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get("/api/v1/profile/full");
        const p = data.user;
        const prof = data.profile ?? {};

        setForm({
          age: data.user?.age ?? "",
          gender: prof.gender ?? data.user?.gender ?? "",
          weight: prof.weight ?? "",
          height: prof.height ?? "",
          bodyFat: prof.bodyFat ?? "",
          trainingExperience: prof.trainingExperience ?? "",
          aim: prof.aim ?? "",
          targets: {
            calories: data.targets?.calories ?? 2300,
            protein: data.targets?.protein ?? 140,
            water: data.targets?.water ?? 3000,
          },
        });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("targets.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        targets: { ...prev.targets, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.patch("/api/v1/profile", {
        ...(form.age && { age: Number(form.age) }),
        ...(form.gender && { gender: form.gender }),
        ...(form.weight && { weight: Number(form.weight) }),
        ...(form.height && { height: Number(form.height) }),
        ...(form.bodyFat && { bodyFat: Number(form.bodyFat) }),
        ...(form.trainingExperience && {
          trainingExperience: form.trainingExperience,
        }),
        ...(form.aim && { aim: form.aim }),
        targets: {
          calories: Number(form.targets.calories) || 2300,
          protein: Number(form.targets.protein) || 140,
          water: Number(form.targets.water) || 3000,
        },
      });

      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text-main)] px-6 md:px-12 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="text-[var(--text-sub)] hover:text-[var(--primary)] transition text-sm"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Body Stats ── */}
          <Section title="Body Stats">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Age">
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min="10"
                  max="100"
                  placeholder="e.g. 24"
                  className={inputClass}
                />
              </Field>

              <Field label="Gender">
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>

              <Field label="Weight (kg)">
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  min="30"
                  max="300"
                  placeholder="e.g. 75"
                  className={inputClass}
                />
              </Field>

              <Field label="Height (cm)">
                <input
                  type="number"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  min="100"
                  max="250"
                  placeholder="e.g. 175"
                  className={inputClass}
                />
              </Field>

              <Field label="Body Fat %">
                <input
                  type="number"
                  name="bodyFat"
                  value={form.bodyFat}
                  onChange={handleChange}
                  min="3"
                  max="60"
                  placeholder="e.g. 15"
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          {/* ── Training ── */}
          <Section title="Training">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Experience Level">
                <select
                  name="trainingExperience"
                  value={form.trainingExperience}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o.charAt(0).toUpperCase() + o.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Primary Goal">
                <select
                  name="aim"
                  value={form.aim}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  {AIM_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o.charAt(0).toUpperCase() + o.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          {/* ── Daily Targets ── */}
          <Section title="Daily Targets">
            <p className="text-xs text-[var(--text-sub)] mb-4">
              These control the progress rings on your profile page.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Calories (kcal)">
                <input
                  type="number"
                  name="targets.calories"
                  value={form.targets.calories}
                  onChange={handleChange}
                  min="500"
                  max="10000"
                  className={inputClass}
                />
              </Field>

              <Field label="Protein (g)">
                <input
                  type="number"
                  name="targets.protein"
                  value={form.targets.protein}
                  onChange={handleChange}
                  min="10"
                  max="500"
                  className={inputClass}
                />
              </Field>

              <Field label="Water (ml)">
                <input
                  type="number"
                  name="targets.water"
                  value={form.targets.water}
                  onChange={handleChange}
                  min="500"
                  max="10000"
                  className={inputClass}
                />
              </Field>
            </div>

            {/* BMR-based suggestion */}
            {form.weight && form.height && form.age && form.gender && (
              <CalorieSuggestion
                weight={Number(form.weight)}
                height={Number(form.height)}
                age={Number(form.age)}
                gender={form.gender}
                aim={form.aim}
                onApply={(cal, prot) =>
                  setForm((prev) => ({
                    ...prev,
                    targets: { ...prev.targets, calories: cal, protein: prot },
                  }))
                }
              />
            )}
          </Section>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[var(--primary)] text-black py-3 rounded-lg font-semibold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── BMR calorie suggestion based on Mifflin-St Jeor formula ──
function CalorieSuggestion({ weight, height, age, gender, aim, onApply }) {
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = Math.round(bmr * 1.55); // moderate activity

  let suggestedCalories = tdee;
  let suggestedProtein = Math.round(weight * 2); // 2g per kg default

  if (aim === "lose weight") {
    suggestedCalories = Math.round(tdee * 0.8);
    suggestedProtein = Math.round(weight * 2.2);
  } else if (aim === "build muscle") {
    suggestedCalories = Math.round(tdee * 1.1);
    suggestedProtein = Math.round(weight * 2.4);
  } else if (aim === "increase strength") {
    suggestedCalories = Math.round(tdee * 1.05);
    suggestedProtein = Math.round(weight * 2.2);
  }

  return (
    <div className="mt-4 p-4 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/20">
      <p className="text-sm font-medium mb-1">
        💡 Suggested based on your stats
      </p>
      <p className="text-xs text-[var(--text-sub)] mb-3">
        BMR: {Math.round(bmr)} kcal · TDEE: {tdee} kcal
        {aim ? ` · Adjusted for "${aim}"` : ""}
      </p>
      <div className="flex gap-6 text-sm mb-3">
        <span>
          Calories: <strong>{suggestedCalories}</strong> kcal
        </span>
        <span>
          Protein: <strong>{suggestedProtein}</strong>g
        </span>
      </div>
      <button
        type="button"
        onClick={() => onApply(suggestedCalories, suggestedProtein)}
        className="text-xs px-3 py-1.5 bg-[var(--primary)] text-black rounded-lg font-semibold hover:scale-105 transition"
      >
        Apply these targets
      </button>
    </div>
  );
}

// ── Small helpers ──
const inputClass =
  "w-full px-3 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition";

function Section({ title, children }) {
  return (
    <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--text-sub)]/20">
      <h2 className="text-base font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-[var(--text-sub)] mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}
