import { useState, useEffect } from "react";
import DailyDiary from "./DailyDiary";
import ProgressRings from "./ProgressRings";
import InsightsPanel from "./InsightsPanel";
import StreakCard from "./StreakCard";
import { useNavigate } from "react-router-dom";
import { useFood } from "../context/FoodContext";
export default function Profile() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  const [data] = useState({
    age: 20,
    weight: 69.5,
    bodyFat: 15,
    steps: 17000,
    frequency: 5,
  });

  const { foods, water, setFoods } = useFood();
  const totals = foods.reduce(
    (acc, f) => {
      acc.calories += f.calories;
      acc.protein += f.protein;
      return acc;
    },
    { calories: 0, protein: 0 },
  );

  const targets = {
    calories: 2300,
    protein: 140,
    water: 3000,
  };

  const caloriePercent = Math.min(
    100,
    (totals.calories / targets.calories) * 100,
  );

  const proteinPercent = Math.min(
    100,
    (totals.protein / targets.protein) * 100,
  );

  const waterPercent = Math.min(100, (water / targets.water) * 100);

  const goals = getGoals(data, entries);

  const avgRating =
    entries.length > 0
      ? entries.reduce((a, e) => a + Number(e.rating), 0) / entries.length
      : 5;

  const proteinScore = avgRating * 15; // mock
  const waterScore = 1800; // mock ml
  const streak = entries.length;
  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    const saved = localStorage.getItem("foods");
    if (saved) setFoods(JSON.parse(saved));
  }, []);
  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text-main)] px-6 md:px-12 py-10 space-y-10 transition-colors duration-300">
      {/* 🔥 HERO */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 to-transparent border border-[var(--text-sub)]/20 shadow-lg">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--primary)] shadow-lg">
              <img
                src="https://i.pravatar.cc/150?img=3"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Siddhartha 👋</h1>
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

      {/* 🔥 PROGRESS RINGS */}
      <div className="flex flex-wrap gap-8 justify-center md:justify-start">
        <ProgressRings value={caloriePercent} label="Calories" />
        <ProgressRings value={proteinPercent} label="Protein" />
        <ProgressRings value={waterPercent} label="Water" />
      </div>

      {/* 🔥 STREAK + INSIGHTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <StreakCard streak={streak} />
        <InsightsPanel protein={totals.protein} water={water} />
      </div>

      {/* 🔥 GOALS */}
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

      {/* 🔥 DIARY */}
      <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--text-sub)]/20 shadow-sm">
        <DailyDiary entries={entries} setEntries={setEntries} />
      </div>
    </div>
  );
}

/* 🔥 GOALS ENGINE */

function getGoals(data, entries) {
  const bodyFatStart = 15;
  const bodyFatTarget = 8;

  const benchTarget = 100;
  const ohpTarget = 60;

  const avgRating =
    entries.length > 0
      ? entries.reduce((a, e) => a + Number(e.rating), 0) / entries.length
      : 5;

  const performanceMultiplier = Math.min(1.2, Math.max(0.5, avgRating / 7));

  const benchCurrent = 80 + entries.length * 0.3 * performanceMultiplier;
  const ohpCurrent = 55 + entries.length * 0.2 * performanceMultiplier;

  return [
    {
      title: "Cut to 8% Body Fat",
      progress: calculateProgress(
        bodyFatStart - data.bodyFat,
        bodyFatStart - bodyFatTarget,
      ),
      eta: calculateETA(
        bodyFatStart - data.bodyFat,
        0.4 * performanceMultiplier,
      ),
    },
    {
      title: "Bench 100kg",
      progress: calculateProgress(benchCurrent, benchTarget),
      eta: calculateETA(benchCurrent, 2.5 * performanceMultiplier),
    },
    {
      title: "OHP 60kg",
      progress: calculateProgress(ohpCurrent, ohpTarget),
      eta: calculateETA(ohpCurrent, 1.5 * performanceMultiplier),
    },
  ];
}

function calculateProgress(current, target) {
  return Math.max(0, Math.min(100, (current / target) * 100));
}

function calculateETA(current, weeklyRate) {
  if (current <= 0) return "—";

  const remaining = 100 - current;
  const weeks = Math.ceil(remaining / weeklyRate);

  if (weeks <= 1) return "Almost there";
  return `${weeks} weeks`;
}
