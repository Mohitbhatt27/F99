import { useLocation } from "react-router-dom";
import { api } from "../src/utils/api";

export default function Workout() {
  const { state: program } = useLocation();

  if (!program) {
    return <div className="p-6">No program found</div>;
  }

  const logSet = async (exercise) => {
    await api.post("/workout/log", {
      programId: program._id,
      exerciseName: exercise.name,
      workoutDay: program.workouts[0].day,
      sets: [{ weight: 60, reps: 10 }],
    });
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--bg)] min-h-screen">
      <h1 className="text-2xl font-bold">{program.split}</h1>

      {program.workouts.map((w) => (
        <div key={w.day} className="bg-[var(--card)] p-5 rounded-xl">
          <h2 className="font-bold">{w.day}</h2>

          {w.exercises.map((ex) => (
            <div key={ex.name} className="flex justify-between mt-3">
              <div>
                {ex.name} ({ex.sets}x{ex.reps})
              </div>

              <button
                onClick={() => logSet(ex)}
                className="bg-[var(--primary)] px-3 py-1 rounded"
              >
                Log
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
