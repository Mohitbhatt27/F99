import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center border-b border-[var(--text-sub)]/20 bg-[var(--bg)]">
      <h1 className="text-xl font-bold">
        Fitness<span className="text-[var(--primary)]">2099</span>
      </h1>

      <ThemeToggle />
    </div>
  );
}
