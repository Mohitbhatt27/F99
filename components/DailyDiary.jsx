import { useState } from "react";
import { api } from "../src/utils/api";
import DiaryChart from "./DiaryChart";
import DiaryHeatmap from "./DiaryHeatmap";

const PAGE_SIZE = 10;

export default function DailyDiary({ entries, setEntries }) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(entries.length === PAGE_SIZE);

  const [entry, setEntry] = useState({ mood: "😐", rating: 5, note: "" });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ mood: "😐", rating: 5, note: "" });
  const [editSaving, setEditSaving] = useState(false);

  function handleChange(e) {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  }

  function handleEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  function startEdit(e) {
    setEditingId(e._id);
    setEditForm({ mood: e.mood, rating: e.rating, note: e.note });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ mood: "😐", rating: 5, note: "" });
  }

  async function saveEdit(entryId) {
    if (!editForm.note.trim()) {
      setMessage("Note cannot be empty.");
      return;
    }
    setEditSaving(true);
    try {
      const data = await api.patch(`/nutrition/diary/${entryId}`, {
        mood: editForm.mood,
        rating: Number(editForm.rating),
        note: editForm.note,
      });
      const updated = data.entry;
      // ── Update entries so chart re-renders immediately ──
      setEntries(entries.map((e) => (e._id === entryId ? updated : e)));
      setEditingId(null);
      setMessage("Entry updated.");
    } catch (err) {
      setMessage(err.message || "Failed to update entry.");
    } finally {
      setEditSaving(false);
    }
  }

  async function saveEntry() {
    const today = new Date().toLocaleDateString();
    if (!entry.note.trim()) {
      setMessage("Write something first.");
      return;
    }
    if (entries.find((e) => e.date === today)) {
      setMessage("Already logged today.");
      return;
    }

    setSaving(true);
    try {
      const data = await api.post("/nutrition/diary", {
        mood: entry.mood,
        rating: Number(entry.rating),
        note: entry.note,
        date: today,
      });
      const saved = data.entry ?? { ...entry, date: today };
      setEntries([saved, ...entries]);
      setEntry({ mood: "😐", rating: 5, note: "" });
      setMessage("Entry saved.");
    } catch (err) {
      setMessage(err.message || "Failed to save entry.");
    } finally {
      setSaving(false);
    }
  }

  async function loadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await api.get(
        `/nutrition/diary?page=${nextPage}&limit=${PAGE_SIZE}`,
      );
      setEntries([...entries, ...(data.entries ?? [])]);
      setPage(nextPage);
      setHasMore(data.hasMore ?? false);
    } catch (err) {
      setMessage("Failed to load more entries.");
    } finally {
      setLoadingMore(false);
    }
  }

  /* Analytics — recomputed from entries so chart updates immediately after edit */
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
      } else break;
    }
    return streak;
  }

  const streak = calculateStreak();

  let insight = "Stay consistent.";
  if (entries.length < 3) insight = "Start building your streak.";
  else if (avgRating >= 8) insight = "You're performing at a high level.";
  else if (avgRating >= 6)
    insight = "Solid consistency, push intensity slightly.";
  else if (avgRating !== "—")
    insight = "Your training quality is low — fix effort or recovery.";

  return (
    <div className="mt-14">
      <h2 className="text-xl font-semibold mb-6">Daily Fitness Diary</h2>

      {/* Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card label="Entries" value={entries.length} />
        <Card label="Avg Rating" value={avgRating} />
        <Card label="Streak 🔥" value={streak} />
        <Card label="Consistency" value={`${consistency}%`} />
      </div>

      {/* New Entry Input */}
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
          disabled={saving}
          className="bg-[var(--primary)] text-black px-6 py-2 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Entry"}
        </button>
        {message && <p className="text-sm text-[var(--text-sub)]">{message}</p>}
      </div>

      {/* Charts — key forces remount when entries change so line updates */}
      <DiaryChart
        entries={entries}
        key={JSON.stringify(entries.map((e) => e.rating))}
      />
      <DiaryHeatmap entries={entries} />

      {/* Entries list */}
      <div className="mt-8 space-y-4">
        {entries.map((e) => (
          <div
            key={e._id}
            className="bg-[var(--card)] rounded-xl border border-[var(--text-sub)]/20 hover:border-[var(--primary)]/40 transition overflow-hidden"
          >
            {editingId === e._id ? (
              /* ── Edit mode ── */
              <div className="p-5 space-y-3 border-l-4 border-[var(--primary)]">
                <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide">
                  Editing — {e.date}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[var(--text-sub)]">
                      Mood
                    </label>
                    <select
                      name="mood"
                      value={editForm.mood}
                      onChange={handleEditChange}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm"
                    >
                      <option>😃</option>
                      <option>🙂</option>
                      <option>😐</option>
                      <option>😴</option>
                      <option>😡</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-sub)]">
                      Rating (1–10)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      min="1"
                      max="10"
                      value={editForm.rating}
                      onChange={handleEditChange}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-sub)]">Note</label>
                  <textarea
                    name="note"
                    value={editForm.note}
                    onChange={handleEditChange}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm h-24 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(e._id)}
                    disabled={editSaving}
                    className="bg-[var(--primary)] text-black px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition disabled:opacity-50"
                  >
                    {editSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="border border-[var(--text-sub)]/20 px-5 py-2 rounded-lg text-sm hover:bg-[var(--bg)] transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ── View mode ── */
              <>
                {/* Header bar with Edit button — full width, easy to find */}
                <div className="flex justify-between items-center px-5 py-3 border-b border-[var(--text-sub)]/10 bg-[var(--bg)]/40">
                  <div className="flex items-center gap-3 text-sm text-[var(--text-sub)]">
                    <span className="font-medium text-[var(--text-main)]">
                      {e.date}
                    </span>
                    <span>{e.mood}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold">
                      {e.rating}/10
                    </span>
                  </div>
                  <button
                    onClick={() => startEdit(e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--primary)]/30 text-[var(--primary)] text-xs font-semibold hover:bg-[var(--primary)]/10 transition"
                  >
                    ✏️ Edit
                  </button>
                </div>
                <p className="px-5 py-4 text-sm leading-relaxed">{e.note}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 rounded-lg border border-[var(--text-sub)]/20 text-sm hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 transition disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      <div className="mt-6 text-sm text-[var(--text-sub)]">
        Insight: <span className="text-[var(--text-main)]">{insight}</span>
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--text-sub)]/20 text-center">
      <p className="text-lg font-bold text-[var(--primary)]">{value}</p>
      <p className="text-xs text-[var(--text-sub)]">{label}</p>
    </div>
  );
}
