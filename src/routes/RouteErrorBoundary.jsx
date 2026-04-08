import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export default function RouteErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let description = "An unexpected error occurred while loading this page.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page not found";
      description = "That route does not exist in this app.";
    } else {
      title = `${error.status} ${error.statusText}`;
      description = error.data?.message || description;
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-black text-(--text-main) sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base text-(--text-muted)">
        {description}
      </p>
      <Link
        to="/"
        className="mt-8 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        Back to home
      </Link>
    </section>
  );
}
