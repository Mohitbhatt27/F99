export default function InsightsPanel({ protein, water }) {
  return (
    <div className="bg-[var(--card)] p-4 rounded-xl border space-y-2">
      <p className="text-sm">
        🔥 You are {protein < 100 ? "low" : "good"} on protein
      </p>
      <p className="text-sm">
        💧 {water < 2000 ? "Drink more water" : "Hydration good"}
      </p>
    </div>
  );
}
