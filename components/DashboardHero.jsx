export default function DashboardHero({ name, progress }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 to-transparent border border-[var(--text-sub)]/20">
      <h2 className="text-2xl font-bold">Good morning, {name} 👋</h2>

      <p className="text-[var(--text-sub)] mt-1">
        You're {progress}% on track today
      </p>
    </div>
  );
}
