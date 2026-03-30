export default function DiaryHeatmap({ entries }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-3">Consistency</h3>

      <div className="flex gap-2 flex-wrap">
        {[...Array(14)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString();

          const logged = entries.find((e) => e.date === dateStr);

          return (
            <div
              key={i}
              className={`w-6 h-6 rounded transition ${
                logged ? "bg-[var(--primary)]" : "bg-[var(--text-sub)]/20"
              }`}
              title={dateStr}
            />
          );
        })}
      </div>
    </div>
  );
}
