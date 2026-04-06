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

  const { setFoods, setWater } = useFood();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }
      try {
        // ── FIXED: was accidentally calling api.upload — should be api.get ──
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

  // ── Avatar upload ──
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

      // ── Uses api.upload — does NOT set Content-Type so multer works ──
      const data = await api.upload("/upload/profile-image", formData);
      setUserData((prev) => ({ ...prev, avatar: data.url }));
    } catch (err) {
      setAvatarError(err.message || "Failed to upload photo.");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
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
            {/* Avatar with upload on hover */}
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
        />
      </div>

      {/* GOALS */}
      {goals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Goals</h2>
          <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--text-sub)]/20 space-y-5 shadow-sm">
            {goals.map((g, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{g.title}</span>
                  <span className="text-[var(--text-sub)]">
                    {Math.round(g.progress)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[var(--text-sub)]/20 rounded-full">
                  <div
                    className="h-2 rounded-full bg-[var(--primary)] transition-all duration-500"
                    style={{ width: `${Math.min(100, g.progress)}%` }}
                  />
                </div>
                {g.eta && (
                  <p className="text-xs text-[var(--text-sub)] mt-1">
                    ETA: {g.eta}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIARY */}
      <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--text-sub)]/20 shadow-sm">
        <DailyDiary entries={diaryEntries} setEntries={setDiaryEntries} />
      </div>
    </div>
  );
}
