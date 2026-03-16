import { Link } from "@/i18n/navigation";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
      role="main"
    >
      <div className="mx-auto max-w-md">
        <p className="mb-4 font-body text-8xl font-bold text-primary/20">
          404
        </p>
        <h1 className="mb-4 font-heading text-3xl font-bold text-text">
          Página no encontrada
        </h1>
        <p className="mb-8 font-body text-text-muted">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-body font-semibold text-white transition-colors hover:bg-primary-light"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Ir al inicio
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/20 px-6 py-3 font-body font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Contacto
          </Link>
        </div>
      </div>
    </main>
  );
}
