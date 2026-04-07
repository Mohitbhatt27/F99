import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../src/utils/api";
import DailyDiary from "./DailyDiary";
import ProgressRings from "./ProgressRings";
import InsightsPanel from "./InsightsPanel";
import StreakCard from "./StreakCard";
import { useFood } from "../context/FoodContext";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const avatarInputRef = useRef();

  const [userData, setUserData] = useState(null);
  const [todayFood, setTodayFood] = useState({
    foods: [],
    water: 0,
    totals: { calories: 0, protein: 0 },
  });
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [goals, setGoals] = useState([]);
  const [streak, setStreak] = useState(0);
  const [targets, setTargets] = useState({
    calories: 2300,
    protein: 140,
    water: 3000,
  });

  // Goal management state
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    current: "",
    target: "",
    unit: "",
  });
  const [addingGoal, setAddingGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editGoalForm, setEditGoalForm] = useState({
    title: "",
    current: "",
    target: "",
    unit: "",
  });
  const [goalMessage, setGoalMessage] = useState("");

  const { setFoods, setWater } = useFood();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }
      try {
        const data = await api.get("/profile/full");
        setUserData(data.user);
        setTodayFood(data.todayFood);
        setDiaryEntries(data.diaryEntries ?? []);
        setGoals(data.goals ?? []);
        setStreak(data.streak ?? 0);
        setTargets(
          data.targets ?? { calories: 2300, protein: 140, water: 3000 },
        );
        setFoods(data.todayFood?.foods ?? []);
        setWater(data.todayFood?.water ?? 0);
      } catch (err) {
        setError(err.message || "Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, setFoods, setWater]);

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be under 5MB.");
      return;
    }
    setUploadingAvatar(true);
    setAvatarError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const data = await api.upload("/upload/profile-image", formData);
      setUserData((prev) => ({ ...prev, avatar: data.url }));
    } catch (err) {
      setAvatarError(err.message || "Failed to upload photo.");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  }

  // ── Goal handlers ──
  async function handleAddGoal() {
    if (!newGoal.title.trim()) {
      setGoalMessage("Title is required.");
      return;
    }
    if (!newGoal.target || Number(newGoal.target) <= 0) {
      setGoalMessage("Target must be a positive number.");
      return;
    }

    setAddingGoal(true);
    setGoalMessage("");
    try {
      const data = await api.post("/goals", {
        title: newGoal.title.trim(),
        current: Number(newGoal.current) || 0,
        target: Number(newGoal.target),
        unit: newGoal.unit.trim(),
      });
      setGoals([data.goal, ...goals]);
      setNewGoal({ title: "", current: "", target: "", unit: "" });
      setShowAddGoal(false);
    } catch (err) {
      setGoalMessage(err.message || "Failed to add goal.");
    } finally {
      setAddingGoal(false);
    }
  }

  function startEditGoal(g) {
    setEditingGoalId(g._id);
    setEditGoalForm({
      title: g.title,
      current: g.current,
      target: g.target,
      unit: g.unit,
    });
    setGoalMessage("");
  }

  async function handleUpdateGoal(id) {
    if (!editGoalForm.title.trim()) {
      setGoalMessage("Title is required.");
      return;
    }
    try {
      const data = await api.patch(`/goals/${id}`, {
        title: editGoalForm.title.trim(),
        current: Number(editGoalForm.current),
        target: Number(editGoalForm.target),
        unit: editGoalForm.unit.trim(),
      });
      setGoals(
        goals.map((g) =>
          g._id === id
            ? {
                ...data.goal,
                progress: Math.min(
                  100,
                  Math.round((data.goal.current / data.goal.target) * 100),
                ),
              }
            : g,
        ),
      );
      setEditingGoalId(null);
    } catch (err) {
      setGoalMessage(err.message || "Failed to update goal.");
    }
  }

  async function handleDeleteGoal(id) {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter((g) => g._id !== id));
    } catch (err) {
      setGoalMessage(err.message || "Failed to delete goal.");
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-main)]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--text-sub)]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center space-y-4 px-6">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--primary)] text-black rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const caloriePercent = Math.min(
    100,
    Math.round((todayFood.totals.calories / targets.calories) * 100),
  );
  const proteinPercent = Math.min(
    100,
    Math.round((todayFood.totals.protein / targets.protein) * 100),
  );
  const waterPercent = Math.min(
    100,
    Math.round((todayFood.water / targets.water) * 100),
  );

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text-main)] px-6 md:px-12 py-10 space-y-10 transition-colors duration-300">
      {/* HERO */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 to-transparent border border-[var(--text-sub)]/20 shadow-lg">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className="relative group cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--primary)] shadow-lg">
                {uploadingAvatar ? (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--card)]">
                    <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <img
                    src={userData?.avatar || "https://i.pravatar.cc/150?img=3"}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-lg">📷</span>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Hello, {userData?.name || "Athlete"} 👋
              </h1>
              <p className="text-[var(--text-sub)]">
                You're building something elite.
              </p>
              {avatarError && (
                <p className="text-red-500 text-xs mt-1">{avatarError}</p>
              )}
              <p className="text-[var(--text-sub)] text-xs mt-0.5">
                Hover avatar to change photo
              </p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-5 py-2 bg-[var(--card)] border border-[var(--text-sub)]/20 rounded-lg font-semibold hover:scale-105 transition shadow-md"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/progress-photos")}
              className="px-5 py-2 bg-[var(--card)] border border-[var(--text-sub)]/20 rounded-lg font-semibold hover:scale-105 transition shadow-md"
            >
              Progress Photos
            </button>
            <button
              onClick={() => navigate("/food")}
              className="px-5 py-2 bg-[var(--primary)] text-black rounded-lg font-semibold hover:scale-105 transition shadow-md"
            >
              Food Diary
            </button>
          </div>
        </div>
      </div>

      {/* PROGRESS RINGS */}
      <div className="flex flex-wrap gap-8 justify-center md:justify-start">
        <ProgressRings
          value={caloriePercent}
          label={`Calories ${todayFood.totals.calories}/${targets.calories}`}
        />
        <ProgressRings
          value={proteinPercent}
          label={`Protein ${todayFood.totals.protein}g/${targets.protein}g`}
        />
        <ProgressRings
          value={waterPercent}
          label={`Water ${todayFood.water}/${targets.water}ml`}
        />
      </div>

      {/* STREAK + INSIGHTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <StreakCard streak={streak} />
        <InsightsPanel
          protein={todayFood.totals.protein}
          water={todayFood.water}
          targets={targets}
          userData={userData}
        />
      </div>

      {/* GOALS — fully user-defined */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Current Goals</h2>
          <button
            onClick={() => {
              setShowAddGoal(!showAddGoal);
              setGoalMessage("");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-black rounded-lg text-sm font-semibold hover:scale-105 transition"
          >
            {showAddGoal ? "✕ Cancel" : "+ Add Goal"}
          </button>
        </div>

        {/* Add goal form */}
        {showAddGoal && (
          <div className="bg-[var(--card)] p-5 rounded-xl border border-[var(--primary)]/30 mb-4 space-y-3">
            <p className="text-sm font-medium text-[var(--primary)]">
              New Goal
            </p>
            <input
              placeholder="Goal title — e.g. Bench 100kg, Run 5km"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] transition"
            />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-[var(--text-sub)]">
                  Current value
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newGoal.current}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, current: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] transition"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-sub)]">
                  Target value
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, target: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] transition"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-sub)]">Unit</label>
                <input
                  placeholder="kg, km, reps…"
                  value={newGoal.unit}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, unit: e.target.value })
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] transition"
                />
              </div>
            </div>
            {goalMessage && (
              <p className="text-red-500 text-xs">{goalMessage}</p>
            )}
            <button
              onClick={handleAddGoal}
              disabled={addingGoal}
              className="bg-[var(--primary)] text-black px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition disabled:opacity-50"
            >
              {addingGoal ? "Adding..." : "Add Goal"}
            </button>
          </div>
        )}

        {/* Goals list */}
        {goals.length === 0 && !showAddGoal ? (
          <div className="bg-[var(--card)] p-8 rounded-xl border border-[var(--text-sub)]/20 text-center text-[var(--text-sub)]">
            <p className="text-3xl mb-2">🎯</p>
            <p className="text-sm">
              No goals yet. Click "Add Goal" to set your first target.
            </p>
          </div>
        ) : (
          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--text-sub)]/20 space-y-6 shadow-sm">
            {goalMessage && !showAddGoal && (
              <p className="text-red-500 text-xs">{goalMessage}</p>
            )}
            {goals.map((g) => (
              <div key={g._id}>
                {editingGoalId === g._id ? (
                  /* ── Edit mode ── */
                  <div className="space-y-3 p-4 rounded-lg border border-[var(--primary)]/30 bg-[var(--bg)]">
                    <input
                      value={editGoalForm.title}
                      onChange={(e) =>
                        setEditGoalForm({
                          ...editGoalForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] transition"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-[var(--text-sub)]">
                          Current
                        </label>
                        <input
                          type="number"
                          value={editGoalForm.current}
                          onChange={(e) =>
                            setEditGoalForm({
                              ...editGoalForm,
                              current: e.target.value,
                            })
                          }
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] transition"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-sub)]">
                          Target
                        </label>
                        <input
                          type="number"
                          value={editGoalForm.target}
                          onChange={(e) =>
                            setEditGoalForm({
                              ...editGoalForm,
                              target: e.target.value,
                            })
                          }
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] transition"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-sub)]">
                          Unit
                        </label>
                        <input
                          value={editGoalForm.unit}
                          onChange={(e) =>
                            setEditGoalForm({
                              ...editGoalForm,
                              unit: e.target.value,
                            })
                          }
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--text-sub)]/20 text-sm focus:outline-none focus:border-[var(--primary)] transition"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateGoal(g._id)}
                        className="bg-[var(--primary)] text-black px-4 py-1.5 rounded-lg text-sm font-semibold hover:scale-105 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingGoalId(null)}
                        className="border border-[var(--text-sub)]/20 px-4 py-1.5 rounded-lg text-sm hover:bg-[var(--card)] transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── View mode ── */
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-sm font-medium">{g.title}</p>
                        <p className="text-xs text-[var(--text-sub)] mt-0.5">
                          {g.current}
                          {g.unit ? ` ${g.unit}` : ""} / {g.target}
                          {g.unit ? ` ${g.unit}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[var(--primary)]">
                          {g.progress}%
                        </span>
                        <button
                          onClick={() => startEditGoal(g)}
                          className="text-xs px-2 py-1 rounded border border-[var(--text-sub)]/20 hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(g._id)}
                          className="text-xs px-2 py-1 rounded border border-red-500/20 text-red-500 hover:bg-red-500/10 transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-[var(--text-sub)]/20 rounded-full mt-2">
                      <div
                        className="h-2 rounded-full bg-[var(--primary)] transition-all duration-500"
                        style={{ width: `${Math.min(100, g.progress)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DIARY */}
      <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--text-sub)]/20 shadow-sm">
        <DailyDiary entries={diaryEntries} setEntries={setDiaryEntries} />
      </div>
    </div>
  );
}
