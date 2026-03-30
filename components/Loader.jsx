function Loader() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-main)]">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-[var(--primary)]/20 rounded-full"></div>

        <div className="bg-[var(--card)] rounded-full px-8 py-4 flex items-center gap-3 shadow-2xl border border-[var(--text-sub)]/20">
          <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-ping"></div>

          <p className="text-[var(--text-sub)] tracking-wide">
            Fitness redefined...
          </p>
        </div>
      </div>
    </div>
  );
}
export default Loader;
