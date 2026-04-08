import { useState } from "react";
import { api } from "../src/utils/api";
import { useNavigate } from "react-router-dom";

export default function Programs() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const next = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
  };

  const generate = async (finalData) => {
    setLoading(true);
    try {
      const res = await api.post(
        "/program/generate",
        await api.post("/program/generate", {
          days: finalData.days,
          goal: finalData.goal,
          location: finalData.location,
        }),
      );

      setProgram(res);
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)] p-6">
      {step === 1 && (
        <Select
          title="How many days can you train?"
          options={[2, 3, 4, 5, 6]}
          onSelect={(v) => next("days", v)}
        />
      )}

      {step === 2 && (
        <Select
          title="Your Goal"
          options={["muscle", "fat", "recomp"]}
          onSelect={(v) => next("goal", v)}
        />
      )}

      {step === 3 && (
        <Select
          title="Training Type"
          options={["gym", "home"]}
          onSelect={(v) => {
            const final = { ...data, location: v };
            setData(final);
            generate(final);
          }}
        />
      )}

      {loading && (
        <div className="flex justify-center mt-20">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {step === 4 && program && (
        <ProgramView program={program} navigate={navigate} />
      )}
    </div>
  );
}

function Select({ title, options, onSelect }) {
  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="p-4 bg-[var(--card)] border border-[var(--text-sub)]/20 rounded-xl 
                       hover:scale-105 hover:border-[var(--primary)] transition"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgramView({ program, navigate }) {
  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--primary)]/20 border border-[var(--primary)]/20">
        <h1 className="text-2xl font-bold">{program.split}</h1>
        <p className="text-[var(--text-sub)]">
          {program.daysPerWeek} days / week
        </p>
      </div>

      {program.workouts.map((w) => (
        <div key={w.day} className="p-5 bg-[var(--card)] rounded-xl border">
          <h2 className="font-semibold">{w.day}</h2>

          {w.exercises.map((ex) => (
            <div key={ex.name} className="text-sm mt-2">
              {ex.name} — {ex.sets} × {ex.reps}
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={() => navigate("/workout", { state: program })}
        className="w-full py-3 bg-[var(--primary)] text-black rounded-xl font-semibold hover:scale-105 transition"
      >
        Start Program 🚀
      </button>
    </div>
  );
}
