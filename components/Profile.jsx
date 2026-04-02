// src/components/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DailyDiary from "./DailyDiary";
import ProgressRings from "./ProgressRings";
import InsightsPanel from "./InsightsPanel";
import StreakCard from "./StreakCard";
import { useFood } from "../context/FoodContext";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Backend data
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
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { foods, water, setFoods, setWater } = useFood();

  // Fetch all profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming you store JWT after login

        const res = await fetch(`${baseURL}/profile/full`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        setUserData(data.user);
        setTodayFood(data.todayFood);
        setDiaryEntries(data.diaryEntries);
        setGoals(data.goals);
        setStreak(data.streak);
        setTargets(data.targets);

        // Sync FoodContext with backend data
        setFoods(data.todayFood.foods || []);
        setWater(data.todayFood.water || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setFoods, setWater]);

  if (loading)
    return <div className="text-center py-20">Loading your profile...</div>;
  if (error)
    return <div className="text-red-500 text-center py-20">{error}</div>;

  const caloriePercent = Math.min(
    100,
    (todayFood.totals.calories / targets.calories) * 100,
  );
  const proteinPercent = Math.min(
    100,
    (todayFood.totals.protein / targets.protein) * 100,
  );
  const waterPercent = Math.min(100, (todayFood.water / targets.water) * 100);

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text-main)] px-6 md:px-12 py-10 space-y-10 transition-colors duration-300">
      {/* HERO */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 to-transparent border border-[var(--text-sub)]/20 shadow-lg">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--primary)] shadow-lg">
              <img
                src={userData?.avatar || "https://i.pravatar.cc/150?img=3"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Hello, {userData?.name || "Siddhartha"} 👋
              </h1>
              <p className="text-[var(--text-sub)]">
                You're building something elite.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/food")}
            className="px-5 py-2 bg-[var(--primary)] text-black rounded-lg font-semibold hover:scale-105 transition shadow-md"
          >
            Food Diary
          </button>
        </div>
      </div>

      {/* PROGRESS RINGS */}
      <div className="flex flex-wrap gap-8 justify-center md:justify-start">
        <ProgressRings value={caloriePercent} label="Calories" />
        <ProgressRings value={proteinPercent} label="Protein" />
        <ProgressRings value={waterPercent} label="Water" />
      </div>

      {/* STREAK + INSIGHTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <StreakCard streak={streak} />
        <InsightsPanel
          protein={todayFood.totals.protein}
          water={todayFood.water}
        />
      </div>

      {/* GOALS */}
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
                  style={{ width: `${g.progress}%` }}
                />
              </div>
              <p className="text-xs text-[var(--text-sub)] mt-1">
                ETA: {g.eta}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DIARY */}
      <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--text-sub)]/20 shadow-sm">
        <DailyDiary entries={diaryEntries} setEntries={setDiaryEntries} />
      </div>
    </div>
  );
}
