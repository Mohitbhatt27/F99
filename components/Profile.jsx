import { useState } from "react";
import DailyDiary from "./DailyDiary";

export default function Profile() {
  const [entries, setEntries] = useState([]);

  const [data, setData] = useState({
    age: 20,
    weight: 69.5,
    bodyFat: 15,
    steps: 17000,
    frequency: 5,
  });

  const goals = getGoals(data, entries);

  return (
    <div className="w-full min-h-screen bg-[#0B0F14] text-[#E6EDF3] px-6 md:px-12 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00D1FF] shadow-[0_0_15px_#00D1FF]">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <div>
            <h1 className="text-3xl font-bold">Siddhartha</h1>
            <p className="text-[#8B98A5]">Fitness Enthusiast • Student</p>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Current Goals</h2>

        <div className="bg-[#121821] p-6 rounded-xl border border-[#1f2933] space-y-5">
          {goals.map((g, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span>{g.title}</span>
                <span className="text-[#8B98A5]">
                  {Math.round(g.progress)}%
                </span>
              </div>

              <div className="w-full h-2 bg-[#1f2933] rounded-full">
                <div
                  className="h-2 rounded-full bg-[#00FF88]"
                  style={{ width: `${g.progress}%` }}
                />
              </div>

              <p className="text-xs text-[#8B98A5] mt-1">ETA: {g.eta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Diary */}
      <DailyDiary entries={entries} setEntries={setEntries} />
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
