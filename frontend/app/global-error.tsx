"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="global-error-page">
          <section className="global-error-card" aria-labelledby="global-error-title">
            <span>Something went wrong</span>
            <h1 id="global-error-title">Aurent hit an unexpected error.</h1>
            <p>
              {error.digest
                ? `Error digest: ${error.digest}`
                : "Try again, or refresh the page if the problem keeps showing up."}
            </p>
            <button type="button" onClick={reset}>
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
