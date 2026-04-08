import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../src/utils/api";

export default function Workout() {
  const { state: program } = useLocation();
  const [loggingKey, setLoggingKey] = useState("");
  const [toast, setToast] = useState({ type: "idle", message: "" });
  const toastTimerRef = useRef(null);

  const setToastMessage = (type, message, timeout = 2500) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast({ type, message });

    if (timeout > 0) {
      toastTimerRef.current = setTimeout(() => {
        setToast({ type: "idle", message: "" });
      }, timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  if (!program) {
    return <div className="p-6">No program found</div>;
  }

  const logSet = async (exercise, workoutDay) => {
    const currentKey = `${workoutDay}::${exercise.name}`;
    setLoggingKey(currentKey);
    setToastMessage("loading", `Logging ${exercise.name}...`, 0);

    try {
      await api.post("/workout/log", {
        programId: program._id,
        exerciseName: exercise.name,
        workoutDay,
        sets: [{ weight: 60, reps: 10 }]
      });

      setToastMessage("success", `${exercise.name} logged for ${workoutDay}.`);
    } catch (error) {
      setToastMessage("error", error.message || "Failed to log workout set.");
    } finally {
      setLoggingKey("");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-(--bg) min-h-screen">
      {toast.message && (
        <div
          className={`fixed right-6 top-24 z-50 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-md ${
            toast.type === "success"
              ? "bg-green-500/15 text-green-400 border border-green-400/30"
              : toast.type === "error"
                ? "bg-red-500/15 text-red-400 border border-red-400/30"
                : "bg-(--card)/95 text-(--text-main) border border-(--text-sub)/30"
          }`}
        >
          {toast.message}
        </div>
      )}

      <h1 className="text-2xl font-bold">{program.split}</h1>

      {program.workouts.map((w) => (
        <div key={w.day} className="bg-(--card) p-5 rounded-xl">
          <h2 className="font-bold">{w.day}</h2>

          {w.exercises.map((ex) => (
            <div key={ex.name} className="flex justify-between mt-3">
              <div>
                {ex.name} ({ex.sets}x{ex.reps})
              </div>

              <button
                onClick={() => logSet(ex, w.day)}
                disabled={loggingKey === `${w.day}::${ex.name}`}
                className="bg-(--primary) px-3 py-1 rounded transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loggingKey === `${w.day}::${ex.name}` ? "Logging..." : "Log"}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
