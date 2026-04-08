import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
        404
      </p>
      <h1 className="mt-3 text-4xl font-black text-(--text-main) sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-xl text-base text-(--text-muted)">
        The page you requested does not exist or may have been moved.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Go home
        </Link>
        <Link
          to="/login"
          className="rounded-xl border border-(--border) px-5 py-2.5 text-sm font-semibold text-(--text-main) transition hover:bg-(--card-bg)"
        >
          Go to login
        </Link>
      </div>
    </section>
  );
}
