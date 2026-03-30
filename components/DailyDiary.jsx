import { useState, useEffect } from "react";
import DiaryChart from "./DiaryChart";
import DiaryHeatmap from "./DiaryHeatmap";

export default function DailyDiary({ entries, setEntries }) {
  const [message, setMessage] = useState("");

  const [entry, setEntry] = useState({
    mood: "😐",
    rating: 5,
    note: "",
  });

  /* Load from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("diary");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  /* Save to localStorage */
  useEffect(() => {
    localStorage.setItem("diary", JSON.stringify(entries));
  }, [entries]);

  function handleChange(e) {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  }

  function saveEntry() {
    const today = new Date().toLocaleDateString();

    if (!entry.note.trim()) {
      setMessage("Write something first.");
      return;
    }

    if (entries.find((e) => e.date === today)) {
      setMessage("Already logged today.");
      return;
    }

    const newEntry = { ...entry, date: today };

    setEntries([newEntry, ...entries]);

    setEntry({
      mood: "😐",
      rating: 5,
      note: "",
    });

    setMessage("Entry saved.");
  }

  /* Analytics */

  const avgRating =
    entries.length > 0
      ? (
          entries.reduce((a, e) => a + Number(e.rating), 0) / entries.length
        ).toFixed(1)
      : "—";

  const consistency =
    entries.length > 0
      ? Math.min(100, Math.round((entries.length / 30) * 100))
      : 0;

  function calculateStreak() {
    if (!entries.length) return 0;

    const sorted = [...entries].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    let streak = 0;
    let current = new Date();

    for (let i = 0; i < sorted.length; i++) {
      const d = new Date(sorted[i].date);

      if (d.toDateString() === current.toDateString()) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  const streak = calculateStreak();

  /* Insight */
  let insight = "Stay consistent.";

  if (entries.length < 3) {
    insight = "Start building your streak.";
  } else if (avgRating >= 8) {
    insight = "You're performing at a high level.";
  } else if (avgRating >= 6) {
    insight = "Solid consistency, push intensity slightly.";
  } else if (avgRating !== "—") {
    insight = "Your training quality is low — fix effort or recovery.";
  }

  return (
    <div className="mt-14">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">Daily Fitness Diary</h2>

      {/* Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card label="Entries" value={entries.length} />
        <Card label="Avg Rating" value={avgRating} />
        <Card label="Streak 🔥" value={streak} />
        <Card label="Consistency" value={`${consistency}%`} />
      </div>

      {/* Input */}
      <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--text-sub)]/20 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[var(--text-sub)]">Mood</label>
            <select
              name="mood"
              value={entry.mood}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20"
            >
              <option>😃</option>
              <option>🙂</option>
              <option>😐</option>
              <option>😴</option>
              <option>😡</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--text-sub)]">
              Workout Rating
            </label>
            <input
              type="number"
              name="rating"
              min="1"
              max="10"
              value={entry.rating}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-[var(--text-sub)]">Diary</label>
          <textarea
            name="note"
            value={entry.note}
            onChange={handleChange}
            placeholder="What did you train? How did you feel?"
            className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 h-24 resize-none"
          />
        </div>

        <button
          onClick={saveEntry}
          className="bg-[var(--primary)] text-black px-6 py-2 rounded-lg font-semibold hover:scale-105 transition"
        >
          Save Entry
        </button>

        {message && <p className="text-sm text-[var(--text-sub)]">{message}</p>}
      </div>

      {/* Charts */}
      <DiaryChart entries={entries} />
      <DiaryHeatmap entries={entries} />

      {/* Entries */}
      <div className="mt-8 space-y-4">
        {entries.map((e, i) => (
          <div
            key={i}
            className="bg-[var(--card)] p-5 rounded-xl border border-[var(--text-sub)]/20 hover:border-[var(--primary)]/40 transition"
          >
            <div className="flex justify-between text-sm text-[var(--text-sub)] mb-2">
              <span>{e.date}</span>
              <span>
                {e.mood} • {e.rating}/10
              </span>
            </div>

            <p>{e.note}</p>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="mt-6 text-sm text-[var(--text-sub)]">
        Insight: <span className="text-[var(--text-main)]">{insight}</span>
      </div>
    </div>
  );
}

/* Card */
function Card({ label, value }) {
  return (
    <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--text-sub)]/20 text-center">
      <p className="text-lg font-bold text-[var(--primary)]">{value}</p>
      <p className="text-xs text-[var(--text-sub)]">{label}</p>
    </div>
  );
}
