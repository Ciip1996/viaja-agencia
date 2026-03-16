"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      role="main"
    >
      <div className="mx-auto max-w-md">
        <p className="mb-4 font-body text-6xl font-bold text-primary/20">
          Error
        </p>
        <h1 className="mb-4 font-heading text-3xl font-bold text-text">
          Algo salió mal
        </h1>
        <p className="mb-8 font-body text-text-muted">
          Ha ocurrido un error inesperado. Por favor intenta de nuevo.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-body font-semibold text-white transition-colors hover:bg-primary-light"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/20 px-6 py-3 font-body font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
