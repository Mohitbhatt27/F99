export default function StreakCard({ streak }) {
  return (
    <div className="bg-[var(--card)] p-4 rounded-xl border text-center">
      <p className="text-xl">🔥 {streak} Day Streak</p>
      <p className="text-xs text-[var(--text-sub)]">Keep going!</p>
    </div>
  );
}
