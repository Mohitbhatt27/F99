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

  /*  Analytics */

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

  /*  Insight */
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

      {/*  Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card label="Entries" value={entries.length} />
        <Card label="Avg Rating" value={avgRating} />
        <Card label="Streak 🔥" value={streak} />
        <Card label="Consistency" value={`${consistency}%`} />
      </div>

      {/*  Input */}
      <div className="bg-[#121821] p-6 rounded-xl border border-[#1f2933] space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#8B98A5]">Mood</label>
            <select
              name="mood"
              value={entry.mood}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-[#0B0F14] border border-[#1f2933]"
            >
              <option>😃</option>
              <option>🙂</option>
              <option>😐</option>
              <option>😴</option>
              <option>😡</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[#8B98A5]">Workout Rating</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="10"
              value={entry.rating}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-[#0B0F14] border border-[#1f2933]"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-[#8B98A5]">Diary</label>
          <textarea
            name="note"
            value={entry.note}
            onChange={handleChange}
            placeholder="What did you train? How did you feel?"
            className="w-full mt-1 px-3 py-2 rounded-lg bg-[#0B0F14] border border-[#1f2933] h-24 resize-none"
          />
        </div>

        <button
          onClick={saveEntry}
          className="bg-[#00FF88] text-black px-6 py-2 rounded-lg font-semibold hover:scale-105 transition"
        >
          Save Entry
        </button>

        {message && <p className="text-sm text-[#8B98A5]">{message}</p>}
      </div>

      {/*  Charts + Heatmap */}
      <DiaryChart entries={entries} />
      <DiaryHeatmap entries={entries} />

      {/*  Entries */}
      <div className="mt-8 space-y-4">
        {entries.map((e, i) => (
          <div
            key={i}
            className="bg-[#121821] p-5 rounded-xl border border-[#1f2933] hover:border-[#00D1FF]/40 transition"
          >
            <div className="flex justify-between text-sm text-[#8B98A5] mb-2">
              <span>{e.date}</span>
              <span>
                {e.mood} • {e.rating}/10
              </span>
            </div>

            <p>{e.note}</p>
          </div>
        ))}
      </div>

      {/*  Insight */}
      <div className="mt-6 text-sm text-[#8B98A5]">
        Insight: <span className="text-white">{insight}</span>
      </div>
    </div>
  );
}

/* Small reusable card */
function Card({ label, value }) {
  return (
    <div className="bg-[#121821] p-4 rounded-lg border border-[#1f2933] text-center">
      <p className="text-lg font-bold text-[#00D1FF]">{value}</p>
      <p className="text-xs text-[#8B98A5]">{label}</p>
    </div>
  );
}
