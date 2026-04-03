export default function InsightsPanel({ protein, water, targets = {} }) {
  const proteinTarget = targets.protein ?? 100;
  const waterTarget = targets.water ?? 2000;

  const proteinOk = protein >= proteinTarget * 0.8;
  const waterOk = water >= waterTarget * 0.8;

  return (
    <div className="bg-[var(--card)] p-4 rounded-xl border space-y-2">
      <p className="font-semibold mb-3">Today's Insights</p>

      <div className="flex items-center gap-2 text-sm">
        <span>{proteinOk ? "✅" : "⚠️"}</span>
        <span>
          Protein: {protein}g /{" "}
          <span className="text-[var(--text-sub)]">
            {proteinTarget}g target
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span>{waterOk ? "✅" : "💧"}</span>
        <span>
          Water: {water}ml /{" "}
          <span className="text-[var(--text-sub)]">{waterTarget}ml target</span>
        </span>
      </div>

      {!proteinOk && (
        <p className="text-xs text-[var(--text-sub)] mt-1">
          You're low on protein — aim to add a meal or shake.
        </p>
      )}
      {!waterOk && (
        <p className="text-xs text-[var(--text-sub)]">
          Drink more water — you're under 80% of your target.
        </p>
      )}
    </div>
  );
}
