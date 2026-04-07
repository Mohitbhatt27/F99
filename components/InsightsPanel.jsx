export default function InsightsPanel({
  protein,
  water,
  targets = {},
  userData = {},
}) {
  const proteinTarget = targets.protein ?? 140;
  const waterTarget = targets.water ?? 3000;
  const calorieTarget = targets.calories ?? 2300;

  const proteinPct = Math.round((protein / proteinTarget) * 100);
  const waterPct = Math.round((water / waterTarget) * 100);

  const { weight, height, gender, age, aim, trainingExperience } = userData;

  // ── BMI ──
  let bmi = null;
  let bmiLabel = "";
  if (weight && height) {
    bmi = (weight / (height / 100) ** 2).toFixed(1);
    if (bmi < 18.5) bmiLabel = "Underweight";
    else if (bmi < 25) bmiLabel = "Healthy";
    else if (bmi < 30) bmiLabel = "Overweight";
    else bmiLabel = "Obese";
  }

  // ── BMR / TDEE ──
  let tdee = null;
  if (weight && height && age && gender) {
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    tdee = Math.round(bmr * 1.55);
  }

  // ── Protein per kg ──
  let proteinPerKg = null;
  if (weight && protein > 0) {
    proteinPerKg = (protein / weight).toFixed(1);
  }

  // ── Personalised insight message ──
  function getInsight() {
    if (!aim && !weight)
      return "Complete your profile to get personalised insights.";

    const insights = [];

    if (proteinPct < 60)
      insights.push(`You're low on protein — aim for ${proteinTarget}g today.`);
    else if (proteinPct >= 100) insights.push("Protein target hit 💪");

    if (waterPct < 50)
      insights.push("You're under 50% of your water target — drink up.");
    else if (waterPct >= 100) insights.push("Hydration goal reached 💧");

    if (aim === "lose weight" && tdee && calorieTarget > tdee)
      insights.push(
        "Your calorie target is above your TDEE — update it in Edit Profile.",
      );

    if (aim === "build muscle" && proteinPerKg && proteinPerKg < 1.6)
      insights.push(
        `For muscle gain, aim for at least 1.6g protein/kg (you need ${Math.round(weight * 1.6)}g).`,
      );

    if (bmi && bmi >= 25 && aim === "lose weight")
      insights.push(
        `BMI ${bmi} (${bmiLabel}) — a 300-500 kcal deficit is a good starting point.`,
      );

    if (trainingExperience === "beginner")
      insights.push(
        "As a beginner, consistency beats intensity — aim for 3 sessions/week.",
      );

    return insights.length > 0 ? insights[0] : "You're on track — keep it up!";
  }

  return (
    <div className="bg-[var(--card)] p-5 rounded-xl border border-[var(--text-sub)]/20 space-y-4">
      <h3 className="font-semibold">Today's Insights</h3>

      {/* Protein */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Protein</span>
          <span
            className={
              proteinPct >= 100 ? "text-green-500" : "text-[var(--text-sub)]"
            }
          >
            {protein}g / {proteinTarget}g
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--text-sub)]/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, proteinPct)}%` }}
          />
        </div>
      </div>

      {/* Water */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>Water</span>
          <span
            className={
              waterPct >= 100 ? "text-green-500" : "text-[var(--text-sub)]"
            }
          >
            {water}ml / {waterTarget}ml
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--text-sub)]/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, waterPct)}%` }}
          />
        </div>
      </div>

      {/* BMI if available */}
      {bmi && (
        <div className="flex justify-between text-sm">
          <span>BMI</span>
          <span
            className={
              bmiLabel === "Healthy"
                ? "text-green-500"
                : bmiLabel === "Underweight"
                  ? "text-yellow-500"
                  : "text-red-400"
            }
          >
            {bmi} — {bmiLabel}
          </span>
        </div>
      )}

      {/* TDEE if available */}
      {tdee && (
        <div className="flex justify-between text-sm">
          <span>Est. TDEE</span>
          <span className="text-[var(--text-sub)]">{tdee} kcal/day</span>
        </div>
      )}

      {/* Protein per kg */}
      {proteinPerKg && (
        <div className="flex justify-between text-sm">
          <span>Protein / kg</span>
          <span
            className={
              Number(proteinPerKg) >= 1.6 ? "text-green-500" : "text-yellow-500"
            }
          >
            {proteinPerKg}g/kg
          </span>
        </div>
      )}

      {/* Personalised insight */}
      <div className="pt-2 border-t border-[var(--text-sub)]/10 text-sm text-[var(--text-sub)]">
        💡 {getInsight()}
      </div>

      {/* Link to edit profile if stats missing */}
      {(!weight || !height) && (
        <a
          href="/edit-profile"
          className="block text-xs text-[var(--primary)] hover:underline"
        >
          Add your stats for personalised insights →
        </a>
      )}
    </div>
  );
}
