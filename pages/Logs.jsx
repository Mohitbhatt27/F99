import { useEffect, useMemo, useState } from "react";
import { api } from "../src/utils/api";

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function totalSets(sets) {
  if (!Array.isArray(sets)) return 0;
  return sets.length;
}

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchLogs() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/workout/logs");
        const list = Array.isArray(response) ? response : response?.logs;

        if (!active) return;
        setLogs(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Unable to load workout logs.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchLogs();

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const totalVolume = logs.reduce(
      (sum, item) => sum + Number(item.totalVolume || 0),
      0
    );
    const maxLift = logs.reduce(
      (max, item) => Math.max(max, Number(item.maxWeight || 0)),
      0
    );
    return {
      count: logs.length,
      totalVolume,
      maxLift
    };
  }, [logs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg) px-6 py-10 text-(--text-main) md:px-12">
        <div className="mx-auto max-w-6xl animate-pulse rounded-2xl border border-(--text-sub)/20 bg-(--card)/60 p-8">
          <div className="h-8 w-56 rounded bg-(--text-sub)/20" />
          <div className="mt-3 h-4 w-80 rounded bg-(--text-sub)/20" />
          <div className="mt-8 space-y-3">
            <div className="h-20 rounded-xl bg-(--text-sub)/15" />
            <div className="h-20 rounded-xl bg-(--text-sub)/15" />
            <div className="h-20 rounded-xl bg-(--text-sub)/15" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-(--bg) px-6 py-10 text-(--text-main) md:px-12">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-(--text-sub)/20 bg-(--card)/75 p-6 backdrop-blur-xl md:p-8">
          <h1 className="text-3xl font-black md:text-4xl">Workout Logs</h1>
          <p className="mt-2 text-(--text-sub)">
            All your exercise logs, newest first.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-(--bg)/80 p-4">
              <p className="text-sm text-(--text-sub)">Total Logs</p>
              <p className="mt-1 text-xl font-bold">{summary.count}</p>
            </div>
            <div className="rounded-xl bg-(--bg)/80 p-4">
              <p className="text-sm text-(--text-sub)">Total Volume</p>
              <p className="mt-1 text-xl font-bold">
                {summary.totalVolume.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-(--bg)/80 p-4">
              <p className="text-sm text-(--text-sub)">Max Weight</p>
              <p className="mt-1 text-xl font-bold">{summary.maxLift}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            {error}
          </div>
        )}

        {!error && logs.length === 0 && (
          <div className="mt-6 rounded-2xl border border-(--text-sub)/20 bg-(--card)/60 p-8 text-center">
            <p className="text-lg font-semibold">No logs found yet.</p>
            <p className="mt-2 text-sm text-(--text-sub)">
              Start logging workouts to see your history here.
            </p>
          </div>
        )}

        {!error && logs.length > 0 && (
          <div className="mt-6 space-y-4">
            {logs.map((log) => (
              <article
                key={log._id}
                className="rounded-2xl border border-(--text-sub)/20 bg-(--card)/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{log.exerciseName}</h2>
                    <p className="text-sm text-(--text-sub)">
                      {log.workoutDay}
                    </p>
                  </div>
                  <p className="text-sm text-(--text-sub)">
                    {formatDate(log.createdAt)}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-lg bg-(--bg)/80 p-3">
                    <p className="text-xs uppercase tracking-wide text-(--text-sub)">
                      Sets
                    </p>
                    <p className="mt-1 font-semibold">{totalSets(log.sets)}</p>
                  </div>
                  <div className="rounded-lg bg-(--bg)/80 p-3">
                    <p className="text-xs uppercase tracking-wide text-(--text-sub)">
                      Max Weight
                    </p>
                    <p className="mt-1 font-semibold">{log.maxWeight ?? 0}</p>
                  </div>
                  <div className="rounded-lg bg-(--bg)/80 p-3">
                    <p className="text-xs uppercase tracking-wide text-(--text-sub)">
                      Total Volume
                    </p>
                    <p className="mt-1 font-semibold">{log.totalVolume ?? 0}</p>
                  </div>
                  <div className="rounded-lg bg-(--bg)/80 p-3">
                    <p className="text-xs uppercase tracking-wide text-(--text-sub)">
                      Program ID
                    </p>
                    <p className="mt-1 truncate font-semibold">
                      {log.programId}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-(--bg)/70 p-3">
                  <p className="mb-2 text-xs uppercase tracking-wide text-(--text-sub)">
                    Logged Sets
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(log.sets) && log.sets.length > 0 ? (
                      log.sets.map((setItem, index) => (
                        <span
                          key={`${log._id}-${index}`}
                          className="rounded-full border border-(--text-sub)/25 px-3 py-1 text-sm"
                        >
                          Set {index + 1}: {setItem.weight} x {setItem.reps}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-(--text-sub)">
                        No set details
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
